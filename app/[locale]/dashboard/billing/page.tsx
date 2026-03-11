"use client";

import { useState } from "react";
import { CreditCard, Check, Shield, Zap, Loader2, ArrowRight } from "lucide-react";
import { createCheckoutSession } from "@/lib/resources";
import { toast } from "sonner";

const PLANS = [
    {
        name: "Pack Découverte",
        credits: 100,
        price: 5000,
        currency: "XOF",
        popular: false,
    },
    {
        name: "Pack Growth",
        credits: 500,
        price: 20000,
        currency: "XOF",
        popular: true,
    },
    {
        name: "Pack Business",
        credits: 1500,
        price: 50000,
        currency: "XOF",
        popular: false,
    },
];

export default function BillingPage() {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handlePurchase = async (plan: typeof PLANS[0]) => {
        setIsLoading(plan.name);
        try {
            const { paymentUrl } = await createCheckoutSession(
                plan.price,
                plan.credits,
                plan.name
            );
            window.location.assign(paymentUrl);
        } catch (err) {
            toast.error("Erreur lors de l'initialisation du paiement");
            setIsLoading(null);
        }
    };

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PLANS.map((plan) => (
                    <div 
                        key={plan.name} 
                        className={`tech-border bg-black/40 p-6 transition-all hover:border-primary/50 ${
                            plan.popular ? 'border-primary/40' : 'border-border/60'
                        }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary/10 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest font-mono">
                                RECOMMENDED
                            </div>
                        )}
                        <div className="flex items-center gap-2 mb-4 mt-2">
                            <Zap size={16} className={plan.popular ? "text-primary animate-pulse" : "text-foreground/60"} />
                            <span className="text-[10px] font-mono text-foreground/50 uppercase tracking-widest">
                                {plan.popular ? "PREMIUM_TIER" : "STANDARD_TIER"}
                            </span>
                        </div>
                        <h3 className="text-lg font-black text-foreground mb-4 font-mono uppercase tracking-wider">{plan.name.replace(/ /g, "_")}</h3>
                        <div className="flex items-end gap-1 mb-6">
                            <span className="text-4xl font-black text-foreground font-mono">{plan.price.toLocaleString()}</span>
                            <span className="text-sm font-bold text-foreground/40 mb-1 font-mono">{plan.currency}</span>
                        </div>
                        
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-xs text-foreground/70 font-mono">
                                <div className={`w-1 h-1 ${plan.popular ? 'bg-primary animate-pulse' : 'bg-foreground/40'}`} />
                                <span>{plan.credits}_EXTRACTION_CREDITS</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-foreground/70 font-mono">
                                <div className={`w-1 h-1 ${plan.popular ? 'bg-primary animate-pulse' : 'bg-foreground/40'}`} />
                                <span>PRIORITY_SUPPORT_ACCESS</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-foreground/70 font-mono">
                                <div className={`w-1 h-1 ${plan.popular ? 'bg-primary animate-pulse' : 'bg-foreground/40'}`} />
                                <span>FULL_API_ACCESS_GRANTED</span>
                            </div>
                        </div>

                        <button
                            onClick={() => handlePurchase(plan)}
                            disabled={!!isLoading}
                            className={`w-full py-3 text-sm font-black flex items-center justify-center gap-2 transition-all font-mono uppercase tracking-wider border ${
                                plan.popular 
                                    ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20' 
                                    : 'bg-transparent border-border text-foreground hover:border-foreground/40 hover:bg-foreground/5'
                            }`}
                        >
                            {isLoading === plan.name ? (
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
        </div>
    );
}
