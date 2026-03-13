"use client";

import { useEffect, useState } from "react";
import { CreditCard, Shield, Zap, Loader2, ArrowRight, Check, X, FileText } from "lucide-react";
import { createCheckoutSession, createSubscription, getCurrentUser, getPlans, getActiveSubscription, getInvoices, cancelSubscription } from "@/lib/resources";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import type { User, Plan, Subscription, Invoice } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function BillingPage() {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [isSubscribing, setIsSubscribing] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [billingPhone, setBillingPhone] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showAllInvoices, setShowAllInvoices] = useState(false);
    const [isPlansLoading, setIsPlansLoading] = useState(true);
    const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [pendingPlan, setPendingPlan] = useState<Plan | null>(null);
    const params = useSearchParams();

    const loadData = async () => {
        try {
            const [me, fetchedPlans, sub, invs] = await Promise.all([
                getCurrentUser(),
                getPlans(),
                getActiveSubscription(),
                getInvoices()
            ]);
            setUser(me);
            if (me.phone) setBillingPhone(me.phone);
            setPlans(fetchedPlans);
            setActiveSubscription(sub);
            setInvoices(invs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsPlansLoading(false);
        }
    };

    useEffect(() => {
        const status = params.get("status");
        if (status === "success") {
            toast.success("Paiement confirmé. Vos crédits seront ajoutés.");
            // Reload data to show updated credits/subscription
            loadData();
        } else if (status === "cancel") {
            toast.error("Paiement annulé.");
        }
    }, [params]);

    useEffect(() => {
        loadData();
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
                loadData();
            }
        } catch (err: any) {
            toast.error(err?.message || "Erreur lors de la souscription");
        } finally {
            setIsSubscribing(null);
        }
    };

    const handleCancelSubscription = async () => {
        if (!confirm("Êtes-vous sûr de vouloir annuler votre abonnement ? Vous conserverez vos avantages jusqu'à la fin de la période.")) return;
        
        setIsCancelling(true);
        try {
            await cancelSubscription();
            toast.success("Abonnement annulé. Il ne sera pas renouvelé.");
            loadData();
        } catch (err: any) {
            toast.error(err?.message || "Erreur lors de l'annulation");
        } finally {
            setIsCancelling(false);
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
        (plan) => plan.type === "subscription" && plan.interval === billingInterval
    );
    const creditPacks = activePlans.filter((plan) => plan.type === "pack");
    const hasYearlyPlans = activePlans.some(
        (plan) => plan.type === "subscription" && plan.interval === "year"
    );


    return (
        <div className="space-y-8 pb-12">
            <div className="tech-border bg-black/40 border-primary/20 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <CreditCard size={20} className="text-primary animate-pulse" />
                    <span className="text-xs font-mono text-primary/80 uppercase tracking-widest">PAYMENT_CENTER</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-mono uppercase">Billing_System</h1>
                <p className="text-foreground/60 mt-1 font-mono text-xs">CREDIT_MANAGEMENT // INVOICE_TRACKING</p>
            </div>

            <div className="tech-border bg-primary/10 border-primary/30 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/20 border border-primary/40 text-primary">
                            <Zap size={24} className="animate-pulse" />
                        </div>
                        <div>
                            <p className="text-[10px] font-mono text-foreground/50 uppercase tracking-widest">CURRENT_BALANCE</p>
                            <p className="text-3xl font-black text-foreground font-mono">{user?.credits?.toLocaleString() || 0} <span className="text-lg text-foreground/40">CREDITS</span></p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-mono text-foreground/50 uppercase tracking-widest">PLAN</p>
                        <p className="text-sm font-bold text-primary font-mono uppercase">{user?.plan || 'FREE'}</p>
                    </div>
                </div>
            </div>

            {/* Current Plan Highlight in Subscription Section */}
            {/* {user?.plan && (
                <div className="tech-border bg-primary/5 border-primary/40 p-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary animate-pulse rounded-full"></div>
                        <span className="text-xs font-mono text-primary uppercase tracking-widest">
                            PLAN ACTUEL
                        </span>
                    </div>
                    <p className="text-sm font-black text-foreground font-mono uppercase mt-1">
                        {user.plan.toUpperCase()}
                    </p>
                </div>
            )} */}

            {/* Invoices Section */}
            {invoices.length > 0 && (
                <div className="tech-border bg-black/40 border-primary/20 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-primary" />
                            <span className="text-xs font-mono text-primary/80 uppercase tracking-widest">FACTURES_RÉCENTES</span>
                        </div>
                        {!showAllInvoices && invoices.length > 3 && (
                            <button
                                onClick={() => setShowAllInvoices(true)}
                                className="text-[10px] text-primary/80 hover:text-primary font-mono uppercase tracking-wider"
                            >
                                VOIR TOUT
                            </button>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/50 text-[10px] text-foreground/50 font-mono uppercase tracking-widest">
                                    <th className="py-3 px-2">Reference</th>
                                    <th className="py-3 px-2">Date</th>
                                    <th className="py-3 px-2">Amount</th>
                                    <th className="py-3 px-2">Status</th>
                                    <th className="py-3 px-2 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(showAllInvoices ? invoices : invoices.slice(0, 3)).map((inv) => (
                                    <tr key={inv._id} className="border-b border-border/10 hover:bg-white/5 transition-colors text-xs font-mono">
                                        <td className="py-3 px-2 text-foreground/80">{inv.reference}</td>
                                        <td className="py-3 px-2 text-foreground/60">{format(new Date(inv.createdAt), 'dd MMM yyyy', { locale: fr })}</td>
                                        <td className="py-3 px-2 font-bold text-foreground">{inv.amount.toLocaleString()} {inv.currency}</td>
                                        <td className="py-3 px-2">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                inv.status === 'paid' ? 'text-green-500 bg-green-500/10' :
                                                inv.status === 'pending' ? 'text-yellow-500 bg-yellow-500/10' :
                                                'text-red-500 bg-red-500/10'
                                            }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-right">
                                            {inv.status === 'pending' && inv.paymentUrl && (
                                                <a 
                                                    href={inv.paymentUrl}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-black text-[10px] font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                                                >
                                                    Payer <ArrowRight size={10} />
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

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
                        const isCurrentPlan = (activeSubscription?.planId === plan.id && activeSubscription?.status === 'active') || (user?.plan === plan.id && !activeSubscription);
                        const isFreePlan = plan.price === 0;

                        return (
                            <div
                                key={plan.id}
                                className={`tech-border bg-black/40 p-6 transition-all hover:border-primary/50 ${
                                    plan.id === 'growth' ? 'border-primary/40' : 'border-border/60'
                                } ${isCurrentPlan ? 'bg-primary/5 border-primary' : ''}`}
                            >
                                {plan.id === 'growth' && (
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary/10 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest font-mono">
                                        RECOMMENDED
                                    </div>
                                )}
                                <div className="flex items-center gap-2 mb-4 mt-2">
                                    <Zap size={16} className="text-primary animate-pulse" />
                                    <span className="text-[10px] font-mono text-foreground/50 uppercase tracking-widest">
                                        ABONNEMENT
                                    </span>
                                </div>
                                <h3 className="text-lg font-black text-foreground mb-2 font-mono uppercase tracking-wider">{plan.name}</h3>
                                <p className="text-xs text-foreground/60 mb-4">
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
                                        <span>{plan.credits.toLocaleString()} crédits d'extraction</span>
                                    </div>
                                    {plan.features.slice(0, 3).map((feature, idx) => (
                                        <div key={`${plan.id}-${idx}`} className="flex items-center gap-2 text-[10px] text-foreground/60">
                                            <div className={`w-1 h-1 ${plan.id === 'growth' ? 'bg-primary animate-pulse' : 'bg-foreground/40'}`} />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={!!isSubscribing || isCurrentPlan || isFreePlan}
                                    className={`w-full py-3 text-sm font-black flex items-center justify-center gap-2 transition-all font-mono uppercase tracking-wider border ${
                                        isCurrentPlan 
                                        ? 'bg-green-500/10 border-green-500 text-green-500 cursor-default' 
                                        : isFreePlan
                                        ? 'bg-gray-500/10 border-gray-500 text-gray-500 cursor-default'
                                        : 'bg-primary/10 border-primary text-primary hover:bg-primary/20 disabled:opacity-50'
                                    }`}
                                >
                                    {isCurrentPlan ? (
                                        <>
                                            <Check size={16} />
                                            ACTIF
                                        </>
                                    ) : isSubscribing === plan.id ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            TRAITEMENT
                                        </>
                                    ) : (
                                        <>
                                            {activeSubscription?.status === 'active' ? 'CHANGER' : 'S\'ABONNER'}
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
                                <X size={16} />
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
