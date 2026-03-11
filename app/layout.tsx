import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kiriku - API d'identité pour l'Afrique",
  description: "L'infrastructure KYC complète pour les fintechs et banques.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

