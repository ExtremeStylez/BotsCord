"use client"

import AuthCard from "@/components/auth-card";

export default function Home() {
  return (<main className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolte top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
    </div>

    {/* Floating Discord icons */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-[15%] w-8 h-8 text-primary/20 animate-pulse">
        <svg viewBox="0 0 71 55" fill="currentColor">
          <path d="M60.1 4.9A58.5 58.5 0 0045.4.5a.2.2 0 00-.2.1 40.6 40.6 0 00-1.8 3.7 54 54 0 00-16.2 0A37.4 37.4 0 0025.4.6a.2.2 0 00-.2-.1 58.4 58.4 0 00-14.7 4.4.2.2 0 00-.1.1A59.5 59.5 0 00.6 45.8a.2.2 0 00.1.2A58.9 58.9 0 0018.4 55a.2.2 0 00.2-.1 42 42 0 003.6-6 .2.2 0 00-.1-.3 38.8 38.8 0 01-5.5-2.6.2.2 0 010-.4l1.1-.9a.2.2 0 01.2 0 42 42 0 0035.8 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.4 36.4 0 01-5.5 2.6.2.2 0 00-.1.3 47.2 47.2 0 003.6 6 .2.2 0 00.2.1 58.7 58.7 0 0017.7-9a.2.2 0 00.1-.2c1.5-15.5-2.5-29-10.6-41A.2.2 0 0060 5zM23.7 37.5c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.6 0 6.5 3.3 6.4 7.2 0 4-2.8 7.2-6.4 7.2zm23.6 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.6 0 6.5 3.3 6.4 7.2 0 4-2.8 7.2-6.4 7.2z" />
        </svg>
      </div>
      <div className="absolute top-40 right-[20%] w-6 h-6 text-primary/15 animate-pulse delay-300">
        <svg viewBox="0 0 71 55" fill="currentColor">
          <path d="M60.1 4.9A58.5 58.5 0 0045.4.5a.2.2 0 00-.2.1 40.6 40.6 0 00-1.8 3.7 54 54 0 00-16.2 0A37.4 37.4 0 0025.4.6a.2.2 0 00-.2-.1 58.4 58.4 0 00-14.7 4.4.2.2 0 00-.1.1A59.5 59.5 0 00.6 45.8a.2.2 0 00.1.2A58.9 58.9 0 0018.4 55a.2.2 0 00.2-.1 42 42 0 003.6-6 .2.2 0 00-.1-.3 38.8 38.8 0 01-5.5-2.6.2.2 0 010-.4l1.1-.9a.2.2 0 01.2 0 42 42 0 0035.8 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.4 36.4 0 01-5.5 2.6.2.2 0 00-.1.3 47.2 47.2 0 003.6 6 .2.2 0 00.2.1 58.7 58.7 0 0017.7-9a.2.2 0 00.1-.2c1.5-15.5-2.5-29-10.6-41A.2.2 0 0060 5zM23.7 37.5c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.6 0 6.5 3.3 6.4 7.2 0 4-2.8 7.2-6.4 7.2zm23.6 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.6 0 6.5 3.3 6.4 7.2 0 4-2.8 7.2-6.4 7.2z" />
        </svg>
      </div>
      <div className="absolute bottom-32 left-[25%] w-10 h-10 text-primary/10 animate-pulse delay-700">
        <svg viewBox="0 0 71 55" fill="currentColor">
          <path d="M60.1 4.9A58.5 58.5 0 0045.4.5a.2.2 0 00-.2.1 40.6 40.6 0 00-1.8 3.7 54 54 0 00-16.2 0A37.4 37.4 0 0025.4.6a.2.2 0 00-.2-.1 58.4 58.4 0 00-14.7 4.4.2.2 0 00-.1.1A59.5 59.5 0 00.6 45.8a.2.2 0 00.1.2A58.9 58.9 0 0018.4 55a.2.2 0 00.2-.1 42 42 0 003.6-6 .2.2 0 00-.1-.3 38.8 38.8 0 01-5.5-2.6.2.2 0 010-.4l1.1-.9a.2.2 0 01.2 0 42 42 0 0035.8 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.4 36.4 0 01-5.5 2.6.2.2 0 00-.1.3 47.2 47.2 0 003.6 6 .2.2 0 00.2.1 58.7 58.7 0 0017.7-9a.2.2 0 00.1-.2c1.5-15.5-2.5-29-10.6-41A.2.2 0 0060 5zM23.7 37.5c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.6 0 6.5 3.3 6.4 7.2 0 4-2.8 7.2-6.4 7.2zm23.6 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.6 0 6.5 3.3 6.4 7.2 0 4-2.8 7.2-6.4 7.2z" />
        </svg>
      </div>
    </div>

    {/* Content */}
    <div className="relative z-10 w-full max-w-md">
      <AuthCard />
    </div> 
  </main>);
}
