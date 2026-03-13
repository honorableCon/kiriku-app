"use client";

import { useEffect, useState } from "react";
import { CreditCard, Plus, Check, X, TrendingUp, TrendingDown, Zap, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getPlans, createPlan, updatePlanStatus, syncPlanWithDexpay, updatePlan, deletePlan } from "@/lib/resources-ext";
import type { Plan } from "@/types";

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlan, setNewPlan] = useState<Plan>({
    id: "",
    name: "",
    description: "",
    price: 0,
    currency: "XAF",
    interval: "month",
    credits: 0,
    features: [],
    isActive: true,
    type: "subscription",
    quotas: {
      monthly: 0,
      daily: 0,
      concurrent: 0,
    },
    creditCost: 0,
  });
  const [featureInput, setFeatureInput] = useState("");
  const [editFeatureInput, setEditFeatureInput] = useState("");

  const fetchPlans = async () => {
    try {
      const fetchedPlans = await getPlans();
      setPlans(fetchedPlans || []);
    } catch (error) {
      toast.error("Erreur lors du chargement des plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleToggleActive = async (planId: string, currentStatus: boolean) => {
    try {
      await updatePlanStatus(planId, !currentStatus);
      toast.success("Plan mis à jour avec succès");
      fetchPlans();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du plan");
    }
  };

  const handleSyncDexpay = async (planId: string, currentId?: string) => {
    const dexpayProductId = window.prompt("DexPay Product ID", currentId || "");
    if (!dexpayProductId) return;
    try {
      await syncPlanWithDexpay(planId, dexpayProductId);
      toast.success("Plan synchronisé avec DexPay");
      fetchPlans();
    } catch (error) {
      toast.error("Erreur lors de la synchronisation DexPay");
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setNewPlan(prev => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };

  const handleAddEditFeature = () => {
    if (!editingPlan) return;
    if (editFeatureInput.trim()) {
      setEditingPlan({
        ...editingPlan,
        features: [...(editingPlan.features || []), editFeatureInput.trim()],
      });
      setEditFeatureInput("");
    }
  };

  const handleRemoveEditFeature = (index: number) => {
    if (!editingPlan) return;
    setEditingPlan({
      ...editingPlan,
      features: editingPlan.features?.filter((_, i) => i !== index) || [],
    });
  };

  const handleRemoveFeature = (index: number) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index)
    }));
  };

  const handleCreatePlan = async () => {
    try {
      await createPlan({
        name: newPlan.name ?? "",
        description: newPlan.description ?? "",
        amount: newPlan.price ?? 0,
        currency: newPlan.currency ?? "XAF",
        interval: (newPlan.interval as "month" | "year" | "one_time") ?? "month",
        credits: newPlan.credits ?? 0,
        features: newPlan.features ?? [],
        type: newPlan.type ?? "subscription",
        quotas: newPlan.quotas,
        creditCost: newPlan.creditCost ?? 0,
      });

      toast.success("Plan créé avec succès");
      setShowAddModal(false);
      setNewPlan({
        id: "",
        name: "",
        description: "",
        price: 0,
        currency: "XAF",
        interval: "month",
        credits: 0,
        features: [],
        isActive: true,
        type: "subscription",
        quotas: {
          monthly: 0,
          daily: 0,
          concurrent: 0,
        },
        creditCost: 0,
      });
      fetchPlans();
    } catch (error) {
      toast.error("Erreur lors de la création du plan");
    }
  };

  const handleUpdatePlan = async () => {
    if (!editingPlan) return;
    try {
      await updatePlan(editingPlan.id, {
        name: editingPlan.name,
        description: editingPlan.description,
        amount: editingPlan.price,
        currency: editingPlan.currency,
        interval: editingPlan.interval as "month" | "year" | "one_time",
        credits: editingPlan.credits,
        features: editingPlan.features,
        type: editingPlan.type,
        quotas: editingPlan.quotas,
        creditCost: editingPlan.creditCost,
      });
      toast.success("Plan mis à jour");
      setEditingPlan(null);
      fetchPlans();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du plan");
    }
  };

  const handleDeletePlan = async (planId: string, planName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement le plan "${planName}" ? Cette action est irréversible.`)) {
      return;
    }
    
    try {
      await deletePlan(planId);
      toast.success("Plan supprimé avec succès");
      fetchPlans();
    } catch (error) {
      toast.error("Erreur lors de la suppression du plan");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="tech-border bg-black/40 border-primary/20 p-6 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary/20 border-t-primary animate-spin" />
          <span className="text-xs font-mono text-foreground/50 uppercase tracking-widest">CHARGEMENT</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-widest text-foreground font-mono uppercase">
            Plans de Facturation
          </h1>
          <p className="text-xs text-foreground/50 font-mono uppercase tracking-wider mt-1">
            Gestion des plans d'abonnement et tarifs
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="tech-border bg-primary/10 border-primary text-primary px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider hover:bg-primary/20 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Ajouter un plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "tech-border border transition-all duration-300 relative overflow-hidden group",
              plan.isActive
                ? "bg-black/40 border-primary/30 hover:border-primary/60"
                : "bg-black/20 border-border/30 hover:border-border/50"
            )}
          >
            {!plan.isActive && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                <div className="text-center">
                  <X size={32} className="text-foreground/40 mx-auto mb-2" />
                  <span className="text-xs font-mono text-foreground/40 uppercase tracking-wider">
                    Plan désactivé
                  </span>
                </div>
              </div>
            )}

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 flex items-center justify-center",
                    plan.isActive ? "bg-primary/10" : "bg-border/10"
                  )}>
                    <CreditCard size={20} className={plan.isActive ? "text-primary" : "text-foreground/40"} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-foreground font-mono uppercase tracking-wider">
                      {plan.name}
                    </h3>
                    <p className="text-[10px] text-foreground/40 font-mono uppercase tracking-wider">
                      {plan.interval === "month" ? "MENSUEL" : "ANNUEL"}
                    </p>
                  </div>
                </div>
                {/* Bouton de toggle placé avec un z-index plus élevé pour être accessible même quand le plan est désactivé */}
                <div className="flex items-center gap-1 relative z-20">
                  <button
                    onClick={() => handleToggleActive(plan.id, plan.isActive)}
                    className={cn(
                      "w-8 h-4 transition-all relative rounded-full",
                      plan.isActive ? "bg-primary" : "bg-border/60"
                    )}
                  >
                    <div className={cn(
                      "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
                      plan.isActive ? "left-4.5" : "left-0.5"
                    )} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-foreground font-mono">
                    {plan.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-foreground/60 font-mono">{plan.currency}</span>
                  <span className="text-[10px] text-foreground/40 font-mono">
                    /{plan.interval === "month" ? "mois" : "an"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={12} className="text-primary" />
                  <span className="text-xs text-foreground/60 font-mono">
                    {plan.credits.toLocaleString()} crédits
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-foreground/40 font-mono uppercase tracking-wider mb-2">
                  Fonctionnalités
                </p>
                {plan.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check size={10} className={cn("mt-0.5 shrink-0", plan.isActive ? "text-primary" : "text-foreground/30")} />
                    <span className="text-[10px] text-foreground/60 font-mono">{feature}</span>
                  </div>
                ))}
                {plan.features.length > 3 && (
                  <p className="text-[10px] text-foreground/40 font-mono pl-4">
                    +{plan.features.length - 3} autres fonctionnalités
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] font-mono">
                  {plan.price > 5000 ? (
                    <TrendingUp size={12} className="text-green-500" />
                  ) : (
                    <TrendingDown size={12} className="text-blue-500" />
                  )}
                  <span className={cn(
                    "uppercase tracking-wider",
                    plan.price > 5000 ? "text-green-500" : "text-blue-500"
                  )}>
                    {plan.price > 5000 ? "PRO" : "ENTRÉE DE GAMME"}
                  </span>
                </div>
                {plan.type !== "pack" ? (
                  <button
                    onClick={() => handleSyncDexpay(plan.id, plan.dexpayProductId)}
                    className="text-[10px] text-primary/80 hover:text-primary font-mono uppercase tracking-wider"
                  >
                    SYNC_DEXPAY
                  </button>
                ) : null}
              </div>
              <div className="pt-3 text-[10px] text-foreground/50 font-mono">
                TYPE: {plan.type || "subscription"} • DEXPAY_ID: {plan.dexpayProductId || "—"}
              </div>
              <div className="pt-2 text-[10px] text-foreground/50 font-mono">
                QUOTA: {plan.quotas?.monthly ?? 0}/mois • {plan.quotas?.daily ?? 0}/jour • {plan.quotas?.concurrent ?? 0} conc.
              </div>
              <div className="pt-1 text-[10px] text-foreground/50 font-mono">
                CREDIT_COST: {plan.creditCost ?? 0}
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  onClick={() => setEditingPlan(plan)}
                  className="text-[10px] text-foreground/70 hover:text-foreground font-mono uppercase tracking-wider flex items-center gap-1"
                >
                  <Edit size={12} /> EDIT
                </button>
                <button
                  onClick={() => handleDeletePlan(plan.id, plan.name)}
                  className="text-[10px] text-red-500/70 hover:text-red-500 font-mono uppercase tracking-wider flex items-center gap-1"
                >
                  <Trash2 size={12} /> SUPPRIMER
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="tech-border bg-black border-primary/30 max-w-lg w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-foreground font-mono uppercase tracking-wider">
                Modifier Plan
              </h2>
              <button
                onClick={() => setEditingPlan(null)}
                className="p-2 text-foreground/60 hover:text-foreground hover:bg-white/10 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                  Nom du plan
                </label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground placeholder-foreground/30 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                  Description
                </label>
                <textarea
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  className="w-full tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground placeholder-foreground/30 focus:border-primary focus:outline-none resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                  Fonctionnalités
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editFeatureInput}
                      onChange={(e) => setEditFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddEditFeature()}
                      className="flex-1 tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground placeholder-foreground/30 focus:border-primary focus:outline-none"
                      placeholder="Ajouter une fonctionnalité"
                    />
                    <button
                      onClick={handleAddEditFeature}
                      className="tech-border bg-primary/10 border-primary text-primary px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider hover:bg-primary/20 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {editingPlan.features?.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between tech-border bg-black/20 border-border/20 px-3 py-2">
                        <span className="text-[10px] text-foreground/60 font-mono">{feature}</span>
                        <button
                          onClick={() => handleRemoveEditFeature(index)}
                          className="text-foreground/40 hover:text-red-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                    Prix
                  </label>
                  <input
                    type="number"
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: parseInt(e.target.value) || 0 })}
                    className="w-full tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground placeholder-foreground/30 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                    Crédits
                  </label>
                  <input
                    type="number"
                    value={editingPlan.credits}
                    onChange={(e) => setEditingPlan({ ...editingPlan, credits: parseInt(e.target.value) || 0 })}
                    className="w-full tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground placeholder-foreground/30 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                    Devise
                  </label>
                  <select
                    value={editingPlan.currency}
                    onChange={(e) => setEditingPlan({ ...editingPlan, currency: e.target.value })}
                    className="w-full tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="XAF">XAF</option>
                    <option value="XOF">XOF</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                    Type
                  </label>
                  <select
                    value={editingPlan.type || "subscription"}
                    onChange={(e) => setEditingPlan({ ...editingPlan, type: e.target.value as "subscription" | "pack" })}
                    className="w-full tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="subscription">Subscription</option>
                    <option value="pack">Pack</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                  Périodicité
                </label>
                <select
                  value={editingPlan.interval}
                  onChange={(e) => setEditingPlan({ ...editingPlan, interval: e.target.value as "month" | "year" | "one_time" })}
                  className="w-full tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="month">Mensuel</option>
                  <option value="year">Annuel</option>
                  <option value="one_time">One-time</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                    Quota/mois
                  </label>
                  <input
                    type="number"
                    value={editingPlan.quotas?.monthly ?? 0}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        quotas: {
                          monthly: parseInt(e.target.value) || 0,
                          daily: editingPlan.quotas?.daily ?? 0,
                          concurrent: editingPlan.quotas?.concurrent ?? 0,
                        },
                      })
                    }
                    className="w-full tech-border bg-black/40 border-border/40 px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                    Quota/jour
                  </label>
                  <input
                    type="number"
                    value={editingPlan.quotas?.daily ?? 0}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        quotas: {
                          monthly: editingPlan.quotas?.monthly ?? 0,
                          daily: parseInt(e.target.value) || 0,
                          concurrent: editingPlan.quotas?.concurrent ?? 0,
                        },
                      })
                    }
                    className="w-full tech-border bg-black/40 border-border/40 px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                    Concurrent
                  </label>
                  <input
                    type="number"
                    value={editingPlan.quotas?.concurrent ?? 0}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        quotas: {
                          monthly: editingPlan.quotas?.monthly ?? 0,
                          daily: editingPlan.quotas?.daily ?? 0,
                          concurrent: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full tech-border bg-black/40 border-border/40 px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                  Credit cost
                </label>
                <input
                  type="number"
                  value={editingPlan.creditCost ?? 0}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      creditCost: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-primary/10">
              <button
                onClick={() => setEditingPlan(null)}
                className="flex-1 tech-border bg-black/40 border-border/40 px-4 py-3 text-xs font-bold font-mono uppercase tracking-wider text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdatePlan}
                className="flex-1 tech-border bg-primary/10 border-primary px-4 py-3 text-xs font-bold font-mono uppercase tracking-wider text-primary hover:bg-primary/20 transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="tech-border bg-black border-primary/30 max-w-lg w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-foreground font-mono uppercase tracking-wider">
                Nouveau Plan
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-foreground/60 hover:text-foreground hover:bg-white/10 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                  Nom du plan
                </label>
                <input
                  type="text"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className="w-full tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground placeholder-foreground/30 focus:border-primary focus:outline-none"
                  placeholder="Ex: Starter"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                  Description
                </label>
                <textarea
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  className="w-full tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground placeholder-foreground/30 focus:border-primary focus:outline-none resize-none"
                  rows={2}
                  placeholder="Description du plan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                    Prix
                  </label>
                  <input
                    type="number"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: parseInt(e.target.value) || 0 })}
                    className="w-full tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground placeholder-foreground/30 focus:border-primary focus:outline-none"
                    placeholder="2000"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                    Crédits
                  </label>
                  <input
                    type="number"
                    value={newPlan.credits}
                    onChange={(e) => setNewPlan({ ...newPlan, credits: parseInt(e.target.value) || 0 })}
                    className="w-full tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground placeholder-foreground/30 focus:border-primary focus:outline-none"
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                    Devise
                  </label>
                  <select
                    value={newPlan.currency}
                    onChange={(e) => setNewPlan({ ...newPlan, currency: e.target.value })}
                    className="w-full tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="XAF">XAF</option>
                    <option value="XOF">XOF</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                    Périodicité
                  </label>
                  <select
                    value={newPlan.interval}
                    onChange={(e) => setNewPlan({ ...newPlan, interval: e.target.value as "month" | "year" | "one_time" })}
                    className="w-full tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="month">Mensuel</option>
                    <option value="year">Annuel</option>
                    <option value="one_time">One-time</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                    Type
                  </label>
                  <select
                    value={newPlan.type || "subscription"}
                    onChange={(e) => setNewPlan({ ...newPlan, type: e.target.value as "subscription" | "pack" })}
                    className="w-full tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="subscription">Subscription</option>
                    <option value="pack">Pack</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                    Credit cost
                  </label>
                  <input
                    type="number"
                    value={newPlan.creditCost ?? 0}
                    onChange={(e) => setNewPlan({ ...newPlan, creditCost: Number(e.target.value) || 0 })}
                    className="w-full tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                    Quota/mois
                  </label>
                  <input
                    type="number"
                    value={newPlan.quotas?.monthly ?? 0}
                    onChange={(e) =>
                      setNewPlan({
                        ...newPlan,
                        quotas: {
                          monthly: parseInt(e.target.value) || 0,
                          daily: newPlan.quotas?.daily ?? 0,
                          concurrent: newPlan.quotas?.concurrent ?? 0,
                        },
                      })
                    }
                    className="w-full tech-border bg-black/40 border-border/40 px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                    Quota/jour
                  </label>
                  <input
                    type="number"
                    value={newPlan.quotas?.daily ?? 0}
                    onChange={(e) =>
                      setNewPlan({
                        ...newPlan,
                        quotas: {
                          monthly: newPlan.quotas?.monthly ?? 0,
                          daily: parseInt(e.target.value) || 0,
                          concurrent: newPlan.quotas?.concurrent ?? 0,
                        },
                      })
                    }
                    className="w-full tech-border bg-black/40 border-border/40 px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                    Concurrent
                  </label>
                  <input
                    type="number"
                    value={newPlan.quotas?.concurrent ?? 0}
                    onChange={(e) =>
                      setNewPlan({
                        ...newPlan,
                        quotas: {
                          monthly: newPlan.quotas?.monthly ?? 0,
                          daily: newPlan.quotas?.daily ?? 0,
                          concurrent: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full tech-border bg-black/40 border-border/40 px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider block mb-2">
                  Fonctionnalités
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddFeature()}
                      className="flex-1 tech-border bg-black/40 border-border/40 px-4 py-2 text-xs font-mono text-foreground placeholder-foreground/30 focus:border-primary focus:outline-none"
                      placeholder="Ajouter une fonctionnalité"
                    />
                    <button
                      onClick={handleAddFeature}
                      className="tech-border bg-primary/10 border-primary text-primary px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider hover:bg-primary/20 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {newPlan.features?.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between tech-border bg-black/20 border-border/20 px-3 py-2">
                        <span className="text-[10px] text-foreground/60 font-mono">{feature}</span>
                        <button
                          onClick={() => handleRemoveFeature(index)}
                          className="text-foreground/40 hover:text-red-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-primary/10">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 tech-border bg-black/40 border-border/40 px-4 py-3 text-xs font-bold font-mono uppercase tracking-wider text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreatePlan}
                className="flex-1 tech-border bg-primary/10 border-primary px-4 py-3 text-xs font-bold font-mono uppercase tracking-wider text-primary hover:bg-primary/20 transition-colors"
              >
                Créer le plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
