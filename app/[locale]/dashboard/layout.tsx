"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/layout/Sidebar";
import { useSession } from "next-auth/react";
import { Toaster } from 'sonner';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const user = session?.user;

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/login');
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-primary font-mono tracking-widest">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-none animate-spin" />
                    <p className="animate-pulse">INITIALIZING_SYSTEM...</p>
                </div>
            </div>
        );
    }

    if (!session || !user) {
        return null;
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden selection:bg-primary selection:text-black">
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative">
                {/* Background Grid Fix */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
                     style={{ 
                         backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', 
                         backgroundSize: '40px 40px' 
                     }} 
                />
                
                <div className="relative z-10 p-8 md:p-12 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
            <Toaster 
                theme="dark" 
                position="top-right" 
                toastOptions={{
                    className: 'border border-primary/20 bg-black/90 font-mono text-xs',
                    style: { borderRadius: '0px' }
                }}
            />
        </div>
    );
}
