"use client";

import { useState } from "react";
import { Upload, Camera, AlertCircle, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { serverApi } from "@/lib/api";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function MobileUploadPage() {
    const params = useParams();
    const sessionId = params.sessionId as string;
    
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            await serverApi.post(`/mobile-handoff/upload/${sessionId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
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
        setFile(null);
        setPreview(null);
        setError(null);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 tech-border bg-primary/10 flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Document envoyé !</h1>
                <p className="text-zinc-400 text-sm">
                    Vous pouvez retourner sur votre ordinateur pour voir le résultat.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col p-6">
            <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full space-y-8">
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 tech-border bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Scanner un document</h1>
                    <p className="text-zinc-400 text-sm">
                        Prenez une photo claire de votre document (CNI, Passeport, etc.)
                    </p>
                </div>

                {error && (
                    <div className="w-full p-4 tech-border bg-red-500/10 border-red-500/20 flex items-center gap-3 text-red-500 text-sm">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <div className="w-full">
                    {!file ? (
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed tech-border border-zinc-800 cursor-pointer hover:bg-zinc-900/50 hover:border-primary/50 transition-all active:scale-95">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Camera className="w-10 h-10 text-zinc-500 mb-3" />
                                <p className="mb-2 text-sm text-zinc-400 font-medium">Appuyez pour prendre une photo</p>
                                <p className="text-xs text-zinc-600">ou choisir dans la galerie</p>
                            </div>
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                capture="environment"
                                onChange={handleFileChange}
                            />
                        </label>
                    ) : (
                        <div className="relative w-full aspect-[4/3] bg-zinc-900 tech-border overflow-hidden border-zinc-800">
                            {preview && (
                                <Image 
                                    src={preview} 
                                    alt="Preview" 
                                    fill 
                                    className="object-contain"
                                />
                            )}
                            <button 
                                onClick={handleReset}
                                className="absolute top-2 right-2 p-2 tech-border bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="w-full space-y-3">
                    <button
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        className={cn(
                            "w-full py-4 px-6 tech-border font-bold text-white transition-all flex items-center justify-center gap-2",
                            !file 
                                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                                : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20",
                            isUploading && "opacity-80 cursor-wait"
                        )}
                    >
                        {isUploading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin" />
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <Upload size={20} />
                                Envoyer le document
                            </>
                        )}
                    </button>
                    
                    <div className="flex items-start gap-2 p-3 tech-border bg-yellow-500/5 border-yellow-500/10">
                        <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-600/80">
                            Assurez-vous que le texte est lisible et sans reflets.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
