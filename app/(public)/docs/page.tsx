"use client";

import { Book, Code, Terminal, Zap, ChevronRight, Search } from "lucide-react";
import Link from "next/link";

const sections = [
    {
        title: "Démarrage Rapide",
        icon: Zap,
        description: "Apprenez à intégrer Kiriku en moins de 5 minutes.",
        links: ["Installation", "Authentification", "Votre première extraction"]
    },
    {
        title: "API Reference",
        icon: Code,
        description: "Documentation détaillée de tous nos points de terminaison.",
        links: ["Documents ID", "Passeports", "Extraits de naissance", "NINEA"]
    },
    {
        title: "SDKs & Outils",
        icon: Terminal,
        description: "Bibliothèques prêtes à l'emploi pour vos langages préférés.",
        links: ["Node.js SDK", "Python Client", "PHP Library", "Postman Collection"]
    },
];

export default function DocsPage() {
    return (
        <div className="bg-white dark:bg-black min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="max-w-3xl mb-16">
                    <h2 className="text-primary font-bold mb-4 flex items-center gap-2">
                        <Book size={20} /> Documentation
                    </h2>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                        Tout ce dont vous avez besoin pour <span className="text-primary">bâtir avec Kiriku</span>
                    </h1>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher dans la documentation..."
                            className="w-full pl-12 pr-6 py-4 bg-accent/30 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {sections.map((section) => (
                        <div key={section.title} className="bg-white dark:bg-zinc-900 border border-border p-8 rounded-3xl hover:border-primary/30 transition-all group">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <section.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">{section.title}</h3>
                            <p className="text-foreground/60 text-sm mb-6 leading-relaxed">
                                {section.description}
                            </p>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <button className="text-sm font-bold text-foreground hover:text-primary flex items-center gap-1 group/link transition-colors">
                                            {link} <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="space-y-12">
                    <div className="bg-white dark:bg-zinc-900 border border-border rounded-3xl p-8">
                        <h3 className="text-2xl font-bold text-foreground mb-4">Démarrage rapide</h3>
                        <p className="text-sm text-foreground/70 mb-6">
                            Base URL locale: <span className="font-mono">http://localhost:3009/v1</span>. Les appels d’écriture nécessitent un token JWT.
                        </p>
                        <div className="bg-zinc-950 rounded-2xl p-6 border border-white/10 text-xs text-green-400 font-mono overflow-x-auto">
                            <pre>{`# Extraction rapide (multipart) - envoi des options en champs séparés (recommandé)
curl -X POST http://localhost:3009/v1/extract \\
  -H "Authorization: Bearer <TOKEN>" \\
  -F "file=@/chemin/vers/cni_recto.jpg" \\
  -F "documentType=cni-senegal" \\
  -F "fraudCheck=true" \\
  -F "returnConfidence=true" \\
  -F "returnRawText=false"`}</pre>
                        </div>
                        <div className="mt-4 bg-zinc-950 rounded-2xl p-6 border border-white/10 text-xs text-green-400 font-mono overflow-x-auto">
                            <pre>{`# Variante: envoi des options dans un seul champ JSON
curl -X POST http://localhost:3009/v1/extract \\
  -H "Authorization: Bearer <TOKEN>" \\
  -F "file=@/chemin/vers/cni_recto.jpg" \\
  -F "documentType=cni-senegal" \\
  -F "options={\\"fraudCheck\\":true,\\"returnConfidence\\":true,\\"returnRawText\\":false}"`}</pre>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-border rounded-3xl p-8">
                        <h3 className="text-2xl font-bold text-foreground mb-4">Référence Extraction</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <p className="text-sm text-foreground/70">POST <span className="font-mono">/extract</span></p>
                                <ul className="text-sm text-foreground/80 space-y-1">
                                    <li>- file: image/jpeg|png|webp, application/pdf</li>
                                    <li>- fileBack (optionnel)</li>
                                    <li>- documentType: cni-senegal | passeport-senegal | permis-conduire-cedeao | auto</li>
                                    <li>- fraudCheck | returnConfidence | returnRawText (ou champ unique options JSON)</li>
                                </ul>
                            </div>
                            <div className="bg-zinc-950 rounded-2xl p-6 border border-white/10 text-xs text-green-400 font-mono overflow-x-auto">
                                <pre>{`# Réponse (exemple)
{
  "id": "ext_1773232267885",
  "status": "completed",
  "documentType": "cni-senegal",
  "data": {
    "nom": { "value": "THIOMBANE", "confidence": 0.99 },
    "prenom": { "value": "IBRAHIMA", "confidence": 0.99 }
  },
  "globalConfidence": 0.95,
  "rawText": "...",
  "provider": "openrouter",
  "processingMs": 9000
}`}</pre>
                            </div>
                        </div>
                        <div className="mt-6 grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <p className="text-sm text-foreground/70">POST <span className="font-mono">/extract/async</span></p>
                                <p className="text-sm text-foreground/80">Même payload. Réponse: <span className="font-mono">{"{ extractionId, status: 'queued' }"}</span></p>
                                <p className="text-sm text-foreground/80">Récupération: GET <span className="font-mono">/extractions/:id</span></p>
                            </div>
                            <div className="bg-zinc-950 rounded-2xl p-6 border border-white/10 text-xs text-green-400 font-mono overflow-x-auto">
                                <pre>{`curl -X POST http://localhost:3009/v1/extract/async \\
  -H "Authorization: Bearer <TOKEN>" \\
  -F "file=@/chemin/vers/cni_recto.jpg" \\
  -F "documentType=cni-senegal"`}</pre>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-border rounded-3xl p-8">
                        <h3 className="text-2xl font-bold text-foreground mb-4">Templates</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <p className="text-sm text-foreground/80">GET <span className="font-mono">/templates</span></p>
                                <p className="text-sm text-foreground/80">GET <span className="font-mono">/templates/:slug</span></p>
                                <p className="text-sm text-foreground/80">POST/PUT/DELETE protégés (JWT)</p>
                            </div>
                            <div className="bg-zinc-950 rounded-2xl p-6 border border-white/10 text-xs text-green-400 font-mono overflow-x-auto">
                                <pre>{`# Création d'un template
curl -X POST http://localhost:3009/v1/templates \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Ma CNI",
    "slug": "ma-cni",
    "category": "identity",
    "country": "SN",
    "language": "fr",
    "fields": [
      { "key": "nom", "type": "string", "required": true }
    ]
  }'`}</pre>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-border rounded-3xl p-8">
                        <h3 className="text-2xl font-bold text-foreground mb-4">Scan Mobile (Mobile Handoff)</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <ul className="text-sm text-foreground/80 space-y-1">
                                    <li>- POST <span className="font-mono">/mobile-handoff/session</span> → {"{ sessionId }"}</li>
                                    <li>- GET <span className="font-mono">/mobile-handoff/session/:sessionId</span> → {"{ status, hasFile }"}</li>
                                    <li>- POST <span className="font-mono">/mobile-handoff/upload/:sessionId</span> (file)</li>
                                    <li>- GET <span className="font-mono">/mobile-handoff/consume/:sessionId</span> (récupération du fichier)</li>
                                </ul>
                            </div>
                            <div className="bg-zinc-950 rounded-2xl p-6 border border-white/10 text-xs text-green-400 font-mono overflow-x-auto">
                                <pre>{`curl -X POST http://localhost:3009/v1/mobile-handoff/session
curl -X POST http://localhost:3009/v1/mobile-handoff/upload/<SESSION_ID> \\
  -F "file=@/chemin/vers/photo.jpg"
curl -X GET  http://localhost:3009/v1/mobile-handoff/consume/<SESSION_ID> -OJ`}</pre>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 rounded-3xl p-8 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-12 opacity-5">
                            <Code size={200} className="text-white" />
                        </div>
                        <div className="relative z-10 max-w-2xl">
                            <h3 className="text-2xl font-bold text-white mb-4">Intégration rapide (cURL)</h3>
                            <div className="bg-black/50 p-6 rounded-2xl border border-white/5 font-mono text-xs text-green-400 overflow-x-auto shadow-inner">
                                <pre>
{`curl -X POST http://localhost:3009/v1/extract \\
  -H "Authorization: Bearer <TOKEN>" \\
  -F "file=@/chemin/vers/cni_recto.jpg" \\
  -F "documentType=cni-senegal" \\
  -F "fraudCheck=true" -F "returnConfidence=true" -F "returnRawText=false"`}
                                </pre>
                            </div>
                            <div className="mt-8">
                                <Link href="/register" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                    Obtenir ma clé API <Zap size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
