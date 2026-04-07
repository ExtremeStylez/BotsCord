import jwt from "@elysiajs/jwt"
import Elysia from "elysia"
import { node } from '@elysiajs/node'

export const client = new Elysia({
        prefix: "/client",
        adapter: node()
    })
    .use(jwt({
        name: 'session',
        secret: process.env.SESSION_SECRET || "sessionsecret",
        exp: "7d"
    }))
    // .use(websocket())
    //.get('/', () => { return "Hi" })
    .ws('/', {
        open(ws) {
            console.log('Connection opened')
            ws.subscribe('chat')
        },
        message(ws, message) {
            ws.send(message)
        }
    })

export type SocketRoutes = typeof client