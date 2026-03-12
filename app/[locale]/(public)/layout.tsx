import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function PublicLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pt-20">{children}</main>
            <Footer locale={locale} />
        </div>
    );
}
