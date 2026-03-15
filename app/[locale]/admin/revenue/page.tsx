"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, TrendingUp, Loader2, FileText, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import { getAdminInvoices, getAdminTransactions } from "@/lib/resources-ext";
import { toast } from "sonner";

export default function AdminRevenuePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isInvoicesLoading, setIsInvoicesLoading] = useState(true);
    const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
    const [overview, setOverview] = useState<{
        revenueXof: number;
        completedTransactions: number;
    } | null>(null);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [trxTotal, setTrxTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [trxPage, setTrxPage] = useState(1);
    const limit = 25;

    useEffect(() => {
        const fetchOverview = async () => {
            setIsLoading(true);
            try {
                const res = await api.get("/analytics/admin/overview");
                setOverview(res.data);
            } catch {
                toast.error("Erreur lors du chargement des métriques de revenu");
            } finally {
                setIsLoading(false);
            }
        };
        fetchOverview();
    }, []);

    useEffect(() => {
        const fetchInvoices = async () => {
            setIsInvoicesLoading(true);
            try {
                const { data, total } = await getAdminInvoices({
                    limit,
                    offset: (page - 1) * limit,
                    status: statusFilter === "all" ? undefined : statusFilter,
                });
                setInvoices(data);
                setTotal(total);
            } catch {
                toast.error("Erreur lors du chargement des factures");
            } finally {
                setIsInvoicesLoading(false);
            }
        };
        fetchInvoices();
    }, [page, statusFilter]);

    useEffect(() => {
        const fetchTransactions = async () => {
            setIsTransactionsLoading(true);
            try {
                const { data, total } = await getAdminTransactions({
                    limit,
                    offset: (trxPage - 1) * limit,
                    status: "completed",
                });
                setTransactions(data);
                setTrxTotal(total);
            } catch {
                toast.error("Erreur lors du chargement des transactions");
            } finally {
                setIsTransactionsLoading(false);
            }
        };
        fetchTransactions();
    }, [trxPage]);

    const invoiceStats = useMemo(() => {
        const paid = invoices.filter((i) => i.status === "paid");
        const pending = invoices.filter((i) => i.status === "pending");
        const paidTotal = paid.reduce((sum, i) => sum + (i.amount || 0), 0);
        return {
            paidTotal,
            pendingCount: pending.length,
            paidCount: paid.length,
        };
    }, [invoices]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const trxTotalPages = Math.max(1, Math.ceil(trxTotal / limit));

    return (
        <div className="space-y-6">
            <div className="tech-border bg-black/40 border-primary/20 p-4">
                <div className="flex items-center gap-2 mb-1">
                    <CreditCard size={18} className="text-primary animate-pulse" />
                    <span className="text-[10px] font-mono text-primary/80 uppercase tracking-widest">REVENUE_ANALYTICS</span>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-mono uppercase">Revenue_Monitoring</h1>
                <p className="text-foreground/60 mt-1 font-mono text-xs">PAYMENT_TRACKING // COMMERCIAL_PERFORMANCE</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="tech-border bg-black/40 border-primary/20 p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="tech-border bg-black/60 border-border/40 p-2 text-green-400">
                            <TrendingUp size={16} />
                        </div>
                        <h2 className="text-sm font-black text-foreground font-mono uppercase tracking-wider">TOTAL_REVENUE</h2>
                    </div>
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-xs font-mono text-foreground/60">
                            <Loader2 size={14} className="animate-spin" />
                            LOADING
                        </div>
                    ) : (
                        <div className="text-2xl font-black text-foreground font-mono">
                            {(overview?.revenueXof ?? 0).toLocaleString()} XOF
                        </div>
                    )}
                    <p className="text-[10px] text-foreground/40 mt-2 font-mono">SOURCE // TRANSACTIONS_COMPLETED</p>
                </div>

                <div className="tech-border bg-black/40 border-primary/20 p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="tech-border bg-black/60 border-border/40 p-2 text-blue-400">
                            <FileText size={16} />
                        </div>
                        <h2 className="text-sm font-black text-foreground font-mono uppercase tracking-wider">INVOICES_PAID</h2>
                    </div>
                    <div className="text-2xl font-black text-foreground font-mono">
                        {invoiceStats.paidTotal.toLocaleString()} XOF
                    </div>
                    <p className="text-[10px] text-foreground/40 mt-2 font-mono">
                        COUNT // {invoiceStats.paidCount}
                    </p>
                </div>

                <div className="tech-border bg-black/40 border-primary/20 p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="tech-border bg-black/60 border-border/40 p-2 text-yellow-400">
                            <CreditCard size={16} />
                        </div>
                        <h2 className="text-sm font-black text-foreground font-mono uppercase tracking-wider">INVOICES_PENDING</h2>
                    </div>
                    <div className="text-2xl font-black text-foreground font-mono">
                        {invoiceStats.pendingCount}
                    </div>
                    <p className="text-[10px] text-foreground/40 mt-2 font-mono">ACTION // PAYMENT_LINK</p>
                </div>
            </div>

            <div className="tech-border bg-black/40 border-primary/20 p-4">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-primary" />
                        <span className="text-xs font-mono text-primary/80 uppercase tracking-widest">TRANSACTIONS</span>
                    </div>
                </div>

                {isTransactionsLoading ? (
                    <div className="flex items-center gap-2 text-xs font-mono text-foreground/60">
                        <Loader2 size={14} className="animate-spin" />
                        LOADING_TRANSACTIONS
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-xs font-mono text-foreground/50">NO_TRANSACTIONS</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/50 text-[10px] text-foreground/50 font-mono uppercase tracking-widest">
                                    <th className="py-3 px-2">Reference</th>
                                    <th className="py-3 px-2">User</th>
                                    <th className="py-3 px-2">Amount</th>
                                    <th className="py-3 px-2">Type</th>
                                    <th className="py-3 px-2">Provider</th>
                                    <th className="py-3 px-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((trx) => (
                                    <tr key={trx.id} className="border-b border-border/10 hover:bg-white/5 transition-colors text-xs font-mono">
                                        <td className="py-3 px-2 text-foreground/80">{trx.reference}</td>
                                        <td className="py-3 px-2 text-foreground/60">{trx.user?.email || "UNKNOWN"}</td>
                                        <td className="py-3 px-2 font-bold text-foreground">
                                            {(trx.amount || 0).toLocaleString()} {trx.currency}
                                        </td>
                                        <td className="py-3 px-2 text-foreground/60">{(trx.type || "—").toString()}</td>
                                        <td className="py-3 px-2 text-foreground/60">{(trx.provider || "—").toString()}</td>
                                        <td className="py-3 px-2 text-foreground/60">
                                            {trx.createdAt ? new Date(trx.createdAt).toLocaleDateString("fr-FR") : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                    <div className="text-[10px] font-mono text-foreground/50">
                        TOTAL // {trxTotal} • PAGE {trxPage}/{trxTotalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={trxPage <= 1}
                            onClick={() => setTrxPage((p) => Math.max(1, p - 1))}
                            className="tech-border bg-black/40 border-border/40 px-3 py-2 text-[10px] font-bold font-mono uppercase tracking-wider text-foreground/60 disabled:opacity-40"
                        >
                            PREV
                        </button>
                        <button
                            disabled={trxPage >= trxTotalPages}
                            onClick={() => setTrxPage((p) => Math.min(trxTotalPages, p + 1))}
                            className="tech-border bg-black/40 border-border/40 px-3 py-2 text-[10px] font-bold font-mono uppercase tracking-wider text-foreground/60 disabled:opacity-40"
                        >
                            NEXT
                        </button>
                    </div>
                </div>
            </div>

            <div className="tech-border bg-black/40 border-primary/20 p-4">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <FileText size={16} className="text-primary" />
                        <span className="text-xs font-mono text-primary/80 uppercase tracking-widest">INVOICES</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setPage(1);
                                setTrxPage(1);
                                setStatusFilter(e.target.value);
                            }}
                            className="tech-border bg-black/40 border-border/40 px-3 py-2 text-xs font-mono text-foreground/80 focus:outline-none focus:border-primary"
                        >
                            <option value="all">ALL</option>
                            <option value="paid">PAID</option>
                            <option value="pending">PENDING</option>
                            <option value="failed">FAILED</option>
                            <option value="cancelled">CANCELLED</option>
                        </select>
                    </div>
                </div>

                {isInvoicesLoading ? (
                    <div className="flex items-center gap-2 text-xs font-mono text-foreground/60">
                        <Loader2 size={14} className="animate-spin" />
                        LOADING_INVOICES
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="text-xs font-mono text-foreground/50">NO_INVOICES</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/50 text-[10px] text-foreground/50 font-mono uppercase tracking-widest">
                                    <th className="py-3 px-2">Reference</th>
                                    <th className="py-3 px-2">User</th>
                                    <th className="py-3 px-2">Plan</th>
                                    <th className="py-3 px-2">Amount</th>
                                    <th className="py-3 px-2">Status</th>
                                    <th className="py-3 px-2">Date</th>
                                    <th className="py-3 px-2 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="border-b border-border/10 hover:bg-white/5 transition-colors text-xs font-mono">
                                        <td className="py-3 px-2 text-foreground/80">{inv.reference}</td>
                                        <td className="py-3 px-2 text-foreground/60">
                                            {inv.user?.email || "UNKNOWN"}
                                        </td>
                                        <td className="py-3 px-2 text-foreground/60">
                                            {(inv.subscription?.planId || inv.metadata?.planId || "—").toString().toUpperCase()}
                                        </td>
                                        <td className="py-3 px-2 font-bold text-foreground">
                                            {(inv.amount || 0).toLocaleString()} {inv.currency}
                                        </td>
                                        <td className="py-3 px-2">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                inv.status === 'paid' ? 'text-green-500 bg-green-500/10' :
                                                inv.status === 'pending' ? 'text-yellow-500 bg-yellow-500/10' :
                                                'text-red-500 bg-red-500/10'
                                            }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-foreground/60">
                                            {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString("fr-FR") : "—"}
                                        </td>
                                        <td className="py-3 px-2 text-right">
                                            {inv.status === "pending" && inv.paymentUrl ? (
                                                <a
                                                    href={inv.paymentUrl}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-black text-[10px] font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                                                >
                                                    PAY <ArrowRight size={10} />
                                                </a>
                                            ) : (
                                                <span className="text-[10px] text-foreground/40">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                    <div className="text-[10px] font-mono text-foreground/50">
                        TOTAL // {total} • PAGE {page}/{totalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="tech-border bg-black/40 border-border/40 px-3 py-2 text-[10px] font-bold font-mono uppercase tracking-wider text-foreground/60 disabled:opacity-40"
                        >
                            PREV
                        </button>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="tech-border bg-black/40 border-border/40 px-3 py-2 text-[10px] font-bold font-mono uppercase tracking-wider text-foreground/60 disabled:opacity-40"
                        >
                            NEXT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
