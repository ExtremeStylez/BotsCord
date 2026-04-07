"use client"
import { DiscordGatewayClient } from "@/lib/discord-socket"
import { socketClient } from "@/lib/server"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { io as Client } from "socket.io-client"

type SocketContextType = {
    socket: unknown | null,
    isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [app, setApp] = useState(null)
    const [socket, setSocket] = useState(null)
    const [isConnected, setIsConnected] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [error, setError] = useState("")
    const [botInfo, setBotInfo] = useState<unknown | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [connectionLogs, setConnectionLogs] = useState<string[]>(["Waiting for connection..."])
    const gatewayClientRef = useRef<DiscordGatewayClient | null>(null)


    useEffect(() => {
        if (!app || !app?.token) return
        const gatewayClient = new DiscordGatewayClient(app?.token)
        gatewayClientRef.current = gatewayClient;

        (async() => { await gatewayClient.connect() })()

        return () => {
            if (gatewayClientRef.current) {
                gatewayClientRef.current.disconnect()
            }
        }
    }, [app])

    return (<SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>)
}