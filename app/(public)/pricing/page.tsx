"use client";

import { Check, MoveRight, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Gratuit",
        price: "0 FCFA",
        description: "Parfait pour tester Kiriku et monter en compétence.",
        features: [
            "50 extractions / jour",
            "PaddleOCR (Self-hosted)",
            "Templates Built-in uniquement",
            "Support via Discord",
            "Communauté active",
        ],
        cta: "Commencer gratuitement",
        href: "/register",
        popular: false,
    },
    {
        name: "Growth",
        price: "25,000 FCFA",
        period: "/mois",
        description: "Pour les startups et entreprises en pleine croissance.",
        features: [
            "2,500 extractions / mois",
            "Gemini Flash 2.0 & Google Vision",
            "Templates Custom illimités",
            "Détection de fraude de base",
            "Support Prioritaire",
            "Webhooks",
        ],
        cta: "Essayer 14 jours",
        href: "/register",
        popular: true,
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
    },
];

export default function PricingPage() {
    return (
        <div className="bg-white dark:bg-black py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary">Tarifs</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Des prix adaptés à <span className="text-primary italic">votre succès</span>
                    </p>
                    <p className="mt-6 text-lg leading-8 text-foreground/60">
                        Choisissez le plan qui correspond à vos besoins d'intelligence documentaire.
                        Pas de frais cachés, une tarification transparente.
                    </p>
                </div>
                <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={cn(
                                "flex flex-col justify-between rounded-3xl p-8 ring-1 transition-all hover:scale-[1.02] duration-300",
                                plan.popular
                                    ? "bg-zinc-900 ring-zinc-900 shadow-2xl scale-105 z-10 dark:bg-zinc-900 dark:ring-zinc-800"
                                    : "bg-white ring-border dark:bg-black dark:ring-zinc-800 shadow-sm"
                            )}
                        >
                            <div>
                                <div className="flex items-center justify-between gap-x-4">
                                    <h3
                                        className={cn(
                                            "text-lg font-semibold leading-8",
                                            plan.popular ? "text-white" : "text-foreground"
                                        )}
                                    >
                                        {plan.name}
                                    </h3>
                                    {plan.popular && (
                                        <p className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                                            Le plus populaire
                                        </p>
                                    )}
                                </div>
                                <p className={cn(
                                    "mt-4 text-sm leading-6",
                                    plan.popular ? "text-zinc-400" : "text-foreground/60"
                                )}>
                                    {plan.description}
                                </p>
                                <p className="mt-6 flex items-baseline gap-x-1">
                                    <span className={cn(
                                        "text-4xl font-bold tracking-tight",
                                        plan.popular ? "text-white" : "text-foreground"
                                    )}>
                                        {plan.price}
                                    </span>
                                    {plan.period && (
                                        <span className={cn(
                                            "text-sm font-semibold leading-6",
                                            plan.popular ? "text-zinc-400" : "text-foreground/60"
                                        )}>
                                            {plan.period}
                                        </span>
                                    )}
                                </p>
                                <ul
                                    role="list"
                                    className={cn(
                                        "mt-8 space-y-3 text-sm leading-6",
                                        plan.popular ? "text-zinc-300" : "text-foreground/60"
                                    )}
                                >
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                                            <Check
                                                className={cn(
                                                    "h-6 w-5 flex-none",
                                                    plan.popular ? "text-primary" : "text-primary"
                                                )}
                                                aria-hidden="true"
                                            />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Link
                                href={plan.href}
                                className={cn(
                                    "mt-8 block rounded-full px-3 py-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all",
                                    plan.popular
                                        ? "bg-primary text-white shadow-lg hover:bg-primary/90 focus-visible:outline-primary"
                                        : "bg-accent text-foreground hover:bg-accent/80 focus-visible:outline-accent border border-border"
                                )}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-20 flex flex-col items-center justify-center text-center p-12 bg-primary/5 rounded-3xl border border-primary/10">
                    <Zap className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-2xl font-bold text-foreground mb-2">Besoin d'un essai personnalisé ?</h3>
                    <p className="text-foreground/60 max-w-xl mb-8">
                        Vous avez un volume important de documents ou des besoins spécifiques ?
                        Notre équipe peut mettre en place un environnement de test dédié pour votre entreprise.
                    </p>
                    <button className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-xl shadow-primary/20 hover:bg-primary/90 flex items-center gap-2">
                        Contacter le support <MoveRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
