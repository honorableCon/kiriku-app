"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
    Layers,
    FileText,
    CheckCircle2,
    AlertTriangle,
    Clock,
    ArrowLeft,
    RefreshCcw,
    Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getBatchById } from "@/lib/resources";
import Link from "next/link";

export default function BatchDetailPage() {
    const params = useParams();
    const batchId = params.id as string;

    const [batch, setBatch] = useState<any>(null);
    const [extractions, setExtractions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBatch = useCallback(async () => {
        try {
            const result = await getBatchById(batchId);
            setBatch(result.batch);
            setExtractions(result.extractions || []);
        } catch (err) {
            console.error("Failed to fetch batch:", err);
        } finally {
            setIsLoading(false);
        }
    }, [batchId]);

    useEffect(() => {
        fetchBatch();
    }, [fetchBatch]);

    // Auto-refresh while processing
    useEffect(() => {
        if (!batch || batch.status === "completed" || batch.status === "partial_failure") return;
        const interval = setInterval(fetchBatch, 5000);
        return () => clearInterval(interval);
    }, [batch, fetchBatch]);

    const handleExportJson = () => {
        const exportData = extractions.map(ext => {
            const data: any = {
                referenceId: ext.referenceId,
                documentType: ext.documentType,
                status: ext.status,
                confidence: ext.result?.globalConfidence,
            };
            
            if (ext.result?.extractedData) {
                const cleanedData: Record<string, any> = {};
                for (const [k, v] of Object.entries(ext.result.extractedData)) {
                    cleanedData[k] = (v as any)?.value ?? v;
                }
                data.extractedData = cleanedData;
            }
            
            return data;
        });

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `batch_${batchId}_export.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <span className="text-xs text-foreground/40 font-mono uppercase tracking-widest animate-pulse">Loading Batch...</span>
                </div>
            </div>
        );
    }

    if (!batch) {
        return (
            <div className="text-center py-20">
                <p className="text-foreground/40 text-sm">Batch introuvable</p>
                <Link href="/dashboard/batch" className="text-primary text-xs mt-4 inline-block hover:underline">
                    ← Retour aux batches
                </Link>
            </div>
        );
    }

    const total = batch.totalDocuments || 0;
    const completed = batch.completedCount || 0;
    const failed = batch.failedCount || 0;
    const processing = total - completed - failed;
    const progressPct = total > 0 ? ((completed + failed) / total) * 100 : 0;

    const statusConfig: Record<string, { color: string; label: string }> = {
        queued: { color: "text-zinc-500", label: "En attente" },
        processing: { color: "text-yellow-500", label: "En cours" },
        completed: { color: "text-primary", label: "Terminé" },
        partial_failure: { color: "text-destructive", label: "Erreurs partielles" },
    };
    const cfg = statusConfig[batch.status] || statusConfig.queued;

    return (
        <div className="space-y-8 font-mono">
            <div className="flex items-center gap-4 border-b border-border pb-6">
                <Link
                    href="/dashboard/batch"
                    className="p-2 border border-border bg-black text-foreground/40 hover:text-primary hover:border-primary/30 transition-all rounded"
                >
                    <ArrowLeft size={16} />
                </Link>
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase tracking-widest flex items-center gap-3">
                        <Layers className="text-primary" size={24} /> {batchId}
                    </h1>
                    <p className="text-foreground/40 text-xs mt-1 font-mono uppercase tracking-wider">
                        {batch.documentType} · {total} documents
                    </p>
                </div>
                {(batch.status === "queued" || batch.status === "processing") && (
                    <button
                        onClick={fetchBatch}
                        className="p-2 border border-border bg-black text-foreground/40 hover:text-primary hover:border-primary/30 transition-all rounded"
                    >
                        <RefreshCcw size={16} />
                    </button>
                )}
                <button
                    onClick={handleExportJson}
                    disabled={extractions.length === 0}
                    className="flex items-center gap-2 px-4 py-2 border border-border bg-black text-foreground hover:border-primary/50 hover:text-primary transition-all rounded text-xs font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download size={16} /> JSON
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="tech-border bg-black/20 p-6 rounded-lg text-center">
                    <div className="text-[10px] text-foreground/40 uppercase tracking-widest mb-2 font-bold">Total</div>
                    <div className="text-3xl font-black text-foreground">{total}</div>
                </div>
                <div className="tech-border bg-black/20 p-6 rounded-lg text-center">
                    <div className="text-[10px] text-primary/60 uppercase tracking-widest mb-2 font-bold">Réussis</div>
                    <div className="text-3xl font-black text-primary">{completed}</div>
                </div>
                <div className="tech-border bg-black/20 p-6 rounded-lg text-center">
                    <div className="text-[10px] text-destructive/60 uppercase tracking-widest mb-2 font-bold">Échoués</div>
                    <div className="text-3xl font-black text-destructive">{failed}</div>
                </div>
                <div className="tech-border bg-black/20 p-6 rounded-lg text-center">
                    <div className="text-[10px] text-yellow-500/60 uppercase tracking-widest mb-2 font-bold">En cours</div>
                    <div className="text-3xl font-black text-yellow-500">{processing}</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="tech-border bg-black/20 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Progression</span>
                    <span className={cn("text-xs font-bold uppercase tracking-wider", cfg.color)}>{cfg.label} · {Math.round(progressPct)}%</span>
                </div>
                <div className="h-3 bg-border rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-500 relative"
                        style={{ width: `${Math.max(progressPct, 2)}%` }}
                    >
                        {batch.status === "processing" && (
                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                        )}
                    </div>
                </div>
            </div>

            {/* Extractions Table */}
            <div className="tech-border bg-black/40 overflow-hidden rounded-lg">
                <div className="p-4 border-b border-border bg-accent/5">
                    <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
                        <FileText size={16} /> Documents ({extractions.length})
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border bg-black/60 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                                <th className="px-6 py-4">Reference_ID</th>
                                <th className="px-6 py-4">Doc_Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Confidence</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {extractions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-foreground/40 text-xs uppercase tracking-widest">
                                        Aucun document
                                    </td>
                                </tr>
                            ) : (
                                extractions.map((ext: any) => (
                                    <tr key={ext.referenceId} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <Link href={`/dashboard/extractions/${ext.referenceId}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                                                <div className="p-1.5 border border-border bg-black text-foreground/40 group-hover:text-primary group-hover:border-primary/30 transition-colors rounded">
                                                    <FileText size={12} />
                                                </div>
                                                <span className="font-mono text-xs text-foreground/80">{ext.referenceId}</span>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-foreground capitalize">{ext.documentType || "UNKNOWN"}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest rounded",
                                                ext.status === "completed" ? "border-primary/30 bg-primary/5 text-primary" :
                                                ext.status === "processing" ? "border-yellow-500/30 bg-yellow-500/5 text-yellow-500" :
                                                ext.status === "failed" ? "border-destructive/30 bg-destructive/5 text-destructive" :
                                                "border-zinc-500/30 bg-zinc-500/5 text-zinc-500"
                                            )}>
                                                {ext.status === "completed" && <CheckCircle2 size={10} />}
                                                {ext.status === "failed" && <AlertTriangle size={10} />}
                                                {(ext.status === "processing" || ext.status === "queued") && <Clock size={10} />}
                                                {ext.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {ext.result?.globalConfidence ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-12 h-1 bg-border overflow-hidden rounded">
                                                        <div
                                                            className={cn("h-full rounded",
                                                                ext.result.globalConfidence > 0.8 ? "bg-primary" :
                                                                ext.result.globalConfidence > 0.5 ? "bg-yellow-500" : "bg-destructive"
                                                            )}
                                                            style={{ width: `${ext.result.globalConfidence * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-foreground/60 font-mono">
                                                        {Math.round(ext.result.globalConfidence * 100)}%
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-foreground/30 font-mono">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
