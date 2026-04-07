import jwt from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { node } from '@elysiajs/node'

export const discord = new Elysia({
        prefix: "/discord",
        adapter: node()
    })
    .use(jwt({
        name: 'session',
        secret: process.env.SESSION_SECRET || "sessionsecret",
        exp: "7d"
    }))
    .post('/app', async ({ session, cookie: { discord_user }, body }) => {
        try {
            const { token } = body

            if (!token) return { error: "Token is required", status: 400 }

            const appResponse = await fetch("https://discord.com/api/v10/users/@me", {
                headers: {
                    Authorization: `Bot ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (!appResponse.ok) {
                const errorText = await appResponse.text()
                console.error("Failed to fetch app information: ", errorText)

                if (appResponse.status === 401) return { error: "Invalid token was provided", status: 401 }

                return { error: `Failed to fetch app information: ${appResponse.status} ${appResponse.statusText}`, status: appResponse.status }
            }

            const appData = await appResponse.json()

            const guildsResponse = await fetch("https://discord.com/api/v10/users/@me/guilds", {
                headers: {
                    Authorization: `Bot ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (!guildsResponse.ok) {
                const errorText = await guildsResponse.text()
                console.error("Failed to fetch app guilds", errorText)

                return { error: `Failed to fetch app guilds: ${guildsResponse.status} ${guildsResponse.statusText}`, status: guildsResponse.status }
            }

            const guildsData = await guildsResponse.json()
            const estimatedUserCount = guildsData.length * 50

            return {
                app_id: appData.id,
                username: appData.username,
                global_name: appData.global_null,
                discriminator: appData.discriminator,
                avatar: appData.avatar,
                guild_count: guildsData.length,
                user_count: estimatedUserCount
            }
        } catch (error) {
            console.error("Error in app-info API route:", error)
            return { error: "Internal server error", status: 500 }
        }
    },  {
        body: t.Object({
            token: t.String()
        })
    })
    .post("/gateway", async ({ body }) => {
        try {
            const { token } = body

            if (!token) return { error: "Token is required", status: 400 }

            const gatewayResponse = await fetch("https://discord.com/api/v10/gateway", {
                headers: {
                    Authorization: `Bot ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (!gatewayResponse.ok) {
                const errorText = await gatewayResponse.text()
                console.error("Gateway request failed", errorText)

                return { error: `Failed to get gateway URL: ${gatewayResponse.status} ${gatewayResponse.statusText}`, status: gatewayResponse.status }
            }

            const gatewayData = await gatewayResponse.json()
            const gatewayUrl = `${gatewayData.url}/?v=10&encoding=json`

            return { url: gatewayUrl }
        } catch (error) {
            console.error("Error in app-info API route:", error)
            return { error: "Internal server error", status: 500 }
        }
    }, {
        body: t.Object({
            token: t.String()
        })
    })

export type InfoRoutes = typeof discord