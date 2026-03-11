"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getExtraction, submitFeedback } from "@/lib/resources";
import { Extraction } from "@/types";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { ArrowLeft, Save, CheckCircle, AlertTriangle, FileText, ZoomIn, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ExtractionDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [extraction, setExtraction] = useState<Extraction | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isReviewed, setIsReviewed] = useState(false);

    useEffect(() => {
        const fetchExtraction = async () => {
            try {
                const data = await getExtraction(params.id as string);
                setExtraction(data);
                
                // Initialize form data from result
                if (data.result?.extractedData) {
                    const initialData: Record<string, any> = {};
                    Object.entries(data.result.extractedData).forEach(([key, field]) => {
                        initialData[key] = field.value;
                    });
                    setFormData(initialData);
                }

                if (data.status === 'reviewed' || data.userCorrection) {
                    setIsReviewed(true);
                    if (data.userCorrection) {
                        setFormData(data.userCorrection);
                    }
                }
            } catch (error) {
                toast.error("Impossible de charger l'extraction");
                router.push("/dashboard/extractions");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchExtraction();
        }
    }, [params.id, router]);

    const handleFieldChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!extraction) return;
        setIsSubmitting(true);
        try {
            await submitFeedback(extraction.referenceId, formData);
            setIsReviewed(true);
            toast.success("Corrections enregistrées ! Merci pour votre feedback.");
        } catch (error) {
            toast.error("Erreur lors de l'enregistrement");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExport = () => {
        if (!extraction) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(extraction, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `extraction_${extraction.referenceId}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-8 w-64" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
                    <Skeleton className="h-full w-full rounded-2xl" />
                    <Skeleton className="h-full w-full rounded-2xl" />
                </div>
            </div>
        );
    }

    if (!extraction) return null;

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/extractions" className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            Extraction <span className="font-mono text-zinc-500 text-base">#{extraction.referenceId.slice(0, 8)}</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                                extraction.status === 'completed' ? "bg-green-500/10 text-green-500" :
                                extraction.status === 'reviewed' ? "bg-blue-500/10 text-blue-500" :
                                "bg-zinc-500/10 text-zinc-500"
                            )}>
                                {extraction.status}
                            </span>
                            <span className="text-xs text-zinc-500">
                                {new Date(extraction.createdAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all text-sm font-medium"
                    >
                        <Download size={16} /> Exporter JSON
                    </button>
                    {!isReviewed ? (
                        <button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all text-sm font-bold disabled:opacity-50"
                        >
                            {isSubmitting ? "Enregistrement..." : <> <Save size={16} /> Valider & Corriger</>}
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg text-sm font-bold border border-green-500/20">
                            <CheckCircle size={16} /> Validé
                        </div>
                    )}
                </div>
            </div>

            {/* Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Left: Document Preview (Mocked for now as we don't have real file storage URL) */}
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col relative group">
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/50">
                        <div className="text-center p-6">
                            <FileText size={48} className="mx-auto text-zinc-700 mb-4" />
                            <p className="text-zinc-500 font-medium">Aperçu du document</p>
                            <p className="text-zinc-600 text-sm mt-1">{extraction.file?.originalName}</p>
                        </div>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-black/80 text-white rounded-lg hover:bg-black"><ZoomIn size={20} /></button>
                    </div>
                </div>

                {/* Right: Editable Form */}
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-y-auto p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-lg">Données extraites</h2>
                        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-md">
                            Confiance: {Math.round((extraction.result?.globalConfidence || 0) * 100)}%
                        </span>
                    </div>

                    <div className="space-y-6">
                        {Object.entries(formData).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider flex justify-between">
                                    {key.replace(/_/g, ' ')}
                                    {extraction.result?.extractedData[key]?.confidence && (
                                        <span className={cn(
                                            "text-[10px]",
                                            extraction.result.extractedData[key].confidence > 0.8 ? "text-green-500" : "text-yellow-500"
                                        )}>
                                            {Math.round(extraction.result.extractedData[key].confidence * 100)}%
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="text"
                                    value={value || ''}
                                    onChange={(e) => handleFieldChange(key, e.target.value)}
                                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    disabled={isReviewed}
                                />
                            </div>
                        ))}
                        
                        {Object.keys(formData).length === 0 && (
                            <div className="text-center py-12 text-zinc-500">
                                Aucune donnée extraite disponible.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
