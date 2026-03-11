"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, CreditCard, Activity, ShieldAlert, TrendingUp, Loader2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from "@/lib/api";
import { getAdminUsers } from "@/lib/resources-ext";
import type { User } from "@/types";
import { toast } from "sonner";

const data = [
  { name: 'Lun', extractions: 4000 },
  { name: 'Mar', extractions: 3000 },
  { name: 'Mer', extractions: 2000 },
  { name: 'Jeu', extractions: 2780 },
  { name: 'Ven', extractions: 1890 },
  { name: 'Sam', extractions: 2390 },
  { name: 'Dim', extractions: 3490 },
];

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [overview, setOverview] = useState<{
        totalUsers: number;
        activeUsers: number;
        totalExtractions: number;
        successRate: number;
        revenueXof: number;
        completedTransactions: number;
        fraudDistribution?: { low: number; medium: number; high: number; critical: number };
    } | null>(null);
    const [latestUsers, setLatestUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [overviewRes, usersRes] = await Promise.all([
                    api.get("/analytics/admin/overview"),
                    getAdminUsers({ limit: 5, offset: 0 }),
                ]);
                setOverview(overviewRes.data);
                setLatestUsers(usersRes.data);
            } catch (err) {
                toast.error("Erreur lors du chargement des métriques admin");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = useMemo(() => {
        return {
            totalUsers: overview?.totalUsers ?? 0,
            activeUsers: overview?.activeUsers ?? 0,
            revenue: overview?.revenueXof ?? 0,
            apiUsage: overview?.totalExtractions ?? 0,
            fraudAlerts:
                (overview?.fraudDistribution?.high ?? 0) + (overview?.fraudDistribution?.critical ?? 0),
        };
    }, [overview]);

    const cards = [
        { label: "TOTAL_USERS", value: stats.totalUsers, change: "+12%", icon: Users, color: "text-blue-400" },
        { label: "REVENUE_XOF", value: stats.revenue.toLocaleString(), change: `${overview?.completedTransactions ?? 0} TRX`, icon: CreditCard, color: "text-green-400" },
        { label: "EXTRACTIONS", value: stats.apiUsage.toLocaleString(), change: `${(overview?.successRate ?? 0).toFixed(1)}% SUCCESS`, icon: Activity, color: "text-purple-400" },
        { label: "FRAUD_ALERTS", value: stats.fraudAlerts.toString(), change: "HIGH + CRITICAL", icon: ShieldAlert, color: "text-red-400" },
    ];

    return (
        <div className="space-y-6">
            <div className="tech-border bg-black/40 border-primary/20 p-4">
                <div className="flex items-center gap-2 mb-1">
                    <Activity size={18} className="text-primary animate-pulse" />
                    <span className="text-[10px] font-mono text-primary/80 uppercase tracking-widest">ADMIN_OVERVIEW</span>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-mono uppercase">Dashboard_System</h1>
                <p className="text-foreground/60 mt-1 font-mono text-xs">PLATFORM_METRICS // KEY_INDICATORS</p>
            </div>

            {isLoading && (
                <div className="tech-border bg-black/40 border-primary/20 p-4 flex items-center gap-3 text-xs text-foreground/60 font-mono">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    LOADING_METRICS
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <div key={card.label} className="tech-border bg-black/40 border-border/60 p-4 hover:border-primary/40 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 tech-border bg-black/60 border-border/40 ${card.color}`}>
                                <card.icon size={18} />
                            </div>
                            <span className="text-[10px] font-black text-green-400 flex items-center gap-1 tech-border bg-green-500/10 border-green-500/30 px-2 py-1 font-mono uppercase tracking-wider">
                                {card.change} <TrendingUp size={10} />
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-foreground/50 font-mono uppercase tracking-wider">{card.label}</p>
                        <h3 className="text-xl font-black text-foreground mt-1 font-mono">{card.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="tech-border bg-black/40 border-primary/20 p-4 min-h-[400px]">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity size={16} className="text-primary animate-pulse" />
                        <h3 className="text-sm font-black text-foreground font-mono uppercase tracking-wider">API_ACTIVITY_LAST_7_DAYS</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorExt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00A651" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#00A651" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tick={{ fontFamily: 'monospace' }} />
                                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} tick={{ fontFamily: 'monospace' }} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontFamily: 'monospace', fontSize: '10px' }}
                                    itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
                                />
                                <Area type="monotone" dataKey="extractions" stroke="#00A651" strokeWidth={2} fillOpacity={1} fill="url(#colorExt)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="tech-border bg-black/40 border-primary/20 p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Users size={16} className="text-primary animate-pulse" />
                        <h3 className="text-sm font-black text-foreground font-mono uppercase tracking-wider">LATEST_REGISTRATIONS</h3>
                    </div>
                    <div className="space-y-2">
                        {latestUsers.map((u) => (
                            <div key={u.id} className="flex items-center justify-between p-3 tech-border bg-black/60 border-border/40">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 tech-border bg-primary/10 border-primary/40 flex items-center justify-center text-[10px] text-primary font-black font-mono">
                                        {(u.firstName?.[0] ?? "U")}{(u.lastName?.[0] ?? "")}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-foreground font-mono uppercase">{u.firstName} {u.lastName}</p>
                                        <p className="text-[9px] text-foreground/50 font-mono uppercase tracking-wider">{u.email}</p>
                                    </div>
                                </div>
                                <span className="text-[9px] text-foreground/50 font-mono uppercase tracking-wider">{u.plan?.toUpperCase?.() ?? ""}</span>
                            </div>
                        ))}
                        {latestUsers.length === 0 && (
                            <div className="text-xs text-foreground/60 font-mono uppercase tracking-wider">NO_USERS_FOUND</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
