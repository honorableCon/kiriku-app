"use client";

import { useEffect, useState } from "react";
import { FileText, Plus, Search, Edit, Trash2, Eye, Globe, Shield, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTemplates, deleteTemplate } from "@/lib/resources";
import type { Template } from "@/types";
import { toast } from "sonner";
import { TemplateModal } from "@/components/templates/TemplateModal";

export default function AdminTemplatesPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    const handleOpenModal = (mode: "view" | "edit" | "create", template?: Template) => {
        setModalMode(mode);
        setSelectedTemplate(template || null);
        setIsModalOpen(true);
    };

    const fetchTemplates = async () => {
        try {
            const data = await getTemplates();
            setTemplates(data);
        } catch {
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
        } catch {
            toast.error("Erreur lors de la suppression du modèle");
        }
    };

    return (
        <div className="space-y-6">
            <div className="tech-border bg-black/40 border-primary/20 p-4">
                <div className="flex items-center gap-2 mb-1">
                    <FileText size={18} className="text-primary animate-pulse" />
                    <span className="text-[10px] font-mono text-primary/80 uppercase tracking-widest">TEMPLATE_MANAGEMENT</span>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-mono uppercase">Document_Templates_Control</h1>
                <p className="text-foreground/60 mt-1 font-mono text-xs">EXTRACTION_ENGINE // TEMPLATE_CONFIG</p>
                <button
                    onClick={() => handleOpenModal("create")}
                    className="tech-border bg-primary/20 border-primary/40 px-4 py-2 mt-4 text-xs font-black text-primary uppercase tracking-wider hover:bg-primary/30 hover:border-primary/60 transition-all font-mono flex items-center gap-2"
                >
                    <Plus size={14} />NEW_TEMPLATE
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
                    <input
                        type="text"
                        placeholder="SEARCH_TEMPLATE"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="tech-border bg-black/60 border-border/40 w-full pl-10 pr-4 py-2.5 text-sm text-foreground font-mono focus:border-primary/40 outline-none placeholder:text-foreground/30"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                                "tech-border px-3 py-2 text-xs font-black whitespace-nowrap uppercase tracking-wider transition-all font-mono",
                                selectedCategory === category
                                    ? "bg-primary/20 border-primary/40 text-primary"
                                    : "bg-black/60 border-border/40 text-foreground/60 hover:text-foreground hover:border-primary/40"
                            )}
                        >
                           {category === "all" ? "ALL" : category.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="tech-border bg-black/40 border-border/60 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border/60 bg-black/60">
                            <th className="px-6 py-3 text-[10px] font-black text-foreground/40 uppercase tracking-wider font-mono">TEMPLATE</th>
                            <th className="px-6 py-3 text-[10px] font-black text-foreground/40 uppercase tracking-wider font-mono">CATEGORY</th>
                            <th className="px-6 py-3 text-[10px] font-black text-foreground/40 uppercase tracking-wider font-mono">COUNTRY</th>
                            <th className="px-6 py-3 text-[10px] font-black text-foreground/40 uppercase tracking-wider font-mono">FIELDS</th>
                            <th className="px-6 py-3 text-[10px] font-black text-foreground/40 uppercase tracking-wider font-mono">USAGE</th>
                            <th className="px-6 py-3 text-[10px] font-black text-foreground/40 uppercase tracking-wider font-mono text-right">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-3"><div className="h-5 w-32 bg-black/60 tech-border border-border/40" /></td>
                                    <td className="px-6 py-3"><div className="h-5 w-20 bg-black/60 tech-border border-border/40" /></td>
                                    <td className="px-6 py-3"><div className="h-5 w-16 bg-black/60 tech-border border-border/40" /></td>
                                    <td className="px-6 py-3"><div className="h-5 w-12 bg-black/60 tech-border border-border/40" /></td>
                                    <td className="px-6 py-3"><div className="h-5 w-16 bg-black/60 tech-border border-border/40" /></td>
                                    <td className="px-6 py-3"><div className="h-6 w-20 bg-black/60 tech-border border-border/40 ml-auto" /></td>
                                </tr>
                            ))
                        ) : filteredTemplates.length > 0 ? (
                            filteredTemplates.map((template) => (
                                <tr key={template.slug} className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="tech-border bg-primary/10 border-primary/40 p-2">
                                                <FileText size={16} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-foreground font-mono uppercase">{template.name}</p>
                                                <p className="text-[10px] text-foreground/40 font-mono uppercase tracking-wider">{template.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="tech-border bg-black/60 border-border/40 inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-black text-foreground/70 uppercase tracking-wider font-mono">
                                            {template.category.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2 text-xs text-foreground/60 font-mono uppercase tracking-wider">
                                            <Globe size={12} />
                                            {template.country}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-xs text-foreground/60 font-mono">
                                        {template.fields.length} FIELDS
                                    </td>
                                    <td className="px-6 py-3 text-xs text-foreground/60 font-mono">
                                        {(template.usageCount || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button 
                                                onClick={() => handleOpenModal("view", template)}
                                                className="tech-border bg-black/60 border-border/40 p-2 text-foreground/40 hover:text-primary hover:border-primary/40 transition-all"
                                                title="Voir les détails"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleOpenModal("edit", template)}
                                                className="tech-border bg-black/60 border-border/40 p-2 text-foreground/40 hover:text-primary hover:border-primary/40 transition-all"
                                                title="Modifier le modèle"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            {!template.isBuiltin && (
                                                <button
                                                    onClick={() => handleDelete(template.slug)}
                                                    className="tech-border bg-black/60 border-border/40 p-2 text-foreground/40 hover:text-red-500 hover:border-red-500/40 transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <div className="w-16 h-16 tech-border bg-black/60 border-border/40 flex items-center justify-center mx-auto mb-4 text-foreground/20">
                                        <FileText size={28} />
                                    </div>
                                    <p className="text-foreground/60 font-mono text-xs uppercase tracking-wider">NO_TEMPLATES_FOUND</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="tech-border bg-primary/10 border-primary/30 p-4">
                    <h3 className="text-sm font-black text-primary mb-2 flex items-center gap-2 font-mono uppercase tracking-wider">
                        <Shield size={16} />BUILTIN_TEMPLATES
                    </h3>
                    <p className="text-xs text-foreground/70 mb-4 font-mono uppercase tracking-wider">
                        PREDEFINED_DOCUMENTS // SENEGAL_CEDEAO
                    </p>
                    <ul className="space-y-2">
                        {["CNI Sénégalaise", "Passeport Senegal", "NINEA", "Permis de Conduire CEDEAO"].map((doc, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-foreground/70 font-mono uppercase tracking-wider">
                                <CheckCircle2 size={12} className="text-primary" />
                                {doc}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="tech-border bg-black/40 border-border/60 p-4">
                    <h3 className="text-sm font-black text-foreground mb-4 font-mono uppercase tracking-wider">CUSTOM_TEMPLATE_API</h3>
                    <pre className="tech-border bg-black/60 border-border/40 p-3 text-[10px] font-mono text-green-400 overflow-x-auto">
{`// POST /v1/templates
{
  "name": "MY_CNI",
  "category": "IDENTITY",
  "country": "SN",
  "language": "FR",
  "fields": [
    { "key": "NOM", "type": "STRING", "required": true },
    { "key": "PRENOM", "type": "STRING", "required": true }
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

