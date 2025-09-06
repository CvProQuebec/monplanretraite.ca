/**
 * Utilitaire de logging avec timestamp automatique
 * Affiche la date et l'heure courante avec chaque message de log
 */

export interface LogData {
  [key: string]: any;
}

/**
 * Log avec timestamp automatique au format français canadien
 * @param message - Message principal à afficher
 * @param data - Données optionnelles à afficher
 * @param level - Niveau de log (info, warn, error)
 */
export const logWithTimestamp = (
  message: string, 
  data?: LogData | string | number, 
  level: 'info' | 'warn' | 'error' = 'info'
) => {
  const now = new Date();
  const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const time = now.toLocaleTimeString('fr-CA', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const timestamp = `📅 ${date} ${time}`;
  const fullMessage = `${timestamp} - ${message}`;
  
  switch (level) {
    case 'error':
      console.error(`❌ ${fullMessage}`, data || '');
      break;
    case 'warn':
      console.warn(`⚠️ ${fullMessage}`, data || '');
      break;
    default:
      console.log(`ℹ️ ${fullMessage}`, data || '');
  }
};

/**
 * Log spécifique pour les calculs financiers
 * @param component - Nom du composant (ex: 'GlobalSummary', 'IncomeTable')
 * @param calculation - Type de calcul (ex: 'Seasonal Employment', 'Rental Income')
 * @param data - Données du calcul
 */
export const logCalculation = (
  component: string, 
  calculation: string, 
  data: LogData
) => {
  logWithTimestamp(`🧮 ${component} - ${calculation}`, data);
};

/**
 * Log pour les changements de données utilisateur
 * @param component - Composant source du changement
 * @param action - Action effectuée (ex: 'Update', 'Create', 'Delete')
 * @param data - Données modifiées
 */
export const logDataChange = (
  component: string,
  action: string,
  data: LogData
) => {
  logWithTimestamp(`💾 ${component} - ${action}`, data);
};

/**
 * Log pour les erreurs avec contexte
 * @param component - Composant où l'erreur s'est produite
 * @param error - Message d'erreur ou objet Error
 * @param context - Contexte supplémentaire
 */
export const logError = (
  component: string,
  error: string | Error,
  context?: LogData
) => {
  const errorMessage = error instanceof Error ? error.message : error;
  logWithTimestamp(`${component} - Erreur: ${errorMessage}`, context, 'error');
};

/**
 * Log pour les avertissements
 * @param component - Composant source
 * @param warning - Message d'avertissement
 * @param data - Données contextuelles
 */
export const logWarning = (
  component: string,
  warning: string,
  data?: LogData
) => {
  logWithTimestamp(`${component} - Avertissement: ${warning}`, data, 'warn');
};

// Export par défaut pour utilisation simple
export default logWithTimestamp;