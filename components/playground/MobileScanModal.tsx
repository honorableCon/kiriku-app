"use client";

import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Smartphone, Loader2, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface MobileScanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFileReceived: (file: File) => void;
    onFilesReceived?: (frontFile: File, backFile?: File) => void;
}

export default function MobileScanModal({ isOpen, onClose, onFileReceived, onFilesReceived }: MobileScanModalProps) {
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
            
            const hasBackFile = response.headers['x-has-back-file'] === 'true';
            
            const contentDisposition = response.headers['content-disposition'];
            let frontFilename = 'mobile-upload.jpg';
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) frontFilename = match[1];
            }

            const frontFile = new File([response.data], frontFilename, {
                type: response.headers['content-type'] || 'image/jpeg',
            });

            if (hasBackFile && onFilesReceived) {
                try {
                    const backResponse = await api.get(`/mobile-handoff/consume/${sid}?side=back`, {
                        responseType: 'blob',
                    });
                    
                    const backContentDisposition = backResponse.headers['content-disposition'];
                    let backFilename = 'mobile-upload-back.jpg';
                    if (backContentDisposition) {
                        const match = backContentDisposition.match(/filename="?([^"]+)"?/);
                        if (match && match[1]) backFilename = match[1];
                    }

                    const backFile = new File([backResponse.data], backFilename, {
                        type: backResponse.headers['content-type'] || 'image/jpeg',
                    });

                    onFilesReceived(frontFile, backFile);
                    toast.success("Documents reçus avec succès !", {
                        description: "Recto et verso disponibles pour l'extraction.",
                        duration: 3000,
                    });
                } catch (backErr) {
                    console.error("Error fetching back file", backErr);
                    onFilesReceived(frontFile);
                    toast.success("Document reçu avec succès !", {
                        description: "Vous pouvez maintenant lancer l'extraction.",
                        duration: 3000,
                    });
                }
            } else {
                onFileReceived(frontFile);
                toast.success("Document reçu avec succès !", {
                    description: "Vous pouvez maintenant lancer l'extraction.",
                    duration: 3000,
                });
            }
            
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
        ? `${process.env.NEXTAUTH_URL}/mobile/${sessionId}`
        : '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background border border-border w-full max-w-sm overflow-hidden rounded-lg shadow-xl animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-border flex items-center justify-between bg-accent/5">
                    <h3 className="font-bold text-foreground flex items-center gap-2 text-sm uppercase tracking-wide">
                        <Smartphone size={18} className="text-primary" />
                        Scanner avec mobile
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-primary/10 transition-colors rounded-md"
                    >
                        <X size={18} className="text-foreground/60 hover:text-foreground" />
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center text-center space-y-6">
                    {status === 'loading' && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            <p className="text-sm text-foreground/60">Initialisation de la session...</p>
                        </div>
                    )}

                    {status === 'waiting' && sessionId && (
                        <>
                            <div className="bg-white p-4 rounded-lg">
                                <QRCodeSVG value={mobileUrl} size={180} />
                            </div>
                            <div className="space-y-2 w-full">
                                <p className="text-sm font-medium text-foreground">Scannez le QR Code</p>
                                <div className="text-xs text-foreground/40 space-y-1">
                                    <p>Ou utilisez ce lien :</p>
                                    <div className="bg-accent/10 px-2 py-1.5 rounded text-foreground/60 select-all border border-border break-all font-mono text-[10px]">
                                        {mobileUrl}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-primary animate-pulse">
                                <div className="w-2 h-2 bg-primary rounded-full" />
                                En attente de connexion...
                            </div>
                        </>
                    )}

                    {(status === 'uploaded' || status === 'consuming') && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-primary animate-bounce" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-bold text-foreground">Envoi terminé !</p>
                                <p className="text-sm text-foreground/60">Récupération des documents...</p>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                                <X className="w-6 h-6 text-destructive" />
                            </div>
                            <p className="text-sm text-destructive font-medium">{error || "Une erreur est survenue"}</p>
                            <button 
                                onClick={() => setStatus('loading')} // Retry logic could be better
                                className="text-xs text-primary hover:text-primary/80 font-medium border border-primary/20 px-3 py-1.5 hover:bg-primary/10 transition-colors rounded-md"
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
