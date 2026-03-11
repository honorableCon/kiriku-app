"use client";

export default function PrivacyPage() {
    return (
        <div className="bg-white dark:bg-black min-h-screen py-24">
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="text-4xl font-extrabold text-foreground mb-8">Politique de Confidentialité</h1>
                <div className="prose dark:prose-invert max-w-none text-foreground/60 space-y-6">
                    <p className="font-medium text-foreground">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
                    <p>
                        Chez Kiriku, nous prenons la protection de vos données très au sérieux.
                        Cette politique détaille comment nous traitons les informations que vous nous confiez.
                    </p>
                    <h2 className="text-xl font-bold text-foreground">1. Données collectées</h2>
                    <p>
                        Nous collectons les informations nécessaires à la création de votre compte (nom, email)
                        et les documents que vous soumettez à l'extraction.
                    </p>
                    <h2 className="text-xl font-bold text-foreground">2. Traitement des documents</h2>
                    <p>
                        Les documents soumis sont traités uniquement pour l'extraction de données.
                        Ils sont supprimés de nos serveurs de traitement immédiatement après traitement,
                        sauf si vous choisissez de les conserver dans votre historique.
                    </p>
                    <h2 className="text-xl font-bold text-foreground">3. Sécurité</h2>
                    <p>
                        Toutes les communications avec Kiriku sont cryptées via SSL/TLS.
                        Vos données sont stockées sur des serveurs sécurisés.
                    </p>
                </div>
            </div>
        </div>
    );
}
