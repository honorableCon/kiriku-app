"use client";

import { useState } from "react";
import { Upload, Camera, AlertCircle, X, CheckCircle2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { serverApi } from "@/lib/api";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function MobileUploadPage() {
    const params = useParams();
    const sessionId = params.sessionId as string;
    
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [frontPreview, setFrontPreview] = useState<string | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);
    const [backPreview, setBackPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showBackOption, setShowBackOption] = useState(false);

    const isHeicLike = (f: File) => {
        const type = (f.type || "").toLowerCase();
        const name = (f.name || "").toLowerCase();
        return type.includes("heic") || type.includes("heif") || name.endsWith(".heic") || name.endsWith(".heif");
    };

    const convertHeicToJpeg = async (input: File): Promise<File> => {
        const mod = await import("heic2any");
        const heic2any = mod.default as unknown as (opts: {
            blob: Blob;
            toType: string;
            quality?: number;
        }) => Promise<Blob | Blob[]>;

        const out = await heic2any({ blob: input, toType: "image/jpeg", quality: 0.9 });
        const blob = Array.isArray(out) ? out[0] : out;

        const name = input.name?.replace(/\.(heic|heif)$/i, ".jpg") || "mobile-upload.jpg";
        return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
    };

    const handleFrontFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setError(null);

            try {
                const finalFile = isHeicLike(selectedFile)
                    ? await convertHeicToJpeg(selectedFile)
                    : selectedFile;

                setFrontFile(finalFile);
                const objectUrl = URL.createObjectURL(finalFile);
                setFrontPreview(objectUrl);
            } catch (err) {
                console.error(err);
                setFrontFile(null);
                setFrontPreview(null);
                setError("Format non supporté. Passez l'iPhone en \"Plus compatible\" (JPEG) ou envoyez un PNG/JPEG.");
            }
        }
    };

    const handleBackFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setError(null);

            try {
                const finalFile = isHeicLike(selectedFile)
                    ? await convertHeicToJpeg(selectedFile)
                    : selectedFile;

                setBackFile(finalFile);
                const objectUrl = URL.createObjectURL(finalFile);
                setBackPreview(objectUrl);
            } catch (err) {
                console.error(err);
                setBackFile(null);
                setBackPreview(null);
                setError("Format non supporté. Passez l'iPhone en \"Plus compatible\" (JPEG) ou envoyez un PNG/JPEG.");
            }
        }
    };

    const handleUpload = async () => {
        if (!frontFile) return;

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", frontFile);

            if (backFile) {
                formData.append("backFile", backFile);
            }

            await serverApi.post(`/mobile-handoff/upload/${sessionId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                transformRequest: [(data) => data],
            });
            setIsSuccess(true);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Erreur lors de l'envoi du fichier");
        } finally {
            setIsUploading(false);
        }
    };

    const handleReset = () => {
        setFrontFile(null);
        setFrontPreview(null);
        setBackFile(null);
        setBackPreview(null);
        setShowBackOption(false);
        setError(null);
    };

    const handleRemoveFront = () => {
        setFrontFile(null);
        setFrontPreview(null);
        if (backFile) {
            setFrontFile(backFile);
            setFrontPreview(backPreview);
            setBackFile(null);
            setBackPreview(null);
        }
    };

    const handleRemoveBack = () => {
        setBackFile(null);
        setBackPreview(null);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-in zoom-in duration-500 shadow-[0_0_30px_rgba(var(--primary),0.2)]">
                    <CheckCircle2 className="w-12 h-12 text-primary animate-bounce" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-3">Document envoyé !</h1>
                <p className="text-foreground/60 text-base max-w-xs">
                    Vous pouvez maintenant retourner sur votre ordinateur pour lancer l'extraction.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col p-6">
            <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full space-y-8">
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary/20">
                        <Camera className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Scanner un document</h1>
                    <p className="text-foreground/60 text-sm px-4">
                        Prenez une photo claire de votre document d'identité (CNI, Passeport).
                    </p>
                </div>

                {error && (
                    <div className="w-full p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive text-sm animate-in slide-in-from-top-2">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="w-full space-y-5">
                    {!frontFile ? (
                        <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-2xl border-border/60 cursor-pointer bg-accent/5 hover:bg-accent/10 hover:border-primary/50 transition-all active:scale-[0.98]">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-3 shadow-sm border border-border">
                                    <Camera className="w-6 h-6 text-foreground/60" />
                                </div>
                                <p className="mb-1 text-base text-foreground font-semibold">Recto du document</p>
                                <p className="text-xs text-foreground/40">Appuyez pour prendre une photo</p>
                            </div>
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                capture="environment"
                                onChange={handleFrontFileChange}
                            />
                        </label>
                    ) : (
                        <div className="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden border border-border/50 shadow-sm group">
                            {frontPreview && (
                                <Image 
                                    src={frontPreview} 
                                    alt="Front preview" 
                                    fill 
                                    className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                                />
                            )}
                            <button 
                                onClick={handleRemoveFront}
                                className="absolute top-3 right-3 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-all active:scale-90"
                            >
                                <X size={18} />
                            </button>
                            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-medium">
                                Recto
                            </div>
                        </div>
                    )}

                    {showBackOption && (
                        <div className="animate-in slide-in-from-top-4 duration-300 fade-in">
                            {!backFile ? (
                                <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-2xl border-border/60 cursor-pointer bg-accent/5 hover:bg-accent/10 hover:border-primary/50 transition-all active:scale-[0.98]">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-3 shadow-sm border border-border">
                                            <Camera className="w-6 h-6 text-foreground/60" />
                                        </div>
                                        <p className="mb-1 text-base text-foreground font-semibold">Verso du document (optionnel)</p>
                                        <p className="text-xs text-foreground/40">Appuyez pour prendre une photo</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*" 
                                        capture="environment"
                                        onChange={handleBackFileChange}
                                    />
                                </label>
                            ) : (
                                <div className="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden border border-border/50 shadow-sm group">
                                    {backPreview && (
                                        <Image 
                                            src={backPreview} 
                                            alt="Back preview" 
                                            fill 
                                            className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                                        />
                                    )}
                                    <button 
                                        onClick={handleRemoveBack}
                                        className="absolute top-3 right-3 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-all active:scale-90"
                                    >
                                        <X size={18} />
                                    </button>
                                    <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-medium">
                                        Verso
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {!showBackOption && frontFile && (
                        <button
                            onClick={() => setShowBackOption(true)}
                            className="w-full py-4 px-6 rounded-xl border border-border/80 text-foreground/60 bg-accent/5 hover:bg-accent/10 hover:text-foreground transition-all flex items-center justify-center gap-2 font-medium active:scale-[0.98] animate-in fade-in"
                        >
                            <Plus size={18} />
                            Ajouter le verso (optionnel)
                        </button>
                    )}
                </div>

                <div className="w-full space-y-4 pt-4">
                    <button
                        onClick={handleUpload}
                        disabled={!frontFile || isUploading}
                        className={cn(
                            "w-full py-4 px-6 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2",
                            !frontFile 
                                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                                : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 active:scale-[0.98]",
                            isUploading && "opacity-80 cursor-wait pointer-events-none"
                        )}
                    >
                        {isUploading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <Upload size={20} />
                                Envoyer le document
                            </>
                        )}
                    </button>
                    
                    {(frontFile || backFile) && (
                        <button
                            onClick={handleReset}
                            className="w-full py-3 px-6 rounded-xl text-foreground/50 hover:text-foreground hover:bg-accent/10 text-sm font-medium transition-all"
                        >
                            Tout recommencer
                        </button>
                    )}
                    
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                        <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-600/90 dark:text-yellow-500/90 leading-relaxed">
                            Assurez-vous que le texte est lisible, bien éclairé et sans reflets pour une meilleure extraction.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
