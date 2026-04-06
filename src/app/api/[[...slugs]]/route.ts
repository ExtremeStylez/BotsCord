import { Elysia } from "elysia"

import swagger from "@elysiajs/swagger";
import { jwt } from '@elysiajs/jwt'
import { cors } from "@elysiajs/cors"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const authorizationEndpoint = "https://discord.com/oauth2/authorize";
const tokenEndpoint = "https://discord.com/api/oauth2/token";
const userEndpoint = "https://discord.com/api/users/@me"
const tokenRevocationEndpoint = "https://discord.com/api/oauth2/token/revoke";
const user = new Elysia({ prefix: "/auth/user" })
    .use(jwt({
        name: 'session',
        secret: process.env.SESSION_SECRET || "sessionsecret",
        exp: "7d"
    }))
    .get("/", async ({ session, status, cookie: { discord_user } }) => {
        const user = await session.verify(discord_user.value as string | undefined)

        if (!user)
            return status(401, 'Unauthorized')

        return user || null
    })
    .get("/logout", async ({ cookie: { discord_user }, session, status }) => {
         const user = await session.verify(discord_user.value as string | undefined)
         if (!user)
            return status(401, 'Unauthorized')

         discord_user.remove()
         return status(200)
    })
    .get("/redirect", () => {
        try {
            console.log("redirecting user...")
            const clientId: string = process.env.DISCORD_CLIENT_ID || ""
            const callbackUrl: string = process.env.DISCORD_CALLBACK_URL || ""
            // const scopes: string = ["identify", "email", "applications.builds.read"].join(" ")
            const scopes: string = ["identify", "email"].join(" ")

            const params = new URLSearchParams({
                client_id: clientId,
                response_type: "code",
                redirect_uri: callbackUrl,
                scope: scopes,
                prompt: "consent",
            });

            return { redirect: `https://discord.com/api/oauth2/authorize?${params.toString()}` }
        } catch (error) {
            console.error("Error redirecting user:", error)
        }
    })
    .get("/callback", async ({ session, cookie: { discord_user }, query, redirect }) => {
        if (query.error) {
            console.error("OAuth2 Error:", query.error)
            return { error: query.error }
        }

        if (!query.code) {
            console.error("No authorization code provided")
            return { error: "No authorization code provided" }
        }

        const clientId: string = process.env.DISCORD_CLIENT_ID || ""
        const callbackUrl: string = process.env.DISCORD_CALLBACK_URL || ""
        const clientSecret: string = process.env.DISCORD_CLIENT_SECRET || ""

        const tokenRes = await fetch(tokenEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: "authorization_code",
                code: query.code,
                redirect_uri: callbackUrl
            })
        })
        const tokens = await tokenRes.json()
        if (tokens.error) {
            console.error("Invalid code was provided")
            return { error: "Invalid code was provided" }
        }

        const userRes = await fetch(userEndpoint, {
            headers: {
            Authorization: `Bearer ${tokens.access_token}`
            }
        })
        if (userRes.status !== 200) {
            console.error("Failed to fetch user data")
            return { error: "Failed to fetch user data" }
        }
        const user = await userRes.json()

        console.log(user, tokens)
        const sessionValue = await session.sign({
            user_id: user.id,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            global_name: user.global_name,
            refresh_token: tokens.refresh_token
        })
        discord_user.set({
            value: sessionValue,
            httpOnly: true,
            maxAge: 60000 * 60 * 24 * 7,
        })
        return redirect(process.env.NEXT_PUBLIC_BASE_URL + "/dashboard")
    })

const app = new Elysia({ "prefix": "/api" })
    .use(cors({
        origin: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    }))
    .use(swagger())
    .use(user)

export type AuthRoutes = typeof app

export const GET = app.fetch
export const POST = app.fetch