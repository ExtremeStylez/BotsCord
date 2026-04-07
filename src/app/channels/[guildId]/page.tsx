"use client"

import { LoadingScreen } from "@/components/discord/loading-screen"
import { ServerSidebar } from "@/components/discord/server-sidebar"
import { useState } from "react"

export default function Home() {
    const [isLoading, setIsLoading] = useState(true)
    const [activeServer, setActiveServer] = useState(null)
    const [activeChannel, setActiveChannel] = useState(null)
    const [activeTab, setActiveTab] = useState("friends")
    const [activeDM, setActiveDM] = useState(null)

    if (isLoading) return (<LoadingScreen onComplete={() => setIsLoading(false)} />)
    return (<div className="flex h-screen w-full overflow-hidden bg-[#313338]">
        {/* ServerSidebar */}
        <ServerSidebar
            activeServer={activeServer}
            onServerClick={setActiveChannel}
        />
    </div>)
}