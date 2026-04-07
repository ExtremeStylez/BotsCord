import { treaty } from "@elysiajs/eden"
import type { AuthRoutes } from "@/app/api/[[...slugs]]/route"
import { SocketRoutes } from "@/app/api/[[...slugs]]/socket.route"

export const authClient = treaty<AuthRoutes>(process.env.NEXT_PUBLIC_BASE_URL!).api
export const socketClient = treaty<SocketRoutes>(process.env.NEXT_PUBLIC_BASE_URL!).client