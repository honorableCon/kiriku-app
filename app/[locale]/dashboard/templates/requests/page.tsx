"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, FileText, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw, FileSearch } from "lucide-react";
import { getTemplateRequests } from "@/lib/resources";
import { TemplateRequest } from "@/types";
import { RequestTemplateModal } from "@/components/templates/RequestTemplateModal";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function TemplateRequestsPage() {
    const t = useTranslations("Templates");
    const [requests, setRequests] = useState<TemplateRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const data = await getTemplateRequests();
            setRequests(data);
        } catch (error) {
            console.error("Failed to fetch template requests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
            case 'in_progress': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin-slow" />;
            case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'pending': return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            case 'in_progress': return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case 'completed': return "bg-green-500/10 text-green-500 border-green-500/20";
            case 'rejected': return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-mono uppercase">
                        DEMANDES DE TEMPLATES
                    </h1>
                    <p className="text-xs text-foreground/60 mt-1 font-mono uppercase tracking-wider">
                        SUIVEZ L'ÉTAT DE VOS DEMANDES DE TEMPLATES SUR MESURE
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="tech-border bg-primary/20 border-primary/40 px-4 py-2.5 text-xs font-black text-primary uppercase tracking-wider hover:bg-primary/30 hover:border-primary/60 transition-all font-mono flex items-center justify-center gap-2"
                >
                    <Plus size={16} />
                    NOUVELLE DEMANDE
                </button>
            </div>

            <div className="tech-border bg-black/40 border-border/40 overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-foreground/40">
                        <RefreshCw className="w-8 h-8 animate-spin mb-4 text-primary/40" />
                        <p className="text-xs font-mono uppercase tracking-wider">CHARGEMENT DES DEMANDES...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
                            <FileSearch className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-wider mb-2">Aucune demande</h3>
                        <p className="text-xs text-foreground/60 max-w-md font-mono mb-6 leading-relaxed">
                            Vous avez un document spécifique qui n'est pas couvert par nos templates standards ? 
                            Soumettez-nous une demande avec des exemples, et notre équipe créera un modèle sur mesure pour vous.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="tech-border bg-primary/10 border-primary/40 px-6 py-2.5 text-xs font-black text-primary uppercase tracking-wider hover:bg-primary/20 transition-all font-mono"
                        >
                            FAIRE UNE DEMANDE
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-black/60 border-b border-border/40 font-mono text-[10px] uppercase tracking-wider text-foreground/60">
                                <tr>
                                    <th className="px-6 py-4 font-black">DOCUMENT</th>
                                    <th className="px-6 py-4 font-black">STATUT</th>
                                    <th className="px-6 py-4 font-black">CHAMPS DEMANDÉS</th>
                                    <th className="px-6 py-4 font-black">DATE</th>
                                    <th className="px-6 py-4 font-black text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {requests.map((request) => (
                                    <tr key={request._id} className="hover:bg-white/5 transition-colors">
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
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-[10px] font-bold font-mono uppercase tracking-wider ${getStatusBadgeClass(request.status)}`}>
                                                {getStatusIcon(request.status)}
                                                {request.status.replace('_', ' ')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {request.fields.slice(0, 3).map((field, i) => (
                                                    <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-sm font-mono text-foreground/70 truncate max-w-[100px]">
                                                        {field}
                                                    </span>
                                                ))}
                                                {request.fields.length > 3 && (
                                                    <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-sm font-mono text-foreground/40">
                                                        +{request.fields.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-foreground/60">
                                            {format(new Date(request.createdAt), 'dd MMM yyyy', { locale: fr })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {request.status === 'completed' && request.createdTemplateId ? (
                                                <button className="text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-wider font-mono">
                                                    VOIR LE TEMPLATE
                                                </button>
                                            ) : (
                                                <span className="text-[10px] text-foreground/30 font-mono">
                                                    EN ATTENTE
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <RequestTemplateModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchRequests} 
            />
        </div>
    );
}