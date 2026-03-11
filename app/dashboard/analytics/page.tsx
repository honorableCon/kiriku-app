"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, ArrowUpRight, Calendar, Loader2 } from "lucide-react";
import { getAnalytics } from "@/lib/resources-ext";
import type { AnalyticsOverview } from "@/types";
import { toast } from "sonner";

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await getAnalytics();
                setAnalytics(data);
            } catch (err) {
                toast.error("Erreur lors du chargement des données");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center min-h-[400px]">
                <div className="tech-border bg-black/40 p-4 flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="font-mono text-xs text-foreground/40">LOADING_ANALYTICS</span>
                </div>
            </div>
        );
    }

    const stats = [
        { 
            label: "TOTAL_EXTRACTIONS", 
            value: analytics?.totalExtractions.toString() || "0", 
            change: "+12%", 
            icon: BarChart3, 
            color: "text-primary" 
        },
        { 
            label: "SUCCESS_RATE", 
            value: analytics ? `${analytics.successRate.toFixed(1)}%` : "0%", 
            change: "+5%", 
            icon: TrendingUp, 
            color: "text-primary" 
        },
        { 
            label: "AVG_PROCESSING_TIME", 
            value: analytics ? `${(analytics.avgProcessingMs / 1000).toFixed(2)}s` : "0s", 
            change: "-0.5s", 
            icon: Calendar, 
            color: "text-primary" 
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-mono">ANALYTICS</h1>
                    <p className="font-mono text-xs text-foreground/40 mt-1">PERFORMANCE_METRICS_AND_PROCESSING_VOLUMES</p>
                </div>
                <button className="tech-border bg-black/40 flex items-center gap-2 px-4 py-2 text-sm font-bold text-foreground/60 hover:border-primary/50 hover:text-foreground transition-all font-mono">
                    <Calendar size={18} /> THIS_MONTH
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="tech-border bg-black/40 p-6 group hover:border-primary/40 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 tech-border bg-primary/10 ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="text-xs font-bold text-primary flex items-center gap-1 bg-primary/10 px-2 py-1 tech-border font-mono">
                                {stat.change} <ArrowUpRight size={14} />
                            </span>
                        </div>
                        <p className="text-xs font-bold text-foreground/40 font-mono">{stat.label}</p>
                        <h3 className="text-3xl font-black text-foreground mt-1 font-mono">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Distribution Chart Placeholder */}
                <div className="tech-border bg-black/40 p-8">
                    <h3 className="text-lg font-bold text-foreground mb-6 font-mono">DOCUMENT_DISTRIBUTION</h3>
                    <div className="space-y-4">
                        {analytics?.distribution && Object.entries(analytics.distribution).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold font-mono">
                                    <span className="capitalize text-foreground/60">{key.replace(/-/g, ' ')}</span>
                                    <span className="font-bold text-primary">{value}</span>
                                </div>
                                <div className="h-2 w-full bg-primary/10 tech-border overflow-hidden">
                                    <div 
                                        className="h-full bg-primary transition-all duration-1000" 
                                        style={{ width: `${(value / (analytics.totalExtractions || 1)) * 100}%` }} 
                                    />
                                </div>
                            </div>
                        ))}
                        {(!analytics?.distribution || Object.keys(analytics.distribution).length === 0) && (
                             <p className="text-center text-foreground/40 py-8 font-mono">NO_DATA_AVAILABLE</p>
                        )}
                    </div>
                </div>

                {/* Fraud Stats */}
                <div className="tech-border bg-black/40 p-8">
                    <h3 className="text-lg font-bold text-foreground mb-6 font-mono">FRAUD_DETECTION</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="tech-border p-4 bg-primary/5 border-primary/20">
                            <p className="text-xs font-bold text-primary mb-1 font-mono">LOW_RISK</p>
                            <p className="text-2xl font-black text-foreground font-mono">{analytics?.fraudDistribution.low || 0}</p>
                        </div>
                        <div className="tech-border p-4 bg-yellow-500/5 border-yellow-500/20">
                            <p className="text-xs font-bold text-yellow-500 mb-1 font-mono">MEDIUM_RISK</p>
                            <p className="text-2xl font-black text-foreground font-mono">{analytics?.fraudDistribution.medium || 0}</p>
                        </div>
                        <div className="tech-border p-4 bg-red-500/5 border-red-500/20">
                            <p className="text-xs font-bold text-red-500 mb-1 font-mono">HIGH_RISK</p>
                            <p className="text-2xl font-black text-foreground font-mono">{analytics?.fraudDistribution.high || 0}</p>
                        </div>
                        <div className="tech-border p-4 bg-zinc-950 border-zinc-800">
                            <p className="text-xs font-bold text-zinc-400 mb-1 font-mono">CRITICAL</p>
                            <p className="text-2xl font-black text-white font-mono">{analytics?.fraudDistribution.critical || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
