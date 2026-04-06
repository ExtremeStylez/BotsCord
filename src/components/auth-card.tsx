"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Bot, Zap, Check, MessageSquare } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useMutation } from "@tanstack/react-query"

export default function AuthCard() {
    const { mutate: logIn } = useMutation({
        mutationFn: async () => {
            const res = await authClient.auth.user.redirect.get()

            if (res.status === 200) return window.location.href = (res.data as { redirect: string })?.redirect
        }
    })

    return (<Card className="w-full max-w-md border-border/60 bg-card shadow-2xl shadow-primary/5 md:h-max md:w-max">
        <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/20">
                <svg
                    className="h-10 w-10 text-primary"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
                Welcome to BotsCord
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                The ultimate platform for seamless communication between Discord and your bots. Connect your account to get started.
            </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
                <FeatureItem icon={Shield} label="Secure" />
                <FeatureItem icon={Bot} label="Bot Ready" />
                <FeatureItem icon={Zap} label="Real-time" />
            </div>

            <Button onClick={() => logIn()} className="w-full h-12 text-base font-semibold bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#5865F2]/25" size="lg">
                <svg
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Connect with Discord
            </Button>

            <div className="space-y-3 pt-2 flex flex-col items-center justify-center">
                <p className="text-xs text-muted-foreground text-center font-medium">
                    By connecting, you&apos;ll unlock:
                </p>
                <ul className="space-y-2.5">
                    <BenefitItem text="Direct bot-to-Discord messaging" />
                    <BenefitItem text="Real-time event monitoring" />
                    <BenefitItem text="Advanced bot management tools" />
                    <BenefitItem text="Webhook integrations" />
                </ul>
            </div>

            <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground justify-center">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Join 10,000+ developers using BotsCord</span>
            </div>

            <p className="text-xs text-muted-foreground/80 text-center">
                We only request basic profile information. Your data stays private and secure.
            </p>
        </CardContent>
    </Card>)
}

function FeatureItem({ icon: Icon, label }: { icon: React.ElementType, label: string }) {
  return (<div className="flex flex-col items-center gap-1.5 rounded-lg bg-secondary/50 p-3">
    <Icon className="h-5 w-5 text-primary" />
    <span className="text-xs font-medium text-foreground">{label}</span>
  </div>)  
}
function BenefitItem({ text }: { text: string }) {
    return (<li className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20">
        <Check className="h-2.5 w-2.5 text-primary" />
      </div>
      {text}
    </li>)
}