"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Bell, LogOut } from "lucide-react";
import { Toaster } from "sonner";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const role = (session?.user as unknown as { role?: string } | undefined)?.role;
    const isAuthorized = status === "authenticated" && role === "admin";

    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated") {
            router.replace("/login");
            return;
        }
        if (status === "authenticated" && role !== "admin") {
            router.replace("/dashboard/overview");
        }
    }, [status, role, router]);

    if (status === "loading" || !isAuthorized) {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <div className="tech-border bg-black/40 border-primary/20 p-6 flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-primary/20 border-t-primary animate-spin" />
                    <span className="text-xs font-mono text-foreground/50 uppercase tracking-widest">AUTHENTICATING</span>
                </div>
            </div>
        );
    }

    const user = session?.user as unknown as { name?: string | null; email?: string | null } | undefined;
    const getInitials = (name?: string | null) => {
        if (!name) return "A";
        const parts = name.split(" ");
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div className="flex h-screen bg-black overflow-hidden">
            <AdminSidebar />
            <Toaster richColors position="top-right" />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-14 border-b border-primary/20 bg-black/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-foreground font-mono uppercase tracking-wider">ADMIN_PANEL</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="tech-border bg-black/40 border-border/40 p-2 text-foreground/60 hover:text-primary hover:border-primary/50 relative">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full border border-black animate-pulse" />
                        </button>
                        <div className="h-6 w-px bg-border/60 mx-1" />
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 tech-border bg-primary/10 border-primary/40 flex items-center justify-center text-primary font-black text-xs font-mono">
                                {getInitials(user?.name)}
                            </div>
                            <div className="hidden md:block">
                                <div className="text-xs font-black text-foreground font-mono uppercase">{user?.name}</div>
                                <div className="text-[9px] text-foreground/50 font-mono uppercase tracking-wider">{user?.email}</div>
                            </div>
                            <button
                                onClick={async () => {
                                    await signOut({ redirect: false });
                                    router.push("/login");
                                }}
                                className="ml-2 tech-border bg-black/40 border-border/40 p-2 text-foreground/60 hover:text-red-500 hover:border-red-500/50 transition-colors"
                                aria-label="Déconnexion"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-black">
                    {children}
                </main>
            </div>
        </div>
    );
}
