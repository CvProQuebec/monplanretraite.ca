
import Airtable from 'airtable';

export interface AirtableMetrics {
  leads: number;
  appointments: number;
  presentations: number;
  sales: number;
  conversionRate: number;
  coreFocus: string;
}

export const getDemoMetrics = (): AirtableMetrics => ({
  leads: 500,
  appointments: 250,
  presentations: 125,
  sales: 60,
  conversionRate: 12,
  coreFocus: "Improve presentation skills to increase conversion rates."
});

// Fonction pour nettoyer et valider les entrées
const cleanAndValidateInputs = (apiKey: string, baseId: string, tableName: string) => {
  // Nettoyer les entrées
  const cleanApiKey = apiKey.trim();
  let cleanBaseId = baseId.trim();
  const cleanTableName = tableName.trim();

  // Extraire le vrai Base ID s'il contient des caractères parasites
  if (cleanBaseId.includes('/')) {
    cleanBaseId = cleanBaseId.split('/')[0];
  }
  if (cleanBaseId.includes('?')) {
    cleanBaseId = cleanBaseId.split('?')[0];
  }

  // Validation des formats
  if (!cleanApiKey.startsWith('pat') && !cleanApiKey.startsWith('key')) {
    throw new Error('🔑 Format clé API invalide. Elle doit commencer par "pat" ou "key"');
  }

  if (!cleanBaseId.startsWith('app') || cleanBaseId.length < 14) {
    throw new Error('📋 Format Base ID invalide. Il doit commencer par "app" et faire au moins 14 caractères (ex: appXXXXXXXXXXXXXX)');
  }

  if (!cleanTableName) {
    throw new Error('📊 Le nom de la table ne peut pas être vide');
  }

  return { cleanApiKey, cleanBaseId, cleanTableName };
};

// Fonction pour lister toutes les tables disponibles
const listAvailableTables = async (base: any): Promise<string[]> => {
  const tables: string[] = [];
  
  // Liste des noms de tables les plus courants à essayer
  const commonTableNames = [
    'Dashboard', 'Table 1', 'Main', 'Data', 'Metrics', 'Sales', 'Pipeline', 'Leads'
  ];

  for (const tableName of commonTableNames) {
    try {
      await base(tableName).select({ maxRecords: 1 }).firstPage();
      tables.push(tableName);
    } catch (err) {
      // Table n'existe pas, continuer
    }
  }

  return tables;
};

export const fetchAirtableMetrics = async (apiKey: string, baseId: string, tableName: string): Promise<AirtableMetrics> => {
  try {
    console.log(`🔍 Tentative de connexion à Airtable...`);
    console.log(`📋 Base ID brut: "${baseId}"`);
    console.log(`📊 Table recherchée: "${tableName}"`);
    
    // Nettoyer et valider les entrées
    const { cleanApiKey, cleanBaseId, cleanTableName } = cleanAndValidateInputs(apiKey, baseId, tableName);
    
    console.log(`✅ Base ID nettoyé: "${cleanBaseId}"`);

    // Initialisation d'Airtable avec configuration robuste
    const airtable = new Airtable({ 
      apiKey: cleanApiKey,
      endpointUrl: 'https://api.airtable.com',
      requestTimeout: 15000
    });
    
    const base = airtable.base(cleanBaseId);
    
    let records: any[] = [];
    let successfulTableName = '';
    
    // D'abord essayer le nom exact fourni par l'utilisateur
    try {
      console.log(`🎯 Essai avec le nom exact: "${cleanTableName}"`);
      const recordsResponse = await base(cleanTableName).select({
        maxRecords: 100
      }).firstPage();
      
      records = [...recordsResponse];
      successfulTableName = cleanTableName;
      console.log(`✅ SUCCÈS! Connecté à la table: "${cleanTableName}" avec ${records.length} enregistrement(s)`);
      
    } catch (firstError: any) {
      console.log(`❌ Échec avec "${cleanTableName}": ${firstError.message}`);
      
      // Si erreur d'authentification, arrêter immédiatement
      if (firstError.status === 401 || firstError.status === 403) {
        throw new Error(`🔑 Problème d'authentification: Vérifiez votre clé API et ses permissions sur la base "${cleanBaseId}"`);
      }
      
      // Si table non trouvée, essayer de lister les tables disponibles
      console.log(`🔍 Recherche des tables disponibles...`);
      const availableTables = await listAvailableTables(base);
      
      if (availableTables.length === 0) {
        throw new Error(`📋 Aucune table accessible trouvée dans la base "${cleanBaseId}". Vérifiez :
1. Votre Base ID est correct
2. Votre clé API a les permissions de lecture sur cette base
3. La base contient au moins une table`);
      }
      
      console.log(`📋 Tables disponibles trouvées: ${availableTables.join(', ')}`);
      
      // Prendre la première table disponible
      const firstAvailableTable = availableTables[0];
      try {
        const recordsResponse = await base(firstAvailableTable).select({
          maxRecords: 100
        }).firstPage();
        
        records = [...recordsResponse];
        successfulTableName = firstAvailableTable;
        console.log(`✅ Connexion réussie à la table: "${firstAvailableTable}" avec ${records.length} enregistrement(s)`);
        
      } catch (secondError: any) {
        throw new Error(`❌ Impossible de se connecter aux tables disponibles. Dernière erreur: ${secondError.message}`);
      }
    }

    // Vérification que nous avons des données
    if (records.length === 0) {
      throw new Error(`📋 La table "${successfulTableName}" est vide. Ajoutez au moins un enregistrement avec vos métriques.`);
    }

    // Traitement des données avec support des nouveaux noms français
    console.log(`📊 Analyse des ${records.length} enregistrement(s) de la table "${successfulTableName}"`);

    let leads = 0;
    let appointments = 0;
    let presentations = 0;
    let sales = 0;
    let coreFocus = "🎯 Données en cours d'analyse...";

    const firstRecord = records[0];
    const availableFields = Object.keys(firstRecord.fields || {});
    console.log(`🏗️ Colonnes disponibles:`, availableFields);

    // Traitement flexible des colonnes avec les nouveaux noms français
    records.forEach((record, index) => {
      const recordFields = record.fields || {};
      
      console.log(`📝 Enregistrement ${index + 1}:`, recordFields);

      // Recherche flexible des colonnes avec les nouveaux noms français et emojis
      const findFieldValue = (possibleNames: string[]) => {
        for (const name of possibleNames) {
          const value = recordFields[name];
          if (value !== undefined && value !== null) {
            const numValue = Number(value);
            return !isNaN(numValue) ? numValue : 0;
          }
        }
        return 0;
      };

      const findTextValue = (possibleNames: string[]) => {
        for (const name of possibleNames) {
          const value = recordFields[name];
          if (value !== undefined && value !== null) {
            // Gérer les objets complexes d'Airtable
            if (typeof value === 'object' && value.value) {
              return String(value.value) || '';
            }
            return String(value) || '';
          }
        }
        return '';
      };

      // Recherche des valeurs avec les nouveaux noms français et emojis de votre base
      leads += findFieldValue([
        '🥸 Prospects', // Nouveau nom français avec emoji
        'Prospects', 
        '🥸Leads', 'Leads', 'Lead', 'Prospection'
      ]);
      
      appointments += findFieldValue([
        '🗓️ Rendez-vous', // Nouveau nom français avec emoji  
        'Rendez-vous',
        '🗓️Appointments', 'Appointments', 'Appointment', 'RDV', 'Meetings'
      ]);
      
      presentations += findFieldValue([
        '📽️ Présentations', // Nouveau nom français avec emoji
        'Présentations',
        '🎬Presentations', 'Presentations', 'Presentation', 'Demos'
      ]);
      
      sales += findFieldValue([
        '🔥 Ventes', // Nouveau nom français avec emoji
        'Ventes',
        '💸Sales', 'Sales', 'Sale', 'Vente', 'Closed'
      ]);
      
      const recordCoreFocus = findTextValue([
        '🎯 Focus', // Nouveau nom français avec emoji
        'Focus',
        'Core focus', 'Core Focus', 'Objectif', 'Goal', 'Notes'
      ]);
      
      if (recordCoreFocus && coreFocus.includes('analyse')) {
        coreFocus = recordCoreFocus;
      }
    });

    const conversionRate = leads > 0 ? Math.round((sales / leads) * 100) : 0;

    const metrics: AirtableMetrics = {
      leads,
      appointments,
      presentations,
      sales,
      conversionRate,
      coreFocus: coreFocus || "Concentrez-vous sur l'amélioration des conversions"
    };

    console.log(`🎉 Métriques calculées avec succès:`, metrics);
    console.log(`📊 Table utilisée: "${successfulTableName}"`);
    
    return metrics;

  } catch (error: any) {
    console.error('💥 Erreur lors de la récupération des données Airtable:', error);
    
    // Messages d'erreur plus précis
    if (error.message?.includes('🔑') || error.message?.includes('📋') || error.message?.includes('📊')) {
      // C'est déjà notre erreur personnalisée
      throw error;
    } else if (error.status === 401) {
      throw new Error('🔑 Clé API invalide ou expirée. Générez une nouvelle clé dans votre compte Airtable.');
    } else if (error.status === 403) {
      throw new Error('🚫 Permissions insuffisantes. Votre clé API doit avoir accès en lecture à cette base.');
    } else if (error.status === 404) {
      throw new Error('🔍 Base Airtable introuvable. Vérifiez votre Base ID.');
    } else if (error.message?.includes('timeout')) {
      throw new Error('⏱️ Délai d\'attente dépassé. Vérifiez votre connexion internet et réessayez.');
    } else if (error.message?.includes('ENOTFOUND') || error.message?.includes('network')) {
      throw new Error('🌐 Problème de connexion réseau. Vérifiez votre connexion internet.');
    } else {
      throw new Error(`❌ Erreur de connexion Airtable: ${error.message || 'Erreur inconnue'}`);
    }
  }
};

export const setupAutoRefresh = (fetchData: () => Promise<AirtableMetrics>, setData: (data: AirtableMetrics) => void, interval: number) => {
  const refreshData = async () => {
    try {
      const data = await fetchData();
      setData(data);
      console.log('✅ Auto-refresh completed successfully');
    } catch (error) {
      console.error('❌ Auto-refresh failed:', error);
    }
  };

  // Run immediately
  refreshData();

  // Set interval
  const intervalId = setInterval(refreshData, interval);

  // Cleanup function
  return () => clearInterval(intervalId);
};
