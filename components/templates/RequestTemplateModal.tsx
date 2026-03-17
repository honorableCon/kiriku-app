"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UploadCloud, X, Plus, Trash2, FileText, FileImage, AlertCircle, Loader2 } from 'lucide-react';
import { createTemplateRequest } from '@/lib/resources';
import { toast } from 'sonner';

interface RequestTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function RequestTemplateModal({ isOpen, onClose, onSuccess }: RequestTemplateModalProps) {
    const t = useTranslations('Templates');
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fields, setFields] = useState<string[]>(['']);
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            
            // Check limits
            if (files.length + newFiles.length > 5) {
                toast.error("Limite atteinte : Vous ne pouvez pas uploader plus de 5 fichiers.");
                return;
            }

            const validFiles = newFiles.filter(file => {
                const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
                if (!isValidSize) {
                    toast.error(`Le fichier ${file.name} dépasse 5MB.`);
                }
                return isValidSize;
            });

            setFiles(prev => [...prev, ...validFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const addField = () => {
        setFields(prev => [...prev, '']);
    };

    const updateField = (index: number, value: string) => {
        const newFields = [...fields];
        newFields[index] = value;
        setFields(newFields);
    };

    const removeField = (index: number) => {
        if (fields.length > 1) {
            setFields(prev => prev.filter((_, i) => i !== index));
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setFields(['']);
        setFiles([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim() || !description.trim()) {
            toast.error("Veuillez remplir le titre et la description.");
            return;
        }

        const validFields = fields.filter(f => f.trim().length > 0);
        if (validFields.length === 0) {
            toast.error("Veuillez spécifier au moins un champ à extraire.");
            return;
        }

        if (files.length === 0) {
            toast.error("Veuillez fournir au moins un fichier d'exemple.");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            
            // Append array items
            validFields.forEach(field => {
                formData.append('fields[]', field);
            });

            files.forEach(file => {
                formData.append('files', file);
            });

            await createTemplateRequest(formData);
            
            toast.success("Votre demande de template a été soumise avec succès.");
            
            resetForm();
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Une erreur est survenue lors de l'envoi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
            <div className="tech-border bg-black/80 border-primary/20 w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-black/40">
                    <div>
                        <h2 className="text-xl font-extrabold tracking-tight text-foreground font-mono uppercase">
                            Demander un nouveau template
                        </h2>
                        <p className="text-xs text-primary/80 mt-1 font-mono uppercase tracking-wider">
                            Fournissez des détails et des exemples de votre document.
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="tech-border bg-black/60 border-border/40 p-2 text-foreground/40 hover:text-primary hover:border-primary/40 transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 flex flex-col gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-foreground font-mono uppercase tracking-wider">Nom du document</label>
                        <input 
                            className="w-full bg-black/40 border border-border/40 text-foreground p-3 text-sm font-mono focus:border-primary/50 focus:outline-none transition-colors"
                            placeholder="Ex: Facture Senelec, Bulletin de paie..." 
                            value={title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-foreground font-mono uppercase tracking-wider">Description et instructions spécifiques</label>
                        <textarea 
                            className="w-full bg-black/40 border border-border/40 text-foreground p-3 text-sm font-mono focus:border-primary/50 focus:outline-none transition-colors"
                            placeholder="Expliquez brièvement comment les données sont organisées..."
                            rows={3}
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-foreground font-mono uppercase tracking-wider">Quelles informations souhaitez-vous extraire ?</label>
                        {fields.map((field, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <input 
                                    className="flex-1 bg-black/40 border border-border/40 text-foreground p-2.5 text-sm font-mono focus:border-primary/50 focus:outline-none transition-colors"
                                    value={field}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField(index, e.target.value)}
                                    placeholder="Ex: Nom du client, Montant total, Date..."
                                />
                                <button 
                                    type="button" 
                                    onClick={() => removeField(index)}
                                    disabled={fields.length === 1}
                                    className="p-2.5 text-foreground/40 hover:text-destructive transition-colors disabled:opacity-50"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <button 
                            type="button" 
                            onClick={addField}
                            className="text-xs font-bold text-primary flex items-center gap-1 hover:underline font-mono uppercase mt-2"
                        >
                            <Plus className="h-3 w-3" />
                            Ajouter un champ
                        </button>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-foreground font-mono uppercase tracking-wider">Fichiers d'exemple (Max 5 fichiers, 5MB/fichier)</label>
                        
                        <div className="border-2 border-dashed border-border/40 rounded-sm p-6 flex flex-col items-center justify-center bg-black/20 hover:bg-black/40 transition-colors relative">
                            <input 
                                type="file" 
                                multiple 
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                                disabled={files.length >= 5}
                            />
                            <UploadCloud className="h-8 w-8 text-primary/60 mb-2" />
                            <p className="text-xs font-mono uppercase tracking-wider text-foreground/80">Cliquez ou glissez vos fichiers ici</p>
                            <p className="text-[10px] text-foreground/40 mt-1 font-mono uppercase">PDF, JPG, PNG supportés</p>
                        </div>

                        {files.length > 0 && (
                            <div className="space-y-2 mt-4">
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border border-border/40 bg-black/40">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            {file.type.includes('pdf') ? (
                                                <FileText className="h-4 w-4 text-blue-400 shrink-0" />
                                            ) : (
                                                <FileImage className="h-4 w-4 text-green-400 shrink-0" />
                                            )}
                                            <span className="text-xs font-mono truncate max-w-[300px] text-foreground/80">{file.name}</span>
                                            <span className="text-[10px] text-foreground/40 font-mono shrink-0">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => removeFile(index)}
                                            className="text-foreground/40 hover:text-destructive transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {files.length === 0 && (
                            <div className="flex items-start gap-2 text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 p-3 font-mono uppercase tracking-wider">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                <p>Les fichiers d'exemple sont indispensables pour que notre équipe puisse configurer l'extraction correctement.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-2">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            disabled={isSubmitting}
                            className="tech-border bg-black/60 border-border/40 px-4 py-2 text-xs font-black text-foreground/60 uppercase tracking-wider hover:text-foreground hover:border-primary/40 transition-all font-mono"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting || files.length === 0}
                            className="tech-border bg-primary/20 border-primary/40 px-5 py-2 text-xs font-black text-primary uppercase tracking-wider hover:bg-primary/30 hover:border-primary/60 transition-all font-mono flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <UploadCloud className="w-4 h-4" />
                            )}
                            {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
