
import { useState, useEffect } from "react";
import { fetchAirtableMetrics, setupAutoRefresh, AirtableMetrics, getDemoMetrics } from "@/services/airtableService";
import { toast } from "@/components/ui/use-toast";

export const useMetrics = () => {
  // Local-only demo mode — no external configuration required
  const isConfigured = false;
  const [metrics, setMetrics] = useState<AirtableMetrics>(getDemoMetrics());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [usingDemoData, setUsingDemoData] = useState(!isConfigured);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Local state for modal form
  const [apiKey, setApiKey] = useState('');
  const [baseId, setBaseId] = useState('');
  const [tableName, setTableName] = useState('');

  // Create fetch function using current config
  const createFetchFunction = () => {
    return async () => {
      // Always return demo metrics locally
      return await fetchAirtableMetrics();
    };
  };

  // Handle retry connection function
  const handleRetryConnection = async () => {
    // Local-only: just refresh demo data
    setIsRetrying(true);
    try {
      const data = await fetchAirtableMetrics();
      setMetrics(data);
      setLastUpdated(new Date());
      setUsingDemoData(true);
      setError(null);
      setConnectionError(null);
      toast({ title: "🔄 Données rafraîchies", description: "Mode démonstration local" });
    } catch (err: any) {
      setConnectionError('Erreur locale inattendue');
    } finally {
      setIsRetrying(false);
    }
  };

  // Handle reset configuration function
  const handleResetConfig = () => {
    setConnectionError(null);
    setError(null);
    setUsingDemoData(true);
    setMetrics(getDemoMetrics());
    setLastUpdated(new Date());
    setApiKey('');
    setBaseId('');
    setTableName('');
    toast({ title: "🔄 Mode démo", description: "Configuration externe désactivée" });
  };

  // Manual refresh function
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchAirtableMetrics();
      setMetrics(data);
      setLastUpdated(new Date());
      setUsingDemoData(true);
      setError(null);
      setConnectionError(null);
      toast({ title: "✅ Données mises à jour", description: "Mode démonstration local" });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMetricsFetched = async () => {
    // Local-only demo fetch
    setUsingDemoData(true);
    setMetrics(getDemoMetrics());
    setLastUpdated(new Date());
    setConnectionError(null);
    setError(null);
    toast({ title: "🎯 Mode démonstration", description: "Utilisation des données locales" });
  };

  const handleConfigError = (message: string) => {
    console.error('Configuration error:', message);
    setConnectionError(message);
    setError(message);
    
    toast({
      title: "❌ Erreur de configuration",
      description: message,
      variant: "destructive",
    });
  };

  // Initialize data and local auto-refresh
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setMetrics(getDemoMetrics());
      setUsingDemoData(true);
      setError(null);
      setConnectionError(null);
      setLastUpdated(new Date());
      setLoading(false);
    };
    run();

    const cleanup = setupAutoRefresh(createFetchFunction(), (data) => {
      setMetrics(data);
      setLastUpdated(new Date());
      setUsingDemoData(true);
    }, 30000);
    return cleanup;
  }, []);


  return {
    metrics,
    loading,
    error,
    lastUpdated,
    isRefreshing,
    usingDemoData,
    connectionError,
    isRetrying,
    apiKey,
    setApiKey,
    baseId,
    setBaseId,
    tableName,
    setTableName,
    handleRetryConnection,
    handleResetConfig,
    handleManualRefresh,
    handleMetricsFetched,
    handleConfigError,
    isConfigured
  };
};
