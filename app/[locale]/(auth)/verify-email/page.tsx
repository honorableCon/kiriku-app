"use client";

import Link from "next/link";
import { Terminal, CheckCircle2, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/lib/resources";

export default function VerifyEmailPage() {
    const params = useSearchParams();
    const router = useRouter();
    const token = params.get("token") || "";
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const run = async () => {
            if (!token) {
                setStatus("error");
                return;
            }
            try {
                await verifyEmail(token);
                setStatus("success");
                setTimeout(() => router.push("/login"), 1500);
            } catch {
                setStatus("error");
            }
        };
        run();
    }, [token, router]);

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black opacity-50" />
            <div className="w-full max-w-md space-y-8 relative z-10 text-center">
                <div className="inline-flex items-center gap-3 mx-auto">
                    <div className="w-12 h-12 tech-border bg-primary flex items-center justify-center">
                        <Terminal className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                        <span className="text-2xl font-bold tracking-tight text-foreground font-mono">KIRIKU</span>
                        <div className="text-[10px] text-primary/60 font-mono tracking-widest uppercase">Email_Verification</div>
                    </div>
                </div>

                {status === "loading" && (
                    <div className="tech-border bg-black/60 p-6 font-mono text-foreground/60">
                        Verification en cours...
                    </div>
                )}

                {status === "success" && (
                    <div className="tech-border bg-black/60 p-6 font-mono text-foreground">
                        <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="text-primary" size={18} />
                            EMAIL_VERIFIED
                        </div>
                        <div className="text-[10px] text-foreground/50 mt-2">Redirection...</div>
                    </div>
                )}

                {status === "error" && (
                    <div className="tech-border bg-black/60 p-6 font-mono text-foreground">
                        <div className="flex items-center justify-center gap-2">
                            <AlertTriangle className="text-destructive" size={18} />
                            INVALID_OR_EXPIRED_TOKEN
                        </div>
                        <div className="text-[10px] text-foreground/50 mt-2">
                            <Link href="/login" className="text-primary/80 hover:text-primary">Back to login</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
