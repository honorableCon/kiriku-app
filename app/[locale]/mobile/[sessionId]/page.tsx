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
            <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full space-y-6">
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

                <div className="w-full space-y-4">
                    {!frontFile ? (
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed tech-border border-zinc-800 cursor-pointer hover:bg-zinc-900/50 hover:border-primary/50 transition-all active:scale-95">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Camera className="w-10 h-10 text-zinc-500 mb-3" />
                                <p className="mb-2 text-sm text-zinc-400 font-medium">Recto du document</p>
                                <p className="text-xs text-zinc-600">Appuyez pour prendre une photo ou choisir dans la galerie</p>
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
                        <div className="relative w-full aspect-[4/3] bg-zinc-900 tech-border overflow-hidden border-zinc-800">
                            {frontPreview && (
                                <Image 
                                    src={frontPreview} 
                                    alt="Front preview" 
                                    fill 
                                    className="object-contain"
                                />
                            )}
                            <button 
                                onClick={handleRemoveFront}
                                className="absolute top-2 right-2 p-2 tech-border bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-2 left-2 px-2 py-1 tech-border bg-black/50 backdrop-blur-md text-white text-xs">
                                Recto
                            </div>
                        </div>
                    )}

                    {showBackOption && (
                        <>
                            {!backFile ? (
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed tech-border border-zinc-800 cursor-pointer hover:bg-zinc-900/50 hover:border-primary/50 transition-all active:scale-95">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Camera className="w-10 h-10 text-zinc-500 mb-3" />
                                        <p className="mb-2 text-sm text-zinc-400 font-medium">Verso du document (optionnel)</p>
                                        <p className="text-xs text-zinc-600">Appuyez pour prendre une photo ou choisir dans la galerie</p>
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
                                <div className="relative w-full aspect-[4/3] bg-zinc-900 tech-border overflow-hidden border-zinc-800">
                                    {backPreview && (
                                        <Image 
                                            src={backPreview} 
                                            alt="Back preview" 
                                            fill 
                                            className="object-contain"
                                        />
                                    )}
                                    <button 
                                        onClick={handleRemoveBack}
                                        className="absolute top-2 right-2 p-2 tech-border bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                    <div className="absolute bottom-2 left-2 px-2 py-1 tech-border bg-black/50 backdrop-blur-md text-white text-xs">
                                        Verso
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {!showBackOption && frontFile && (
                        <button
                            onClick={() => setShowBackOption(true)}
                            className="w-full py-3 px-6 tech-border border-zinc-800 text-zinc-400 hover:text-white hover:border-primary/50 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            Ajouter le verso (optionnel)
                        </button>
                    )}
                </div>

                <div className="w-full space-y-3">
                    <button
                        onClick={handleUpload}
                        disabled={!frontFile || isUploading}
                        className={cn(
                            "w-full py-4 px-6 tech-border font-bold text-white transition-all flex items-center justify-center gap-2",
                            !frontFile 
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
                    
                    {(frontFile || backFile) && (
                        <button
                            onClick={handleReset}
                            className="w-full py-2 px-6 text-zinc-500 hover:text-zinc-300 text-sm transition-all"
                        >
                            Recommencer
                        </button>
                    )}
                    
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
