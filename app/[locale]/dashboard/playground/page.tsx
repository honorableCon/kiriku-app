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
                    <div className="w-3 h-3 bg-primary animate-pulse" />
                    <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase tracking-widest">Neural Playground</h1>
                </div>
                <p className="text-foreground/40 text-xs uppercase tracking-widest pl-6">
                    {'///'} SYSTEM_VERSION: 2.4.0 {'///'} CONNECTION: SECURE
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="tech-border bg-black/40 p-6 space-y-6">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 border-b border-border pb-3">
                            <Settings size={14} /> Extraction Parameters
                        </h3>
                        
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest">Document Class</label>
                            <div className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {documentTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 text-xs font-bold transition-all border border-transparent text-left",
                                            selectedType === type.id
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "bg-accent/5 text-foreground/60 hover:border-white/20 hover:text-foreground"
                                        )}
                                    >
                                        <type.icon size={14} />
                                        <span className="truncate">{type.name}</span>
                                        {selectedType === type.id && <div className="ml-auto w-1.5 h-1.5 bg-primary animate-pulse" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border">
                            <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest">Processing Options</label>
                            
                            <div className="space-y-2">
                                <button
                                    onClick={() => setFraudCheck((v) => !v)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-2 border text-xs font-bold transition-all",
                                        fraudCheck 
                                            ? "border-primary bg-primary/5 text-primary" 
                                            : "border-border bg-transparent text-foreground/40 hover:border-foreground/20"
                                    )}
                                >
                                    <span className="flex items-center gap-2"><ShieldCheck size={14} /> FRAUD_DETECTION</span>
                                    <span>{fraudCheck ? "ON" : "OFF"}</span>
                                </button>

                                <button
                                    onClick={() => setReturnConfidence((v) => !v)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-2 border text-xs font-bold transition-all opacity-50 cursor-not-allowed",
                                        "border-border bg-transparent text-foreground/20"
                                    )}
                                    disabled
                                    title="CONFIDENCE_METRICS temporairement désactivé - Disponible prochainement"
                                >
                                    <span className="flex items-center gap-2"><Activity size={14} /> CONFIDENCE_METRICS</span>
                                    <span>OFF</span>
                                </button>

                                <button
                                    onClick={() => setReturnRawText((v) => !v)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-2 border text-xs font-bold transition-all opacity-50 cursor-not-allowed",
                                        "border-border bg-transparent text-foreground/20"
                                    )}
                                    disabled
                                    title="RAW_DATA_STREAM temporairement désactivé - Disponible prochainement"
                                >
                                    <span className="flex items-center gap-2"><FileText size={14} /> RAW_DATA_STREAM</span>
                                    <span>OFF</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    {isLoading ? (
                        <div className="tech-border bg-black/60 p-12 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                            <div className="relative z-10 flex flex-col items-center gap-8">
                                <div className="relative">
                                    <div className="w-32 h-32 border border-primary/20 rounded-full animate-[spin_3s_linear_infinite]" />
                                    <div className="absolute inset-4 border border-primary/40 rounded-full animate-[spin_2s_linear_infinite_reverse]" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Cpu className="text-primary animate-pulse" size={40} />
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-lg font-bold text-primary tracking-widest uppercase animate-pulse">NEURAL_ANALYSIS_IN_PROGRESS</h3>
                                    <p className="text-xs text-foreground/40 font-mono">
                                        EXTRACTING_FEATURES... VALIDATING_INTEGRITY...
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-1 h-8 bg-primary/20 animate-[pulse_0.5s_ease-in-out_infinite]" />
                                    <div className="w-1 h-8 bg-primary/40 animate-[pulse_0.5s_ease-in-out_0.1s_infinite]" />
                                    <div className="w-1 h-8 bg-primary/60 animate-[pulse_0.5s_ease-in-out_0.2s_infinite]" />
                                    <div className="w-1 h-8 bg-primary/80 animate-[pulse_0.5s_ease-in-out_0.3s_infinite]" />
                                    <div className="w-1 h-8 bg-primary animate-[pulse_0.5s_ease-in-out_0.4s_infinite]" />
                                </div>
                            </div>
                        </div>
                    ) : !result ? (
                        <div className="tech-border bg-black/40 p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-border pb-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider">
                                            <FileText size={14} /> Source A (Front)
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => { setTargetMobileFile('front'); setIsMobileModalOpen(true); }}
                                            className="text-[10px] text-primary font-bold hover:bg-primary/10 px-2 py-1 transition-colors flex items-center gap-1 border border-transparent hover:border-primary/30"
                                        >
                                            <Smartphone size={12} /> MOBILE_LINK
                                        </button>
                                    </div>
                                    <UploadZone
                                        onFileSelect={(file) => setFrontFile(file)}
                                        onRemove={() => setFrontFile(null)}
                                        isLoading={isLoading}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-border pb-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider">
                                            <FileText size={14} /> Source B (Back/Optional)
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => { setTargetMobileFile('back'); setIsMobileModalOpen(true); }}
                                            className="text-[10px] text-primary font-bold hover:bg-primary/10 px-2 py-1 transition-colors flex items-center gap-1 border border-transparent hover:border-primary/30"
                                        >
                                            <Smartphone size={12} /> MOBILE_LINK
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
                                <div className="text-xs text-foreground/40 font-mono">
                                    SELECTED_MODEL: <span className="font-bold text-primary">{selectedTypeLabel}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRun}
                                    disabled={!frontFile}
                                    className="px-8 py-3 bg-primary text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 clip-path-polygon"
                                >
                                    <Zap size={16} /> Execute_Analysis
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Result View */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Visual Recognition Sidebar */}
                                <div className="tech-border bg-black/40 overflow-hidden flex flex-col">
                                    <div className="p-4 border-b border-border bg-accent/5 flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                            <FileSearch size={14} /> Vision_Data_Stream
                                        </h3>
                                        <button onClick={() => { setResult(null); setIsLoading(false); }} className="text-[10px] font-bold text-foreground/60 hover:text-primary transition-colors uppercase tracking-wider">
                                            [ Reset_Sequence ]
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
                                        {result?.error ? (
                                            <div className="p-4 bg-destructive/10 border border-destructive/30 flex items-start gap-3 text-destructive text-xs font-mono">
                                                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-bold uppercase tracking-wider">Processing Error</p>
                                                    <p className="opacity-80">{result.error}</p>
                                                </div>
                                            </div>
                                        ) : extractedEntries.length > 0 ? extractedEntries.map(([key, data]) => (
                                            <div key={key} className="group border border-border/50 bg-black/20 p-3 hover:border-primary/30 transition-all">
                                                <div className="flex justify-between items-center text-[10px] mb-2">
                                                    <span className="font-bold text-foreground/40 uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
                                                    {returnConfidence && typeof (data as { confidence?: number }).confidence === "number" && (
                                                        <span className={cn(
                                                            "font-mono px-1.5 py-0.5 text-[9px]",
                                                            (data as { confidence: number }).confidence > 0.9 ? "text-primary bg-primary/10" : "text-yellow-500 bg-yellow-500/10"
                                                        )}>
                                                            CONF: {Math.round((data as { confidence: number }).confidence * 100)}%
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm font-mono text-foreground font-medium break-all">
                                                    {(data as { value: string | number | boolean | null }).value?.toString() || '-'}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-xs text-foreground/40 font-mono p-4 text-center border border-dashed border-border">
                                                NO_STRUCTURED_DATA_FOUND // STATUS: <span className="text-foreground">{result.status}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* JSON Result / Tech Info */}
                                <div className="space-y-6">
                                    <div className="tech-border bg-black/60 overflow-hidden flex flex-col h-full min-h-[400px]">
                                        <div className="p-4 border-b border-border bg-accent/5 flex items-center justify-between">
                                            <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                                <Code2 size={14} /> JSON_Payload
                                            </h3>
                                            <button className="text-foreground/40 hover:text-foreground transition-colors">
                                                <Terminal size={14} />
                                            </button>
                                        </div>
                                        <div className="p-4 font-mono text-[10px] text-primary/80 overflow-auto flex-1 bg-black custom-scrollbar">
                                            <pre>{JSON.stringify(result, null, 2)}</pre>
                                        </div>
                                    </div>

                                    <div className="tech-border bg-black/40 p-6">
                                        <h3 className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-4 border-b border-border pb-2">Validation Protocols</h3>
                                        <div className="space-y-4">
                                            {(() => {
                                                const errors = (result as any)?.result?.validation?.errors ?? [];
                                                const warnings = (result as any)?.result?.validation?.warnings ?? [];
                                                const isValid = Array.isArray(errors) && errors.length === 0 && !result?.error;
                                                return (
                                                    <div
                                                        className={cn(
                                                            "flex items-start gap-3 p-3 border",
                                                            isValid
                                                                ? "bg-primary/5 border-primary/20"
                                                                : "bg-destructive/5 border-destructive/20"
                                                        )}
                                                    >
                                                        {isValid ? (
                                                            <CheckCircle2 className="text-primary mt-0.5" size={16} />
                                                        ) : (
                                                            <AlertTriangle className="text-destructive mt-0.5" size={16} />
                                                        )}
                                                        <div className="flex-1">
                                                            <p
                                                                className={cn(
                                                                    "text-xs font-bold uppercase tracking-wider",
                                                                    isValid ? "text-primary" : "text-destructive"
                                                                )}
                                                            >
                                                                {isValid ? "Integrity Check: PASSED" : "Integrity Check: FAILED"}
                                                            </p>
                                                            <p className="text-[10px] text-foreground/60 font-mono mt-1">
                                                                {isValid
                                                                    ? `WARNINGS: ${warnings.length}`
                                                                    : `ERRORS: ${errors.length} | WARNINGS: ${warnings.length}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                            <div className="flex items-center gap-3 p-3 border border-border bg-accent/5">
                                                <Lock size={16} className="text-foreground/40" />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider">Fraud Risk Assessment</span>
                                                        <span className={cn(
                                                            "text-[10px] font-bold uppercase",
                                                            ((result as any)?.result?.fraud?.score ?? 0) > 50 ? "text-destructive" : "text-primary"
                                                        )}>
                                                            {(result as any)?.result?.fraud?.level ?? "LOW_RISK"}
                                                        </span>
                                                    </div>
                                                    <div className="h-1 w-full bg-border overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full transition-all duration-1000",
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
