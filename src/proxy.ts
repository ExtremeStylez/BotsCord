import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import jwt from 'jsonwebtoken';

export const proxy = async (req: NextRequest) => {
    const pathname = req.nextUrl.pathname
    const match = pathname.match("dashboard")
    const cookie_data = await cookies()
    const discord_user = cookie_data.get("discord_user")

    if (!match) return NextResponse.redirect(new URL("/", req.url))
    if (!discord_user?.value)  return NextResponse.redirect(new URL("/", req.url))
    const user_data = jwt.verify(discord_user.value, process.env.SESSION_SECRET || "sessionsecret") as jwt.JwtPayload
 
    if (!user_data?.user_id || !user_data?.email || !user_data?.username || !user_data?.refresh_token) return NextResponse.redirect(new URL("/", req.url))
    console.log(user_data)

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard"]
}