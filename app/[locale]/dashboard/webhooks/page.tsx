"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Webhook as WebhookIcon, Plus, ExternalLink, Activity, AlertCircle, Trash2, Edit2, Play } from "lucide-react";
import { getWebhooks, createWebhook, deleteWebhook, testWebhook } from "@/lib/resources-ext";
import type { Webhook } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function WebhooksPage() {
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newWebhookUrl, setNewWebhookUrl] = useState("");
    const [accessError, setAccessError] = useState<string | null>(null);
    const didInitFetch = useRef(false);

    useEffect(() => {
        if (didInitFetch.current) return;
        didInitFetch.current = true;
        fetchWebhooks();
    }, []);

    const fetchWebhooks = async () => {
        try {
            const data = await getWebhooks();
            setWebhooks(data);
            setAccessError(null);
        } catch (err) {
            const message =
                err instanceof Error && err.message
                    ? err.message
                    : "Erreur lors du chargement des webhooks";
            if (message.toLowerCase().includes("plan") || message.includes("403")) {
                setAccessError(message);
                return;
            }
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWebhookUrl) return;
        if (accessError) {
            toast.error("Fonctionnalité disponible à partir du plan Starter");
            return;
        }

        setIsCreating(true);
        try {
            const newWebhook = await createWebhook({
                name: `Webhook ${webhooks.length + 1}`,
                url: newWebhookUrl,
                events: ['extraction.completed', 'extraction.failed']
            });
            setWebhooks([...webhooks, newWebhook]);
            setNewWebhookUrl("");
            toast.success("Webhook créé avec succès");
        } catch {
            toast.error("Erreur lors de la création du webhook");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce webhook ?")) return;
        if (accessError) {
            toast.error("Fonctionnalité disponible à partir du plan Starter");
            return;
        }
        try {
            await deleteWebhook(id);
            setWebhooks(webhooks.filter(w => w.id !== id));
            toast.success("Webhook supprimé");
        } catch {
            toast.error("Erreur lors de la suppression");
        }
    };

    const handleTest = async (id: string) => {
        if (accessError) {
            toast.error("Fonctionnalité disponible à partir du plan Starter");
            return;
        }
        try {
            await testWebhook(id);
            toast.success("Test envoyé avec succès");
        } catch {
            toast.error("Échec du test webhook");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-mono">WEBHOOKS</h1>
                    <p className="font-mono text-xs text-foreground/40 mt-1">REAL_TIME_NOTIFICATION_ENDPOINTS</p>
                </div>
            </div>

            <div className="tech-border bg-black/40 p-6">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2 font-mono">
                    <Plus size={16} className="text-primary" /> ADD_ENDPOINT
                </h3>
                {accessError ? (
                    <div className="mb-4 tech-border border-yellow-500/30 bg-yellow-500/10 p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-yellow-500 mt-0.5" size={18} />
                            <div className="flex-1">
                                <div className="text-xs font-mono text-yellow-500 uppercase tracking-widest">
                                    Upgrade requis
                                </div>
                                <div className="text-sm text-foreground/70 font-mono mt-1">
                                    Les webhooks sont disponibles à partir du plan Starter. Message: {accessError}
                                </div>
                                <div className="mt-3">
                                    <Link
                                        href="/dashboard/billing"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-black text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all font-mono"
                                    >
                                        Aller à la facturation <ExternalLink size={12} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
                <form onSubmit={handleCreate} className="flex gap-4">
                    <input
                        type="url"
                        placeholder="https://api.votre-app.com/webhooks/kiriku"
                        required
                        value={newWebhookUrl}
                        onChange={(e) => setNewWebhookUrl(e.target.value)}
                        disabled={!!accessError}
                        className="flex-1 px-4 py-2.5 bg-primary/10 border border-primary/20 tech-border text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all font-mono text-foreground"
                    />
                    <button 
                        type="submit" 
                        disabled={isCreating || !!accessError}
                        className="px-6 py-2.5 bg-primary text-white tech-border text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50 font-mono"
                    >
                        {isCreating ? "CREATING" : "ADD"}
                    </button>
                </form>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center min-h-[400px]">
                        <div className="tech-border bg-black/40 p-4 flex flex-col items-center gap-3">
                            <WebhookIcon className="h-8 w-8 animate-spin text-primary" />
                            <span className="font-mono text-xs text-foreground/40">LOADING_WEBHOOKS</span>
                        </div>
                    </div>
                ) : webhooks.length > 0 ? (
                    webhooks.map((webhook) => (
                        <div key={webhook.id || webhook.url} className="tech-border bg-black/40 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                            <div className="flex items-start gap-4">
                                <div className={cn("p-3 tech-border", webhook.isActive ? "bg-primary/10 text-primary" : "bg-zinc-500/10 text-zinc-500")}>
                                    <WebhookIcon size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-foreground font-mono">{webhook.name}</h3>
                                        {webhook.isActive ? (
                                            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 tech-border flex items-center gap-1 font-mono">
                                                <div className="w-1.5 h-1.5 bg-primary animate-pulse" /> ACTIVE
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold bg-zinc-500/10 text-zinc-500 px-2 py-0.5 tech-border font-mono">INACTIVE</span>
                                        )}
                                    </div>
                                    <p className="text-sm font-mono text-foreground/60 mt-1">{webhook.url}</p>
                                    <div className="flex gap-2 mt-3">
                                        {webhook.events.map((event, idx) => (
                                            <span key={`${webhook.id || webhook.url}:${event}:${idx}`} className="text-[10px] font-medium bg-primary/5 px-2 py-1 tech-border text-foreground/60 border-primary/20 font-mono">
                                                {event}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-primary/20">
                                <button 
                                    onClick={() => handleTest(webhook.id)}
                                    className="p-2 text-foreground/40 hover:text-primary hover:bg-primary/10 tech-border transition-all"
                                    title="Tester le webhook"
                                >
                                    <Play size={18} />
                                </button>
                                <button className="p-2 text-foreground/40 hover:text-foreground hover:bg-primary/10 tech-border transition-all">
                                    <Edit2 size={18} />
                                </button>
                                <div className="w-px h-6 bg-primary/20 mx-1" />
                                <button 
                                    onClick={() => handleDelete(webhook.id)}
                                    className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 tech-border transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="tech-border bg-black/40 p-12 text-center border-dashed">
                        <div className="w-16 h-16 tech-border bg-primary/5 flex items-center justify-center mx-auto mb-6">
                            <WebhookIcon size={32} className="text-foreground/20" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2 font-mono">NO_WEBHOOKS_CONFIGURED</h3>
                        <p className="text-foreground/60 max-w-md mx-auto mb-8 font-mono text-sm">
                            CONFIGURE_ENDPOINT_TO_RECEIVE_EXTRACTION_RESULTS
                        </p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="tech-border bg-black/40 p-6">
                    <h3 className="font-bold text-foreground flex items-center gap-2 mb-4 font-mono">
                        <Activity className="text-primary" size={18} /> SYSTEM_STATUS
                    </h3>
                    <p className="text-sm text-foreground/60 font-medium font-mono">
                        ALL_WEBHOOK_SERVERS_OPERATIONAL <br />
                        AVG_DELIVERY_TIME <span className="text-foreground font-bold">240ms</span>
                    </p>
                </div>
                <div className="tech-border bg-black/40 p-6">
                    <h3 className="font-bold text-foreground flex items-center gap-2 mb-4 font-mono">
                        <AlertCircle className="text-yellow-500" size={18} /> ERROR_LOGS
                    </h3>
                    <p className="text-sm text-foreground/60 font-medium font-mono">
                        NO_DELIVERY_ERRORS_DETECTED_LAST_24H
                    </p>
                </div>
            </div>
        </div>
    );
}
