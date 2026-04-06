import { treaty } from "@elysiajs/eden"
import type { AuthRoutes } from "@/app/api/[[...slugs]]/route"

export const authClient = treaty<AuthRoutes>('localhost:3000').api