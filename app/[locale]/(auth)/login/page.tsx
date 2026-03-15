"use client";

import Link from "next/link";
import { Mail, Lock, Terminal } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const params = useSearchParams();
    const verificationSent = params.get("verify") === "1";
    const verified = params.get("verified") === "1";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Identifiants invalides");
                toast.error("Identifiants invalides");
            } else {
                router.push("/dashboard/overview");
            }
        } catch (err) {
            setError("Une erreur est survenue");
            toast.error("Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black opacity-50" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />

            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                        <div className="w-12 h-12 tech-border bg-primary flex items-center justify-center group-hover:bg-primary/80 transition-all">
                            <Terminal className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <span className="text-2xl font-bold tracking-tight text-foreground font-mono">KIRIKU</span>
                            <div className="text-[10px] text-primary/60 font-mono tracking-widest uppercase">System_Auth</div>
                        </div>
                    </Link>
                    <h2 className="text-4xl font-bold text-foreground tracking-tight">AUTHENTIFICATION</h2>
                    <div className="mt-3 flex items-center justify-center gap-2 text-xs text-foreground/40 font-mono">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span>SECURE_ACCESS_REQUIRED</span>
                    </div>
                </div>

                <form className="mt-8 tech-border bg-black/60 p-6 backdrop-blur-sm" onSubmit={handleSubmit}>
                    {verificationSent ? (
                        <div className="mb-4 border border-primary/40 bg-primary/10 px-3 py-2 text-xs text-primary/80 font-mono">
                            Un email de confirmation a été envoyé. Vérifiez votre boîte de réception.
                        </div>
                    ) : null}
                    {verified ? (
                        <div className="mb-4 border border-primary/40 bg-primary/10 px-3 py-2 text-xs text-primary/80 font-mono">
                            Email vérifié. Vous pouvez vous connecter.
                        </div>
                    ) : null}
                    {error ? (
                        <div className="mb-4 border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-500 font-mono flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </div>
                    ) : null}
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-foreground/60 mb-2 font-mono uppercase tracking-wider">
                                <span className="text-primary">[</span> EMAIL <span className="text-primary">]</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-foreground/30 group-hover:text-primary/60 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-border bg-black/40 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all text-xs font-mono"
                                    placeholder="nom@exemple.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-foreground/60 mb-2 font-mono uppercase tracking-wider">
                                <span className="text-primary">[</span> PASSWORD <span className="text-primary">]</span>
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
                                    className="block w-full pl-10 pr-3 py-2.5 border border-border bg-black/40 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all text-xs font-mono"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-3 w-3 text-primary focus:ring-primary border-border bg-black/40"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-xs text-foreground/50 font-mono">
                                PERSIST_SESSION
                            </label>
                        </div>
                        <div className="text-xs">
                            <Link href="/forgot-password" title="Mot de passe oublié ?" className="font-mono text-primary/80 hover:text-primary transition-colors">
                                FORGOT_PASSWORD?
                            </Link>
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
                                AUTHENTICATING...
                            </>
                        ) : (
                            <>
                                INITIALIZE_LOGIN
                                <Terminal className="w-3 h-3" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-foreground/50 font-mono">
                    <span className="text-foreground/30">NO_ACCOUNT?</span>{" "}
                    <Link href="/register" className="text-primary/80 hover:text-primary transition-colors">
                        [CREATE_NEW_IDENTITY]
                    </Link>
                </p>

                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border/30 bg-black/40 text-[10px] text-foreground/30 font-mono">
                        <span>SYSTEM_V2.4.0</span>
                        <span className="text-border">|</span>
                        <span className="text-primary/50">ENCRYPTED</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
