"use client";

import Link from "next/link";
import { Mail, Lock, User, Building, Terminal } from "lucide-react";
import { useState } from "react";

import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const firstName = formData.get("first-name") as string;
        const lastName = formData.get("last-name") as string;
        const organization = formData.get("org") as string;

        try {
            // 1. Register via Backend API
            await api.post("/auth/register", {
                email,
                password,
                firstName,
                lastName,
                organization
            });

            // 2. Auto-login via NextAuth
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Compte créé mais échec de la connexion automatique");
                router.push("/login");
            } else {
                toast.success("Bienvenue sur Kiriku !");
                router.push("/dashboard/overview");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Erreur lors de l'inscription");
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
                            <div className="text-[10px] text-primary/60 font-mono tracking-widest uppercase">System_Reg</div>
                        </div>
                    </Link>
                    <h2 className="text-4xl font-bold text-foreground tracking-tight">NEW_IDENTITY</h2>
                    <div className="mt-3 flex items-center justify-center gap-2 text-xs text-foreground/40 font-mono">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span>INITIALIZE_REGISTRATION</span>
                    </div>
                </div>

                <form className="mt-8 tech-border bg-black/60 p-6 backdrop-blur-sm" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="first-name" className="block text-xs font-bold text-foreground/60 mb-2 font-mono uppercase tracking-wider">
                                    <span className="text-primary">[</span> FIRST_NAME <span className="text-primary">]</span>
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-3.5 w-3.5 text-foreground/30 group-hover:text-primary/60 transition-colors" />
                                    </div>
                                    <input
                                        id="first-name"
                                        name="first-name"
                                        type="text"
                                        required
                                        className="block w-full pl-8 pr-3 py-2 border border-border bg-black/40 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all text-xs font-mono"
                                        placeholder="Jean"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="last-name" className="block text-xs font-bold text-foreground/60 mb-2 font-mono uppercase tracking-wider">
                                    <span className="text-primary">[</span> LAST_NAME <span className="text-primary">]</span>
                                </label>
                                <input
                                    id="last-name"
                                    name="last-name"
                                    type="text"
                                    required
                                    className="block w-full px-3 py-2 border border-border bg-black/40 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all text-xs font-mono"
                                    placeholder="Dupont"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="org" className="block text-xs font-bold text-foreground/60 mb-2 font-mono uppercase tracking-wider">
                                <span className="text-primary">[</span> ORGANIZATION <span className="text-primary">]</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building className="h-3.5 w-3.5 text-foreground/30 group-hover:text-primary/60 transition-colors" />
                                </div>
                                <input
                                    id="org"
                                    name="org"
                                    type="text"
                                    className="block w-full pl-8 pr-3 py-2 border border-border bg-black/40 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all text-xs font-mono"
                                    placeholder="Ma Startup"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-foreground/60 mb-2 font-mono uppercase tracking-wider">
                                <span className="text-primary">[</span> EMAIL <span className="text-primary">]</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-3.5 w-3.5 text-foreground/30 group-hover:text-primary/60 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full pl-8 pr-3 py-2 border border-border bg-black/40 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all text-xs font-mono"
                                    placeholder="jean@exemple.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-foreground/60 mb-2 font-mono uppercase tracking-wider">
                                <span className="text-primary">[</span> PASSWORD <span className="text-primary">]</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-3.5 w-3.5 text-foreground/30 group-hover:text-primary/60 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full pl-8 pr-3 py-2 border border-border bg-black/40 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all text-xs font-mono"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start mt-4">
                        <div className="flex items-center h-4">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-3 w-3 text-primary focus:ring-primary border-border bg-black/40"
                            />
                        </div>
                        <div className="ml-2.5 text-xs font-mono text-foreground/50">
                            <label htmlFor="terms">
                                <span className="text-foreground/40">I_ACCEPT_THE</span>{" "}
                                <Link href="/terms" className="text-primary/80 hover:text-primary transition-colors">
                                    [TERMS_OF_SERVICE]
                                </Link>{" "}
                                <span className="text-foreground/40">&</span>{" "}
                                <Link href="/privacy" className="text-primary/80 hover:text-primary transition-colors">
                                    [PRIVACY_POLICY]
                                </Link>
                            </label>
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
                                REGISTERING...
                            </>
                        ) : (
                            <>
                                CREATE_ACCOUNT
                                <Terminal className="w-3 h-3" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-foreground/50 font-mono pb-8">
                    <span className="text-foreground/30">EXISTING_IDENTITY?</span>{" "}
                    <Link href="/login" className="text-primary/80 hover:text-primary transition-colors">
                        [INITIALIZE_LOGIN]
                    </Link>
                </p>

                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border/30 bg-black/40 text-[10px] text-foreground/30 font-mono">
                        <span>SYSTEM_V2.4.0</span>
                        <span className="text-border">|</span>
                        <span className="text-primary/50">SECURE</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
