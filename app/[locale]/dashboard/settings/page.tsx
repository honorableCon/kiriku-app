"use client";

import { useEffect, useState } from "react";
import { Settings, User, Bell, Lock, Globe, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentUser, updateUser, updateNotifications } from "@/lib/resources";
import type { User as UserType } from "@/types";
import { toast } from "sonner";

type Tab = "general" | "security" | "notifications" | "region";

export default function SettingsPage() {
    const [user, setUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("general");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        organization: "",
    });
    const [notificationPrefs, setNotificationPrefs] = useState({
        extractionEmails: false,
        billingAlerts: true,
        productNewsletter: false,
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
                setFormData({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    organization: userData.organization || "",
                });
                setNotificationPrefs({
                    extractionEmails: userData.notifications?.extractionEmails ?? false,
                    billingAlerts: userData.notifications?.billingAlerts ?? true,
                    productNewsletter: userData.notifications?.productNewsletter ?? false,
                });
            } catch (err) {
                toast.error("Erreur lors du chargement du profil");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const updated = await updateUser({
                firstName: formData.firstName,
                lastName: formData.lastName,
                organization: formData.organization,
            });
            setUser(updated);
            setFormData((prev) => ({
                ...prev,
                firstName: updated.firstName,
                lastName: updated.lastName,
                organization: updated.organization || "",
            }));
            toast.success("Profil mis à jour");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erreur lors de la sauvegarde");
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleNotification = async (key: keyof typeof notificationPrefs) => {
        const next = { ...notificationPrefs, [key]: !notificationPrefs[key] };
        setNotificationPrefs(next);
        try {
            const updated = await updateNotifications(next);
            setUser((prev) => prev ? { ...prev, notifications: updated.notifications } : prev);
            toast.success("Notifications mises à jour");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
            setNotificationPrefs(notificationPrefs);
        }
    };

    const tabs = [
        { id: "general" as Tab, label: "Général", icon: User },
        { id: "security" as Tab, label: "Sécurité", icon: Lock },
        { id: "notifications" as Tab, label: "Notifications", icon: Bell },
        { id: "region" as Tab, label: "Région & Langue", icon: Globe },
    ];

    return (
        <div className="space-y-10 max-w-4xl">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs font-mono text-primary/60 tracking-widest uppercase">System_Settings</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-foreground font-mono">CONFIGURATION_PANEL</h1>
                <p className="text-foreground/50 mt-2 font-mono text-xs tracking-wide">ACCOUNT_PREFERENCES_MANAGEMENT</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <aside className="w-full md:w-64 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all border-l-2 font-mono",
                                activeTab === tab.id
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border text-foreground/60 hover:border-primary/50 hover:bg-primary/5"
                            )}
                        >
                            <tab.icon size={16} />
                            <span className="uppercase tracking-wider">{tab.label}</span>
                        </button>
                    ))}
                </aside>

                <main className="flex-1 space-y-6">
                    {activeTab === "general" && (
                        <div className="tech-border bg-black/40 p-6">
                            <h3 className="text-lg font-black text-foreground mb-6 font-mono uppercase tracking-wider">ORGANIZATION_PROFILE</h3>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono">FIRST_NAME</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full px-4 py-3 bg-black/60 border border-border text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono">LAST_NAME</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full px-4 py-3 bg-black/60 border border-border text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono">PROFESSIONAL_EMAIL [READ_ONLY]</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled
                                        className="w-full px-4 py-3 bg-black/40 border border-border/50 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all disabled:opacity-50 font-mono text-foreground/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono">ORGANIZATION_NAME</label>
                                    <input
                                        type="text"
                                        value={formData.organization}
                                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/60 border border-border text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all font-mono"
                                    />
                                </div>
                                <div className="mt-8 pt-6 border-t border-border flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-black font-bold font-mono text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                                    >
                                        <Save size={16} /> SAVE_CHANGES
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="tech-border bg-black/40 p-6">
                            <h3 className="text-lg font-black text-foreground mb-6 font-mono uppercase tracking-wider">ACCOUNT_SECURITY</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-border/50 hover:border-primary/50 transition-all">
                                    <div>
                                        <p className="text-sm font-bold text-foreground font-mono uppercase">PASSWORD</p>
                                        <p className="text-xs text-foreground/50 font-mono">LAST_UPDATE: 30_DAYS_AGO</p>
                                    </div>
                                    <button className="px-4 py-2 border border-border hover:border-primary hover:bg-primary hover:text-black text-xs font-bold font-mono uppercase tracking-wider transition-all">
                                        CHANGE
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-border/50 hover:border-primary/50 transition-all">
                                    <div>
                                        <p className="text-sm font-bold text-foreground font-mono uppercase">TWO_FACTOR_AUTH</p>
                                        <p className="text-xs text-foreground/50 font-mono">
                                            STATUS: {user?.twoFactorEnabled ? "ENABLED" : "DISABLED"}
                                        </p>
                                    </div>
                                    <button className="px-4 py-2 border border-border hover:border-primary hover:bg-primary hover:text-black text-xs font-bold font-mono uppercase tracking-wider transition-all">
                                        {user?.twoFactorEnabled ? "DISABLE" : "ENABLE"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "notifications" && (
                        <div className="tech-border bg-black/40 p-6">
                            <h3 className="text-lg font-black text-foreground mb-6 font-mono uppercase tracking-wider">NOTIFICATION_PREFERENCES</h3>
                            <div className="space-y-4">
                                {[
                                    { key: "extractionEmails", label: "EXTRACTION_EMAILS", desc: "Receive email on each completed extraction" },
                                    { key: "billingAlerts", label: "BILLING_ALERTS", desc: "Notifications on credit usage" },
                                    { key: "productNewsletter", label: "PRODUCT_NEWSLETTER", desc: "Latest features and updates" },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-4 border border-border/50 hover:border-primary/50 transition-all">
                                        <div>
                                            <p className="text-sm font-bold text-foreground font-mono uppercase">{item.label}</p>
                                            <p className="text-xs text-foreground/50 font-mono">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggleNotification(item.key as keyof typeof notificationPrefs)}
                                            className={cn(
                                                "w-12 h-6 border relative transition-colors",
                                                notificationPrefs[item.key as keyof typeof notificationPrefs]
                                                    ? "bg-primary border-primary"
                                                    : "bg-black/40 border-border"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "absolute top-1 w-4 h-4 bg-black rounded-full transition-transform",
                                                    notificationPrefs[item.key as keyof typeof notificationPrefs]
                                                        ? "right-1"
                                                        : "left-1"
                                                )}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "region" && (
                        <div className="tech-border bg-black/40 p-6">
                            <h3 className="text-lg font-black text-foreground mb-6 font-mono uppercase tracking-wider">REGION_AND_LANGUAGE</h3>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono">COUNTRY_REGION</label>
                                    <select
                                        defaultValue={user?.country || "SN"}
                                        className="w-full px-4 py-3 bg-black/60 border border-border text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all font-mono"
                                    >
                                        <option value="SN">SENEGAL</option>
                                        <option value="CI">CÔTE_D'IVOIRE</option>
                                        <option value="ML">MALI</option>
                                        <option value="BF">BURKINA_FASO</option>
                                        <option value="NE">NIGER</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono">LANGUAGE</label>
                                    <select
                                        defaultValue="fr"
                                        className="w-full px-4 py-3 bg-black/60 border border-border text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all font-mono"
                                    >
                                        <option value="fr">FRANÇAIS</option>
                                        <option value="en">ENGLISH</option>
                                        <option value="wo">WOLOF</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono">TIMEZONE</label>
                                    <select
                                        defaultValue="Africa/Dakar"
                                        className="w-full px-4 py-3 bg-black/60 border border-border text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all font-mono"
                                    >
                                        <option value="Africa/Dakar">AFRICA/DAKAR (GMT)</option>
                                        <option value="Africa/Abidjan">AFRICA/ABIDJAN</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-border flex justify-end">
                                <button
                                    type="button"
                                    disabled
                                    className="flex items-center gap-2 px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-black font-bold font-mono text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                                >
                                    <Save size={16} /> SAVE_CHANGES
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="tech-border bg-red-500/5 border-red-500/20 p-6">
                        <h3 className="text-lg font-black text-red-500 mb-2 font-mono uppercase tracking-wider">DANGER_ZONE</h3>
                        <p className="text-sm text-foreground/50 mb-6 font-mono">
                            ACCOUNT_DELETION_IS_IRREVERSIBLE. ALL_DATA_WILL_BE_PERMANENTLY_ERASED.
                        </p>
                        <button className="px-6 py-3 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-black font-bold font-mono text-xs uppercase tracking-wider transition-all">
                            DELETE_ACCOUNT
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
