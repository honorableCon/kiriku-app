"use client";

import { Check, MoveRight, Zap, Cpu, Database, Shield } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Gratuit",
        price: "0 FCFA",
        description: "Parfait pour tester Kiriku et monter en compétence.",
        features: [
            "50 extractions / jour",
            // "PaddleOCR (Self-hosted)",
            "Templates Built-in uniquement",
            "Support via Discord",
            "Communauté active",
        ],
        cta: "Commencer gratuitement",
        href: "/register",
        popular: false,
        icon: Cpu,
    },
    {
        name: "Growth",
        price: "25,000 FCFA",
        period: "/mois",
        description: "Pour les startups et entreprises en pleine croissance.",
        features: [
            "2,500 extractions / mois",
            // "Gemini Flash 2.0 & Google Vision",
            "Templates Custom illimités",
            "Détection de fraude de base",
            "Support Prioritaire",
            "Webhooks",
        ],
        cta: "Essayer 14 jours",
        href: "/register",
        popular: true,
        icon: Database,
    },
    {
        name: "Enterprise",
        price: "Sur mesure",
        description: "Solution complète pour les grands volumes et KYC complexes.",
        features: [
            "Volume illimité",
            "SLA 99.9%",
            "Détection de fraude avancée",
            "Intégration sur site possible",
            "Account Manager dédié",
            "Analyses personnalisées",
        ],
        cta: "Contacter l'équipe",
        href: "/contact",
        popular: false,
        icon: Shield,
    },
];

export default function PricingPage() {
    return (
        <div className="bg-black min-h-screen py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="tech-border bg-primary/10 border-primary/20 inline-block px-4 py-2 mb-6">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest font-mono">PRICING_TIER</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl font-mono uppercase mb-4">
                        Des prix adaptés à votre succès
                    </h1>
                    <p className="text-sm text-foreground/60 font-mono uppercase tracking-wider max-w-2xl mx-auto">
                        Choisissez le plan qui correspond à vos besoins d'intelligence documentaire
                    </p>
                </div>
                <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={cn(
                                "flex flex-col justify-between tech-border p-6 transition-all duration-300",
                                plan.popular
                                    ? "bg-black/60 border-primary/40 shadow-[0_0_30px_rgba(0,166,81,0.1)] scale-105 z-10"
                                    : "bg-black/40 border-border/40 hover:border-primary/30 hover:bg-black/50"
                            )}
                        >
                            <div>
                                <div className="flex items-center justify-between gap-x-4 mb-4">
                                    <div className={cn(
                                        "tech-border p-2",
                                        plan.popular ? "bg-primary/20 border-primary/40" : "bg-black/60 border-border/40"
                                    )}>
                                        <plan.icon size={20} className={cn(plan.popular ? "text-primary" : "text-foreground/60")} />
                                    </div>
                                    {plan.popular && (
                                        <span className="tech-border bg-primary/20 border-primary/40 px-3 py-1 text-[10px] font-black text-primary uppercase tracking-wider font-mono">
                                            POPULAR
                                        </span>
                                    )}
                                </div>
                                <h3 className={cn(
                                    "text-xl font-black uppercase tracking-wider font-mono mb-2",
                                    plan.popular ? "text-foreground" : "text-foreground/80"
                                )}>
                                    {plan.name}
                                </h3>
                                <p className={cn(
                                    "text-xs text-foreground/60 font-mono uppercase tracking-wider mb-4",
                                )}>
                                    {plan.description}
                                </p>
                                <div className="mb-6">
                                    <p className={cn(
                                        "text-3xl font-black tracking-tight font-mono uppercase",
                                        plan.popular ? "text-primary" : "text-foreground"
                                    )}>
                                        {plan.price}
                                    </p>
                                    {plan.period && (
                                        <p className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider">
                                            {plan.period}
                                        </p>
                                    )}
                                </div>
                                <ul className="space-y-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex gap-x-3 items-start">
                                            <div className={cn(
                                                "tech-border p-1 mt-0.5",
                                                plan.popular ? "bg-primary/20 border-primary/40" : "bg-black/60 border-border/40"
                                            )}>
                                                <Check size={12} className={cn(plan.popular ? "text-primary" : "text-foreground/60")} />
                                            </div>
                                            <span className="text-xs text-foreground/70 font-mono uppercase tracking-wider">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Link
                                href={plan.href}
                                className={cn(
                                    "mt-8 block tech-border px-4 py-3 text-center text-xs font-black uppercase tracking-wider transition-all font-mono hover:scale-[1.02]",
                                    plan.popular
                                        ? "bg-primary text-foreground border-primary hover:bg-primary/90"
                                        : "bg-black/60 text-foreground border-border/40 hover:border-primary/40 hover:text-primary"
                                )}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-20 tech-border bg-primary/5 border-primary/20 p-8">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="tech-border bg-primary/20 border-primary/40 p-3 mb-4">
                            <Zap size={24} className="text-primary" />
                        </div>
                        <h3 className="text-lg font-black text-foreground mb-2 font-mono uppercase tracking-wider">
                            Besoin d'un essai personnalisé ?
                        </h3>
                        <p className="text-xs text-foreground/60 font-mono uppercase tracking-wider max-w-xl mb-6">
                            Vous avez un volume important de documents ou des besoins spécifiques ?
                            Notre équipe peut mettre en place un environnement de test dédié pour votre entreprise.
                        </p>
                        <Link href="/contact" className="tech-border bg-primary text-foreground border-primary px-6 py-3 text-xs font-black uppercase tracking-wider hover:bg-primary/90 font-mono flex items-center gap-2">
                            Contacter le support <MoveRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
