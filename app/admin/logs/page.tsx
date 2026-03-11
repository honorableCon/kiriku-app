"use client";

import { ShieldAlert, Activity } from "lucide-react";

export default function AdminLogsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white font-mono">SYSTEM_LOGS</h1>
                <p className="text-zinc-400 mt-1 font-mono text-xs">
                    EVENT_AUDIT_AND_MONITORING
                </p>
            </div>

            <div className="tech-border bg-black/40 p-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 tech-border bg-primary/10 text-primary">
                        <ShieldAlert size={18} />
                    </div>
                    <h2 className="text-lg font-bold text-white font-mono">OBSERVABILITY</h2>
                </div>
                <p className="text-sm text-zinc-400 font-mono">
                    THIS_PAGE_AVOIDS_404_AND_PREPARES_ADMIN_SPACE
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs text-zinc-500 font-mono">
                    <Activity size={14} />
                    <span>TO_CONNECT_TO_SERVER_LOG_SOURCE</span>
                </div>
            </div>
        </div>
    );
}

