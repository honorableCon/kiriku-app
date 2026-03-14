"use client";

import { useDropzone } from "react-dropzone";
import { File, X, Scan } from "lucide-react";
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

    return (
        <div 
            {...getRootProps()}
            className={cn(
                "w-full relative border-2 border-dashed border-border/50 bg-accent/5 p-8 transition-all flex flex-col items-center justify-center cursor-pointer min-h-[250px] overflow-hidden rounded-lg",
                "hover:border-primary/50 hover:bg-primary/5",
                isDragActive && "border-primary bg-primary/10",
                isLoading && "opacity-50 cursor-not-allowed pointer-events-none",
                file && "border-primary/30 bg-primary/5 border-solid"
            )}
        >
            <input {...getInputProps()} />

            {file ? (
                <div className="relative z-10 flex flex-col items-center text-center space-y-4 w-full">
                    <div className="relative w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full">
                        <File size={32} className="text-primary" />
                    </div>
                    <div className="space-y-1 max-w-full px-4">
                        <p className="text-sm font-bold text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-foreground/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            onRemove?.();
                        }}
                        className="px-4 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2 rounded-md"
                    >
                        <X size={14} /> Supprimer le fichier
                    </button>
                </div>
            ) : (
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-foreground/40 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300">
                        <Scan size={32} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-base font-medium text-foreground">Glissez votre document ici</p>
                        <p className="text-xs text-foreground/40">
                            ou cliquez pour sélectionner
                        </p>
                    </div>
                    <p className="text-[10px] text-foreground/30 uppercase tracking-wider">
                        PNG, JPG, PDF (Max 10MB)
                    </p>
                </div>
            )}
        </div>
    );
}
