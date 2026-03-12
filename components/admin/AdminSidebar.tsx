"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Users, 
    Settings, 
    LogOut, 
    ShieldAlert, 
    CreditCard,
    LayoutDashboard,
    ChevronLeft,
    ChevronRight,
    Cpu,
    FileText
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const navigation = [
    { name: "OVERVIEW", href: "/admin", icon: LayoutDashboard },
    { name: "USERS", href: "/admin/users", icon: Users },
    { name: "TEMPLATES", href: "/admin/templates", icon: FileText },
    { name: "BILLING_PLANS", href: "/admin/plans", icon: CreditCard },
    { name: "LEARNING", href: "/admin/learning", icon: Cpu },
    { name: "REVENUE", href: "/admin/revenue", icon: LayoutDashboard },
    { name: "SYSTEM_LOGS", href: "/admin/logs", icon: ShieldAlert },
    { name: "SETTINGS", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    return (
        <aside
            className={cn(
                "hidden lg:flex flex-col border-r border-primary/20 bg-black/80 backdrop-blur-md transition-all duration-300",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex h-16 items-center justify-between px-6 border-b border-primary/20 bg-primary/5">
                <Link href="/admin" className="flex items-center gap-2 overflow-hidden">
                    <div className="min-w-8 h-8 bg-primary/10 border border-primary flex items-center justify-center shrink-0">
                        <span className="text-primary font-mono font-bold text-xl">K</span>
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="text-lg font-bold tracking-widest text-foreground uppercase font-mono">ADMIN</span>
                            <span className="text-[10px] text-primary/60 font-mono tracking-wider">SYSTEM_CONTROL</span>
                        </div>
                    )}
                </Link>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 hover:bg-white/10 text-foreground/60 hidden lg:block transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-0 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
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

            <div className="p-4 border-t border-primary/20 bg-black/50">
                {!isCollapsed && (
                    <div className="mb-6 p-4 border border-primary/20 bg-primary/5 space-y-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                            <span className="text-foreground/60">Admin Status</span>
                            <span className="text-primary">ACTIVE</span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-foreground">SYSTEM_ONLINE</span>
                                <span className="text-primary">●</span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "px-2")}>
                    <div className="w-8 h-8 bg-zinc-800 flex items-center justify-center text-foreground/60">
                        <ShieldAlert size={16} />
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 overflow-hidden space-y-2">
                            <p className="text-xs font-bold text-foreground truncate font-mono">ADMIN_ACCESS</p>
                            <Link
                                href="/dashboard/overview"
                                className="text-[10px] text-foreground/40 hover:text-foreground/80 font-mono flex items-center gap-1"
                            >
                                <LayoutDashboard size={10} /> BACK_TO_DASHBOARD
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="text-[10px] text-destructive hover:text-destructive/80 font-mono flex items-center gap-1"
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
