"use client";

import { useEffect, useState } from "react";
import { 
    Search, 
    Filter, 
    MoreVertical, 
    Ban, 
    CheckCircle, 
    CreditCard, 
    ShieldAlert, 
    Trash2,
    Users
} from "lucide-react";
import { getAdminUsers } from "@/lib/resources-ext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 20;

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const { data, total } = await getAdminUsers({ 
                limit, 
                offset: (page - 1) * limit 
            });
            setUsers(data);
            setTotal(total);
        } catch (err) {
            toast.error("Erreur lors du chargement des utilisateurs");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="tech-border bg-black/40 border-primary/20 p-4">
                <div className="flex items-center gap-2 mb-1">
                    <Users size={18} className="text-primary animate-pulse" />
                    <span className="text-[10px] font-mono text-primary/80 uppercase tracking-widest">USER_MANAGEMENT</span>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-mono uppercase">Users_Control_Panel</h1>
                <p className="text-foreground/60 mt-1 font-mono text-xs">ACCOUNT_MANAGEMENT // CREDITS // PERMISSIONS</p>
                <div className="flex gap-3 mt-4">
                    <button className="tech-border bg-black/60 border-border/40 px-4 py-2 text-foreground text-xs font-black uppercase tracking-wider hover:border-primary/40 hover:text-primary transition-all font-mono">
                        EXPORT_CSV
                    </button>
                    <button className="tech-border bg-primary/20 border-primary/40 px-4 py-2 text-primary text-xs font-black uppercase tracking-wider hover:bg-primary/30 hover:border-primary/60 transition-all font-mono">
                        INVITE_ADMIN
                    </button>
                </div>
            </div>

            <div className="tech-border bg-black/40 border-border/60 overflow-hidden">
                <div className="p-4 border-b border-border/60 flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                        <input 
                            type="text" 
                            placeholder="SEARCH_USER_ID" 
                            className="tech-border bg-black/60 border-border/40 w-full pl-9 pr-4 py-2 text-sm text-foreground font-mono focus:border-primary/40 outline-none placeholder:text-foreground/30"
                        />
                    </div>
                    <button className="tech-border bg-black/60 border-border/40 px-3 py-2 text-foreground/60 hover:text-foreground hover:border-primary/40 flex items-center gap-2 text-xs font-mono uppercase tracking-wider transition-all">
                        <Filter size={14} /> FILTER
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border/60 bg-black/60 text-[10px] font-black text-foreground/40 uppercase tracking-wider font-mono">
                                <th className="px-6 py-3">USER</th>
                                <th className="px-6 py-3">ORG</th>
                                <th className="px-6 py-3">PLAN</th>
                                <th className="px-6 py-3">CREDITS</th>
                                <th className="px-6 py-3">STATUS</th>
                                <th className="px-6 py-3 text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-foreground/60 font-mono text-xs uppercase tracking-wider">LOADING_USERS</td>
                                </tr>
                            ) : users.map((user) => (
                                <tr key={user.id} className="group hover:bg-primary/5 transition-colors">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 tech-border bg-primary/10 border-primary/40 flex items-center justify-center text-xs font-black text-primary font-mono">
                                                {user.firstName[0]}{user.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-foreground font-mono uppercase">{user.firstName} {user.lastName}</p>
                                                <p className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="text-xs text-foreground/60 font-mono uppercase tracking-wider">{user.organization || 'N/A'}</span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={cn(
                                            "text-[10px] font-black px-2 py-1 tech-border uppercase tracking-wider font-mono",
                                            user.plan === 'enterprise' ? "bg-purple-500/10 text-purple-400 border-purple-500/30" :
                                            user.plan === 'pro' ? "bg-blue-500/10 text-blue-400 border-blue-500/30" :
                                            "bg-black/60 text-foreground/60 border-border/40"
                                        )}>
                                            {user.plan.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-foreground font-mono">{user.credits || 0}</span>
                                            <button className="opacity-0 group-hover:opacity-100 p-1 text-foreground/40 hover:text-primary transition-all" title="Add credits">
                                                <CreditCard size={12} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-2 py-1 tech-border text-[9px] font-black uppercase tracking-wider font-mono",
                                            "bg-green-500/10 text-green-400 border-green-500/30"
                                        )}>
                                            <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                            ACTIVE
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="tech-border bg-black/60 border-border/40 p-2 text-foreground/50 hover:text-foreground hover:border-primary/40 transition-all">
                                                <MoreVertical size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
