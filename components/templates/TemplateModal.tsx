"use client";

import { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { Template } from "@/types";
import { createTemplate, updateTemplate } from "@/lib/resources";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "view" | "edit" | "create";
    template?: Template | null;
    onSuccess: () => void;
}

export function TemplateModal({ isOpen, onClose, mode, template, onSuccess }: TemplateModalProps) {
    const [jsonContent, setJsonContent] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            if (mode === "create") {
                setJsonContent(JSON.stringify({
                    name: "Nouveau Modèle",
                    category: "identity",
                    country: "SN",
                    language: "fr",
                    fields: [
                        { key: "nom", label: "Nom", type: "string", required: true },
                        { key: "prenom", label: "Prénom", type: "string", required: true }
                    ]
                }, null, 2));
            } else if (template) {
                // Remove some internal fields for editing if needed, but here we just show all
                const { _id, __v, ...cleanTemplate } = template as any;
                setJsonContent(JSON.stringify(cleanTemplate, null, 2));
            }
        }
    }, [isOpen, mode, template]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsLoading(true);
        setError(null);

        try {
            let parsedData;
            try {
                parsedData = JSON.parse(jsonContent);
            } catch (err) {
                throw new Error("Format JSON invalide");
            }

            if (mode === "create") {
                await createTemplate(parsedData);
                toast.success("Modèle créé avec succès");
            } else if (mode === "edit" && template) {
                await updateTemplate(template.slug, parsedData);
                toast.success("Modèle mis à jour avec succès");
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue");
            toast.error("Erreur lors de l'enregistrement");
        } finally {
            setIsLoading(false);
        }
    };

    const isReadOnly = mode === "view" || (mode === "edit" && template?.isBuiltin);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
            <div className="tech-border bg-black/80 border-primary/20 w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-black/40">
                    <div>
                        <h2 className="text-xl font-extrabold tracking-tight text-foreground font-mono uppercase">
                            {mode === "create" ? "NEW_TEMPLATE" : mode === "edit" ? "EDIT_TEMPLATE" : "TEMPLATE_DETAILS"}
                        </h2>
                        {template && (
                            <p className="text-xs text-primary/80 mt-1 font-mono uppercase tracking-wider">{template.slug}</p>
                        )}
                    </div>
                    <button 
                        onClick={onClose}
                        className="tech-border bg-black/60 border-border/40 p-2 text-foreground/40 hover:text-primary hover:border-primary/40 transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 flex flex-col gap-4">
                    {error && (
                        <div className="tech-border bg-red-500/10 border-red-500/30 text-red-500 p-3 flex items-center gap-2 text-sm font-mono">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}
                    
                    {template?.isBuiltin && mode === "edit" && (
                        <div className="tech-border bg-blue-500/10 border-blue-500/30 text-blue-500 p-3 flex items-center gap-2 text-sm font-mono">
                            <AlertCircle size={16} />
                            Les modèles intégrés ne peuvent pas être modifiés directement. Copiez la structure pour créer votre propre modèle.
                        </div>
                    )}

                    <div className="flex-1 flex flex-col">
                        <label className="text-xs font-black text-foreground mb-2 flex justify-between items-end font-mono uppercase tracking-wider">
                            JSON_CONFIGURATION
                            <span className="text-[10px] font-normal text-foreground/40">
                                {isReadOnly ? "READ_ONLY" : "EDITABLE"}
                            </span>
                        </label>
                        <textarea
                            value={jsonContent}
                            onChange={(e) => setJsonContent(e.target.value)}
                            readOnly={isReadOnly}
                            className={cn(
                                "flex-1 w-full min-h-[400px] p-4 font-mono text-sm tech-border focus:outline-none focus:border-primary/40 transition-colors",
                                isReadOnly 
                                    ? "bg-black/40 border-border/40 text-foreground/50" 
                                    : "bg-black/60 border-border/60 text-green-400"
                            )}
                            spellCheck={false}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border/40 bg-black/40">
                    <button 
                        onClick={onClose}
                        className="tech-border bg-black/60 border-border/40 px-4 py-2 text-xs font-black text-foreground/60 uppercase tracking-wider hover:text-foreground hover:border-primary/40 transition-all font-mono"
                    >
                        {mode === "view" ? "CLOSE" : "CANCEL"}
                    </button>
                    
                    {!isReadOnly && (
                        <button 
                            onClick={handleSave}
                            disabled={isLoading}
                            className="tech-border bg-primary/20 border-primary/40 px-5 py-2 text-xs font-black text-primary uppercase tracking-wider hover:bg-primary/30 hover:border-primary/60 transition-all font-mono flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            ) : (
                                <Save size={14} />
                            )}
                            SAVE_CHANGES
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
