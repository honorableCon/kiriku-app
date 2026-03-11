"use client";

import { motion } from "framer-motion";
import { MoveRight, ShieldCheck, Zap, Database, Server, Code, Terminal, Scan, Activity, Lock, Cpu } from "lucide-react";
import Link from "next/link";

const partners = [
    { name: 'ORANGE_MONEY', color: '#ff7900' },
    { name: 'WAVE', color: '#1dc4ff' },
    { name: 'FREE_MONEY', color: '#d90025' },
    { name: 'ORABANK', color: '#006633' },
    { name: 'BAOBAB', color: '#c41230' },
];

export default function LandingPage() {
    return (
        <div className="bg-background overflow-hidden text-foreground selection:bg-primary selection:text-black min-h-screen font-mono">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32 border-b border-border/50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div 
                            className="flex-1 text-left"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 text-[10px] font-bold tracking-widest text-primary mb-8 uppercase">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                                </span>
                                System_Online :: v2.4.0
                            </div>
                            
                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-8 leading-none uppercase">
                                Identity <br />
                                <span className="text-primary">Intelligence</span> <br />
                                Protocol
                            </h1>
                            
                            <p className="mt-6 max-w-xl text-lg text-foreground/60 leading-relaxed font-sans border-l-2 border-primary/30 pl-6">
                                Advanced KYC infrastructure for West African fintechs. 
                                Neural OCR extraction, fraud detection, and biometric verification via a unified API gateway.
                            </p>

                            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                                <Link
                                    href="/register"
                                    className="w-full sm:w-auto px-8 py-4 bg-primary text-black font-bold text-sm tracking-widest uppercase hover:bg-white transition-all flex items-center justify-center gap-2 clip-path-polygon group"
                                >
                                    Initialize_Access
                                    <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link 
                                    href="/docs" 
                                    className="w-full sm:w-auto px-8 py-4 border border-border bg-black/50 text-foreground font-bold text-sm tracking-widest uppercase hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2"
                                >
                                    <Terminal className="w-4 h-4" />
                                    Read_Documentation
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="flex-1 w-full max-w-lg lg:max-w-none"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative tech-border bg-black/80 p-1">
                                <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary" />
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary" />
                                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary" />
                                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary" />
                                
                                <div className="bg-accent/5 p-6 space-y-6">
                                    <div className="flex items-center justify-between border-b border-border pb-4">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full opacity-50" />
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-50" />
                                            <div className="w-3 h-3 bg-green-500 rounded-full opacity-50" />
                                        </div>
                                        <div className="text-[10px] text-foreground/40 font-mono">ID_VERIFICATION_MODULE</div>
                                    </div>

                                    <div className="space-y-4 font-mono text-xs">
                                        <div className="flex gap-4">
                                            <div className="w-8 text-foreground/30">01</div>
                                            <div className="text-secondary">POST <span className="text-foreground">/v1/extract</span></div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-8 text-foreground/30">02</div>
                                            <div className="text-foreground">Authorization: <span className="text-primary">Bearer sk_live_...</span></div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-8 text-foreground/30">03</div>
                                            <div className="text-foreground">Content-Type: <span className="text-orange-400">multipart/form-data</span></div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-8 text-foreground/30">04</div>
                                            <div className="pl-4 border-l border-border space-y-2 w-full">
                                                <div className="flex justify-between">
                                                    <span className="text-blue-400">"status"</span>
                                                    <span className="text-primary">"completed"</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-blue-400">"confidence"</span>
                                                    <span className="text-primary">0.99</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-blue-400">"fraud_score"</span>
                                                    <span className="text-primary">0.02</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-px w-full bg-border my-4" />
                                        <div className="flex items-center gap-2 text-primary animate-pulse">
                                            <Activity size={14} />
                                            <span>PROCESSING_COMPLETE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-12">
                        {[
                            { label: 'OCR_ACCURACY', value: '99.2%' },
                            { label: 'LATENCY', value: '< 2000ms' },
                            { label: 'REGIONS', value: '8+' },
                            { label: 'UPTIME', value: '99.99%' },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <span className="text-3xl font-bold text-foreground font-sans">{stat.value}</span>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <section className="py-12 border-b border-border bg-accent/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <p className="text-center text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em] mb-8">
                        Trusted_By_Industry_Leaders
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-50 hover:opacity-100 transition-opacity duration-500">
                        {partners.map((partner) => (
                            <span key={partner.name} className="text-lg font-bold tracking-widest text-foreground font-mono">{partner.name}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 relative z-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-primary font-bold tracking-widest uppercase text-xs mb-4">Core_Capabilities</h2>
                        <h3 className="text-4xl font-bold text-foreground mb-6 uppercase tracking-tight">
                            Digital Identity <br /> Suite
                        </h3>
                        <p className="text-foreground/60 font-sans text-lg">
                            Engineered for the specific challenges of the African market.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Database,
                                title: "LOCAL_MODELS",
                                desc: "Neural networks trained on thousands of UEMOA documents for unmatched precision on local ID cards and passports."
                            },
                            {
                                icon: ShieldCheck,
                                title: "FRAUD_DETECTION",
                                desc: "Automated analysis of image tampering, photocopies, and MRZ consistency checks."
                            },
                            {
                                icon: Server,
                                title: "DATA_SOVEREIGNTY",
                                desc: "Infrastructure deployed locally or compliant with CDP regulations. Your user data remains secure."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="tech-border bg-black/40 p-8 hover:bg-accent/5 transition-all group">
                                <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-black transition-colors">
                                    <feature.icon className="w-6 h-6 text-primary group-hover:text-black" />
                                </div>
                                <h4 className="text-lg font-bold text-foreground mb-3 uppercase tracking-wide">{feature.title}</h4>
                                <p className="text-foreground/60 text-sm font-sans leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden border-t border-border">
                <div className="absolute inset-0 bg-primary/5" />
                <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-block p-4 border border-primary/20 bg-black/50 backdrop-blur-sm mb-8">
                        <Cpu className="w-12 h-12 text-primary mx-auto animate-pulse" />
                    </div>
                    <h2 className="text-4xl font-bold text-foreground mb-8 uppercase tracking-tight">
                        Ready to Integrate?
                    </h2>
                    <p className="text-foreground/60 mb-12 max-w-2xl mx-auto font-sans">
                        Get your API keys in 2 minutes. 100 free extractions included.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="w-full sm:w-auto px-12 py-4 bg-primary text-black font-bold text-sm tracking-widest uppercase hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,148,0.3)]"
                        >
                            Create_Account
                        </Link>
                        <Link 
                            href="/contact" 
                            className="w-full sm:w-auto px-12 py-4 border border-border bg-black text-foreground font-bold text-sm tracking-widest uppercase hover:border-primary transition-all"
                        >
                            Contact_Sales
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
