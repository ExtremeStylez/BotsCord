"use client"

import AddAppDialog from "@/components/add-app-dialog";
import DashboardHeader from "@/components/dashboard-header";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Bot } from "lucide-react";
import React, { useState } from "react";

export default function Home() {
    const [botsCount, setBotsCount] = useState(0)
    const { isPending, error, data: user_data } = useQuery({
        queryKey: ["userData"],
        queryFn: async () => await authClient.auth.user.get()
    })

    if (isPending) return (<div className="min-h-screen bg-background">
        <span>Loading</span>
    </div>)

    return (<div className="min-h-screen bg-background">
        <DashboardHeader data={user_data?.data} />

        <main className="px-6 py-8">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* StatCards */}
                {/* <div className="grid grid-cols-2 gap-4 sm-grid-cols-4">
                    <StatCard
                        icon={Bot}
                        label="Total Bots"
                        value={botsCount}
                    />
                </div> */}

                {/* Apps Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">Your Apps</h2>
                            <p className="text-sm text-muted-foreground">Manage your connected discord apps</p>
                        </div>
                        <AddAppDialog onAdd={console.log} />
                    </div>
                </div>
            </div>
        </main>
    </div>);
}

function StatCard({
  icon: Icon,
  label,
  value,
  valueColor = "text-foreground",
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  valueColor?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5865F2]/10">
          <Icon className="h-5 w-5 text-[#5865F2]" />
        </div>
        <div>
          <p className={`text-lg font-semibold ${valueColor}`}>{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  )
}