"use client";

import Link from "next/link";
import { Lock, Terminal } from "lucide-react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/lib/resources";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
    const params = useSearchParams();
    const token = params.get("token") || "";
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token) {
            toast.error("Token invalide");
            return;
        }
        if (password !== confirm) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }
        setIsLoading(true);
        try {
            await resetPassword(token, password);
            toast.success("Mot de passe mis à jour");
            router.push("/login");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erreur");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black opacity-50" />
            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                        <div className="w-12 h-12 tech-border bg-primary flex items-center justify-center group-hover:bg-primary/80 transition-all">
                            <Terminal className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <span className="text-2xl font-bold tracking-tight text-foreground font-mono">KIRIKU</span>
                            <div className="text-[10px] text-primary/60 font-mono tracking-widest uppercase">Password_Reset</div>
                        </div>
                    </Link>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">SET_NEW_PASSWORD</h2>
                </div>

                <form className="mt-8 tech-border bg-black/60 p-6 backdrop-blur-sm" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-foreground/60 mb-2 font-mono uppercase tracking-wider">
                                <span className="text-primary">[</span> NEW_PASSWORD <span className="text-primary">]</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-foreground/30 group-hover:text-primary/60 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-border bg-black/40 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all text-xs font-mono"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirm" className="block text-xs font-bold text-foreground/60 mb-2 font-mono uppercase tracking-wider">
                                <span className="text-primary">[</span> CONFIRM_PASSWORD <span className="text-primary">]</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-foreground/30 group-hover:text-primary/60 transition-colors" />
                                </div>
                                <input
                                    id="confirm"
                                    name="confirm"
                                    type="password"
                                    required
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-border bg-black/40 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all text-xs font-mono"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-6 w-full flex justify-center items-center gap-2 py-3 px-4 border border-primary text-xs font-bold text-primary hover:bg-primary hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono uppercase tracking-wider"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                UPDATING...
                            </>
                        ) : (
                            "UPDATE_PASSWORD"
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-foreground/50 font-mono">
                    <Link href="/login" className="text-primary/80 hover:text-primary transition-colors">
                        [BACK_TO_LOGIN]
                    </Link>
                </p>
            </div>
        </div>
    );
}
