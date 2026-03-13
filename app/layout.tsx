import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Kiriku - API d'identité pour l'Afrique",
//   description: "L'infrastructure KYC complète pour les fintechs et banques.",
// };

const BASE_URL = "https://www.kiriku.app";
 
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
 
  // ── Titre
  title: {
    default: "Kiriku — API OCR & KYC pour l'Afrique de l'Ouest",
    template: "%s · Kiriku",
  },
 
  // ── Description
  description:
    "Kiriku est l'infrastructure KYC complète pour les fintechs et banques d'Afrique de l'Ouest. Extraction OCR de documents d'identité, détection de fraude et vérification biométrique via une API unifiée.",
 
  // ── Mots-clés
  keywords: [
    "OCR Sénégal",
    "KYC Afrique",
    "API identité",
    "extraction document",
    "CNI Sénégal",
    "vérification identité",
    "fintech Afrique de l'Ouest",
    "CEDEAO",
    "UEMOA",
    "détection fraude",
    "Kiriku",
  ],
 
  // ── Auteur / Éditeur
  authors: [{ name: "Kiriku", url: BASE_URL }],
  creator: "Kiriku",
  publisher: "Kiriku",
 
  // ── Canonique
  alternates: {
    canonical: "/",
    languages: {
      "fr-SN": "/fr",
      "en-US": "/en",
    },
  },
 
  // ── Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
 
  // ── Open Graph
  openGraph: {
    type: "website",
    locale: "fr_SN",
    alternateLocale: ["en_US"],
    url: BASE_URL,
    siteName: "Kiriku",
    title: "Kiriku — API OCR & KYC pour l'Afrique de l'Ouest",
    description:
      "Extrayez les données de vos documents d'identité en millisecondes. CNI, Passeport, Permis CEDEAO — une API, tous les documents.",
    images: [
      {
        url: "/og/og-default.png",  
        width: 1200,
        height: 630,
        alt: "Kiriku — API OCR & KYC pour l'Afrique de l'Ouest",
        type: "image/png",
      },
    ],
  },
 
  // ── Twitter / X Card
  twitter: {
    card: "summary_large_image",
    site: "@kiriku_app",        // à remplacer par votre handle
    creator: "@kiriku_app",
    title: "Kiriku — API OCR & KYC pour l'Afrique de l'Ouest",
    description:
      "Extrayez les données de vos documents d'identité en millisecondes. CNI, Passeport, Permis CEDEAO — une API, tous les documents.",
    images: ["/og/og-default.png"],
  },
 
  // ── Icons
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
 
  // ── Manifest PWA
  // manifest: "/site.webmanifest",
 
  // ── Thème couleur (mobile browser chrome)
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020202" },
    { media: "(prefers-color-scheme: light)", color: "#020202" },
  ],
 
  // ── Vérification Search Console / Bing
  // verification: {
  //   google: "VOTRE_CODE_GOOGLE",
  //   other: { "msvalidate.01": "VOTRE_CODE_BING" },
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

