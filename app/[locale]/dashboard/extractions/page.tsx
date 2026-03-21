"use client";

import { useEffect, useState } from "react";
import {
    FileText,
    Search,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    AlertTriangle,
    Clock,
    ExternalLink,
    Trash2,
    Database,
    ArrowUpRight,
    Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import api from "@/lib/api";
import { toast } from "sonner";

export default function ExtractionsPage() {
    const [extractions, setExtractions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        fetchExtractions();
    }, []);

    const fetchExtractions = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/extractions");
            setExtractions(response.data.data || []);
            setTotal(response.data.total || 0);
        } catch (err) {
            toast.error("Erreur lors du chargement des extractions");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteExtraction = async (id: string) => {
        if (!confirm("Supprimer cette extraction ?")) return;
        try {
            await api.delete(`/extractions/${id}`);
            setExtractions(prev => prev.filter(e => e.referenceId !== id));
            setTotal(prev => prev - 1);
            toast.success("Extraction supprimée");
        } catch (err) {
            toast.error("Erreur lors de la suppression");
        }
    };

    const exportCsv = async () => {
        setIsExporting(true);
        try {
            const res = await api.get<{ data: string; format: string }>("/analytics/export", {
                params: { format: "csv" },
            });

            const blob = new Blob([res.data.data], { type: "text/csv;charset=utf-8" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `kiriku_extractions_${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            toast.success("Export CSV généré");
        } catch (err) {
            toast.error("Erreur lors de l'export CSV");
        } finally {
            setIsExporting(false);
        }
    };

    const filteredExtractions = extractions.filter(ext => 
        ext.referenceId.toLowerCase().includes(search.toLowerCase()) ||
        (ext.documentType || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 font-mono">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase tracking-widest flex items-center gap-3">
                        <Database className="text-primary" /> Extraction_Logs
                    </h1>
                    <p className="text-foreground/40 text-xs mt-2 font-mono uppercase tracking-wider">
                        Audit Trail & Processing History
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={exportCsv}
                        disabled={isExporting}
                        className="p-3 border border-border bg-black/40 text-foreground/60 hover:text-primary hover:border-primary/50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Exporter CSV"
                    >
                        {isExporting ? (
                            <div className="w-[18px] h-[18px] border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        ) : (
                            <Download size={18} className="group-hover:scale-110 transition-transform" />
                        )}
                    </button>
                    <Link href="/dashboard/playground" className="px-6 py-3 bg-primary text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 clip-path-polygon group">
                        <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" /> New_Process
                    </Link>
                </div>
            </div>

            <div className="tech-border bg-black/40 overflow-hidden">
                <div className="p-4 border-b border-border bg-accent/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:max-w-xs group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4 group-hover:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH_LOGS..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-black border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-foreground/20"
                        />
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <button className="flex items-center gap-2 px-4 py-2 border border-border bg-black text-xs font-bold text-foreground/60 hover:text-primary hover:border-primary/30 transition-all uppercase tracking-wider">
                            <Filter size={14} /> Filter
                        </button>
                        <div className="h-4 w-px bg-border" />
                        <span className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                            {filteredExtractions.length} / {total} RECORDS
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border bg-black/60 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                                <th className="px-6 py-4">Reference_ID</th>
                                <th className="px-6 py-4">Doc_Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Confidence</th>
                                <th className="px-6 py-4">Batch</th>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                            <span className="text-xs text-foreground/40 uppercase tracking-widest animate-pulse">Loading_Data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredExtractions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-foreground/40 text-xs uppercase tracking-widest">
                                        No records found in database
                                    </td>
                                </tr>
                            ) : filteredExtractions.map((ext) => (
                                <tr key={ext.referenceId} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 border border-border bg-black text-foreground/40 group-hover:text-primary group-hover:border-primary/30 transition-colors">
                                                <FileText size={14} />
                                            </div>
                                            <span className="font-mono text-xs text-foreground/80">{ext.referenceId}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-foreground capitalize">{ext.documentType || 'UNKNOWN'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest",
                                            ext.status === 'completed' ? "border-primary/30 bg-primary/5 text-primary" :
                                            ext.status === 'reviewed' ? "border-blue-500/30 bg-blue-500/5 text-blue-500" :
                                            ext.status === 'processing' ? "border-yellow-500/30 bg-yellow-500/5 text-yellow-500" :
                                            ext.status === 'failed' ? "border-destructive/30 bg-destructive/5 text-destructive" :
                                            "border-zinc-500/30 bg-zinc-500/5 text-zinc-500"
                                        )}>
                                            {ext.status === 'completed' && <CheckCircle2 size={10} />}
                                            {ext.status === 'reviewed' && <CheckCircle2 size={10} />}
                                            {ext.status === 'failed' && <AlertTriangle size={10} />}
                                            {ext.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-1 bg-border overflow-hidden">
                                                <div 
                                                    className={cn("h-full", 
                                                        (ext.result?.globalConfidence || 0) > 0.8 ? "bg-primary" : 
                                                        (ext.result?.globalConfidence || 0) > 0.5 ? "bg-yellow-500" : "bg-destructive"
                                                    )}
                                                    style={{ width: `${(ext.result?.globalConfidence || 0) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-foreground/60 font-mono">
                                                {Math.round((ext.result?.globalConfidence || 0) * 100)}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {ext.batchId ? (
                                            <Link 
                                                href={`/dashboard/batch/${ext.batchId}`}
                                                className="group/batch inline-flex items-center gap-1.5 px-2 py-0.5 border border-primary/20 bg-primary/5 text-primary rounded hover:border-primary/50 transition-all"
                                            >
                                                <Layers size={10} className="text-primary/60 group-hover/batch:text-primary transition-colors" />
                                                <span className="text-[9px] font-bold font-mono tracking-tight group-hover/batch:translate-x-0.5 transition-transform">{ext.batchId.split('_').pop()}</span>
                                            </Link>
                                        ) : (
                                            <span className="text-[10px] text-foreground/20 font-mono">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-[10px] text-foreground/40 font-mono">
                                        {new Date(ext.createdAt).toLocaleDateString()} <span className="opacity-50 mx-1">-</span> {new Date(ext.createdAt).toLocaleTimeString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link 
                                                href={`/dashboard/extractions/${ext.referenceId}`}
                                                className="p-1.5 text-foreground/40 hover:text-primary border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all"
                                                title="View Details"
                                            >
                                                <ExternalLink size={14} />
                                            </Link>
                                            <button 
                                                onClick={() => deleteExtraction(ext.referenceId)}
                                                className="p-1.5 text-foreground/40 hover:text-destructive border border-transparent hover:border-destructive/30 hover:bg-destructive/5 transition-all"
                                                title="Delete Record"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-border bg-accent/5 flex justify-between items-center">
                    <button className="p-2 border border-border bg-black text-foreground/40 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:hover:text-foreground/40 disabled:hover:border-border" disabled>
                        <ChevronLeft size={14} />
                    </button>
                    <div className="flex gap-1">
                        <button className="w-8 h-8 border border-primary bg-primary/10 text-primary text-xs font-bold font-mono">1</button>
                    </div>
                    <button className="p-2 border border-border bg-black text-foreground/40 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:hover:text-foreground/40 disabled:hover:border-border" disabled>
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
