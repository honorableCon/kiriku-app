import Link from "next/link";

interface FooterProps {
    locale?: string;
}

export default function Footer({ locale = 'fr' }: FooterProps) {
    return (
        <footer className="bg-black/90 border-t border-primary/20">
            <div className="mx-auto max-w-7xl px-6 py-8 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-4 md:order-2">
                    <Link href={`/${locale}/terms`} className="tech-border bg-black/40 border-border/40 px-4 py-2 text-[10px] font-black leading-6 text-foreground/60 hover:text-primary hover:border-primary/50 transition-all font-mono uppercase tracking-wider">
                        TERMS
                    </Link>
                    <Link href={`/${locale}/privacy`} className="tech-border bg-black/40 border-border/40 px-4 py-2 text-[10px] font-black leading-6 text-foreground/60 hover:text-primary hover:border-primary/50 transition-all font-mono uppercase tracking-wider">
                        PRIVACY
                    </Link>
                    <Link href={`/${locale}/docs`} className="tech-border bg-black/40 border-border/40 px-4 py-2 text-[10px] font-black leading-6 text-foreground/60 hover:text-primary hover:border-primary/50 transition-all font-mono uppercase tracking-wider">
                        DOCS
                    </Link>
                </div>
                <div className="mt-6 md:order-1 md:mt-0">
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-center text-[10px] leading-4 text-foreground/50 font-mono uppercase tracking-wider">
                            &copy; {new Date().getFullYear()} KIRiku // EXTRACTION_PLATFORM
                        </p>
                        <p className="text-center text-[9px] leading-3 text-foreground/40 font-mono uppercase tracking-widest">
                            [SENEGAL] // [AFRICA] // SYSTEM_ACTIVE
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
