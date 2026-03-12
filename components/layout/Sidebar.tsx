"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Key,
    FileText,
    Settings,
    BarChart3,
    Webhook,
    CreditCard,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Plus,
    Activity,
    Book
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { getUsageStats } from "@/lib/resources-ext";
import { getCurrentUser } from "@/lib/resources";
import type { UsageStats, User } from "@/types";
import { useLocale } from "next-intl";

const navigation = [
    { name: "DASHBOARD", href: "/dashboard/overview", icon: LayoutDashboard },
    { name: "API KEYS", href: "/dashboard/api-keys", icon: Key },
    { name: "EXTRACTIONS", href: "/dashboard/extractions", icon: FileText },
    { name: "ANALYTICS", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "WEBHOOKS", href: "/dashboard/webhooks", icon: Webhook },
    { name: "BILLING", href: "/dashboard/billing", icon: CreditCard },
    { name: "DOCUMENTATION", href: "/docs", icon: Book },
    { name: "SYSTEM", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const locale = useLocale();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    const withLocale = (href: string) => {
        if (!href.startsWith("/")) return `/${locale}/${href}`;
        if (href.startsWith(`/${locale}/`) || href === `/${locale}`) return href;
        return `/${locale}${href}`;
    };
    const normalizedPathname = pathname?.replace(new RegExp(`^/${locale}`), "") || "";

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    useEffect(() => {
        const fetchUsageStats = async () => {
            try {
                const stats = await getUsageStats();
                setUsageStats(stats);
            } catch (error) {
                console.error("Failed to fetch usage stats:", error);
            } finally {
                setIsLoadingStats(false);
            }
        };

        fetchUsageStats();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const me = await getCurrentUser();
                setUser(me);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        fetchUser();
    }, []);

    return (
        <aside
            className={cn(
                "flex flex-col border-r border-border bg-black/80 backdrop-blur-md transition-all duration-300 relative z-50",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex h-16 items-center justify-between px-6 border-b border-border bg-accent/10">
                <Link href={`/${locale}`} className="flex items-center gap-3 overflow-hidden group">
                    <div className="min-w-8 h-8 bg-primary/10 border border-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-black transition-all">
                        <span className="text-primary group-hover:text-black font-mono font-bold text-lg">K</span>
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="text-lg font-bold tracking-widest text-foreground uppercase font-mono">KIRIKU</span>
                            <span className="text-[10px] text-primary/60 font-mono tracking-wider">SYSTEMS_ONLINE</span>
                        </div>
                    )}
                </Link>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 rounded-sm hover:bg-white/10 text-foreground/60 hidden lg:block transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-0 space-y-1">
                {navigation.map((item) => {
                    const isActive = normalizedPathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={withLocale(item.href)}
                            className={cn(
                                "flex items-center gap-4 px-6 py-3 text-xs font-bold tracking-widest transition-all group relative border-l-2",
                                isActive
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-transparent text-foreground/40 hover:text-foreground hover:bg-white/5 hover:border-white/20"
                            )}
                        >
                            <item.icon size={18} className={cn("transition-transform", isActive && "text-primary")} />
                            {!isCollapsed && <span className="font-mono">{item.name}</span>}
                            {isActive && !isCollapsed && (
                                <div className="ml-auto w-1.5 h-1.5 bg-primary animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-border bg-black/50">
                {!isCollapsed && (
                    <div className="mb-6 p-4 border border-border bg-accent/5 space-y-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                            <span className="text-foreground/60">Balance Status</span>
                            <span className={user?.credits && user.credits > 0 ? "text-primary" : "text-destructive"}>
                                {user?.credits && user.credits > 0 ? "ACTIVE" : "EMPTY"}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-foreground">
                                    {user?.credits?.toLocaleString() || 0}
                                </span>
                                <span className="text-foreground/40">CREDITS</span>
                            </div>
                            <div className="h-1 w-full bg-accent rounded-none overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-500",
                                        user?.credits === 0 ? "bg-destructive" : "bg-primary"
                                    )}
                                    style={{
                                        width: user?.credits ? `${Math.min((user.credits / 1000) * 100, 100)}%` : "0%"
                                    }}
                                />
                            </div>
                        </div>
                        <Link
                            href={withLocale("/dashboard/billing")}
                            className="w-full py-2 border border-primary/30 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={12} /> Buy Credits
                        </Link>
                    </div>
                )}
                
                <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "px-2")}>
                    <div className="w-8 h-8 bg-zinc-800 flex items-center justify-center text-foreground/60">
                        <Activity size={16} />
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold text-foreground truncate font-mono">
                                {user ? `${user.firstName} ${user.lastName}`.trim() : "USER_SESSION"}
                            </p>
                            {user && (
                                <div className="text-[10px] text-foreground/50 font-mono truncate">
                                    {user.email} • {user.plan?.toUpperCase() || "FREE"}
                                </div>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-[10px] text-destructive hover:text-destructive/80 font-mono flex items-center gap-1 mt-0.5"
                            >
                                <LogOut size={10} /> DISCONNECT
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
