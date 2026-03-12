"use client";

import Link from "next/link";
import { Menu, X, ArrowRight, Globe, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from 'next-intl';
import { useSession, signOut } from "next-auth/react";

const navigation = [
    { name: "FEATURES", href: "/#features", label: "FEATURES" },
    { name: "PRICING", href: "/pricing", label: "PRICING" },
    { name: "DOCS", href: "/docs", label: "DOCUMENTATION" },
];

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showLangSwitch, setShowLangSwitch] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const currentLocale = useLocale();
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";

    const switchLocale = (newLocale: string) => {
        const path = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
        router.push(path || `/${newLocale}`);
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: `/${currentLocale}/` });
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Hide navbar on dashboard pages
    if (pathname?.startsWith("/dashboard")) return null;

    return (
        <header 
            className={cn(
                "fixed inset-x-0 top-0 z-50 transition-all duration-300",
                scrolled ? "bg-black/90 backdrop-blur-md border-b border-primary/20 py-3" : "bg-transparent py-5"
            )}
        >
            <nav className="flex items-center justify-between px-6 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3 group">
                        <div className="w-10 h-10 tech-border bg-primary/10 border-primary/40 flex items-center justify-center group-hover:border-primary/60 group-hover:bg-primary/20 transition-all duration-300">
                            <span className="text-primary font-black text-xl font-mono animate-pulse">K</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-wight text-white font-mono uppercase">Kiriku</span>
                            <span className="text-[8px] text-foreground/50 font-mono uppercase tracking-widest">EXTRACTION_PLATFORM</span>
                        </div>
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="tech-border bg-black/40 border-border/60 inline-flex items-center justify-center p-2.5 text-foreground/60 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-8">
                    {navigation.map((item) => (
                        <Link 
                            key={item.name} 
                            href={`/${currentLocale}${item.href}`} 
                            className="text-[10px] font-black text-foreground/50 hover:text-primary transition-colors font-mono uppercase tracking-wider hover:border-b hover:border-primary/50 pb-1"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3 items-center">
                    <div className="relative">
                        <button
                            onClick={() => setShowLangSwitch(!showLangSwitch)}
                            className="tech-border bg-black/40 border-border/60 p-2 text-foreground/60 hover:text-primary transition-colors"
                        >
                            <Globe className="w-4 h-4" />
                        </button>
                        {showLangSwitch && (
                            <div className="absolute right-0 mt-2 w-32 tech-border bg-black/90 border-primary/20 shadow-xl">
                                <button
                                    onClick={() => { switchLocale('fr'); setShowLangSwitch(false); }}
                                    className={cn(
                                        "w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors",
                                        currentLocale === 'fr' ? "text-primary bg-primary/10" : "text-foreground/60 hover:text-primary"
                                    )}
                                >
                                    FR
                                </button>
                                <button
                                    onClick={() => { switchLocale('en'); setShowLangSwitch(false); }}
                                    className={cn(
                                        "w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors",
                                        currentLocale === 'en' ? "text-primary bg-primary/10" : "text-foreground/60 hover:text-primary"
                                    )}
                                >
                                    EN
                                </button>
                            </div>
                        )}
                    </div>
                    {isAuthenticated ? (
                        <>
                            <Link
                                href={`/${currentLocale}/dashboard/overview`}
                                className="text-xs font-black text-foreground/60 hover:text-primary transition-colors px-4 font-mono uppercase tracking-wider"
                            >
                                DASHBOARD
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="tech-border bg-red-500/10 border-red-500/40 text-red-500 px-5 py-2 text-xs font-black hover:bg-red-500/20 transition-all font-mono uppercase tracking-wider flex items-center gap-2"
                            >
                                LOGOUT
                                <LogOut className="w-3 h-3" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href={`/${currentLocale}/login`} className="text-xs font-black text-foreground/60 hover:text-primary transition-colors px-4 font-mono uppercase tracking-wider">
                                LOGIN
                            </Link>
                            <Link
                                href={`/${currentLocale}/register`}
                                className="tech-border bg-primary/10 border-primary/40 text-primary px-5 py-2 text-xs font-black hover:bg-primary/20 transition-all font-mono uppercase tracking-wider flex items-center gap-2"
                            >
                                REGISTER
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Mobile menu */}
            <div className={cn(
                "lg:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-xl transition-all duration-300",
                mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
            )}>
                <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto px-6 py-6 sm:max-w-sm tech-border border-l border-primary/20 bg-black">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                            <div className="w-8 h-8 tech-border bg-primary/10 border-primary/40 flex items-center justify-center">
                                <span className="text-primary font-bold text-xl font-mono animate-pulse">K</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-black tracking-wight text-white font-mono uppercase">Kiriku</span>
                                <span className="text-[8px] text-foreground/50 font-mono uppercase tracking-widest">EXTRACTION_PLATFORM</span>
                            </div>
                        </Link>
                        <button
                            type="button"
                            className="tech-border bg-black/40 border-border/60 p-2.5 text-foreground/60 hover:text-primary"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-8 flow-root">
                        <div className="-my-6 tech-border border-primary/10 divide-y divide-primary/10">
                            <div className="space-y-1 py-6">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={`/${currentLocale}${item.href}`}
                                        className="tech-border bg-black/40 border-border/40 block px-4 py-3 text-xs font-black leading-7 text-foreground/80 hover:text-primary hover:border-primary/50 transition-colors font-mono uppercase tracking-wider"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="py-6 flex flex-col gap-3">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { switchLocale('fr'); }}
                                        className={cn(
                                            "flex-1 tech-border border-border/40 px-4 py-3 text-xs font-black transition-colors font-mono uppercase tracking-wider",
                                            currentLocale === 'fr' ? "text-primary bg-primary/10 border-primary/40" : "text-foreground/80 hover:text-primary bg-black/40"
                                        )}
                                    >
                                        FR
                                    </button>
                                    <button
                                        onClick={() => { switchLocale('en'); }}
                                        className={cn(
                                            "flex-1 tech-border border-border/40 px-4 py-3 text-xs font-black transition-colors font-mono uppercase tracking-wider",
                                            currentLocale === 'en' ? "text-primary bg-primary/10 border-primary/40" : "text-foreground/80 hover:text-primary bg-black/40"
                                        )}
                                    >
                                        EN
                                    </button>
                                </div>
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            href={`/${currentLocale}/dashboard/overview`}
                                            className="tech-border bg-black/40 border-border/40 block px-4 py-3 text-xs font-black leading-7 text-foreground/80 hover:text-primary hover:border-primary/50 transition-colors font-mono uppercase tracking-wider"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            DASHBOARD
                                        </Link>
                                        <button
                                            onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                            className="w-full flex items-center justify-center gap-2 tech-border bg-red-500/10 border-red-500/40 px-4 py-3 text-xs font-black text-red-500 hover:bg-red-500/20 transition-all font-mono uppercase tracking-wider"
                                        >
                                            LOGOUT
                                            <LogOut className="w-3 h-3" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href={`/${currentLocale}/login`}
                                            className="tech-border bg-black/40 border-border/40 block px-4 py-3 text-xs font-black leading-7 text-foreground/80 hover:text-primary hover:border-primary/50 transition-colors font-mono uppercase tracking-wider"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            LOGIN
                                        </Link>
                                        <Link
                                            href={`/${currentLocale}/register`}
                                            className="w-full flex items-center justify-center gap-2 tech-border bg-primary/10 border-primary/40 px-4 py-3 text-xs font-black text-primary hover:bg-primary/20 transition-all font-mono uppercase tracking-wider"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            INITIALIZE
                                            <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
