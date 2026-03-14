"use client";

import { useEffect, useState } from "react";
import { Clock, Play, Pause, RefreshCw, Calendar, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface CronJob {
  _id: string;
  name: string;
  description: string;
  schedule: string;
  lastRun?: Date;
  nextRun?: Date;
  status: 'running' | 'idle' | 'error';
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CronHistory {
  _id: string;
  jobName: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'success' | 'failed' | 'running';
  duration?: number;
  error?: string;
  triggeredManually?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function CronAdminPage() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [history, setHistory] = useState<CronHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCronData = async () => {
    try {
      setIsLoading(true);
      // Appel API pour récupérer les données réelles
      const [jobsResponse, historyResponse] = await Promise.all([
        api.get("/admin/cron"),
        api.get("/admin/cron/history")
      ]);

      setJobs(jobsResponse.data);
      setHistory(historyResponse.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des cron jobs");
      console.error("Erreur détaillée:", error);
      
      // Fallback vers des données mockées en cas d'erreur
      const mockJobs: CronJob[] = [
        {
          _id: "1",
          name: "subscription_renewal",
          description: "Renouvellement automatique des abonnements",
          schedule: "0 3 * * *",
          lastRun: new Date(Date.now() - 12 * 60 * 60 * 1000),
          nextRun: new Date(Date.now() + 12 * 60 * 60 * 1000),
          status: 'idle',
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: "2", 
          name: "invoice_generation",
          description: "Génération des factures mensuelles",
          schedule: "0 2 1 * *",
          lastRun: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          nextRun: new Date(new Date().setMonth(new Date().getMonth() + 1, 1)),
          status: 'idle',
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: "3",
          name: "data_cleanup", 
          description: "Nettoyage des données temporaires",
          schedule: "0 4 * * 0",
          lastRun: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          nextRun: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          status: 'idle',
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const mockHistory: CronHistory[] = [
        {
          _id: "1",
          jobName: "subscription_renewal",
          startedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 11 * 60 * 60 * 1000),
          status: "success",
          duration: 3600,
          triggeredManually: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: "2",
          jobName: "data_cleanup",
          startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1800 * 1000),
          status: "success", 
          duration: 1800,
          triggeredManually: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      setJobs(mockJobs);
      setHistory(mockHistory);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCronData();
  }, []);

  const triggerJob = async (jobName: string) => {
    try {
      toast.success(`Déclenchement de ${jobName} en cours...`);
      await api.post(`/admin/cron/${jobName}/trigger`);
      toast.success(`Job ${jobName} déclenché avec succès`);
      // Recharger les données après un court délai
      setTimeout(() => fetchCronData(), 2000);
    } catch (error) {
      toast.error("Erreur lors du déclenchement du job");
      console.error("Erreur détaillée:", error);
    }
  };

  const toggleJob = async (jobName: string, enabled: boolean) => {
    try {
      await api.patch(`/admin/cron/${jobName}`);
      toast.success(`${jobName} ${enabled ? 'activé' : 'désactivé'}`);
      fetchCronData(); // Recharger les données
    } catch (error) {
      toast.error("Erreur lors de la modification du job");
      console.error("Erreur détaillée:", error);
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 size={14} className="text-green-500" />;
      case 'failed':
        return <XCircle size={14} className="text-red-500" />;
      case 'running':
        return <RefreshCw size={14} className="text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle size={14} className="text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="tech-border bg-black/40 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-primary animate-pulse" />
            <h1 className="text-xl font-black text-foreground font-mono uppercase tracking-wider">CRON_MANAGEMENT</h1>
          </div>
          <div className="text-center py-12 text-foreground/40 font-mono text-xs">
            LOADING_CRON_JOBS
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="tech-border bg-black/40 p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-primary animate-pulse" />
            <div>
              <h1 className="text-xl font-black text-foreground font-mono uppercase tracking-wider">CRON_MANAGEMENT</h1>
              <p className="text-foreground/60 mt-1 font-mono text-xs">SCHEDULED_JOBS // EXECUTION_HISTORY</p>
            </div>
          </div>
          <button
            onClick={() => {
              setRefreshing(true);
              fetchCronData();
            }}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 border border-border text-foreground/60 hover:text-foreground hover:border-primary/40 font-mono text-xs uppercase tracking-wider transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            REFRESH
          </button>
        </div>

        {/* Jobs Actifs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {jobs.map((job) => (
            <div key={job.name} className="tech-border bg-black/60 border-border/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-foreground font-mono uppercase tracking-wider">{job.name}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerJob(job.name)}
                    className="p-1 text-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Déclencher manuellement"
                  >
                    <Play size={14} />
                  </button>
                  <button
                    onClick={() => toggleJob(job.name, !job.enabled)}
                    className={`p-1 transition-colors ${
                      job.enabled
                        ? 'text-green-500 hover:text-red-500 hover:bg-red-500/10'
                        : 'text-red-500 hover:text-green-500 hover:bg-green-500/10'
                    }`}
                    title={job.enabled ? "Désactiver" : "Activer"}
                  >
                    {job.enabled ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-foreground/60 leading-relaxed">{job.description}</p>
              
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-foreground/40">
                  <Calendar size={12} />
                  <span>Schedule: {job.schedule}</span>
                </div>
                
                {job.lastRun && (
                  <div className="text-foreground/60">
                    Last: {job.lastRun.toLocaleString('fr-FR')}
                  </div>
                )}
                
                {job.nextRun && (
                  <div className="text-primary">
                    Next: {job.nextRun.toLocaleString('fr-FR')}
                  </div>
                )}
                
                <div className={`flex items-center gap-2 ${
                  job.status === 'running' ? 'text-blue-500' : 
                  job.status === 'error' ? 'text-red-500' : 'text-green-500'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    job.status === 'running' ? 'bg-blue-500 animate-pulse' : 
                    job.status === 'error' ? 'bg-red-500' : 'bg-green-500'
                  }`} />
                  Status: {job.status.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Historique d'exécution */}
        <div>
          <h3 className="text-sm font-black text-foreground font-mono uppercase tracking-wider mb-4 border-b border-border/40 pb-2">
            EXECUTION_HISTORY
          </h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.map((item) => (
              <div key={item._id} className="tech-border bg-black/60 border-border/40 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-foreground font-mono uppercase">
                    {item.jobName}
                  </span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className={`text-xs font-mono ${
                      item.status === 'success' ? 'text-green-500' :
                      item.status === 'failed' ? 'text-red-500' : 'text-blue-500'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-foreground/60 font-mono">
                  <div>Start: {item.startedAt.toLocaleString('fr-FR')}</div>
                  {item.completedAt && (
                    <div>End: {item.completedAt.toLocaleString('fr-FR')}</div>
                  )}
                  {item.duration && (
                    <div>Duration: {formatDuration(item.duration)}</div>
                  )}
                </div>
                
                {item.error && (
                  <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 text-xs text-red-500 font-mono">
                    ERROR: {item.error}
                  </div>
                )}
              </div>
            ))}
            
            {history.length === 0 && (
              <div className="text-center py-8 text-foreground/40 font-mono text-xs">
                NO_HISTORY_FOUND
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}