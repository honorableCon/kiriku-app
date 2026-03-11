"use client";

import { useDropzone } from "react-dropzone";
import { File, X, AlertCircle, Scan, Crosshair } from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
    onFileSelect: (file: File) => void;
    onRemove?: () => void;
    isLoading?: boolean;
}

export default function UploadZone({ onFileSelect, onRemove, isLoading }: UploadZoneProps) {
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            setFile(selectedFile);
            onFileSelect(selectedFile);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        disabled: isLoading
    });

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        onRemove?.();
    };

    return (
        <div className="w-full group">
            <div
                {...getRootProps()}
                className={cn(
                    "relative border border-border bg-black/40 p-12 transition-all flex flex-col items-center justify-center cursor-pointer min-h-[300px] overflow-hidden",
                    "hover:border-primary/50 hover:bg-primary/5",
                    isDragActive && "border-primary bg-primary/10",
                    isLoading && "opacity-50 cursor-not-allowed",
                    file && "border-primary/30 bg-primary/5"
                )}
            >
                {/* Technical Corner Markers */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/50" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/50" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/50" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/50" />

                {/* Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                     style={{ 
                         backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', 
                         backgroundSize: '20px 20px' 
                     }} 
                />

                <input {...getInputProps()} />

                {file ? (
                    <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <div className="absolute inset-0 border border-primary/30 rounded-none animate-[spin_10s_linear_infinite]" />
                            <div className="absolute inset-2 border border-primary/20 rounded-none animate-[spin_5s_linear_infinite_reverse]" />
                            <File size={40} className="text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-bold font-mono text-primary tracking-widest uppercase">TARGET_LOCKED</p>
                            <div className="bg-primary/10 px-3 py-1 border border-primary/20">
                                <p className="text-xs font-mono text-primary/80">{file.name}</p>
                            </div>
                            <p className="text-[10px] font-mono text-foreground/40">SIZE: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                            onClick={removeFile}
                            className="px-6 py-2 text-xs font-bold font-mono text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors flex items-center gap-2 uppercase tracking-wider"
                        >
                            <X size={14} /> ABORT_SEQUENCE
                        </button>
                    </div>
                ) : (
                    <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                        <div className="w-24 h-24 border border-border flex items-center justify-center text-foreground/20 group-hover:text-primary group-hover:border-primary/50 transition-all duration-500 relative">
                            <Crosshair size={64} strokeWidth={1} />
                            <div className="absolute inset-0 bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-500" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-bold font-mono text-foreground tracking-tight">DROP_TARGET_HERE</p>
                            <p className="text-xs font-mono text-foreground/40 max-w-xs uppercase tracking-widest">
                                Accept: PNG, JPG, PDF (MAX 10MB)
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-6 py-3 bg-accent/10 border border-border text-xs font-bold font-mono text-foreground/60 uppercase tracking-wider hover:text-primary hover:border-primary/30 transition-all">
                            <Scan size={14} /> Initiate Manual Select
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20">
                        <div className="w-full max-w-xs h-1 bg-border overflow-hidden">
                            <div className="h-full bg-primary animate-[scan_2s_ease-in-out_infinite]" style={{ width: '50%' }} />
                        </div>
                        <p className="text-xs font-bold font-mono text-primary animate-pulse tracking-[0.2em]">PROCESSING_DATA_STREAM...</p>
                    </div>
                )}
            </div>

            <div className="mt-4 flex items-center gap-3 p-3 border border-yellow-500/20 bg-yellow-500/5">
                <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
                <p className="text-[10px] font-mono text-yellow-500/80 uppercase tracking-wide">
                    Advisory: Optimal lighting required for accurate extraction.
                </p>
            </div>
        </div>
    );
}
