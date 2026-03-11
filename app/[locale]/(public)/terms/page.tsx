"use client";

export default function TermsPage() {
    return (
        <div className="bg-white dark:bg-black min-h-screen py-24">
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="text-4xl font-extrabold text-foreground mb-8">Conditions d'utilisation</h1>
                <div className="prose dark:prose-invert max-w-none text-foreground/60 space-y-6">
                    <p className="font-medium text-foreground">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
                    <p>
                        Bienvenue sur Kiriku. En utilisant nos services, vous acceptez les présentes conditions.
                        Veuillez les lire attentivement.
                    </p>
                    <h2 className="text-xl font-bold text-foreground">1. Utilisation du service</h2>
                    <p>
                        Kiriku fournit des services d'extraction de données par OCR. Vous vous engagez à ne pas
                        utiliser le service pour traiter des documents obtenus de manière illégale.
                    </p>
                    <h2 className="text-xl font-bold text-foreground">2. Comptes utilisateur</h2>
                    <p>
                        Vous êtes responsable de la sécurité de votre compte et de vos clés API.
                        Toute activité effectuée sous votre compte est de votre responsabilité.
                    </p>
                    <h2 className="text-xl font-bold text-foreground">3. Limitation de responsabilité</h2>
                    <p>
                        Kiriku s'efforce de fournir la meilleure précision possible, mais ne peut garantir
                        une précision de 100% sur tous les types de documents.
                    </p>
                </div>
            </div>
        </div>
    );
}
