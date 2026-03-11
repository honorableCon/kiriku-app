"use client";

import { CreditCard, TrendingUp } from "lucide-react";

export default function AdminRevenuePage() {
    return (
        <div className="space-y-6">
            <div className="tech-border bg-black/40 border-primary/20 p-4">
                <div className="flex items-center gap-2 mb-1">
                    <CreditCard size={18} className="text-primary animate-pulse" />
                    <span className="text-[10px] font-mono text-primary/80 uppercase tracking-widest">REVENUE_ANALYTICS</span>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-mono uppercase">Revenue_Monitoring</h1>
                <p className="text-foreground/60 mt-1 font-mono text-xs">PAYMENT_TRACKING // COMMERCIAL_PERFORMANCE</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="tech-border bg-black/40 border-primary/20 p-4 hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="tech-border bg-black/60 border-border/40 p-2 text-green-400">
                            <TrendingUp size={16} />
                        </div>
                        <h2 className="text-sm font-black text-foreground font-mono uppercase tracking-wider">GLOBAL_OVERVIEW</h2>
                    </div>
                    <p className="text-xs text-foreground/60 font-mono uppercase tracking-wider">
                        SYSTEM_READY // AWAITING_ADMIN_ENDPOINT
                    </p>
                    <p className="text-[10px] text-foreground/40 mt-2 font-mono">
                        DATA_SOURCE // ADMIN_API // ENDPOINT_REQUIRED
                    </p>
                </div>

                <div className="tech-border bg-black/40 border-primary/20 p-4 hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="tech-border bg-black/60 border-border/40 p-2 text-blue-400">
                            <CreditCard size={16} />
                        </div>
                        <h2 className="text-sm font-black text-foreground font-mono uppercase tracking-wider">TRANSACTIONS</h2>
                    </div>
                    <p className="text-xs text-foreground/60 font-mono uppercase tracking-wider">
                        PENDING_IMPLEMENTATION // DEXPAY_INTEGRATION
                    </p>
                    <p className="text-[10px] text-foreground/40 mt-2 font-mono">
                        FEATURES // LIST_TRANSACTIONS // FILTER // MONTHLY_AGGREGATION
                    </p>
                </div>
            </div>
        </div>
    );
}

