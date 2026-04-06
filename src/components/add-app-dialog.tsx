"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"

export default function AddAppDialog({ onAdd }: { onAdd: (app: { appName: string, appToken: string }) => void }) {
    const [open, setOpen] = useState(false)
    const [appName, setAppName] = useState("")
    const [appToken, setAppToken] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        onAdd({ appName, appToken })
        setOpen(false)
        setAppName("")
        setAppToken("")
    }

    return (<Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add App
            </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[#5865F2]/10 ring-1 ring-[#5865F2]/20">
                    <svg
                    className="h-6 w-6 text-[#5865F2]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                </div>
                <DialogTitle className="text-center">
                    Connect a discord application
                </DialogTitle>
                <DialogDescription className="text-center">
                    Enter your bot&apos;s details to connect it to BotsCord
                </DialogDescription>
            </DialogHeader>


        </DialogContent>
    </Dialog>)
}