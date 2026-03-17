"use client";

import { useEffect, useState } from "react";
import { FileText, Search, Clock, CheckCircle2, XCircle, AlertCircle, Eye, Download, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAdminTemplateRequests, updateTemplateRequestStatus } from "@/lib/resources-ext";
import type { TemplateRequest } from "@/types";
import { toast } from "sonner";

export default function AdminTemplateRequestsPage() {
    const [requests, setRequests] = useState<TemplateRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<TemplateRequest | null>(null);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const data = await getAdminTemplateRequests();
            setRequests(data);
        } catch {
            toast.error("Erreur lors du chargement des demandes");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const statuses = ["all", "pending", "in_progress", "completed", "rejected"];

    const filteredRequests = requests.filter(request => {
        const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === "all" || request.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-amber-500/10 border-amber-500/30 text-amber-500";
            case "in_progress":
                return "bg-blue-500/10 border-blue-500/30 text-blue-500";
            case "completed":
                return "bg-green-500/10 border-green-500/30 text-green-500";
            case "rejected":
                return "bg-red-500/10 border-red-500/30 text-red-500";
            default:
                return "bg-zinc-500/10 border-zinc-500/30 text-zinc-500";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock size={12} />;
            case "in_progress":
                return <Loader2 size={12} className="animate-spin" />;
            case "completed":
                return <CheckCircle2 size={12} />;
            case "rejected":
                return <XCircle size={12} />;
            default:
                return <AlertCircle size={12} />;
        }
    };

    const handleStatusUpdate = async (requestId: string, newStatus: string, adminNotes?: string) => {
        setUpdatingId(requestId);
        try {
            await updateTemplateRequestStatus(requestId, { status: newStatus as any, adminNotes });
            setRequests((prev) =>
                prev.map((r) =>
                    r._id === requestId ? { ...r, status: newStatus as any, adminNotes } : r
                )
            );
            toast.success("Statut mis à jour");
        } catch {
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setUpdatingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="space-y-6">
            <div className="tech-border bg-black/40 border-primary/20 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <FileText size={18} className="text-primary animate-pulse" />
                            <span className="text-[10px] font-mono text-primary/80 uppercase tracking-widest">TEMPLATE_REQUESTS_MANAGEMENT</span>
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-mono uppercase">Requests_Control_Panel</h1>
                        <p className="text-foreground/60 mt-1 font-mono text-xs">USER_REQUESTS // STATUS_TRACKING</p>
                    </div>
                    <button
                        onClick={fetchRequests}
                        className="tech-border bg-primary/20 border-primary/40 px-4 py-2 text-xs font-black text-primary uppercase tracking-wider hover:bg-primary/30 hover:border-primary/60 transition-all font-mono flex items-center gap-2"
                        disabled={isLoading}
                    >
                        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                        REFRESH
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
                    <input
                        type="text"
                        placeholder="SEARCH_REQUESTS"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-primary/20 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-foreground/30"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {statuses.map(status => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={cn(
                                "px-3 py-2 rounded-sm border text-[10px] font-bold font-mono uppercase tracking-wider whitespace-nowrap transition-all",
                                selectedStatus === status
                                    ? "bg-primary/20 border-primary text-primary"
                                    : "bg-black/40 border-primary/20 text-foreground/60 hover:text-foreground hover:border-primary/40"
                            )}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="tech-border bg-black/40 border-primary/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-primary/20 bg-black/60">
                                <th className="px-6 py-3 text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-foreground/40 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Files</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-foreground/40 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/10">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-primary/10 rounded w-48" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-primary/10 rounded w-20" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-primary/10 rounded w-32" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-primary/10 rounded w-16" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-primary/10 rounded w-24" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-primary/10 rounded w-16 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-foreground/40 font-mono text-xs">
                                        NO_REQUESTS_FOUND
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((request) => (
                                    <tr key={request._id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                                    <FileText className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground text-sm truncate max-w-[200px]">{request.title}</p>
                                                    <p className="text-[10px] text-foreground/40 font-mono mt-0.5 truncate max-w-[200px]">{request.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-[10px] font-bold font-mono uppercase tracking-wider",
                                                getStatusBadgeClass(request.status)
                                            )}>
                                                {getStatusIcon(request.status)}
                                                {request.status.replace('_', ' ')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-mono text-foreground/60">
                                                {typeof request.userId === 'object' 
                                                    ? `${request.userId.firstName} ${request.userId.lastName}`
                                                    : request.userId
                                                }
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-foreground/60">{request.exampleFiles?.length || 0}</span>
                                                <button
                                                    onClick={() => setSelectedRequest(request)}
                                                    className="text-primary hover:text-primary/80 transition-colors"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-mono text-foreground/40">{formatDate(request.createdAt)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {request.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(request._id, 'in_progress')}
                                                            disabled={updatingId === request._id}
                                                            className="tech-border bg-blue-500/20 border-blue-500/40 px-2 py-1 text-[10px] font-bold text-blue-500 uppercase tracking-wider hover:bg-blue-500/30 transition-all font-mono disabled:opacity-50"
                                                        >
                                                            START
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(request._id, 'rejected')}
                                                            disabled={updatingId === request._id}
                                                            className="tech-border bg-red-500/20 border-red-500/40 px-2 py-1 text-[10px] font-bold text-red-500 uppercase tracking-wider hover:bg-red-500/30 transition-all font-mono disabled:opacity-50"
                                                        >
                                                            REJECT
                                                        </button>
                                                    </>
                                                )}
                                                {request.status === 'in_progress' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(request._id, 'completed')}
                                                        disabled={updatingId === request._id}
                                                        className="tech-border bg-green-500/20 border-green-500/40 px-2 py-1 text-[10px] font-bold text-green-500 uppercase tracking-wider hover:bg-green-500/30 transition-all font-mono disabled:opacity-50"
                                                    >
                                                        COMPLETE
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
                    <div className="tech-border bg-black/80 border-primary/20 w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-primary/20 bg-black/40">
                            <div>
                                <h2 className="text-xl font-extrabold tracking-tight text-foreground font-mono uppercase">
                                    {selectedRequest.title}
                                </h2>
                                <p className="text-xs text-primary/80 mt-1 font-mono uppercase tracking-wider">
                                    REQUEST_DETAILS
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="tech-border bg-black/60 border-primary/20 p-2 text-foreground/40 hover:text-primary hover:border-primary/40 transition-all"
                            >
                                <XCircle size={16} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-primary/80 uppercase tracking-wider font-mono mb-2 block">DESCRIPTION</label>
                                <p className="text-sm text-foreground/80">{selectedRequest.description}</p>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-primary/80 uppercase tracking-wider font-mono mb-2 block">REQUIRED_FIELDS</label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedRequest.fields.map((field, idx) => (
                                        <span
                                            key={idx}
                                            className="tech-border bg-primary/10 border-primary/20 px-3 py-1.5 text-xs font-mono text-primary"
                                        >
                                            {field}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-primary/80 uppercase tracking-wider font-mono mb-2 block">EXAMPLE_FILES</label>
                                <div className="space-y-2">
                                    {selectedRequest.exampleFiles.map((file, idx) => (
                                        <div
                                            key={idx}
                                            className="tech-border bg-black/40 border-primary/20 p-3 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                    <FileText className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="text-xs font-mono text-foreground/60 truncate max-w-[200px]">
                                                    {file.split('/').pop()}
                                                </span>
                                            </div>
                                            <button className="text-primary hover:text-primary/80 transition-colors">
                                                <Download size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedRequest.adminNotes && (
                                <div>
                                    <label className="text-[10px] font-bold text-primary/80 uppercase tracking-wider font-mono mb-2 block">ADMIN_NOTES</label>
                                    <p className="text-sm text-foreground/80 bg-black/40 border border-primary/20 p-3 rounded-sm">
                                        {selectedRequest.adminNotes}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-primary/80 uppercase tracking-wider font-mono mb-2 block">STATUS</label>
                                    <div className={cn(
                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-[10px] font-bold font-mono uppercase tracking-wider",
                                        getStatusBadgeClass(selectedRequest.status)
                                    )}>
                                        {getStatusIcon(selectedRequest.status)}
                                        {selectedRequest.status.replace('_', ' ')}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-primary/80 uppercase tracking-wider font-mono mb-2 block">CREATED_AT</label>
                                    <p className="text-xs font-mono text-foreground/60">{formatDate(selectedRequest.createdAt)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-primary/20 bg-black/40 flex justify-end gap-2">
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="tech-border bg-black/60 border-primary/20 px-4 py-2 text-xs font-black text-foreground uppercase tracking-wider hover:bg-black/80 hover:border-primary/40 transition-all font-mono"
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
