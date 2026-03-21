"use client";

import { motion } from "framer-motion";
import { Scale, FileText, AlertCircle, ShieldCheck, Zap } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="bg-background min-h-screen text-foreground selection:bg-primary selection:text-black font-mono overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 lg:py-32 lg:pt-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 text-[10px] font-bold tracking-widest text-primary mb-8 uppercase">
                        <Scale size={12} />
                        Compliance_Module :: Terms_Of_Service
                    </div>

                    <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter mb-4 uppercase">
                        Conditions <span className="text-primary">d'utilisation</span>
                    </h1>
                    
                    <p className="text-foreground/40 text-xs mb-12 border-l border-primary/30 pl-4 py-1">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')} | VERSION_2.1.0
                    </p>

                    <div className="grid gap-8">
                        {/* Section 1 */}
                        <div className="tech-border bg-black/40 p-1">
                            <div className="bg-accent/5 p-8">
                                <div className="flex items-center gap-3 mb-6 text-primary">
                                    <Zap size={20} />
                                    <h2 className="text-xl font-bold uppercase tracking-tight">1. Utilisation du service</h2>
                                </div>
                                <div className="space-y-4 text-foreground/60 font-sans leading-relaxed text-sm">
                                    <p>
                                        En accédant au service Kiriku, vous acceptez d'être lié par les présentes conditions. Kiriku fournit une infrastructure d'intelligence documentaire cloud-native.
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                                        <li>Le service doit être utilisé conformément aux lois en vigueur.</li>
                                        <li>Il est interdit d'exploiter les APIs Kiriku pour traiter des documents illégaux ou frauduleux.</li>
                                        <li>Toute tentative de reverse-engineering sur nos modèles OCR est strictement prohibée.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="tech-border bg-black/40 p-1">
                            <div className="bg-accent/5 p-8">
                                <div className="flex items-center gap-3 mb-6 text-primary">
                                    <ShieldCheck size={20} />
                                    <h2 className="text-xl font-bold uppercase tracking-tight">2. Comptes & Clés API</h2>
                                </div>
                                <div className="space-y-4 text-foreground/60 font-sans leading-relaxed text-sm">
                                    <p>
                                        Votre identité numérique et vos accès sont sous votre entière responsabilité :
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                                        <div className="p-4 border border-border bg-black/50">
                                            <div className="text-[10px] font-bold text-primary mb-1 uppercase">API_Security</div>
                                            <p className="text-xs">Vos clés API sont strictement confidentielles. Ne les exposez jamais côté client (Frontend).</p>
                                        </div>
                                        <div className="p-4 border border-border bg-black/50">
                                            <div className="text-[10px] font-bold text-primary mb-1 uppercase">Account_Ownership</div>
                                            <p className="text-xs">Vous êtes responsable de toute activité générée via votre compte et vos identifiants.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="tech-border bg-black/40 p-1">
                            <div className="bg-accent/5 p-8">
                                <div className="flex items-center gap-3 mb-6 text-primary">
                                    <AlertCircle size={20} />
                                    <h2 className="text-xl font-bold uppercase tracking-tight">3. Limitation de responsabilité</h2>
                                </div>
                                <div className="space-y-4 text-foreground/60 font-sans leading-relaxed text-sm">
                                    <p>
                                        Kiriku utilise des modèles neuronaux probabilistes :
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                                        <li>Bien que notre précision soit supérieure à 99%, nous ne garantissons pas l'absence totale d'erreurs.</li>
                                        <li>Kiriku ne pourra être tenu responsable des décisions business basées sur les résultats d'extraction sans vérification humaine.</li>
                                        <li>Le service est fourni "tel quel" avec une garantie de disponibilité de 99.9%.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 p-8 border border-border bg-accent/5 text-center">
                        <FileText className="w-8 h-8 text-primary/40 mx-auto mb-4" />
                        <p className="text-xs text-foreground/40 uppercase tracking-[0.2em]">Kiriku Legal Framework :: Standard_Agreement</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
