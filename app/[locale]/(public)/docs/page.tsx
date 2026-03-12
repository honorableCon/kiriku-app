"use client";

import { ArrowRight, Book, Code, ExternalLink, ShieldCheck, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

const DOCS_URL = "https://docs.kiriku.app";

export default function DocsPage() {
    const t = useTranslations("docs");

    return (
        <div className="bg-black min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="max-w-3xl mb-16">
                    <div className="tech-border bg-primary/10 border-primary/20 inline-block px-4 py-2 mb-6">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest font-mono flex items-center gap-2">
                            <Book size={14} /> DOCUMENTATION
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-6 leading-tight font-mono uppercase tracking-wider">
                        {t("title")}
                    </h1>
                    <p className="text-lg text-foreground/70 mb-8 font-mono uppercase tracking-wider">
                        {t("subtitle")}
                    </p>

                    <p className="text-sm text-foreground/60 font-mono leading-relaxed">
                        La documentation technique complète est disponible sur{" "}
                        <a href={DOCS_URL} target="_blank" rel="noreferrer" className="text-primary font-black hover:underline">
                            docs.kiriku.app
                        </a>
                        .
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <a
                            href={DOCS_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-black font-black font-mono text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors"
                        >
                            OUVRIR LA DOC <ArrowRight size={16} />
                        </a>
                        <a
                            href={`${DOCS_URL}/quickstart`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 px-6 py-4 border border-primary/40 text-primary font-black font-mono text-xs uppercase tracking-widest hover:bg-primary/10 transition-colors"
                        >
                            QUICKSTART <Zap size={16} />
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a
                        href={`${DOCS_URL}/api-reference/introduction`}
                        target="_blank"
                        rel="noreferrer"
                        className="tech-border bg-black/40 border-border/40 p-6 hover:border-primary/40 hover:bg-black/50 transition-all group"
                    >
                        <div className="tech-border p-3 mb-6 w-fit">
                            <Code size={20} className="text-primary group-hover:scale-110 transition-transform" />
                        </div>
                        <h3 className="text-xl font-black text-foreground mb-2 font-mono uppercase tracking-wider">API Reference</h3>
                        <p className="text-xs text-foreground/60 font-mono leading-relaxed">
                            Tous les endpoints Kiriku, paramètres et formats de réponse.
                        </p>
                        <div className="mt-6 flex items-center gap-2 text-xs font-black text-primary font-mono uppercase tracking-wider">
                            OUVRIR <ExternalLink size={14} />
                        </div>
                    </a>

                    <a
                        href={`${DOCS_URL}/guides/authentication`}
                        target="_blank"
                        rel="noreferrer"
                        className="tech-border bg-black/40 border-border/40 p-6 hover:border-primary/40 hover:bg-black/50 transition-all group"
                    >
                        <div className="tech-border p-3 mb-6 w-fit">
                            <ShieldCheck size={20} className="text-primary group-hover:scale-110 transition-transform" />
                        </div>
                        <h3 className="text-xl font-black text-foreground mb-2 font-mono uppercase tracking-wider">Authentification</h3>
                        <p className="text-xs text-foreground/60 font-mono leading-relaxed">
                            JWT pour la console, API key pour vos intégrations serveur.
                        </p>
                        <div className="mt-6 flex items-center gap-2 text-xs font-black text-primary font-mono uppercase tracking-wider">
                            LIRE <ExternalLink size={14} />
                        </div>
                    </a>

                    <a
                        href={`${DOCS_URL}/guides/webhooks`}
                        target="_blank"
                        rel="noreferrer"
                        className="tech-border bg-black/40 border-border/40 p-6 hover:border-primary/40 hover:bg-black/50 transition-all group"
                    >
                        <div className="tech-border p-3 mb-6 w-fit">
                            <Zap size={20} className="text-primary group-hover:scale-110 transition-transform" />
                        </div>
                        <h3 className="text-xl font-black text-foreground mb-2 font-mono uppercase tracking-wider">Webhooks</h3>
                        <p className="text-xs text-foreground/60 font-mono leading-relaxed">
                            Signatures, événements et bonnes pratiques.
                        </p>
                        <div className="mt-6 flex items-center gap-2 text-xs font-black text-primary font-mono uppercase tracking-wider">
                            LIRE <ExternalLink size={14} />
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}

