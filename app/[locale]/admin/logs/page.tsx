"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldAlert, Activity, Loader2, FileText, CreditCard, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getAdminInvoices, getAdminTransactions } from "@/lib/resources-ext";

export default function AdminLogsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [invRes, trxRes] = await Promise.all([
                    getAdminInvoices({ limit: 20, offset: 0 }),
                    getAdminTransactions({ limit: 20, offset: 0 }),
                ]);
                setInvoices(invRes.data);
                setTransactions(trxRes.data);
            } catch {
                toast.error("Erreur lors du chargement des logs");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = useMemo(() => {
        const failedTrx = transactions.filter((t) => t.status === "failed");
        const pendingInv = invoices.filter((i) => i.status === "pending");
        return {
            failedTransactions: failedTrx.length,
            pendingInvoices: pendingInv.length,
            lastInvoice: invoices[0]?.createdAt ? new Date(invoices[0].createdAt) : null,
            lastTransaction: transactions[0]?.createdAt ? new Date(transactions[0].createdAt) : null,
        };
    }, [invoices, transactions]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white font-mono">SYSTEM_LOGS</h1>
                <p className="text-zinc-400 mt-1 font-mono text-xs">
                    EVENT_AUDIT_AND_MONITORING
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="tech-border bg-black/40 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 tech-border bg-primary/10 text-primary">
                            <ShieldAlert size={18} />
                        </div>
                        <h2 className="text-sm font-black text-white font-mono uppercase tracking-wider">OBSERVABILITY</h2>
                    </div>
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                            <Loader2 size={14} className="animate-spin" />
                            LOADING
                        </div>
                    ) : (
                        <div className="space-y-1 text-xs text-zinc-400 font-mono">
                            <div className="flex items-center justify-between">
                                <span>FAILED_TRANSACTIONS</span>
                                <span className={stats.failedTransactions > 0 ? "text-red-400" : "text-green-400"}>
                                    {stats.failedTransactions}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>PENDING_INVOICES</span>
                                <span className={stats.pendingInvoices > 0 ? "text-yellow-400" : "text-green-400"}>
                                    {stats.pendingInvoices}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-zinc-500">
                                <span>LAST_TRX</span>
                                <span>{stats.lastTransaction ? stats.lastTransaction.toLocaleString("fr-FR") : "—"}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-zinc-500">
                                <span>LAST_INV</span>
                                <span>{stats.lastInvoice ? stats.lastInvoice.toLocaleString("fr-FR") : "—"}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="tech-border bg-black/40 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 tech-border bg-black/60 border-border/40 text-yellow-400">
                            <FileText size={16} />
                        </div>
                        <h2 className="text-sm font-black text-white font-mono uppercase tracking-wider">LATEST_INVOICES</h2>
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">SOURCE // BILLING/ADMIN/INVOICES</div>
                </div>

                <div className="tech-border bg-black/40 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 tech-border bg-black/60 border-border/40 text-blue-400">
                            <CreditCard size={16} />
                        </div>
                        <h2 className="text-sm font-black text-white font-mono uppercase tracking-wider">LATEST_TRANSACTIONS</h2>
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">SOURCE // BILLING/ADMIN/TRANSACTIONS</div>
                </div>
            </div>

            <div className="tech-border bg-black/40 p-6 space-y-4">
                <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-primary" />
                    <h2 className="text-lg font-bold text-white font-mono">RECENT_INVOICES</h2>
                </div>
                {isLoading ? (
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                        <Loader2 size={14} className="animate-spin" />
                        LOADING
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="text-xs text-zinc-500 font-mono">NO_INVOICES</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/50 text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                                    <th className="py-3 px-2">Reference</th>
                                    <th className="py-3 px-2">User</th>
                                    <th className="py-3 px-2">Amount</th>
                                    <th className="py-3 px-2">Status</th>
                                    <th className="py-3 px-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="border-b border-border/10 hover:bg-white/5 transition-colors text-xs font-mono">
                                        <td className="py-3 px-2 text-zinc-200">{inv.reference}</td>
                                        <td className="py-3 px-2 text-zinc-400">{inv.user?.email || "UNKNOWN"}</td>
                                        <td className="py-3 px-2 text-zinc-200 font-bold">{(inv.amount || 0).toLocaleString()} {inv.currency}</td>
                                        <td className="py-3 px-2">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                inv.status === "paid" ? "text-green-400 bg-green-500/10" :
                                                inv.status === "pending" ? "text-yellow-400 bg-yellow-500/10" :
                                                "text-red-400 bg-red-500/10"
                                            }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-zinc-500">{inv.createdAt ? new Date(inv.createdAt).toLocaleString("fr-FR") : "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="tech-border bg-black/40 p-6 space-y-4">
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-primary" />
                    <h2 className="text-lg font-bold text-white font-mono">RECENT_TRANSACTIONS</h2>
                </div>
                {isLoading ? (
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                        <Loader2 size={14} className="animate-spin" />
                        LOADING
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-xs text-zinc-500 font-mono">NO_TRANSACTIONS</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/50 text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                                    <th className="py-3 px-2">Reference</th>
                                    <th className="py-3 px-2">User</th>
                                    <th className="py-3 px-2">Type</th>
                                    <th className="py-3 px-2">Amount</th>
                                    <th className="py-3 px-2">Status</th>
                                    <th className="py-3 px-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((trx) => (
                                    <tr key={trx.id} className="border-b border-border/10 hover:bg-white/5 transition-colors text-xs font-mono">
                                        <td className="py-3 px-2 text-zinc-200">{trx.reference}</td>
                                        <td className="py-3 px-2 text-zinc-400">{trx.user?.email || "UNKNOWN"}</td>
                                        <td className="py-3 px-2 text-zinc-400">{String(trx.type || "—").toUpperCase()}</td>
                                        <td className="py-3 px-2 text-zinc-200 font-bold">{(trx.amount || 0).toLocaleString()} {trx.currency}</td>
                                        <td className="py-3 px-2">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                trx.status === "completed" ? "text-green-400 bg-green-500/10" :
                                                trx.status === "pending" ? "text-yellow-400 bg-yellow-500/10" :
                                                "text-red-400 bg-red-500/10"
                                            }`}>
                                                {trx.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-zinc-500">{trx.createdAt ? new Date(trx.createdAt).toLocaleString("fr-FR") : "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
