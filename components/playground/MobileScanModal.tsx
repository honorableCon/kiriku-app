"use client";

import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Smartphone, Loader2, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

interface MobileScanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFileReceived: (file: File) => void;
}

export default function MobileScanModal({ isOpen, onClose, onFileReceived }: MobileScanModalProps) {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [status, setStatus] = useState<'loading' | 'waiting' | 'uploaded' | 'consuming' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Create session on mount
    useEffect(() => {
        if (!isOpen) return;

        const createSession = async () => {
            try {
                const { data } = await api.post('/mobile-handoff/session');
                setSessionId(data.sessionId);
                setStatus('waiting');
            } catch (err) {
                console.error(err);
                setError("Impossible de créer une session mobile");
                setStatus('error');
            }
        };

        createSession();

        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, [isOpen]);

    const consumeFile = async (sid: string) => {
        setStatus('consuming');
        try {
            const response = await api.get(`/mobile-handoff/consume/${sid}`, {
                responseType: 'blob',
            });
            
            // Extract filename from header or default
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'mobile-upload.jpg';
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) filename = match[1];
            }

            const file = new File([response.data], filename, {
                type: response.headers['content-type'] || 'image/jpeg',
            });

            onFileReceived(file);
            onClose();
        } catch (err) {
            console.error("Consume error", err);
            setError("Erreur lors de la récupération du fichier");
            setStatus('error');
        }
    };

    // Poll status
    useEffect(() => {
        if (!sessionId || status !== 'waiting') return;

        const checkStatus = async () => {
            try {
                const { data } = await api.get(`/mobile-handoff/session/${sessionId}`);
                if (data.hasFile && data.status === 'uploaded') {
                    setStatus('uploaded');
                    consumeFile(sessionId);
                }
            } catch (err) {
                // Ignore errors during polling (might be network blip)
                console.error("Polling error", err);
            }
        };

        pollIntervalRef.current = setInterval(checkStatus, 2000);

        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, [sessionId, status]); // eslint-disable-line react-hooks/exhaustive-deps


    if (!isOpen) return null;

    const mobileUrl = sessionId 
        ? `${window.location.protocol}//${window.location.host}/mobile/${sessionId}`
        : '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-sm border border-border shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-border flex items-center justify-between bg-accent/30">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                        <Smartphone size={18} className="text-primary" />
                        Scanner avec mobile
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={18} className="text-foreground/60" />
                    </button>
                </div>

                <div className="p-8 flex flex-col items-center text-center space-y-6">
                    {status === 'loading' && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            <p className="text-sm text-foreground/60">Préparation de la session...</p>
                        </div>
                    )}

                    {status === 'waiting' && sessionId && (
                        <>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-border/50">
                                <QRCodeSVG value={mobileUrl} size={180} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground">Scannez ce code avec votre téléphone</p>
                                <p className="text-xs text-foreground/40">
                                    Ou ouvrez ce lien: <br/>
                                    <span className="font-mono text-[10px] bg-accent px-1 py-0.5 rounded text-foreground/60 select-all">
                                        {mobileUrl}
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-primary animate-pulse">
                                <div className="w-2 h-2 bg-primary rounded-full" />
                                En attente de connexion...
                            </div>
                        </>
                    )}

                    {(status === 'uploaded' || status === 'consuming') && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-green-500 animate-bounce" />
                            </div>
                            <p className="text-lg font-bold text-foreground">Photo reçue !</p>
                            <p className="text-sm text-foreground/60">Traitement en cours...</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                                <X className="w-6 h-6 text-red-500" />
                            </div>
                            <p className="text-sm text-red-500 font-medium">{error || "Une erreur est survenue"}</p>
                            <button 
                                onClick={() => setStatus('loading')} // Retry logic could be better
                                className="text-xs text-primary hover:underline"
                            >
                                Réessayer
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
