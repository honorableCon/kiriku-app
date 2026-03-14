"use client";

import { useMemo, useState, useEffect } from "react";
import UploadZone from "@/components/playground/UploadZone";
import { createExtraction, getTemplates } from "@/lib/resources";
import type { Extraction, Template } from "@/types";
import {
    Zap,
    Terminal,
    Settings,
    ShieldCheck,
    Database,
    RefreshCcw,
    CheckCircle2,
    AlertTriangle,
    FileSearch,
    FileText,
    Smartphone,
    File,
    Cpu,
    Activity,
    Code2,
    Lock
} from "lucide-react";
import MobileScanModal from "@/components/playground/MobileScanModal";
import { cn } from "@/lib/utils";

// Static fallback in case API fails or for initial state
const defaultDocumentTypes = [
    { id: 'cni-senegal', name: 'CNI Sénégal', icon: Database },
    { id: 'passeport-senegal', name: 'Passeport Sénégal', icon: ShieldCheck },
    { id: 'permis-conduire-cedeao', name: 'Permis CEDEAO', icon: Zap },
    { id: 'auto', name: 'Détection Auto', icon: RefreshCcw },
];

interface PlaygroundResult extends Partial<Extraction> {
    error?: string;
}

const LOADING_STEPS = [
    "Analyse du document...",
    "Extraction des données...",
    "Vérification de la qualité...",
    "Détection des manisc...",
    "Validation des champs...",
    "Finalisation..."
];

export default function PlaygroundPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedType, setSelectedType] = useState('cni-senegal');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<PlaygroundResult | null>(null);
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);
    const [fraudCheck, setFraudCheck] = useState(false);
    const [returnRawText, setReturnRawText] = useState(false);
    const [returnConfidence, setReturnConfidence] = useState(false);
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
    const [targetMobileFile, setTargetMobileFile] = useState<'front' | 'back'>('front');
    const [loadingMessage, setLoadingMessage] = useState(LOADING_STEPS[0]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isLoading) {
            setLoadingMessage(LOADING_STEPS[0]);
            setProgress(0);
            return;
        }

        // Gestion des messages
        let step = 0;
        const messageInterval = setInterval(() => {
            step = (step + 1) % LOADING_STEPS.length;
            setLoadingMessage(LOADING_STEPS[step]);
        }, 2000);

        // Gestion de la progression fluide
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                // Ralentir à l'approche de 90%
                if (prev >= 90) return prev;
                // Progression logarithmique inversée pour un effet naturel
                const increment = Math.max(0.2, (90 - prev) / 100);
                return Math.min(prev + increment, 90);
            });
        }, 50);

        return () => {
            clearInterval(messageInterval);
            clearInterval(progressInterval);
        };
    }, [isLoading]);

    // Fetch templates on mount
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const data = await getTemplates();
                // Ensure 'auto' is always available if not returned by API
                if (!data.find(t => t.slug === 'auto')) {
                    // We don't push 'auto' to the list because it's a special client-side handling or should be in DB?
                    // Let's assume the API returns valid templates.
                    // We can map API templates to the format we need.
                }
                setTemplates(data);
            } catch (err) {
                console.error("Failed to fetch templates:", err);
            }
        };
        fetchTemplates();
    }, []);

    const documentTypes = useMemo(() => {
        if (templates.length === 0) return defaultDocumentTypes;
        
        const mapped = templates.map(t => ({
            id: t.slug,
            name: t.name,
            icon: t.category === 'identity' ? ShieldCheck : File
        }));

        // Always add "Auto" option if not present
        if (!mapped.find(t => t.id === 'auto')) {
            mapped.push({ id: 'auto', name: 'Détection Auto', icon: RefreshCcw });
        }
        
        return mapped;
    }, [templates]);

    const selectedTypeLabel = useMemo(() => {
        return documentTypes.find((d) => d.id === selectedType)?.name ?? selectedType;
    }, [selectedType, documentTypes]);

    const extractedEntries = useMemo(() => {
        const v1 = (result as any)?.result?.extractedData;
        const v2 = (result as any)?.data;
        const data = v1 || v2;
        if (!data || typeof data !== 'object') return [];
        try {
            return Object.entries(data);
        } catch {
            return [];
        }
    }, [result]);

    const handleRun = async () => {
        if (!frontFile) return;
        setIsLoading(true);
        setResult(null);

        try {
            const extraction = await createExtraction(
                frontFile,
                selectedType,
                { fraudCheck, returnRawText, returnConfidence },
                backFile || undefined
            );
            setResult(extraction);
        } catch (err) {
            setResult({
                referenceId: "err_" + Date.now(),
                status: 'failed',
                error: err instanceof Error ? err.message : "Erreur de connexion au serveur OCR"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 font-mono">
            {isMobileModalOpen && (
                <MobileScanModal
                    isOpen={true}
                    onClose={() => setIsMobileModalOpen(false)}
                    onFileReceived={(file) => {
                        if (targetMobileFile === 'front') setFrontFile(file);
                        else setBackFile(file);
                    }}
                    onFilesReceived={(frontFile, backFile) => {
                        setFrontFile(frontFile);
                        if (backFile) setBackFile(backFile);
                    }}
                />
            )}

            <div className="flex flex-col gap-2 border-b border-border pb-6">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Neural Playground</h1>
                </div>
                <p className="text-foreground/60 text-sm pl-6">
                    Testez l'extraction de données en temps réel sur vos documents.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="tech-border bg-black/20 p-6 space-y-6 rounded-lg">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
                            <Settings size={16} /> Paramètres
                        </h3>
                        
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Type de document</label>
                            <div className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
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

                        <div className="space-y-4 pt-4 border-t border-border">
                            <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Options d'analyse</label>
                            
                            <div className="space-y-2">
                                <button
                                    onClick={() => setFraudCheck((v) => !v)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 border text-sm font-medium transition-all rounded-md",
                                        fraudCheck 
                                            ? "border-primary/50 bg-primary/5 text-primary" 
                                            : "border-border bg-transparent text-foreground/60 hover:bg-accent/5"
                                    )}
                                >
                                    <span className="flex items-center gap-2"><ShieldCheck size={16} /> Détection de fraude</span>
                                    <span className={cn("text-xs px-2 py-0.5 rounded-full", fraudCheck ? "bg-primary/20" : "bg-zinc-800")}>{fraudCheck ? "ACTIVÉ" : "DÉSACTIVÉ"}</span>
                                </button>

                                <button
                                    onClick={() => setReturnConfidence((v) => !v)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 border text-sm font-medium transition-all opacity-50 cursor-not-allowed rounded-md",
                                        "border-border bg-transparent text-foreground/40"
                                    )}
                                    disabled
                                    title="Disponible prochainement"
                                >
                                    <span className="flex items-center gap-2"><Activity size={16} /> Scores de confiance</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800">BIENTÔT</span>
                                </button>

                                <button
                                    onClick={() => setReturnRawText((v) => !v)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 border text-sm font-medium transition-all opacity-50 cursor-not-allowed rounded-md",
                                        "border-border bg-transparent text-foreground/40"
                                    )}
                                    disabled
                                    title="Disponible prochainement"
                                >
                                    <span className="flex items-center gap-2"><FileText size={16} /> Texte brut</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800">BIENTÔT</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    {isLoading ? (
                        <div className="tech-border bg-black/40 p-12 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden rounded-lg">
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                            <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center animate-pulse">
                                        <Cpu className="text-primary" size={40} />
                                    </div>
                                    <div className="absolute inset-0 border-t-2 border-primary/30 rounded-full animate-spin" />
                                </div>
                                
                                <div className="w-full space-y-3">
                                    <div className="flex justify-between text-xs font-medium text-foreground px-1">
                                        <span className="animate-pulse">{loadingMessage}</span>
                                        <span className="text-primary font-mono">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-white/5">
                                        <div 
                                            className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_15px_rgba(var(--primary),0.5)] relative"
                                            style={{ width: `${Math.max(progress, 5)}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-foreground/40 text-center pt-2">
                                        Traitement sécurisé par kiriku-1.1.5 en cours...
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : !result ? (
                        <div className="tech-border bg-black/20 p-8 space-y-8 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-border pb-3">
                                        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                            <FileText size={16} /> Recto du document
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => { setTargetMobileFile('front'); setIsMobileModalOpen(true); }}
                                            className="text-xs text-primary font-medium hover:bg-primary/10 px-3 py-1.5 transition-colors flex items-center gap-1.5 rounded-md border border-primary/20 hover:border-primary/50"
                                        >
                                            <Smartphone size={14} /> Scanner avec mobile
                                        </button>
                                    </div>
                                    <UploadZone
                                        onFileSelect={(file) => setFrontFile(file)}
                                        onRemove={() => setFrontFile(null)}
                                        isLoading={isLoading}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-border pb-3">
                                        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                            <FileText size={16} /> Verso (Optionnel)
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => { setTargetMobileFile('back'); setIsMobileModalOpen(true); }}
                                            className="text-xs text-primary font-medium hover:bg-primary/10 px-3 py-1.5 transition-colors flex items-center gap-1.5 rounded-md border border-primary/20 hover:border-primary/50"
                                        >
                                            <Smartphone size={14} /> Scanner avec mobile
                                        </button>
                                    </div>
                                    <UploadZone
                                        onFileSelect={(file) => setBackFile(file)}
                                        onRemove={() => setBackFile(null)}
                                        isLoading={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-border pt-6">
                                <div className="text-sm text-foreground/60">
                                    Modèle : <span className="font-bold text-foreground">{selectedTypeLabel}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRun}
                                    disabled={!frontFile}
                                    className="px-6 py-3 bg-primary text-black text-sm font-bold rounded-md hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    <Zap size={18} /> Lancer l'extraction
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Result View */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Visual Recognition Sidebar */}
                                <div className="tech-border bg-black/20 overflow-hidden flex flex-col rounded-lg">
                                    <div className="p-4 border-b border-border bg-accent/5 flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                                            <FileSearch size={16} /> Données extraites
                                        </h3>
                                        <button onClick={() => { setResult(null); setIsLoading(false); }} className="text-xs font-medium text-foreground/60 hover:text-primary transition-colors flex items-center gap-1">
                                            <RefreshCcw size={12} /> Nouvelle extraction
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
                                        {result?.error ? (
                                            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-md flex items-start gap-3 text-destructive text-sm">
                                                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-bold">Erreur de traitement</p>
                                                    <p className="opacity-80">{result.error}</p>
                                                </div>
                                            </div>
                                        ) : extractedEntries.length > 0 ? extractedEntries.map(([key, data]) => (
                                            <div key={key} className="group border border-border/50 bg-black/20 p-4 rounded-md hover:border-primary/30 transition-all hover:bg-black/40">
                                                <div className="flex justify-between items-center text-xs mb-2">
                                                    <span className="font-bold text-foreground/50 uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
                                                    {returnConfidence && typeof (data as { confidence?: number }).confidence === "number" && (
                                                        <span className={cn(
                                                            "font-mono px-2 py-0.5 rounded-full text-[10px]",
                                                            (data as { confidence: number }).confidence > 0.9 ? "text-primary bg-primary/10" : "text-yellow-500 bg-yellow-500/10"
                                                        )}>
                                                            {Math.round((data as { confidence: number }).confidence * 100)}%
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm font-medium text-foreground break-all">
                                                    {(data as { value: string | number | boolean | null }).value?.toString() || '-'}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-sm text-foreground/40 text-center p-8 border border-dashed border-border rounded-md">
                                                Aucune donnée structurée trouvée.
                                                <br/>
                                                <span className="text-xs mt-2 block">Statut : {result.status}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* JSON Result / Tech Info */}
                                <div className="space-y-6">
                                    <div className="tech-border bg-black/40 overflow-hidden flex flex-col h-full min-h-[400px] rounded-lg">
                                        <div className="p-4 border-b border-border bg-accent/5 flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
                                                <Code2 size={16} /> JSON Brut
                                            </h3>
                                            <button className="text-foreground/40 hover:text-foreground transition-colors">
                                                <Terminal size={14} />
                                            </button>
                                        </div>
                                        <div className="p-4 font-mono text-xs text-primary/80 overflow-auto flex-1 bg-black/50 custom-scrollbar">
                                            <pre>{JSON.stringify(result, null, 2)}</pre>
                                        </div>
                                    </div>

                                    <div className="tech-border bg-black/20 p-6 rounded-lg">
                                        <h3 className="text-sm font-bold text-foreground/60 uppercase tracking-wider mb-4 border-b border-border pb-2">Validation</h3>
                                        <div className="space-y-4">
                                            {(() => {
                                                const errors = (result as any)?.result?.validation?.errors ?? [];
                                                const warnings = (result as any)?.result?.validation?.warnings ?? [];
                                                const isValid = Array.isArray(errors) && errors.length === 0 && !result?.error;
                                                return (
                                                    <div
                                                        className={cn(
                                                            "flex items-start gap-3 p-4 border rounded-md transition-colors",
                                                            isValid
                                                                ? "bg-primary/5 border-primary/20"
                                                                : "bg-destructive/5 border-destructive/20"
                                                        )}
                                                    >
                                                        {isValid ? (
                                                            <CheckCircle2 className="text-primary mt-0.5" size={18} />
                                                        ) : (
                                                            <AlertTriangle className="text-destructive mt-0.5" size={18} />
                                                        )}
                                                        <div className="flex-1">
                                                            <p
                                                                className={cn(
                                                                    "text-sm font-bold",
                                                                    isValid ? "text-primary" : "text-destructive"
                                                                )}
                                                            >
                                                                {isValid ? "Document Valide" : "Attention Requise"}
                                                            </p>
                                                            <p className="text-xs text-foreground/60 mt-1">
                                                                {isValid
                                                                    ? `${warnings.length} avertissement(s)`
                                                                    : `${errors.length} erreur(s), ${warnings.length} avertissement(s)`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                            <div className="flex items-center gap-3 p-4 border border-border bg-accent/5 rounded-md">
                                                <Lock size={18} className="text-foreground/40" />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Risque de fraude</span>
                                                        <span className={cn(
                                                            "text-xs font-bold uppercase px-2 py-0.5 rounded-full",
                                                            ((result as any)?.result?.fraud?.score ?? 0) > 50 ? "text-destructive bg-destructive/10" : "text-primary bg-primary/10"
                                                        )}>
                                                            {(result as any)?.result?.fraud?.level ?? "FAIBLE"}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full transition-all duration-1000 rounded-full",
                                                                ((result as any)?.result?.fraud?.score ?? 0) > 50 ? "bg-destructive" : "bg-primary"
                                                            )}
                                                            style={{
                                                                width: `${Math.min(
                                                                    Math.max(((result as any)?.result?.fraud?.score ?? 0), 5), // Min 5% for visibility
                                                                    100
                                                                )}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
