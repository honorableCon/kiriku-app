"use client";

import { Book, Code, Terminal, Zap, ChevronRight, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';

const sections = [
    {
        titleKey: "quickStart",
        icon: Zap,
        description: "Apprenez à intégrer Kiriku en moins de 5 minutes.",
        links: ["Installation", "Authentification", "Votre première extraction"]
    },
    {
        titleKey: "apiReference",
        icon: Code,
        description: "Documentation détaillée de tous nos points de terminaison.",
        links: ["Documents ID", "Passeports", "Extraits de naissance", "NINEA"]
    },
    {
        titleKey: "sdks",
        icon: Terminal,
        description: "Bibliothèques prêtes à l'emploi pour vos langages préférés.",
        links: ["Node.js SDK", "Python Client", "PHP Library", "Postman Collection"]
    },
];

export default function DocsPage() {
    const t = useTranslations('docs');

    return (
        <div className="bg-black min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="max-w-3xl mb-16">
                    <div className="tech-border bg-primary/10 border-primary/20 inline-block px-4 py-2 mb-6">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest font-mono flex items-center gap-2">
                            <Book size={14} /> DOCUMENTATION
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-6 leading-tight font-mono uppercase tracking-wider">
                        {t('title')}
                    </h1>
                    <p className="text-lg text-foreground/70 mb-8 font-mono uppercase tracking-wider">
                        {t('subtitle')}
                    </p>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                        <input
                            type="text"
                            placeholder="SEARCH_DOCUMENTATION"
                            className="tech-border bg-black/60 border-border/40 w-full pl-12 pr-6 py-4 text-sm text-foreground font-mono focus:border-primary/40 outline-none placeholder:text-foreground/30 uppercase tracking-wider"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {sections.map((section) => (
                        <div key={section.titleKey} className="tech-border bg-black/40 border-border/40 p-6 hover:border-primary/40 hover:bg-black/50 transition-all group">
                            <div className="tech-border p-3 mb-6 w-fit">
                                <section.icon size={20} className="text-primary group-hover:scale-110 transition-transform" />
                            </div>
                            <h3 className="text-xl font-black text-foreground mb-3 font-mono uppercase tracking-wider">{t(section.titleKey)}</h3>
                            <p className="text-xs text-foreground/60 font-mono uppercase tracking-wider mb-6 leading-relaxed">
                                {section.description}
                            </p>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <button className="text-xs font-black text-foreground/80 hover:text-primary flex items-center gap-1 group/link transition-colors font-mono uppercase tracking-wider">
                                            {link} <ChevronRight size={12} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="tech-border bg-black/40 border-primary/20 p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="tech-border bg-primary/20 border-primary/40 p-2">
                            <Zap size={16} className="text-primary" />
                        </div>
                        <h3 className="text-xl font-black text-foreground font-mono uppercase tracking-wider">Authentification</h3>
                    </div>
                    <div className="space-y-4">
                        <p className="text-xs text-foreground/60 font-mono uppercase tracking-wider">
                            Toutes les requêtes API sécurisées acceptent une API key ou un JWT. Pour les intégrations externes, privilégiez l'API key.
                        </p>
                        <div className="tech-border bg-black/60 border-border/40 p-4 text-xs text-primary/80 font-mono overflow-x-auto">
                            <pre>{`# API key (recommandé)
X-API-Key: sk_...

# JWT (web app)
Authorization: Bearer <YOUR_JWT_TOKEN>

# Obtenir votre token via l'endpoint d'authentification
curl -X POST https://api.kiriku.app/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "votre@email.com",
    "password": "votre_mot_de_passe"
  }'`}</pre>
                        </div>
                        <div className="tech-border bg-black/60 border-border/40 p-4">
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-2 font-mono">ACTIVATION COMPTE</p>
                            <p className="text-xs text-foreground/70 font-mono">L'email doit être vérifié pour activer le compte.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="tech-border bg-black/60 border-border/40 p-4">
                                <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-2 font-mono">DURÉE DE VALIDITÉ</p>
                                <p className="text-xs text-foreground/70 font-mono">JWT: 24 heures</p>
                            </div>
                            <div className="tech-border bg-black/60 border-border/40 p-4">
                                <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-2 font-mono">API KEY</p>
                                <p className="text-xs text-foreground/70 font-mono">Persistante, révocable</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tech-border bg-black/40 border-primary/20 p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="tech-border bg-primary/20 border-primary/40 p-2">
                            <Book size={16} className="text-primary" />
                        </div>
                        <h3 className="text-xl font-black text-foreground font-mono uppercase tracking-wider">Types de Documents Supportés</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="tech-border bg-black/60 border-border/40 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-[10px] text-primary font-black uppercase tracking-widest font-mono">CNI SÉNÉGAL</p>
                            </div>
                            <p className="text-xs text-foreground/70 font-mono leading-relaxed">Carte d'identité nationale sénégalaise, recto et verso</p>
                        </div>
                        <div className="tech-border bg-black/60 border-border/40 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-[10px] text-primary font-black uppercase tracking-widest font-mono">PASSEPORT SÉNÉGAL</p>
                            </div>
                            <p className="text-xs text-foreground/70 font-mono leading-relaxed">Passeport biométrique sénégalais</p>
                        </div>
                        <div className="tech-border bg-black/60 border-border/40 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-[10px] text-primary font-black uppercase tracking-widest font-mono">PERMIS CONDUIRE CEDEAO</p>
                            </div>
                            <p className="text-xs text-foreground/70 font-mono leading-relaxed">Permis de conduire CEDEAO (format uniformisé)</p>
                        </div>
                        <div className="tech-border bg-black/60 border-border/40 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-[10px] text-primary font-black uppercase tracking-widest font-mono">AUTO</p>
                            </div>
                            <p className="text-xs text-foreground/70 font-mono leading-relaxed">Détection automatique du type de document</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                        <div className="tech-border bg-black/40 border-primary/20 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="tech-border bg-primary/20 border-primary/40 p-2">
                                <Zap size={16} className="text-primary" />
                            </div>
                            <h3 className="text-xl font-black text-foreground font-mono uppercase tracking-wider">Démarrage rapide</h3>
                        </div>
                        <p className="text-xs text-foreground/60 font-mono uppercase tracking-wider mb-6">
                            Base URL: <span className="text-primary font-black">https://api.kiriku.app/v1</span>. Les appels d'écriture nécessitent une API key ou un JWT.
                        </p>
                        <div className="tech-border bg-black/60 border-border/40 p-4 text-xs text-primary/80 font-mono overflow-x-auto mb-4">
                            <pre>{`# Extraction rapide (multipart) - envoi des options en champs séparés (recommandé)
curl -X POST https://api.kiriku.app/v1/extract \\
  -H "X-API-Key: <YOUR_API_KEY>" \\
  -F "file=@/chemin/vers/cni_recto.jpg" \\
  -F "documentType=cni-senegal" \\
  -F "fraudCheck=true" \\
  -F "returnConfidence=true" \\
  -F "returnRawText=false"`}</pre>
                        </div>
                        <div className="tech-border bg-black/60 border-border/40 p-4 text-xs text-primary/80 font-mono overflow-x-auto">
                            <pre>{`# Variante: envoi des options dans un seul champ JSON
curl -X POST https://api.kiriku.app/v1/extract \\
  -H "X-API-Key: <YOUR_API_KEY>" \\
  -F "file=@/chemin/vers/cni_recto.jpg" \\
  -F "documentType=cni-senegal" \\
  -F "options={\\"fraudCheck\\":true,\\"returnConfidence\\":true,\\"returnRawText\\":false}"`}</pre>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-6">
                            <div className="tech-border bg-black/60 border-border/40 p-4">
                                <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-2 font-mono">JAVASCRIPT</p>
                                <div className="tech-border bg-black/60 border-border/40 p-3 text-xs text-primary/80 font-mono overflow-x-auto">
                                    <pre>{`const formData = new FormData();
formData.append('file', fileInput);
formData.append('documentType', 'cni-senegal');
formData.append('fraudCheck', 'true');

const response = await fetch(
  'https://api.kiriku.app/v1/extract',
  {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey
    },
    body: formData
  }
);

const result = await response.json();`}</pre>
                                </div>
                            </div>
                            <div className="tech-border bg-black/60 border-border/40 p-4">
                                <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-2 font-mono">PYTHON</p>
                                <div className="tech-border bg-black/60 border-border/40 p-3 text-xs text-primary/80 font-mono overflow-x-auto">
                                    <pre>{`import requests

url = "https://api.kiriku.app/v1/extract"
headers = {
    "X-API-Key": apiKey
}
files = {
    "file": open("cni_recto.jpg", "rb")
}
data = {
    "documentType": "cni-senegal",
    "fraudCheck": "true",
    "returnConfidence": "true"
}

response = requests.post(
    url, headers=headers,
    files=files, data=data
)
result = response.json()`}</pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tech-border bg-black/40 border-primary/20 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="tech-border bg-primary/20 border-primary/40 p-2">
                                <Terminal size={16} className="text-primary" />
                            </div>
                            <h3 className="text-xl font-black text-foreground font-mono uppercase tracking-wider">Gestion des Erreurs</h3>
                        </div>
                        <div className="space-y-4">
                            <p className="text-xs text-foreground/60 font-mono uppercase tracking-wider">
                                L'API retourne des codes HTTP standard et des messages d'erreur structurés.
                            </p>
                            <div className="tech-border bg-black/60 border-border/40 p-4 text-xs text-primary/80 font-mono overflow-x-auto">
                                <pre>{`# Structure des réponses d'erreur
{
  "error": {
    "code": "INVALID_DOCUMENT_TYPE",
    "message": "Type de document non supporté",
    "details": {
      "provided": "passport-france",
      "allowed": ["cni-senegal", "passeport-senegal", "permis-conduire-cedeao", "auto"]
    }
  }
}`}</pre>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="tech-border bg-black/60 border-border/40 p-3">
                                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1 font-mono">400</p>
                                    <p className="text-[10px] text-foreground/70 font-mono leading-tight">Requête invalide</p>
                                </div>
                                <div className="tech-border bg-black/60 border-border/40 p-3">
                                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1 font-mono">401</p>
                                    <p className="text-[10px] text-foreground/70 font-mono leading-tight">Non authentifié</p>
                                </div>
                                <div className="tech-border bg-black/60 border-border/40 p-3">
                                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1 font-mono">403</p>
                                    <p className="text-[10px] text-foreground/70 font-mono leading-tight">Accès refusé</p>
                                </div>
                                <div className="tech-border bg-black/60 border-border/40 p-3">
                                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1 font-mono">429</p>
                                    <p className="text-[10px] text-foreground/70 font-mono leading-tight">Trop de requêtes</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tech-border bg-black/40 border-primary/20 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="tech-border bg-primary/20 border-primary/40 p-2">
                                <Code size={16} className="text-primary" />
                            </div>
                            <h3 className="text-xl font-black text-foreground font-mono uppercase tracking-wider">Référence Extraction</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <p className="text-xs text-foreground/60 font-mono uppercase tracking-wider">POST <span className="text-primary font-black">/extract</span></p>
                                <ul className="text-xs text-foreground/70 font-mono uppercase tracking-wider space-y-1">
                                    <li>- file: image/jpeg|png|webp, application/pdf</li>
                                    <li>- fileBack (optionnel)</li>
                                    <li>- documentType: cni-senegal | passeport-senegal | permis-conduire-cedeao | auto</li>
                                    <li>- fraudCheck | returnConfidence | returnRawText (ou champ unique options JSON)</li>
                                </ul>
                            </div>
                            <div className="tech-border bg-black/60 border-border/40 p-4 text-xs text-primary/80 font-mono overflow-x-auto">
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
                                <p className="text-xs text-foreground/60 font-mono uppercase tracking-wider">POST <span className="text-primary font-black">/extract/async</span></p>
                                <p className="text-xs text-foreground/70 font-mono uppercase tracking-wider">Même payload. Réponse: <span className="text-primary font-black">{"{ extractionId, status: 'queued' }"}</span></p>
                                <p className="text-xs text-foreground/70 font-mono uppercase tracking-wider">Récupération: GET <span className="text-primary font-black">/extractions/:id</span></p>
                            </div>
                            <div className="tech-border bg-black/60 border-border/40 p-4 text-xs text-primary/80 font-mono overflow-x-auto">
                                <pre>{`curl -X POST https://api.kiriku.app/v1/extract/async \\
  -H "Authorization: Bearer <TOKEN>" \\
  -F "file=@/chemin/vers/cni_recto.jpg" \\
  -F "documentType=cni-senegal"`}</pre>
                            </div>
                        </div>
                    </div>

                    <div className="tech-border bg-black/40 border-primary/20 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="tech-border bg-primary/20 border-primary/40 p-2">
                                <Terminal size={16} className="text-primary" />
                            </div>
                            <h3 className="text-xl font-black text-foreground font-mono uppercase tracking-wider">Templates</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <p className="text-xs text-foreground/70 font-mono uppercase tracking-wider">GET <span className="text-primary font-black">/templates</span></p>
                                <p className="text-xs text-foreground/70 font-mono uppercase tracking-wider">GET <span className="text-primary font-black">/templates/:slug</span></p>
                                <p className="text-xs text-foreground/70 font-mono uppercase tracking-wider">POST/PUT/DELETE protégés (JWT)</p>
                            </div>
                            <div className="tech-border bg-black/60 border-border/40 p-4 text-xs text-primary/80 font-mono overflow-x-auto">
                                <pre>{`# Création d'un template
curl -X POST https://api.kiriku.app/v1/templates \\
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

                    <div className="tech-border bg-black/40 border-primary/20 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="tech-border bg-primary/20 border-primary/40 p-2">
                                <Zap size={16} className="text-primary" />
                            </div>
                            <h3 className="text-xl font-black text-foreground font-mono uppercase tracking-wider">Scan Mobile (Mobile Handoff)</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <ul className="text-xs text-foreground/70 font-mono uppercase tracking-wider space-y-1">
                                    <li>- POST <span className="text-primary font-black">/mobile-handoff/session</span> → {"{ sessionId }"}</li>
                                    <li>- GET <span className="text-primary font-black">/mobile-handoff/session/:sessionId</span> → {"{ status, hasFile }"}</li>
                                    <li>- POST <span className="text-primary font-black">/mobile-handoff/upload/:sessionId</span> (file)</li>
                                    <li>- GET <span className="text-primary font-black">/mobile-handoff/consume/:sessionId</span> (récupération du fichier)</li>
                                </ul>
                            </div>
                            <div className="tech-border bg-black/60 border-border/40 p-4 text-xs text-primary/80 font-mono overflow-x-auto">
                                <pre>{`curl -X POST https://api.kiriku.app/v1/mobile-handoff/session
curl -X POST https://api.kiriku.app/v1/mobile-handoff/upload/<SESSION_ID> \\
  -F "file=@/chemin/vers/photo.jpg"
curl -X GET  https://api.kiriku.app/v1/mobile-handoff/consume/<SESSION_ID> -OJ`}</pre>
                            </div>
                        </div>
                    </div>

                    <div className="tech-border bg-black/60 border-primary/40 p-8 overflow-hidden relative shadow-[0_0_30px_rgba(0,166,81,0.1)]">
                        <div className="absolute top-0 right-0 p-12 opacity-5">
                            <Code size={200} className="text-foreground" />
                        </div>
                        <div className="relative z-10 max-w-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="tech-border bg-primary/20 border-primary/40 p-2">
                                    <Zap size={16} className="text-primary" />
                                </div>
                                <h3 className="text-xl font-black text-foreground font-mono uppercase tracking-wider">Intégration rapide (cURL)</h3>
                            </div>
                            <div className="tech-border bg-black/60 border-border/40 p-4 text-xs text-primary/80 font-mono overflow-x-auto shadow-inner">
                                <pre>
{`curl -X POST https://api.kiriku.app/v1/extract \\
  -H "Authorization: Bearer <TOKEN>" \\
  -F "file=@/chemin/vers/cni_recto.jpg" \\
  -F "documentType=cni-senegal" \\
  -F "fraudCheck=true" -F "returnConfidence=true" -F "returnRawText=false"`}
                                </pre>
                            </div>
                            <div className="mt-8">
                                <Link href="/register" className="tech-border bg-primary text-foreground border-primary px-6 py-3 text-xs font-black uppercase tracking-wider hover:bg-primary/90 transition-all font-mono flex items-center gap-2 inline-flex">
                                    Obtenir ma clé API <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
