
import { useState, useEffect } from "react";
import { fetchAirtableMetrics, setupAutoRefresh, AirtableMetrics, getDemoMetrics } from "@/services/airtableService";
import { toast } from "@/components/ui/use-toast";
import { useAirtableConfig } from "@/hooks/useAirtableConfig";

export const useMetrics = () => {
  const { config, isConfigured, saveConfig, clearConfig } = useAirtableConfig();
  
  const [metrics, setMetrics] = useState<AirtableMetrics>(getDemoMetrics());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [usingDemoData, setUsingDemoData] = useState(!isConfigured);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Local state for modal form
  const [apiKey, setApiKey] = useState(config?.apiKey || '');
  const [baseId, setBaseId] = useState(config?.baseId || '');
  const [tableName, setTableName] = useState(config?.tableName || '');

  // Create fetch function using current config
  const createFetchFunction = () => {
    return async () => {
      if (!config) {
        throw new Error('Configuration Airtable manquante');
      }
      return await fetchAirtableMetrics(config.apiKey, config.baseId, config.tableName);
    };
  };

  // Handle retry connection function
  const handleRetryConnection = async () => {
    if (!config) {
      setConnectionError('Configuration Airtable manquante');
      return;
    }

    setIsRetrying(true);
    setConnectionError(null);
    setError(null);
    
    try {
      console.log('Retrying Airtable connection...');
      const data = await fetchAirtableMetrics(config.apiKey, config.baseId, config.tableName);
      setMetrics(data);
      setLastUpdated(new Date());
      setError(null);
      setUsingDemoData(false);
      setConnectionError(null);
      
      toast({
        title: "✅ Connexion rétablie",
        description: "Dashboard synchronisé avec Airtable",
      });
    } catch (err: any) {
      console.error("Retry connection failed:", err);
      const errorMessage = err.message || 'Erreur de connexion Airtable';
      setConnectionError(errorMessage);
      setError(errorMessage);
      
      toast({
        title: "❌ Échec de la reconnexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRetrying(false);
    }
  };

  // Handle reset configuration function
  const handleResetConfig = () => {
    clearConfig();
    setConnectionError(null);
    setError(null);
    setUsingDemoData(true);
    setMetrics(getDemoMetrics());
    setLastUpdated(new Date());
    
    // Reset form fields
    setApiKey('');
    setBaseId('');
    setTableName('');
    
    toast({
      title: "🔄 Configuration réinitialisée",
      description: "Veuillez entrer de nouvelles informations Airtable",
    });
  };

  // Manual refresh function
  const handleManualRefresh = async () => {
    if (!isConfigured || !config) {
      toast({
        title: "⚠️ Aucune configuration",
        description: "Veuillez configurer Airtable d'abord",
        variant: "destructive",
      });
      return;
    }

    setIsRefreshing(true);
    setConnectionError(null);
    setError(null);
    
    try {
      console.log('Manual refresh initiated...');
      const data = await fetchAirtableMetrics(config.apiKey, config.baseId, config.tableName);
      setMetrics(data);
      setLastUpdated(new Date());
      setError(null);
      setUsingDemoData(false);
      setConnectionError(null);
      
      toast({
        title: "✅ Données mises à jour",
        description: "Dashboard synchronisé avec Airtable",
      });
    } catch (err: any) {
      console.error("Manual refresh failed:", err);
      const errorMessage = err.message || 'Erreur lors de la synchronisation';
      setConnectionError(errorMessage);
      setError(errorMessage);
      setUsingDemoData(true);
      setMetrics(getDemoMetrics());
      
      toast({
        title: "❌ Erreur de synchronisation",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMetricsFetched = async () => {
    // Save the configuration
    if (apiKey && baseId && tableName) {
      try {
        const newConfig = { apiKey: apiKey.trim(), baseId: baseId.trim(), tableName: tableName.trim() };
        saveConfig(newConfig);
        
        // Forcer une synchronisation immédiate
        setLoading(true);
        const data = await fetchAirtableMetrics(newConfig.apiKey, newConfig.baseId, newConfig.tableName);
        setMetrics(data);
        setLastUpdated(new Date());
        setUsingDemoData(false);
        setConnectionError(null);
        setError(null);
        
        toast({
          title: "✅ Configuration sauvegardée et connectée",
          description: "Dashboard synchronisé avec Airtable",
        });
        
      } catch (err: any) {
        console.error('Failed to connect after saving config:', err);
        setConnectionError(err.message || 'Erreur lors de la connexion');
        setError(err.message || 'Erreur lors de la connexion');
        setUsingDemoData(true);
        setMetrics(getDemoMetrics());
        
        toast({
          title: "❌ Erreur de connexion",
          description: err.message || 'Erreur lors de la connexion',
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Demo mode
      setUsingDemoData(true);
      setMetrics(getDemoMetrics());
      setLastUpdated(new Date());
      setConnectionError(null);
      setError(null);
      
      toast({
        title: "🎯 Mode démonstration",
        description: "Utilisation des données de démonstration",
      });
    }
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

  // Initialize data and auto-refresh
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);
        setConnectionError(null);
        
        if (isConfigured && config) {
          console.log('Initializing Airtable connection with saved config...');
          
          try {
            const data = await fetchAirtableMetrics(config.apiKey, config.baseId, config.tableName);
            setMetrics(data);
            setUsingDemoData(false);
            setError(null);
            setConnectionError(null);
            
            toast({
              title: "✅ Connexion Airtable établie",
              description: "Dashboard synchronisé avec succès",
            });
          } catch (err: any) {
            console.error("Failed to initialize Airtable data:", err);
            const errorMessage = err.message || 'Erreur de connexion Airtable';
            setConnectionError(errorMessage);
            setError(errorMessage);
            setMetrics(getDemoMetrics());
            setUsingDemoData(true);
            
            toast({
              title: "⚠️ Connexion Airtable échouée",
              description: "Mode démonstration activé",
              variant: "destructive",
            });
          }
        } else {
          console.log('No Airtable config found, using demo data');
          setMetrics(getDemoMetrics());
          setUsingDemoData(true);
          setError(null);
          setConnectionError(null);
        }
        
        setLastUpdated(new Date());

      } catch (err: any) {
        console.error("Initialization error:", err);
        const errorMessage = err.message || 'Erreur d\'initialisation';
        setError(errorMessage);
        setMetrics(getDemoMetrics());
        setUsingDemoData(true);
        
        toast({
          title: "⚠️ Erreur d'initialisation",
          description: "Mode démonstration activé",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeData();

    // Set up auto-refresh only if configured
    if (isConfigured && config) {
      const cleanup = setupAutoRefresh(createFetchFunction(), (data) => {
        setMetrics(data);
        setLastUpdated(new Date());
        setUsingDemoData(false);
        setError(null);
        setConnectionError(null);
        console.log('Auto-refresh completed successfully');
      }, 30000);

      return cleanup;
    }
  }, [isConfigured, config]);

  // Update local state when config changes
  useEffect(() => {
    if (config) {
      setApiKey(config.apiKey);
      setBaseId(config.baseId);
      setTableName(config.tableName);
    }
  }, [config]);

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
