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
    Activity,
    Book,
    ShieldCheck,
    Play
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { getCurrentUser } from "@/lib/resources";
import type { User } from "@/types";
import { useLocale } from "next-intl";
import Image from "next/image";

const navigation = [
    { name: "DASHBOARD", href: "/dashboard/overview", icon: LayoutDashboard },
    { name: "PLAYGROUND OCR", href: "/dashboard/playground", icon: Play },
    { name: "KYC & IDENTITY", href: "/dashboard/kyc", icon: ShieldCheck },
    { name: "API KEYS", href: "/dashboard/api-keys", icon: Key },
    { name: "EXTRACTIONS", href: "/dashboard/extractions", icon: FileText },
    { name: "TEMPLATE_REQUESTS", href: "/dashboard/templates/requests", icon: FileText },
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
                    {/* <div className="min-w-8 h-8 bg-primary/10 border border-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-black transition-all">
                        <span className="text-primary group-hover:text-black font-mono font-bold text-lg">K</span>
                    </div> */}
                    <Image src="/logo.png" alt="Kiriku Logo" width={40} height={40} className="flex items-center justify-center transition-all" />
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
                            target={item.name === "DOCUMENTATION" ? "_blank" : undefined}
                            rel={item.name === "DOCUMENTATION" ? "noopener noreferrer" : undefined}
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
