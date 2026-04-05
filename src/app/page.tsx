import AuthCard from "@/components/auth-card";

export default function Home() {
  return (<main className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolte top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
    </div>

    {/* Content */}
    <div className="relative z-10 w-full max-w-md">
      <AuthCard />
    </div> 
  </main>);
}
