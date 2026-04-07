import { Elysia } from "elysia"

import swagger from "@elysiajs/swagger";
import { jwt } from '@elysiajs/jwt'
import { cors } from "@elysiajs/cors"
import { auth } from "./auth.route";
import { client } from "./socket.route";
import { discord } from "./discord.routes";

const app = new Elysia({
        "prefix": "/api",
        websocket: {
            
        },
        serve: { idleTimeout: 255 }
    })
    .use(cors({
        origin: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    }))
    .use(swagger())
    .use(auth)
    .use(client)
    .use(discord)

export type AuthRoutes = typeof app

export const GET = app.fetch
export const POST = app.fetch