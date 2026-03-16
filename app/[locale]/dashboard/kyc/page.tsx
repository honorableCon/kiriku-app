"use client";

import { useState } from "react";
import { ShieldCheck, UserCheck, Search, Activity, AlertTriangle, CheckCircle2, RefreshCcw, Camera } from "lucide-react";
import { toast } from "sonner";
import { checkLiveness, matchFaces, screenAml, calculateKycScore } from "@/lib/kyc";
import type { LivenessResult, FaceMatchResult, AmlResult, KycScoreResult } from "@/lib/kyc";
import { cn } from "@/lib/utils";

export default function KycPage() {
    const [activeTab, setActiveTab] = useState<'liveness' | 'match' | 'aml' | 'score'>('liveness');
    
    // Liveness State
    const [livenessFile, setLivenessFile] = useState<File | null>(null);
    const [livenessResult, setLivenessResult] = useState<LivenessResult | null>(null);
    const [isLivenessLoading, setIsLivenessLoading] = useState(false);

    // Match State
    const [matchRefFile, setMatchRefFile] = useState<File | null>(null);
    const [matchLiveFile, setMatchLiveFile] = useState<File | null>(null);
    const [matchResult, setMatchResult] = useState<FaceMatchResult | null>(null);
    const [isMatchLoading, setIsMatchLoading] = useState(false);

    // AML State
    const [amlData, setAmlData] = useState({ firstName: '', lastName: '', dateOfBirth: '', nationality: '', documentNumber: '' });
    const [amlResult, setAmlResult] = useState<AmlResult | null>(null);
    const [isAmlLoading, setIsAmlLoading] = useState(false);

    // Score State
    const [scoreExtractionId, setScoreExtractionId] = useState('');
    const [scoreSelfieFile, setScoreSelfieFile] = useState<File | null>(null);
    const [scoreEnableAml, setScoreEnableAml] = useState(false);
    const [scoreResult, setScoreResult] = useState<KycScoreResult | null>(null);
    const [isScoreLoading, setIsScoreLoading] = useState(false);

    const handleScoreSubmit = async () => {
        if (!scoreExtractionId || !scoreSelfieFile) {
            toast.error("L'ID d'extraction et le selfie sont requis.");
            return;
        }

        setIsScoreLoading(true);
        setScoreResult(null);

        try {
            const selfieBase64 = await fileToBase64(scoreSelfieFile);
            const result = await calculateKycScore({
                extractionId: scoreExtractionId,
                selfieBase64,
                enableAml: scoreEnableAml
            });
            setScoreResult(result);
            toast.success("Score KYC calculé avec succès.");
        } catch (error: any) {
            toast.error(error.message || "Échec du calcul KYC.");
        } finally {
            setIsScoreLoading(false);
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    const handleLivenessSubmit = async () => {
        if (!livenessFile) {
            toast.error("Veuillez sélectionner une image.");
            return;
        }

        setIsLivenessLoading(true);
        setLivenessResult(null);

        try {
            const result = await checkLiveness(livenessFile);
            setLivenessResult(result);
            toast.success("Vérification terminée avec succès.");
        } catch (error: any) {
            toast.error(error.message || "Échec de la vérification Liveness.");
        } finally {
            setIsLivenessLoading(false);
        }
    };

    const handleMatchSubmit = async () => {
        if (!matchRefFile || !matchLiveFile) {
            toast.error("Veuillez sélectionner les deux images.");
            return;
        }

        setIsMatchLoading(true);
        setMatchResult(null);

        try {
            const referenceImage = await fileToBase64(matchRefFile);
            const liveImage = await fileToBase64(matchLiveFile);

            const result = await matchFaces({ referenceImage, liveImage });
            setMatchResult(result);
            toast.success("Comparaison faciale terminée.");
        } catch (error: any) {
            toast.error(error.message || "Échec de la comparaison faciale.");
        } finally {
            setIsMatchLoading(false);
        }
    };

    const handleAmlSubmit = async () => {
        if (!amlData.firstName || !amlData.lastName) {
            toast.error("Le prénom et le nom sont requis.");
            return;
        }

        setIsAmlLoading(true);
        setAmlResult(null);

        try {
            const result = await screenAml(amlData);
            setAmlResult(result);
            toast.success("Recherche AML terminée.");
        } catch (error: any) {
            toast.error(error.message || "Échec de la recherche AML.");
        } finally {
            setIsAmlLoading(false);
        }
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
        }
    };

    return (
        <div className="space-y-6 max-w-5xl">
            <div>
                <h1 className="text-2xl font-mono font-bold tracking-widest uppercase">KYC & Identity</h1>
                <p className="text-foreground/60 mt-2 font-mono text-sm">
                    Testez les fonctionnalités de vérification d'identité et de conformité AML.
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-2 border-b border-border mb-6 overflow-x-auto pb-px">
                <button
                    onClick={() => setActiveTab('liveness')}
                    className={cn(
                        "px-4 py-2 font-mono text-sm uppercase tracking-wider whitespace-nowrap transition-colors border-b-2",
                        activeTab === 'liveness' ? "border-primary text-primary" : "border-transparent text-foreground/60 hover:text-foreground"
                    )}
                >
                    <Activity className="inline-block w-4 h-4 mr-2" />
                    Liveness
                </button>
                <button
                    onClick={() => setActiveTab('match')}
                    className={cn(
                        "px-4 py-2 font-mono text-sm uppercase tracking-wider whitespace-nowrap transition-colors border-b-2",
                        activeTab === 'match' ? "border-primary text-primary" : "border-transparent text-foreground/60 hover:text-foreground"
                    )}
                >
                    <UserCheck className="inline-block w-4 h-4 mr-2" />
                    Face Match
                </button>
                <button
                    onClick={() => setActiveTab('aml')}
                    className={cn(
                        "px-4 py-2 font-mono text-sm uppercase tracking-wider whitespace-nowrap transition-colors border-b-2",
                        activeTab === 'aml' ? "border-primary text-primary" : "border-transparent text-foreground/60 hover:text-foreground"
                    )}
                >
                    <Search className="inline-block w-4 h-4 mr-2" />
                    AML Screening
                </button>
                <button
                    onClick={() => setActiveTab('score')}
                    className={cn(
                        "px-4 py-2 font-mono text-sm uppercase tracking-wider whitespace-nowrap transition-colors border-b-2",
                        activeTab === 'score' ? "border-primary text-primary" : "border-transparent text-foreground/60 hover:text-foreground"
                    )}
                >
                    <ShieldCheck className="inline-block w-4 h-4 mr-2" />
                    KYC Score Complet
                </button>
            </div>

            {/* Liveness Tab */}
            {activeTab === 'liveness' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-border bg-black/40 p-6 space-y-6">
                        <h2 className="text-lg font-mono font-bold">Anti-Spoofing (Liveness)</h2>
                        <p className="text-sm text-foreground/60 font-mono">
                            Détecte si le visage sur l'image est une personne réelle ou une tentative d'usurpation (photo, écran, masque).
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-foreground/60 mb-2">Image Selfie</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => setLivenessFile(e.target.files?.[0] || null)}
                                    className="block w-full text-sm font-mono file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 bg-black border border-border p-2"
                                />
                            </div>
                            
                            <button 
                                onClick={handleLivenessSubmit}
                                disabled={isLivenessLoading || !livenessFile}
                                className="w-full py-3 bg-primary text-black font-mono font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLivenessLoading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                Analyser
                            </button>
                        </div>
                    </div>

                    <div className="border border-border bg-black/40 p-6 min-h-[300px]">
                        <h3 className="text-sm font-mono text-foreground/60 uppercase tracking-widest mb-4">Résultat</h3>
                        
                        {isLivenessLoading ? (
                            <div className="h-full flex flex-col items-center justify-center text-primary/60 space-y-4">
                                <RefreshCcw className="w-8 h-8 animate-spin" />
                                <span className="font-mono text-sm animate-pulse">ANALYSE_EN_COURS...</span>
                            </div>
                        ) : livenessResult ? (
                            <div className="space-y-6 font-mono">
                                <div className={cn(
                                    "p-4 border flex items-center gap-4",
                                    livenessResult.isLive ? "border-green-500/30 bg-green-500/10 text-green-500" : "border-red-500/30 bg-red-500/10 text-red-500"
                                )}>
                                    {livenessResult.isLive ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                                    <div>
                                        <div className="font-bold text-lg">{livenessResult.isLive ? "PERSONNE RÉELLE" : "USURPATION DÉTECTÉE"}</div>
                                        <div className="text-sm opacity-80">Confiance: {(livenessResult.confidence * 100).toFixed(1)}%</div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between py-2 border-b border-border">
                                        <span className="text-foreground/60">Type d'attaque</span>
                                        <span className="font-bold">{livenessResult.attackType || "Aucune"}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border">
                                        <span className="text-foreground/60">Score Small Model</span>
                                        <span>{livenessResult.scoreSmall?.toFixed(4)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border">
                                        <span className="text-foreground/60">Score Large Model</span>
                                        <span>{livenessResult.scoreLarge?.toFixed(4)}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-foreground/60">Temps de traitement</span>
                                        <span>{livenessResult.processingMs}ms</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-foreground/20 font-mono text-sm text-center">
                                EN_ATTENTE_DE_REQUETE
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Match Tab */}
            {activeTab === 'match' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-border bg-black/40 p-6 space-y-6">
                        <h2 className="text-lg font-mono font-bold">Face Match</h2>
                        <p className="text-sm text-foreground/60 font-mono">
                            Compare deux visages pour déterminer s'il s'agit de la même personne.
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-foreground/60 mb-2">Image de Référence (ex: Pièce d'identité)</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => setMatchRefFile(e.target.files?.[0] || null)}
                                    className="block w-full text-sm font-mono file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 bg-black border border-border p-2"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-mono text-foreground/60 mb-2">Image Live (ex: Selfie)</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => setMatchLiveFile(e.target.files?.[0] || null)}
                                    className="block w-full text-sm font-mono file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 bg-black border border-border p-2"
                                />
                            </div>

                            <button 
                                onClick={handleMatchSubmit}
                                disabled={isMatchLoading || !matchRefFile || !matchLiveFile}
                                className="w-full py-3 bg-primary text-black font-mono font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isMatchLoading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                                Comparer
                            </button>
                        </div>
                    </div>

                    <div className="border border-border bg-black/40 p-6 min-h-[300px]">
                        <h3 className="text-sm font-mono text-foreground/60 uppercase tracking-widest mb-4">Résultat</h3>
                        
                        {isMatchLoading ? (
                            <div className="h-full flex flex-col items-center justify-center text-primary/60 space-y-4">
                                <RefreshCcw className="w-8 h-8 animate-spin" />
                                <span className="font-mono text-sm animate-pulse">COMPARAISON_EN_COURS...</span>
                            </div>
                        ) : matchResult ? (
                            <div className="space-y-6 font-mono">
                                <div className={cn(
                                    "p-4 border flex items-center gap-4",
                                    matchResult.match ? "border-green-500/30 bg-green-500/10 text-green-500" : "border-red-500/30 bg-red-500/10 text-red-500"
                                )}>
                                    {matchResult.match ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                                    <div>
                                        <div className="font-bold text-lg">{matchResult.match ? "MÊME PERSONNE" : "PERSONNES DIFFÉRENTES"}</div>
                                        <div className="text-sm opacity-80">Similarité: {(matchResult.similarity * 100).toFixed(1)}%</div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between py-2 border-b border-border">
                                        <span className="text-foreground/60">Distance</span>
                                        <span>{matchResult.distance?.toFixed(4)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border">
                                        <span className="text-foreground/60">Seuil de validation</span>
                                        <span>{matchResult.threshold?.toFixed(4)}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-foreground/60">Temps de traitement</span>
                                        <span>{matchResult.processingMs}ms</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-foreground/20 font-mono text-sm text-center">
                                EN_ATTENTE_DE_REQUETE
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* AML Tab */}
            {activeTab === 'aml' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-border bg-black/40 p-6 space-y-6">
                        <h2 className="text-lg font-mono font-bold">Filtrage AML (Sanctions)</h2>
                        <p className="text-sm text-foreground/60 font-mono">
                            Recherche l'individu dans les listes mondiales de sanctions et de personnes politiquement exposées (PEP).
                        </p>
                        
                        <div className="space-y-4 font-mono">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-foreground/60 mb-2">Prénom *</label>
                                    <input 
                                        type="text" 
                                        value={amlData.firstName}
                                        onChange={(e) => setAmlData({...amlData, firstName: e.target.value})}
                                        className="w-full bg-black border border-border p-2 text-sm focus:border-primary outline-none"
                                        placeholder="Baye"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-foreground/60 mb-2">Nom *</label>
                                    <input 
                                        type="text" 
                                        value={amlData.lastName}
                                        onChange={(e) => setAmlData({...amlData, lastName: e.target.value})}
                                        className="w-full bg-black border border-border p-2 text-sm focus:border-primary outline-none"
                                        placeholder="Dame"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs text-foreground/60 mb-2">Date de naissance</label>
                                <input 
                                    type="date" 
                                    value={amlData.dateOfBirth}
                                    onChange={(e) => setAmlData({...amlData, dateOfBirth: e.target.value})}
                                    className="w-full bg-black border border-border p-2 text-sm focus:border-primary outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-foreground/60 mb-2">Nationalité (Code ISO)</label>
                                    <input 
                                        type="text" 
                                        value={amlData.nationality}
                                        onChange={(e) => setAmlData({...amlData, nationality: e.target.value})}
                                        className="w-full bg-black border border-border p-2 text-sm focus:border-primary outline-none"
                                        placeholder="SN, FR, US..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-foreground/60 mb-2">Numéro de document</label>
                                    <input 
                                        type="text" 
                                        value={amlData.documentNumber}
                                        onChange={(e) => setAmlData({...amlData, documentNumber: e.target.value})}
                                        className="w-full bg-black border border-border p-2 text-sm focus:border-primary outline-none"
                                        placeholder="N° CNI ou Passeport"
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleAmlSubmit}
                                disabled={isAmlLoading || !amlData.firstName || !amlData.lastName}
                                className="w-full py-3 bg-primary text-black font-mono font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                            >
                                {isAmlLoading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                Lancer la recherche
                            </button>
                        </div>
                    </div>

                    <div className="border border-border bg-black/40 p-6 min-h-[300px]">
                        <h3 className="text-sm font-mono text-foreground/60 uppercase tracking-widest mb-4">Résultat</h3>
                        
                        {isAmlLoading ? (
                            <div className="h-full flex flex-col items-center justify-center text-primary/60 space-y-4">
                                <RefreshCcw className="w-8 h-8 animate-spin" />
                                <span className="font-mono text-sm animate-pulse">RECHERCHE_EN_COURS...</span>
                            </div>
                        ) : amlResult ? (
                            <div className="space-y-6 font-mono">
                                <div className={cn(
                                    "p-4 border flex items-center gap-4",
                                    getRiskColor(amlResult.riskLevel)
                                )}>
                                    {amlResult.riskLevel === 'low' ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                                    <div>
                                        <div className="font-bold text-lg uppercase">Niveau de Risque: {amlResult.riskLevel}</div>
                                        <div className="text-sm opacity-80">{amlResult.hits.length} correspondance(s) trouvée(s)</div>
                                    </div>
                                </div>

                                {amlResult.hits.length > 0 ? (
                                    <div className="space-y-4">
                                        <h4 className="text-xs text-foreground/60 uppercase tracking-wider">Correspondances:</h4>
                                        <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
                                            {amlResult.hits.map((hit, idx) => (
                                                <div key={idx} className="bg-black border border-border p-3 text-sm">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-bold text-red-400">{hit.name}</span>
                                                        <span className="text-xs bg-red-500/20 text-red-500 px-2 py-0.5">Score: {(hit.score * 100).toFixed(0)}%</span>
                                                    </div>
                                                    <div className="text-xs text-foreground/60">
                                                        <div>ID: {hit.entityId}</div>
                                                        {hit.topics.length > 0 && <div className="mt-1">Sujets: {hit.topics.join(', ')}</div>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-foreground/60">
                                        Aucune correspondance trouvée dans les {amlResult.listsChecked} listes vérifiées.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-foreground/20 font-mono text-sm text-center">
                                EN_ATTENTE_DE_REQUETE
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* KYC Score Tab */}
            {activeTab === 'score' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-border bg-black/40 p-6 space-y-6">
                        <h2 className="text-lg font-mono font-bold">Score KYC Complet</h2>
                        <p className="text-sm text-foreground/60 font-mono">
                            Combinez l'extraction de document (OCR), la vérification du vivant et la comparaison faciale pour obtenir un score KYC global.
                        </p>
                        
                        <div className="space-y-4 font-mono">
                            <div>
                                <label className="block text-xs text-foreground/60 mb-2">ID d'Extraction (Document) *</label>
                                <input 
                                    type="text" 
                                    value={scoreExtractionId}
                                    onChange={(e) => setScoreExtractionId(e.target.value)}
                                    className="w-full bg-black border border-border p-2 text-sm focus:border-primary outline-none"
                                    placeholder="ext_123456789"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs text-foreground/60 mb-2">Image Live / Selfie *</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => setScoreSelfieFile(e.target.files?.[0] || null)}
                                    className="block w-full text-sm font-mono file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 bg-black border border-border p-2"
                                />
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer mt-4">
                                <input 
                                    type="checkbox" 
                                    checked={scoreEnableAml}
                                    onChange={(e) => setScoreEnableAml(e.target.checked)}
                                    className="w-4 h-4 rounded-none bg-black border-border text-primary focus:ring-primary focus:ring-offset-0 accent-primary"
                                />
                                <span className="text-sm">Activer la vérification AML (Sanctions)</span>
                            </label>

                            <button 
                                onClick={handleScoreSubmit}
                                disabled={isScoreLoading || !scoreExtractionId || !scoreSelfieFile}
                                className="w-full py-3 bg-primary text-black font-mono font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                            >
                                {isScoreLoading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                Calculer le Score KYC
                            </button>
                        </div>
                    </div>

                    <div className="border border-border bg-black/40 p-6 min-h-[300px]">
                        <h3 className="text-sm font-mono text-foreground/60 uppercase tracking-widest mb-4">Résultat Global</h3>
                        
                        {isScoreLoading ? (
                            <div className="h-full flex flex-col items-center justify-center text-primary/60 space-y-4">
                                <RefreshCcw className="w-8 h-8 animate-spin" />
                                <span className="font-mono text-sm animate-pulse">CALCUL_EN_COURS...</span>
                            </div>
                        ) : scoreResult ? (
                            <div className="space-y-6 font-mono">
                                <div className={cn(
                                    "p-4 border flex items-center gap-4",
                                    scoreResult.recommendation === 'APPROVE' ? "border-green-500/30 bg-green-500/10 text-green-500" : 
                                    scoreResult.recommendation === 'REVIEW' ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-500" : 
                                    "border-red-500/30 bg-red-500/10 text-red-500"
                                )}>
                                    {scoreResult.recommendation === 'APPROVE' ? <CheckCircle2 className="w-8 h-8" /> : 
                                     scoreResult.recommendation === 'REVIEW' ? <Activity className="w-8 h-8" /> : 
                                     <AlertTriangle className="w-8 h-8" />}
                                    <div className="w-full">
                                        <div className="flex justify-between items-center w-full">
                                            <div className="font-bold text-lg uppercase">{scoreResult.recommendation}</div>
                                            <div className="font-bold text-xl">{scoreResult.kycScore.toFixed(0)}/100</div>
                                        </div>
                                        <div className="text-sm opacity-80 uppercase mt-1">Risque: {scoreResult.riskLevel}</div>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm mt-6">
                                    <h4 className="text-xs text-foreground/60 uppercase tracking-wider mb-2">Détails du Score</h4>
                                    
                                    <div className="flex justify-between py-2 border-b border-border items-center">
                                        <span className="text-foreground/60">Confiance OCR</span>
                                        <span className={scoreResult.breakdown.ocrConfidence > 0.8 ? "text-green-500" : "text-yellow-500"}>
                                            {(scoreResult.breakdown.ocrConfidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between py-2 border-b border-border items-center">
                                        <span className="text-foreground/60">Liveness (Anti-spoofing)</span>
                                        {scoreResult.breakdown.livenessScore !== null ? (
                                            <span className={scoreResult.breakdown.livenessScore > 0.5 ? "text-green-500" : "text-red-500"}>
                                                {(scoreResult.breakdown.livenessScore * 100).toFixed(1)}%
                                            </span>
                                        ) : (
                                            <span className="text-foreground/40">N/A</span>
                                        )}
                                    </div>
                                    
                                    <div className="flex justify-between py-2 border-b border-border items-center">
                                        <span className="text-foreground/60">Face Match (Document vs Selfie)</span>
                                        {scoreResult.breakdown.faceMatchScore !== null ? (
                                            <span className={scoreResult.breakdown.faceMatchScore > 0.5 ? "text-green-500" : "text-red-500"}>
                                                {(scoreResult.breakdown.faceMatchScore * 100).toFixed(1)}%
                                            </span>
                                        ) : (
                                            <span className="text-foreground/40">N/A</span>
                                        )}
                                    </div>
                                    
                                    {scoreEnableAml && (
                                        <div className="flex justify-between py-2 border-b border-border items-center">
                                            <span className="text-foreground/60">Conformité AML</span>
                                            {scoreResult.breakdown.amlClear !== null ? (
                                                <span className={scoreResult.breakdown.amlClear ? "text-green-500" : "text-red-500 font-bold"}>
                                                    {scoreResult.breakdown.amlClear ? "CLEARED" : "HIT DETECTED"}
                                                </span>
                                            ) : (
                                                <span className="text-foreground/40">N/A</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-foreground/20 font-mono text-sm text-center">
                                EN_ATTENTE_DE_REQUETE
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}