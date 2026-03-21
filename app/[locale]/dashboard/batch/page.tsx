"use client";

import { useMemo, useState, useEffect } from "react";
import {
    Upload,
    Zap,
    FileText,
    X,
    Layers,
    CheckCircle2,
    AlertTriangle,
    Clock,
    ArrowRight,
    RefreshCcw,
    File,
    ShieldCheck,
    Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createBatchExtraction, getBatches, getTemplates } from "@/lib/resources";
import type { Template } from "@/types";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const defaultDocumentTypes = [
    { id: "cni-senegal", name: "CNI Sénégal", icon: Database },
    { id: "passeport-senegal", name: "Passeport Sénégal", icon: ShieldCheck },
    { id: "auto", name: "Détection Auto", icon: RefreshCcw },
];

export default function BatchPage() {
    const router = useRouter();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedType, setSelectedType] = useState("cni-senegal");
    const [files, setFiles] = useState<File[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [batches, setBatches] = useState<any[]>([]);
    const [isLoadingBatches, setIsLoadingBatches] = useState(true);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const data = await getTemplates();
                setTemplates(data);
            } catch (err) {
                console.error("Failed to fetch templates:", err);
            }
        };
        fetchTemplates();
    }, []);

    useEffect(() => {
        const fetchBatches = async () => {
            setIsLoadingBatches(true);
            try {
                const result = await getBatches({ limit: 10 });
                setBatches(result.data || []);
            } catch (err) {
                console.error("Failed to fetch batches:", err);
            } finally {
                setIsLoadingBatches(false);
            }
        };
        fetchBatches();
    }, []);

    const documentTypes = useMemo(() => {
        if (templates.length === 0) return defaultDocumentTypes;
        const mapped = templates.map((t) => ({
            id: t.slug,
            name: t.name,
            icon: t.category === "identity" ? ShieldCheck : File,
        }));
        if (!mapped.find((t) => t.id === "auto")) {
            mapped.push({ id: "auto", name: "Détection Auto", icon: RefreshCcw });
        }
        return mapped;
    }, [templates]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addFiles(Array.from(e.target.files));
        }
    };

    const addFiles = (newFiles: File[]) => {
        const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
        const maxSize = 10 * 1024 * 1024;
        const filtered = newFiles.filter((f) => {
            if (!validTypes.includes(f.type)) {
                toast.error(`Type invalide: ${f.name}`);
                return false;
            }
            if (f.size > maxSize) {
                toast.error(`Fichier trop volumineux: ${f.name}`);
                return false;
            }
            return true;
        });
        setFiles((prev) => {
            const combined = [...prev, ...filtered];
            if (combined.length > 50) {
                toast.error("Maximum 50 fichiers");
                return combined.slice(0, 50);
            }
            return combined;
        });
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (files.length < 2) {
            toast.error("Minimum 2 fichiers requis");
            return;
        }
        setIsUploading(true);
        try {
            const result = await createBatchExtraction(files, selectedType);
            toast.success(`Batch créé: ${result.totalDocuments} documents en traitement`);
            router.push(`/dashboard/batch/${result.batchId}`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erreur lors de la création du batch");
        } finally {
            setIsUploading(false);
        }
    };

    const statusConfig: Record<string, { color: string; icon: typeof CheckCircle2; label: string }> = {
        queued: { color: "text-zinc-500 bg-zinc-500/5 border-zinc-500/30", icon: Clock, label: "En attente" },
        processing: { color: "text-yellow-500 bg-yellow-500/5 border-yellow-500/30", icon: Clock, label: "En cours" },
        completed: { color: "text-primary bg-primary/5 border-primary/30", icon: CheckCircle2, label: "Terminé" },
        partial_failure: { color: "text-destructive bg-destructive/5 border-destructive/30", icon: AlertTriangle, label: "Partiel" },
    };

    return (
        <div className="space-y-8 font-mono">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase tracking-widest flex items-center gap-3">
                        <Layers className="text-primary" /> Batch_Processing
                    </h1>
                    <p className="text-foreground/40 text-xs mt-2 font-mono uppercase tracking-wider">
                        Traitement en lot de documents
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="tech-border bg-black/20 p-6 space-y-6 rounded-lg">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
                            <Upload size={16} /> Upload de documents
                        </h3>

                        {/* Drop Zone */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDrop={handleDrop}
                            className={cn(
                                "border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer",
                                isDragOver
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                            )}
                            onClick={() => document.getElementById("batch-file-input")?.click()}
                        >
                            <input
                                id="batch-file-input"
                                type="file"
                                multiple
                                accept="image/jpeg,image/png,image/webp,application/pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <Upload className="mx-auto mb-4 text-foreground/30" size={40} />
                            <p className="text-sm text-foreground/60 mb-2">
                                Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
                            </p>
                            <p className="text-xs text-foreground/30">
                                JPEG, PNG, WebP, PDF · Max 10 MB/fichier · 2-50 fichiers
                            </p>
                        </div>

                        {/* File List */}
                        {files.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-foreground/60 uppercase tracking-wider">
                                        {files.length} fichier{files.length > 1 ? "s" : ""} sélectionné{files.length > 1 ? "s" : ""}
                                    </span>
                                    <button
                                        onClick={() => setFiles([])}
                                        className="text-xs text-destructive/60 hover:text-destructive transition-colors"
                                    >
                                        Tout supprimer
                                    </button>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto space-y-1 custom-scrollbar pr-2">
                                    {files.map((file, i) => (
                                        <div
                                            key={`${file.name}-${i}`}
                                            className="flex items-center justify-between px-4 py-2 bg-accent/5 border border-border rounded group hover:border-primary/30 transition-all"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <FileText size={14} className="text-foreground/40 shrink-0" />
                                                <span className="text-xs text-foreground/80 truncate">{file.name}</span>
                                                <span className="text-[10px] text-foreground/30 font-mono shrink-0">
                                                    {(file.size / 1024).toFixed(0)} KB
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => removeFile(i)}
                                                className="text-foreground/20 hover:text-destructive transition-colors shrink-0"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <div className="flex items-center justify-between border-t border-border pt-6">
                            <div className="text-sm text-foreground/60">
                                Type: <span className="font-bold text-foreground">{documentTypes.find((d) => d.id === selectedType)?.name || selectedType}</span>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={files.length < 2 || isUploading}
                                className="px-6 py-3 bg-primary text-black text-sm font-bold rounded-md hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary/20"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <Zap size={18} /> Lancer le batch ({files.length})
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Settings Column */}
                <div className="space-y-6">
                    <div className="tech-border bg-black/20 p-6 space-y-6 rounded-lg">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
                            Type de document
                        </h3>
                        <div className="grid grid-cols-1 gap-1 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                            {documentTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all border border-transparent text-left rounded-md",
                                        selectedType === type.id
                                            ? "border-primary/50 bg-primary/10 text-primary"
                                            : "bg-accent/5 text-foreground/60 hover:bg-accent/10 hover:text-foreground"
                                    )}
                                >
                                    <type.icon size={16} />
                                    <span className="truncate">{type.name}</span>
                                    {selectedType === type.id && <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Batches History */}
            <div className="tech-border bg-black/40 overflow-hidden rounded-lg">
                <div className="p-4 border-b border-border bg-accent/5 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
                        <Layers size={16} /> Historique des batches
                    </h3>
                    <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                        {batches.length} BATCH{batches.length !== 1 ? "ES" : ""}
                    </span>
                </div>
                <div className="divide-y divide-border/50">
                    {isLoadingBatches ? (
                        <div className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                <span className="text-xs text-foreground/40 uppercase tracking-widest animate-pulse">Loading...</span>
                            </div>
                        </div>
                    ) : batches.length === 0 ? (
                        <div className="px-6 py-12 text-center text-foreground/40 text-xs uppercase tracking-widest">
                            Aucun batch trouvé
                        </div>
                    ) : (
                        batches.map((batch: any) => {
                            const cfg = statusConfig[batch.status] || statusConfig.queued;
                            const StatusIcon = cfg.icon;
                            const progress = batch.totalDocuments > 0
                                ? ((batch.completedCount + batch.failedCount) / batch.totalDocuments) * 100
                                : 0;
                            return (
                                <Link
                                    key={batch.batchId}
                                    href={`/dashboard/batch/${batch.batchId}`}
                                    className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors group"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="p-2 border border-border bg-black text-foreground/40 group-hover:text-primary group-hover:border-primary/30 transition-colors rounded">
                                            <Layers size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs font-mono text-foreground/80 truncate">{batch.batchId}</div>
                                            <div className="text-[10px] text-foreground/40 mt-0.5">
                                                {batch.totalDocuments} documents · {batch.documentType}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                                        </div>
                                        <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest rounded", cfg.color)}>
                                            <StatusIcon size={10} /> {cfg.label}
                                        </span>
                                        <ArrowRight size={14} className="text-foreground/20 group-hover:text-primary transition-colors" />
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
