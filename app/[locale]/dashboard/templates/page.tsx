"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FileText, Plus, Search, Edit, Trash2, Eye, Globe, Shield, Copy, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTemplates, deleteTemplate } from "@/lib/resources";
import type { Template } from "@/types";
import { toast } from "sonner";
import { TemplateModal } from "@/components/templates/TemplateModal";

export default function TemplatesPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    useEffect(() => {
        if (status === "loading") return;
        const role = (session?.user as unknown as { role?: string } | undefined)?.role;
        if (status === "unauthenticated") {
            router.replace("/login");
            return;
        }
        if (role !== "admin") {
            router.replace("/dashboard/overview");
            return;
        }
        router.replace("/admin/templates");
    }, [status, session, router]);

    const handleOpenModal = (mode: "view" | "edit" | "create", template?: Template) => {
        setModalMode(mode);
        setSelectedTemplate(template || null);
        setIsModalOpen(true);
    };

    const fetchTemplates = async () => {
        try {
            const data = await getTemplates();
            setTemplates(data);
        } catch (err) {
            toast.error("Erreur lors du chargement des modèles");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const categories = ["all", ...new Set(templates.map(t => t.category))];

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = async (slug: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce modèle ?")) return;
        try {
            await deleteTemplate(slug);
            setTemplates(templates.filter(t => t.slug !== slug));
            toast.success("Modèle supprimé");
        } catch (err) {
            toast.error("Erreur lors de la suppression du modèle");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Modèles de Documents</h1>
                    <p className="text-foreground/60 mt-1">Configurez les modèles pour l'extraction de vos documents.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal("create")}
                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                    <Plus size={18} /> Nouveau Modèle
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un modèle..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                                selectedCategory === category
                                    ? "bg-primary text-white"
                                    : "bg-white dark:bg-zinc-900 border border-border text-foreground/60 hover:text-foreground"
                            )}
                        >
                            {category === "all" ? "Tous" : category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-border overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-accent/30">
                            <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-wider">Modèle</th>
                            <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-wider">Catégorie</th>
                            <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-wider">Pays</th>
                            <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-wider">Champs</th>
                            <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-wider">Utilisation</th>
                            <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4"><div className="h-6 w-32 bg-accent rounded" /></td>
                                    <td className="px-6 py-4"><div className="h-6 w-20 bg-accent rounded" /></td>
                                    <td className="px-6 py-4"><div className="h-6 w-16 bg-accent rounded" /></td>
                                    <td className="px-6 py-4"><div className="h-6 w-12 bg-accent rounded" /></td>
                                    <td className="px-6 py-4"><div className="h-6 w-16 bg-accent rounded" /></td>
                                    <td className="px-6 py-4"><div className="h-8 w-20 bg-accent rounded ml-auto" /></td>
                                </tr>
                            ))
                        ) : filteredTemplates.length > 0 ? (
                            filteredTemplates.map((template) => (
                                <tr key={template.slug} className="hover:bg-accent/20 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <FileText size={18} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{template.name}</p>
                                                <p className="text-xs text-foreground/40">{template.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/50 rounded-lg text-xs font-medium text-foreground/70">
                                            {template.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-foreground/60">
                                            <Globe size={14} />
                                            {template.country}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-foreground/60">
                                        {template.fields.length} champs
                                    </td>
                                    <td className="px-6 py-4 text-sm text-foreground/60">
                                        {(template.usageCount || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button 
                                                onClick={() => handleOpenModal("view", template)}
                                                className="p-2 text-foreground/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                title="Voir les détails"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleOpenModal("edit", template)}
                                                className="p-2 text-foreground/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                title="Modifier le modèle"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            {!template.isBuiltin && (
                                                <button 
                                                    onClick={() => handleDelete(template.slug)}
                                                    className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 text-foreground/20">
                                        <FileText size={32} />
                                    </div>
                                    <p className="text-foreground/60 font-medium">Aucun modèle trouvé.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                        <Shield size={20} /> Modèles Intégrés
                    </h3>
                    <p className="text-sm text-foreground/70 mb-4">
                        Kiriku inclut des modèles prédéfinis pour les documents d'identité courants au Sénégal et dans la CEDEAO.
                    </p>
                    <ul className="space-y-2">
                        {["CNI Sénégalaise", "Passeport Senegal", "NINEA", "Permis de Conduire CEDEAO"].map((doc, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-foreground/70">
                                <CheckCircle2 size={14} className="text-blue-500" />
                                {doc}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-4">Créer un modèle personnalisé</h3>
                    <pre className="bg-zinc-950 p-4 rounded-xl text-xs font-mono text-green-400 overflow-x-auto">
{`// POST /v1/templates
{
  "name": "Ma CNI",
  "category": "identity",
  "country": "SN",
  "language": "fr",
  "fields": [
    { "key": "nom", "type": "string", "required": true },
    { "key": "prenom", "type": "string", "required": true }
  ]
}`}
                    </pre>
                </div>
            </div>

            <TemplateModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
                template={selectedTemplate}
                onSuccess={() => fetchTemplates()}
            />
        </div>
    );
}
