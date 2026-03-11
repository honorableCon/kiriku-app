"use client";

import { useEffect, useState } from "react";
import { Key, Plus, Copy, Trash2, Eye, EyeOff, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showKeyId, setShowKeyId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        try {
            const response = await api.get("/api-keys");
            setKeys(response.data);
        } catch (err) {
            toast.error("Erreur lors de la récupération des clés API");
        } finally {
            setIsLoading(false);
        }
    };

    const createKey = async () => {
        setIsCreating(true);
        try {
            const name = `Clé ${new Date().toLocaleDateString()}`;
            const response = await api.post("/api-keys", { name, environment: 'live' });
            setKeys([response.data, ...keys]);
            toast.success("Nouvelle clé API générée");
        } catch (err) {
            toast.error("Erreur lors de la création de la clé");
        } finally {
            setIsCreating(false);
        }
    };

    const revokeKey = async (id: string) => {
        if (!confirm("Voulez-vous vraiment révoquer cette clé ?")) return;
        try {
            await api.delete(`/api-keys/${id}`);
            setKeys(keys.filter(k => k._id !== id));
            toast.success("Clé API révoquée");
        } catch (err) {
            toast.error("Erreur lors de la révocation");
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
        toast.success("Clé copiée dans le presse-papier");
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-xs font-mono text-primary/60 tracking-widest uppercase">API_Management</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground font-mono">API_KEYS_CONTROL</h1>
                    <p className="text-foreground/50 mt-2 font-mono text-xs tracking-wide">ACCESS_TOKEN_MANAGEMENT</p>
                </div>
                <button 
                    onClick={createKey}
                    disabled={isCreating}
                    className="flex items-center gap-2 px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-black font-bold font-mono text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                    {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} 
                    GENERATE_KEY
                </button>
            </div>

            <div className="tech-border bg-black/40 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-accent/5">
                            <th className="px-4 py-3 text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono">KEY_NAME</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono">API_KEY</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono">CREATED_AT</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-foreground/40 uppercase tracking-widest text-right font-mono">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-12 text-center text-foreground/40 text-xs font-mono">
                                    LOADING_KEYS
                                </td>
                            </tr>
                        ) : keys.map((key) => (
                            <tr key={key._id} className={cn("hover:bg-primary/5 transition-colors group", !key.isActive && "opacity-40 grayscale")}>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full animate-pulse",
                                            key.isActive ? (key.environment === 'live' ? "bg-primary" : "bg-yellow-500") : "bg-zinc-500"
                                        )} />
                                        <span className="text-xs font-bold text-foreground font-mono uppercase">{key.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2 max-w-[300px]">
                                        <code className="text-xs font-mono bg-black/60 px-2 py-1 border border-border/50 text-foreground/80 truncate">
                                            {showKeyId === key._id ? (key.key || `${key.keyPrefix}********************`) : `${key.keyPrefix}********************`}
                                        </code>
                                        <button
                                            onClick={() => setShowKeyId(showKeyId === key._id ? null : key._id)}
                                            className="p-1 hover:text-primary transition-colors text-foreground/40"
                                        >
                                            {showKeyId === key._id ? <EyeOff size={12} /> : <Eye size={12} />}
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(key.key || `${key.keyPrefix}********************`, key._id)}
                                            className="p-1 hover:text-primary transition-colors text-foreground/40 relative"
                                        >
                                            {copiedId === key._id ? <CheckCircle2 size={12} className="text-primary" /> : <Copy size={12} />}
                                        </button>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-xs text-foreground/60 font-mono">
                                    {new Date(key.createdAt).toLocaleDateString('fr-FR')}
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <button 
                                        onClick={() => revokeKey(key._id)}
                                        className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!isLoading && keys.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 border border-border/30 flex items-center justify-center mx-auto mb-4 text-foreground/20">
                            <Key size={32} />
                        </div>
                        <p className="text-foreground/50 font-mono text-xs">NO_API_KEYS_FOUND</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="tech-border bg-primary/5 border-primary/20 p-6">
                    <h3 className="text-lg font-black text-primary mb-4 font-mono uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck size={18} /> SECURITY_PROTOCOLS
                    </h3>
                    <ul className="space-y-3">
                        {[
                            "NEVER_SHARE_YOUR_SECRET_KEYS",
                            "USE_TEST_KEYS_FOR_DEVELOPMENT",
                            "REVOKE_COMPROMISED_KEYS_IMMEDIATELY",
                            "USE_RESTRICTED_SCOPES_WHEN_POSSIBLE"
                        ].map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-foreground/70 font-mono">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 animate-pulse" />
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="tech-border bg-black/40 p-6">
                    <h3 className="text-lg font-black text-foreground mb-4 font-mono uppercase tracking-wider">QUICK_INTEGRATION</h3>
                    <pre className="bg-black/60 p-4 border border-border/50 text-xs font-mono text-primary overflow-x-auto">
                        {`curl -X POST https://api.kiriku.sn/v1/extract \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@document.jpg" \\
  -F "type=cni-senegal"`}
                    </pre>
                </div>
            </div>
        </div>
    );
}
