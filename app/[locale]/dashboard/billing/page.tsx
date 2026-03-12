"use client";

import { useEffect, useState } from "react";
import { CreditCard, Shield, Zap, Loader2, ArrowRight } from "lucide-react";
import { createCheckoutSession, createSubscription, getCurrentUser, getPlans } from "@/lib/resources";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import type { User, Plan } from "@/types";

export default function BillingPage() {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [isSubscribing, setIsSubscribing] = useState<string | null>(null);
    const [billingPhone, setBillingPhone] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isPlansLoading, setIsPlansLoading] = useState(true);
    const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [pendingPlan, setPendingPlan] = useState<Plan | null>(null);
    const params = useSearchParams();

    useEffect(() => {
        const status = params.get("status");
        if (status === "success") {
            toast.success("Paiement confirmé. Vos crédits seront ajoutés.");
        } else if (status === "cancel") {
            toast.error("Paiement annulé.");
        }
    }, [params]);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const me = await getCurrentUser();
                setUser(me);
                if (me.phone) {
                    setBillingPhone(me.phone);
                }
            } catch {
                // ignore
            }
        };
        loadUser();
    }, []);

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const fetchedPlans = await getPlans();
                setPlans(fetchedPlans);
            } catch {
                // ignore
            } finally {
                setIsPlansLoading(false);
            }
        };
        loadPlans();
    }, []);

    const handlePurchase = async (pack: Plan) => {
        setIsLoading(pack.id);
        try {
            const { paymentUrl } = await createCheckoutSession(pack.id);
            window.location.assign(paymentUrl);
        } catch (err) {
            toast.error("Erreur lors de l'initialisation du paiement");
            setIsLoading(null);
        }
    };

    const handleSubscribe = async (plan: Plan) => {
        if (!billingPhone) {
            setPendingPlan(plan);
            setShowPhoneModal(true);
            return;
        }
        setIsSubscribing(plan.id);
        try {
            const result = await createSubscription(plan.id, billingPhone);
            if (result.paymentUrl) {
                window.location.assign(result.paymentUrl);
            } else {
                toast.success("Abonnement créé. En attente de confirmation.");
            }
        } catch (err: any) {
            toast.error(err?.message || "Erreur lors de la souscription");
        } finally {
            setIsSubscribing(null);
        }
    };

    const confirmSubscription = async () => {
        if (!pendingPlan) return;
        if (!billingPhone) {
            toast.error("Numéro requis pour la facturation.");
            return;
        }
        setShowPhoneModal(false);
        await handleSubscribe(pendingPlan);
        setPendingPlan(null);
    };

    if (isPlansLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="tech-border bg-black/40 border-primary/20 p-6 flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-primary/20 border-t-primary animate-spin" />
                    <span className="text-xs font-mono text-foreground/50 uppercase tracking-widest">CHARGEMENT</span>
                </div>
            </div>
        );
    }

    const activePlans = plans.filter((plan) => plan.isActive);
    const subscriptionPlans = activePlans.filter(
        (plan) => plan.type === "subscription" && plan.id !== "free" && plan.interval === billingInterval
    );
    const creditPacks = activePlans.filter((plan) => plan.type === "pack");
    const hasYearlyPlans = activePlans.some(
        (plan) => plan.type === "subscription" && plan.interval === "year"
    );

    return (
        <div className="space-y-8">
            <div className="tech-border bg-black/40 border-primary/20 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <CreditCard size={20} className="text-primary animate-pulse" />
                    <span className="text-xs font-mono text-primary/80 uppercase tracking-widest">PAYMENT_CENTER</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-mono uppercase">Billing_System</h1>
                <p className="text-foreground/60 mt-1 font-mono text-xs">CREDIT_MANAGEMENT // INVOICE_TRACKING</p>
            </div>

            <div className="tech-border bg-black/40 border-primary/20 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Zap size={16} className="text-primary" />
                    <span className="text-xs font-mono text-primary/80 uppercase tracking-widest">PLAN_SUBSCRIPTION</span>
                </div>
                <div className="flex justify-center mb-6">
                    <div className="inline-flex bg-black/40 border border-border p-1">
                        <button
                            onClick={() => setBillingInterval('month')}
                            className={`px-6 py-2 text-xs font-black font-mono uppercase tracking-wider transition-all ${
                                billingInterval === 'month'
                                    ? 'bg-primary text-black'
                                    : 'text-foreground/60 hover:text-foreground'
                            }`}
                        >
                            Mensuel
                        </button>
                        <button
                            disabled={!hasYearlyPlans}
                            onClick={() => setBillingInterval('year')}
                            className={`px-6 py-2 text-xs font-black font-mono uppercase tracking-wider transition-all relative ${
                                billingInterval === 'year'
                                    ? 'bg-primary text-black'
                                    : 'text-foreground/60 hover:text-foreground'
                            }`}
                        >
                            Annuel
                            {hasYearlyPlans ? (
                                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-primary/30 border border-primary text-[8px] font-black font-mono uppercase">
                                    -20%
                                </span>
                            ) : null}
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subscriptionPlans.map((plan) => {
                        const displayPeriod = billingInterval === 'year' ? '/AN' : '/MOIS';

                        return (
                            <div
                                key={plan.id}
                                className={`tech-border bg-black/40 p-6 transition-all hover:border-primary/50 ${
                                    plan.id === 'growth' ? 'border-primary/40' : 'border-border/60'
                                }`}
                            >
                                {plan.id === 'growth' && (
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary/10 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest font-mono">
                                        RECOMMENDED
                                    </div>
                                )}
                                <div className="flex items-center gap-2 mb-4 mt-2">
                                    <Zap size={16} className="text-primary animate-pulse" />
                                    <span className="text-[10px] font-mono text-foreground/50 uppercase tracking-widest">
                                        SUBSCRIPTION
                                    </span>
                                </div>
                                <h3 className="text-lg font-black text-foreground mb-2 font-mono uppercase tracking-wider">{plan.name}</h3>
                                <p className="text-xs text-foreground/60 font-mono uppercase tracking-wider mb-4">
                                    {plan.description}
                                </p>
                                <div className="flex items-end gap-1 mb-6">
                                    <span className="text-4xl font-black text-foreground font-mono">{plan.price.toLocaleString()}</span>
                                    <span className="text-sm font-bold text-foreground/40 mb-1 font-mono">{plan.currency}</span>
                                    <span className="text-[10px] text-foreground/40 mb-1 font-mono">{displayPeriod}</span>
                                </div>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-xs text-foreground/70 font-mono">
                                        <div className={`w-1 h-1 ${plan.id === 'growth' ? 'bg-primary animate-pulse' : 'bg-foreground/40'}`} />
                                        <span>{plan.credits.toLocaleString()}_EXTRACTION_CREDITS</span>
                                    </div>
                                    {plan.features.slice(0, 3).map((feature, idx) => (
                                        <div key={`${plan.id}-${idx}`} className="flex items-center gap-2 text-[10px] text-foreground/60 font-mono">
                                            <div className={`w-1 h-1 ${plan.id === 'growth' ? 'bg-primary animate-pulse' : 'bg-foreground/40'}`} />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={!!isSubscribing}
                                    className="w-full py-3 text-sm font-black flex items-center justify-center gap-2 transition-all font-mono uppercase tracking-wider border bg-primary/10 border-primary text-primary hover:bg-primary/20 disabled:opacity-50"
                                >
                                    {isSubscribing === plan.id ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            PROCESSING
                                        </>
                                    ) : (
                                        <>
                                            UPGRADE
                                            <ArrowRight size={14} />
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="tech-border bg-black/40 border-primary/20 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard size={16} className="text-primary" />
                    <span className="text-xs font-mono text-primary/80 uppercase tracking-widest">CREDIT_TOPUP</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {creditPacks.map((pack) => (
                        <div 
                            key={pack.id} 
                            className="tech-border bg-black/40 p-6 transition-all hover:border-primary/50 border-border/60"
                        >
                            <div className="flex items-center gap-2 mb-4 mt-2">
                                <Zap size={16} className="text-foreground/60" />
                                <span className="text-[10px] font-mono text-foreground/50 uppercase tracking-widest">
                                    ONE_TIME
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-foreground mb-4 font-mono uppercase tracking-wider">{pack.name.replace(/ /g, "_")}</h3>
                            <div className="flex items-end gap-1 mb-6">
                                <span className="text-4xl font-black text-foreground font-mono">{pack.price.toLocaleString()}</span>
                                <span className="text-sm font-bold text-foreground/40 mb-1 font-mono">{pack.currency}</span>
                            </div>
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-xs text-foreground/70 font-mono">
                                    <div className="w-1 h-1 bg-foreground/40" />
                                    <span>{pack.credits}_EXTRACTION_CREDITS</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handlePurchase(pack)}
                                disabled={!!isLoading}
                                className="w-full py-3 text-sm font-black flex items-center justify-center gap-2 transition-all font-mono uppercase tracking-wider border bg-transparent border-border text-foreground hover:border-foreground/40 hover:bg-foreground/5"
                            >
                                {isLoading === pack.id ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        PROCESSING
                                    </>
                                ) : (
                                    <>
                                        INITIALIZE
                                        <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="tech-border bg-primary/5 border-primary/20 p-6 flex items-start gap-4">
                <div className="p-3 bg-primary/10 border border-primary/30 text-primary">
                    <Shield size={24} className="animate-pulse" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-black text-primary font-mono uppercase tracking-wider">SECURE_PAYMENT_GATEWAY</h3>
                        <div className="h-1 flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
                    </div>
                    <p className="text-xs text-foreground/70 leading-relaxed max-w-2xl font-mono">
                        <span className="text-primary font-bold">[DEXPAY_INTEGRATION]</span> MOBILE_MONEY // WAVE // ORANGE_MONEY // FREE_MONEY // BANK_CARDS
                        <br />
                        <span className="text-foreground/50 mt-2 block">TRANSACTIONS_ENCRYPTED // SECURE_TUNNEL_ACTIVE</span>
                    </p>
                </div>
            </div>

            {showPhoneModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="tech-border bg-black border-primary/30 max-w-md w-full p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-black text-foreground font-mono uppercase tracking-wider">
                                Numéro de facturation
                            </h2>
                            <button
                                onClick={() => {
                                    setShowPhoneModal(false);
                                    setPendingPlan(null);
                                }}
                                className="p-2 text-foreground/60 hover:text-foreground hover:bg-white/10 rounded transition-colors"
                            >
                                X
                            </button>
                        </div>
                        <div>
                            <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                                Téléphone
                            </label>
                            <input
                                value={billingPhone}
                                onChange={(e) => setBillingPhone(e.target.value)}
                                placeholder="+221771234567"
                                className="w-full border border-border bg-black/40 text-foreground px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary"
                            />
                            {user?.phone ? (
                                <p className="mt-2 text-[10px] text-foreground/50 font-mono">Enregistré dans votre profil</p>
                            ) : (
                                <p className="mt-2 text-[10px] text-foreground/50 font-mono">Requis pour la facturation DexPay</p>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowPhoneModal(false);
                                    setPendingPlan(null);
                                }}
                                className="flex-1 tech-border bg-black/40 border-border/40 px-4 py-3 text-xs font-bold font-mono uppercase tracking-wider text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmSubscription}
                                className="flex-1 tech-border bg-primary/10 border-primary px-4 py-3 text-xs font-bold font-mono uppercase tracking-wider text-primary hover:bg-primary/20 transition-colors"
                            >
                                Continuer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
