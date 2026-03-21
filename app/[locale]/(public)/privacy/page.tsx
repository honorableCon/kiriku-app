"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, Globe } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="bg-background min-h-screen text-foreground selection:bg-primary selection:text-black font-mono overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 lg:py-32">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 text-[10px] font-bold tracking-widest text-primary mb-8 uppercase">
                        <Lock size={12} />
                        Security_Protocol :: Privacy_Policy
                    </div>

                    <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter mb-4 uppercase">
                        Politique de <span className="text-primary">Confidentialité</span>
                    </h1>
                    
                    <p className="text-foreground/40 text-xs mb-12 border-l border-primary/30 pl-4 py-1">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')} | VERSION_1.0.4
                    </p>

                    <div className="grid gap-8">
                        {/* Section 1 */}
                        <div className="tech-border bg-black/40 p-1">
                            <div className="bg-accent/5 p-8">
                                <div className="flex items-center gap-3 mb-6 text-primary">
                                    <Database size={20} />
                                    <h2 className="text-xl font-bold uppercase tracking-tight">1. Données collectées</h2>
                                </div>
                                <div className="space-y-4 text-foreground/60 font-sans leading-relaxed text-sm">
                                    <p>
                                        Kiriku collecte les informations strictement nécessaires à la fourniture de ses services d'IA Documentaire.
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                                        <li><span className="text-foreground font-bold">Données de compte :</span> Nom, adresse email et informations d'organisation lors de l'enregistrement.</li>
                                        <li><span className="text-foreground font-bold">Métadonnées techniques :</span> Adresses IP, identifiants de session et logs d'utilisation pour la sécurité et l'optimisation.</li>
                                        <li><span className="text-foreground font-bold">Documents sources :</span> Fichiers images ou PDF soumis pour l'extraction OCR.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="tech-border bg-black/40 p-1">
                            <div className="bg-accent/5 p-8">
                                <div className="flex items-center gap-3 mb-6 text-primary">
                                    <Shield size={20} />
                                    <h2 className="text-xl font-bold uppercase tracking-tight">2. Traitement des documents</h2>
                                </div>
                                <div className="space-y-4 text-foreground/60 font-sans leading-relaxed text-sm">
                                    <p>
                                        Les documents soumis à nos moteurs d'intelligence artificielle suivent un protocole de traitement rigoureux :
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                                        <div className="p-4 border border-border bg-black/50">
                                            <div className="text-[10px] font-bold text-primary mb-1 uppercase">Extraction_Sync</div>
                                            <p className="text-xs">Traitement immédiat en mémoire vive. Aucune persistance disque après le retour de l'API.</p>
                                        </div>
                                        <div className="p-4 border border-border bg-black/50">
                                            <div className="text-[10px] font-bold text-primary mb-1 uppercase">Stockage_Cloud</div>
                                            <p className="text-xs">Stockage crypté (AES-256) facultatif pour l'historique utilisateur, révocable à tout moment.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="tech-border bg-black/40 p-1">
                            <div className="bg-accent/5 p-8">
                                <div className="flex items-center gap-3 mb-6 text-primary">
                                    <Globe size={20} />
                                    <h2 className="text-xl font-bold uppercase tracking-tight">3. Sécurité & Droits</h2>
                                </div>
                                <div className="space-y-4 text-foreground/60 font-sans leading-relaxed text-sm">
                                    <p>
                                        Conformément au RGPD et aux législations locales sur la protection des données personnelles :
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                                        <li>Toutes les données sont cryptées en transit (TLS 1.3) et au repos.</li>
                                        <li>Vous disposez d'un droit d'accès, de rectification et d'effacement de vos données.</li>
                                        <li>Pour toute demande relative à vos données : <span className="text-primary font-bold">privacy@kiriku.sn</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 p-8 border border-border bg-accent/5 text-center">
                        <Eye className="w-8 h-8 text-primary/40 mx-auto mb-4" />
                        <p className="text-xs text-foreground/40 uppercase tracking-[0.2em]">Kiriku Protection Engine :: Active</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
