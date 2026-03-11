"use client";

import { useState, useEffect } from 'react';
import { Save, RefreshCw, Plus, Trash2, ShieldCheck, Cpu } from 'lucide-react';
import api from '@/lib/api';
import { SystemSettings } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AdminSettingsPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [settings, setSettings] = useState<SystemSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [newFallback, setNewFallback] = useState('');

    useEffect(() => {
        if (status === 'loading') return;
        const role = (session?.user as unknown as { role?: string } | undefined)?.role;
        if (status === 'unauthenticated') {
            router.replace('/login');
            return;
        }
        if (role !== 'admin') {
            router.replace('/dashboard/overview');
            return;
        }
        fetchSettings();
    }, [status, session, router]);

    const fetchSettings = async () => {
        try {
            const response = await api.get<SystemSettings>('/admin/settings');
            setSettings(response.data);
        } catch (error) {
            toast.error("Erreur lors de la récupération des réglages");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;
        setIsSaving(true);
        try {
            await api.put('/admin/settings/openrouter', settings.openRouter);
            toast.success("Réglages mis à jour avec succès");
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde");
        } finally {
            setIsSaving(false);
        }
    };

    const addFallback = () => {
        if (!newFallback || !settings) return;
        setSettings({
            ...settings,
            openRouter: {
                ...settings.openRouter,
                fallbackModels: [...settings.openRouter.fallbackModels, newFallback]
            }
        });
        setNewFallback('');
    };

    const removeFallback = (index: number) => {
        if (!settings) return;
        const newFallbacks = [...settings.openRouter.fallbackModels];
        newFallbacks.splice(index, 1);
        setSettings({
            ...settings,
            openRouter: {
                ...settings.openRouter,
                fallbackModels: newFallbacks
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="tech-border bg-black/40 p-4 flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                    <span className="font-mono text-xs text-foreground/40">LOADING_SETTINGS</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground font-mono">SYSTEM_SETTINGS</h1>
                    <p className="font-mono text-xs text-foreground/40">CONFIGURE_GLOBAL_AI_INFRASTRUCTURE</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="tech-border bg-black/40 flex items-center gap-2 px-6 py-2 text-primary font-mono text-sm hover:bg-primary/10 hover:border-primary/40 transition-all disabled:opacity-50"
                >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    SAVE_CONFIG
                </button>
            </div>

            {/* OpenRouter Configuration */}
            <div className="tech-border bg-black/40 overflow-hidden">
                <div className="p-6 border-b border-primary/20 bg-primary/5 flex items-center gap-3">
                    <div className="w-10 h-10 tech-border bg-primary/10 flex items-center justify-center text-primary">
                        <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold font-mono">OPENROUTER_OCR</h2>
                        <p className="text-xs text-foreground/40 font-mono">CONFIGURE_PREMIUM_AI_ENGINE</p>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-bold font-mono text-primary/80">OPENROUTER_API_KEY</label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    value={settings?.openRouter.apiKey}
                                    onChange={(e) => setSettings(s => s ? ({ ...s, openRouter: { ...s.openRouter, apiKey: e.target.value } }) : null)}
                                    placeholder="sk-or-v1-..."
                                    className="w-full px-4 py-2.5 bg-black/40 tech-border focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono text-sm text-foreground/80"
                                />
                                <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold font-mono text-primary/80">PRIMARY_MODEL</label>
                            <input
                                type="text"
                                value={settings?.openRouter.primaryModel}
                                onChange={(e) => setSettings(s => s ? ({ ...s, openRouter: { ...s.openRouter, primaryModel: e.target.value } }) : null)}
                                placeholder="anthropic/claude-3.5-sonnet"
                                className="w-full px-4 py-2.5 bg-black/40 tech-border focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono text-sm text-foreground/80"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-primary/20">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <label className="text-xs font-bold font-mono text-primary/80">FALLBACK_MODELS</label>
                                <p className="text-xs text-foreground/40 font-mono">AUTO_SWITCH_ON_FAILURE</p>
                            </div>
                            <div className="flex gap-2 w-full max-w-sm">
                                <input
                                    type="text"
                                    value={newFallback}
                                    onChange={(e) => setNewFallback(e.target.value)}
                                    placeholder="google/gemini-2.0-flash-001"
                                    className="flex-1 px-3 py-2 bg-black/40 tech-border text-sm font-mono outline-none text-foreground/80"
                                />
                                <button
                                    onClick={addFallback}
                                    className="tech-border bg-primary/10 text-primary p-2 hover:bg-primary/20 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            {settings?.openRouter.fallbackModels.map((model, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-primary/5 tech-border border-primary/20 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 tech-border bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                            {idx + 1}
                                        </div>
                                        <span className="text-sm font-mono text-foreground/80">{model}</span>
                                    </div>
                                    <button
                                        onClick={() => removeFallback(idx)}
                                        className="p-1.5 text-primary opacity-0 group-hover:opacity-100 hover:bg-primary/10 tech-border transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {settings?.openRouter.fallbackModels.length === 0 && (
                                <div className="text-center py-6 tech-border border-dashed border-primary/20 text-foreground/30 text-sm font-mono">
                                    NO_FALLBACK_CONFIGURED
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-6 border-t border-primary/20">
                        <div className="flex-1">
                            <h3 className="text-xs font-bold font-mono text-primary/80">ENABLE_OPENROUTER</h3>
                            <p className="text-xs text-foreground/40 font-mono">DISABLE_TO_FORCE_PADDLE_GEMINI</p>
                        </div>
                        <button
                            onClick={() => setSettings(s => s ? ({ ...s, openRouter: { ...s.openRouter, isEnabled: !s.openRouter.isEnabled } }) : null)}
                            className={cn(
                                "tech-border w-12 h-6 transition-all relative",
                                settings?.openRouter.isEnabled ? "bg-primary/20 border-primary" : "bg-black/40 border-primary/20"
                            )}
                        >
                            <div className={cn(
                                "absolute top-1 w-4 h-4 bg-primary transition-all",
                                settings?.openRouter.isEnabled ? "left-7" : "left-1"
                            )} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Other Config Placeholder */}
            <div className="tech-border bg-black/40 p-8 opacity-50 grayscale pointer-events-none">
                <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-5 h-5 text-primary/40" />
                    <h2 className="text-lg font-bold font-mono text-foreground/40">SECURITY_QUOTAS</h2>
                </div>
                <p className="text-sm text-foreground/30 font-mono">ADDITIONAL_ADMIN_SETTINGS_COMING_SOON</p>
            </div>
        </div>
    );
}
