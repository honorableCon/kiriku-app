"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Download, Loader2, RefreshCw } from "lucide-react";

type CorrectionRow = {
    referenceId: string;
    documentType: string;
    correctedAt?: string;
    createdAt?: string;
    userCorrection?: Record<string, unknown>;
};

export default function AdminLearningPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState<CorrectionRow[]>([]);
    const [total, setTotal] = useState(0);
    const [isExporting, setIsExporting] = useState(false);
    const [learningStatus, setLearningStatus] = useState<{
        enabled: boolean;
        totalExamples: number;
        totalValidated: number;
        stats: Array<{ _id: string; count: number; validatedCount: number }>;
    } | null>(null);

    const load = async () => {
        setIsLoading(true);
        try {
            const [correctionsRes, statusRes] = await Promise.all([
                api.get<{ data: CorrectionRow[]; total: number }>(
                    "/admin/learning/corrections",
                    { params: { limit: 50, offset: 0 } }
                ),
                api.get<{
                    enabled: boolean;
                    totalExamples: number;
                    totalValidated: number;
                    stats: Array<{ _id: string; count: number; validatedCount: number }>;
                }>("/learning/status"),
            ]);

            setRows(correctionsRes.data.data || []);
            setTotal(correctionsRes.data.total || 0);
            setLearningStatus(statusRes.data);
        } catch (err) {
            toast.error("Erreur lors du chargement des corrections");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const fieldsCount = useMemo(() => {
        return rows.reduce((acc, r) => acc + Object.keys(r.userCorrection || {}).length, 0);
    }, [rows]);

    const topTemplate = useMemo(() => {
        const stats = learningStatus?.stats || [];
        if (stats.length === 0) return null;
        return stats.slice().sort((a, b) => b.count - a.count)[0];
    }, [learningStatus]);

    const handleExport = async (format: "jsonl" | "json") => {
        setIsExporting(true);
        try {
            const res = await api.get<{ data: string; format: string }>(
                "/admin/learning/dataset",
                { params: { format } }
            );

            const contentType =
                format === "jsonl" ? "application/x-ndjson;charset=utf-8" : "application/json;charset=utf-8";
            const blob = new Blob([res.data.data], { type: contentType });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `kiriku_learning_dataset_${new Date().toISOString().slice(0, 10)}.${format}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            toast.success("Export généré");
        } catch (err) {
            toast.error("Erreur lors de l'export");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-mono">Apprentissage</h1>
                    <p className="text-foreground/60 mt-1 font-mono text-xs">
                        Centralisation des corrections (ground truth) et exports pour l'entraînement.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={load}
                        disabled={isLoading}
                        className="px-4 py-2 tech-border border-border bg-primary/10 text-foreground text-sm font-bold hover:bg-primary/20 transition-all disabled:opacity-50 flex items-center gap-2 font-mono"
                    >
                        <RefreshCw size={16} />
                        Rafraîchir
                    </button>
                    <button
                        onClick={() => handleExport("jsonl")}
                        disabled={isExporting}
                        className="px-4 py-2 tech-border bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2 font-mono"
                    >
                        {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        Export JSONL
                    </button>
                    <button
                        onClick={() => handleExport("json")}
                        disabled={isExporting}
                        className="px-4 py-2 tech-border border-border bg-black/40 text-foreground text-sm font-bold hover:bg-primary/10 transition-all disabled:opacity-50 flex items-center gap-2 font-mono"
                    >
                        <Download size={16} />
                        Export JSON
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="tech-border bg-black/40 p-6">
                    <div className="text-xs font-bold text-foreground/40 uppercase tracking-wider font-mono">Corrections</div>
                    <div className="text-3xl font-black text-foreground mt-2 font-mono">{total.toLocaleString()}</div>
                </div>
                <div className="tech-border bg-black/40 p-6">
                    <div className="text-xs font-bold text-foreground/40 uppercase tracking-wider font-mono">Champs corrigés</div>
                    <div className="text-3xl font-black text-foreground mt-2 font-mono">{fieldsCount.toLocaleString()}</div>
                </div>
                <div className="tech-border bg-black/40 p-6">
                    <div className="text-xs font-bold text-foreground/40 uppercase tracking-wider font-mono">Learning</div>
                    {learningStatus ? (
                        <div className="mt-2 space-y-1">
                            <div className="text-2xl font-black text-foreground font-mono">
                                {learningStatus.totalExamples.toLocaleString()}{" "}
                                <span className="text-[10px] text-foreground/40 uppercase tracking-wider">EXAMPLES</span>
                            </div>
                            <div className="text-xs text-foreground/60 font-mono">
                                {learningStatus.totalValidated.toLocaleString()} validated •{" "}
                                {learningStatus.enabled ? "ENABLED" : "DISABLED"}
                            </div>
                            {topTemplate ? (
                                <div className="text-[10px] text-foreground/50 font-mono">
                                    Top: {topTemplate._id} ({topTemplate.count})
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 mt-2 text-xs text-foreground/60 font-mono">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Chargement...
                        </div>
                    )}
                </div>
            </div>

            <div className="tech-border bg-black/40 overflow-hidden">
                <div className="px-6 py-4 border-b border-primary/20 bg-primary/5 flex items-center justify-between">
                    <div className="text-sm font-bold text-foreground font-mono">Dernières corrections</div>
                    {isLoading && (
                        <div className="flex items-center gap-2 text-xs text-foreground/60 font-mono">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Chargement...
                        </div>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-primary/20 bg-primary/10 text-xs font-bold text-foreground/40 uppercase tracking-wider font-mono">
                                <th className="px-6 py-4">Référence</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Champs</th>
                                <th className="px-6 py-4">Corrigé le</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/20">
                            {!isLoading && rows.length === 0 && (
                                <tr>
                                    <td className="px-6 py-10 text-sm text-foreground/60 font-mono" colSpan={4}>
                                        Aucune correction disponible.
                                    </td>
                                </tr>
                            )}
                            {rows.map((r) => (
                                <tr key={r.referenceId} className="hover:bg-primary/10 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono font-bold text-foreground">
                                        {r.referenceId}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-foreground/60 font-mono">{r.documentType}</td>
                                    <td className="px-6 py-4 text-sm text-foreground/60 font-mono">
                                        {Object.keys(r.userCorrection || {}).length}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-foreground/60 font-mono">
                                        {r.correctedAt ? new Date(r.correctedAt).toLocaleString() : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
