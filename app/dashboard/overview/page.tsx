"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BarChart3,
    FileText,
    ShieldCheck,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Key,
    BookOpen,
    MoveRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getExtractions } from "@/lib/resources";
import { getAnalytics } from "@/lib/resources-ext";
import type { Extraction, AnalyticsOverview } from "@/types";

import { Skeleton } from "@/components/ui/skeleton/skeleton";

export default function OverviewPage() {
    const [extractions, setExtractions] = useState<Extraction[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [extsData, analyticsData] = await Promise.all([
                    getExtractions({ limit: 5 }),
                    getAnalytics(),
                ]);
                setExtractions(extsData.data);
                setAnalytics(analyticsData);
            } catch (err) {
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = [
        {
            name: "Total Extractions",
            value: analytics?.totalExtractions.toString() || "0",
            change: analytics ? `${analytics.successRate.toFixed(1)}%` : "0%",
            trend: "up" as const,
            icon: FileText,
            color: "bg-blue-500"
        },
        {
            name: "Taux de Précision",
            value: analytics ? `${(analytics.avgConfidence * 100).toFixed(1)}%` : "0%",
            change: "+0.4%",
            trend: "up" as const,
            icon: ShieldCheck,
            color: "bg-primary"
        },
        {
            name: "Temps Moyen",
            value: analytics ? `${(analytics.avgProcessingMs / 1000).toFixed(1)}s` : "0s",
            change: "-0.2s",
            trend: "up" as const,
            icon: Zap,
            color: "bg-yellow-500"
        },
        {
            name: "Alertes Fraude",
            value: analytics 
                ? (analytics.fraudDistribution.high + analytics.fraudDistribution.critical).toString() 
                : "0",
            change: "-3",
            trend: "down" as const,
            icon: BarChart3,
            color: "bg-red-500"
        },
    ];

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'Terminé';
            case 'failed': return 'Échec';
            case 'processing': return 'En cours';
            case 'queued': return 'En attente';
            default: return status;
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-10 pb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
                            <Skeleton className="h-4 w-32 font-mono" />
                        </div>
                        <Skeleton className="h-10 w-72 tech-border bg-black/40" />
                        <Skeleton className="h-3 w-96 font-mono" />
                    </div>
                    <Skeleton className="h-10 w-40 tech-border bg-black/40" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="tech-border bg-black/40 p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-8 w-8 tech-border bg-black/40" />
                                <Skeleton className="h-5 w-16 tech-border bg-black/40" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24 font-mono" />
                                <Skeleton className="h-8 w-20 tech-border bg-black/40" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="tech-border bg-black/40 overflow-hidden">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <Skeleton className="h-6 w-48 font-mono" />
                        <Skeleton className="h-8 w-24 tech-border bg-black/40" />
                    </div>
                    <div className="p-6 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-8 w-8 tech-border bg-black/40" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32 font-mono" />
                                        <Skeleton className="h-3 w-20 font-mono" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-24 tech-border bg-black/40" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-xs font-mono text-primary/60 tracking-widest uppercase">System_Dashboard</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground font-mono">DASHBOARD_OVERVIEW</h1>
                    <p className="text-foreground/50 mt-2 font-mono text-xs tracking-wide">REALTIME_EXTRACTION_METRICS</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link 
                        href="/dashboard/playground"
                        className="flex items-center gap-2 px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-black font-bold font-mono text-xs uppercase tracking-wider transition-all"
                    >
                        <Zap size={16} /> NEW_ANALYSIS
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="tech-border bg-black/40 p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 opacity-5 -mr-6 -mt-6 rounded-full border border-primary/20" />
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 border border-border/50 text-foreground/40 group-hover:text-primary transition-colors">
                                    <stat.icon size={16} />
                                </div>
                                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono">{stat.name}</span>
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-[10px] font-bold px-2 py-1 border font-mono",
                                stat.trend === 'up' ? "border-primary/30 text-primary" : "border-red-500/30 text-red-500"
                            )}>
                                {stat.trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <span className="text-3xl font-black text-foreground font-mono">{stat.value}</span>
                        </div>
                        <div className="mt-2 h-0.5 bg-border/30 relative overflow-hidden">
                            <div className="absolute inset-0 bg-primary/50 w-3/4" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Extractions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-lg font-bold flex items-center gap-2 font-mono uppercase tracking-wider">
                            <Clock className="w-4 h-4 text-primary" /> RECENT_ANALYSES
                        </h2>
                        <Link href="/dashboard/extractions" className="text-xs font-mono text-primary/80 hover:text-primary transition-colors">VIEW_ALL [→]</Link>
                    </div>
                    
                    <div className="tech-border bg-black/40 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border bg-accent/5">
                                        <th className="px-4 py-3 text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono">DOCUMENT</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono">TIMESTAMP</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-foreground/40 uppercase tracking-widest text-center font-mono">CONFIDENCE</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-foreground/40 uppercase tracking-widest text-right font-mono">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {extractions.map((ext) => (
                                        <tr key={ext.referenceId} className="hover:bg-primary/5 transition-colors group">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 border border-border/50 flex items-center justify-center text-foreground/40 group-hover:border-primary/50 group-hover:text-primary transition-colors">
                                                        <FileText size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-xs text-foreground capitalize font-mono">{ext.documentType || 'UNKNOWN'}</p>
                                                        <p className="text-[9px] font-mono text-foreground/40 uppercase">{ext.referenceId.slice(0, 12)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="text-xs text-foreground/60 font-mono">{new Date(ext.createdAt).toLocaleDateString()}</p>
                                                <p className="text-[10px] text-foreground/40 font-mono">{new Date(ext.createdAt).toLocaleTimeString()}</p>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                {ext.result ? (
                                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 border border-primary/30 text-primary text-[10px] font-bold font-mono">
                                                        {(ext.result.globalConfidence * 100).toFixed(0)}%
                                                    </div>
                                                ) : (
                                                    <span className="text-foreground/20 font-mono text-[10px]">--</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <span className={cn(
                                                    "inline-flex px-2 py-1 border text-[9px] font-black uppercase tracking-widest font-mono",
                                                    ext.status === 'completed' ? "border-green-500/30 text-green-500" :
                                                    ext.status === 'failed' ? "border-red-500/30 text-red-500" :
                                                    "border-yellow-500/30 text-yellow-500"
                                                )}>
                                                    {getStatusLabel(ext.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {extractions.length === 0 && !isLoading && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-16 text-center">
                                                <div className="flex flex-col items-center gap-3 opacity-20">
                                                    <FileText size={40} />
                                                    <p className="font-mono text-xs font-bold">NO_DATA_FOUND</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                    {/* Documentation Card */}
                    <div className="tech-border bg-black/40 p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/20 transition-colors" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="w-5 h-5 text-primary" />
                                <span className="text-[10px] font-mono text-primary/60 tracking-widest uppercase">API_Documentation</span>
                            </div>
                            <h3 className="text-lg font-black mb-3 font-mono uppercase">INTEGRATION_GUIDE</h3>
                            <p className="text-foreground/40 text-xs leading-relaxed mb-6 font-mono">
                                Deploy OCR extraction in &lt;10 minutes using our SDKs and comprehensive API documentation.
                            </p>
                            <Link 
                                href="/docs" 
                                className="inline-flex items-center gap-2 text-xs font-bold text-primary font-mono hover:gap-4 transition-all uppercase tracking-wider"
                            >
                                Access_Docs <MoveRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Action Card */}
                    <div className="tech-border bg-black/40 p-6">
                        <h3 className="text-sm font-bold mb-5 font-mono uppercase tracking-wider text-foreground/80">QUICK_ACTIONS</h3>
                        <div className="grid gap-3">
                            {[
                                { name: "MANAGE_API_KEYS", icon: Key, href: "/dashboard/api-keys" },
                                { name: "FRAUD_CONFIG", icon: ShieldCheck, href: "/dashboard/settings" },
                                { name: "FULL_HISTORY", icon: BarChart3, href: "/dashboard/extractions" },
                            ].map((action) => (
                                <Link 
                                    key={action.name}
                                    href={action.href}
                                    className="flex items-center gap-3 p-3 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                                >
                                    <div className="w-8 h-8 border border-border/30 flex items-center justify-center text-foreground/40 group-hover:text-primary transition-colors">
                                        <action.icon size={14} />
                                    </div>
                                    <span className="text-xs font-bold text-foreground/70 group-hover:text-foreground font-mono">{action.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
