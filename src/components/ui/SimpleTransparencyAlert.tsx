/**
 * Composant de notification de transparence MVP
 * Affiche les hypothèses IPF 2025 utilisées dans les calculs
 * 
 * @version 2025.1.0
 * @date 2025-01-09
 */

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { SimpleAssumptionsService } from '@/services/SimpleAssumptionsService';
import type { TransparencyContext } from '@/types/assumptions-simple';

interface SimpleTransparencyAlertProps {
  /** Contexte d'utilisation pour personnaliser le message */
  context: TransparencyContext;
  
  /** Classe CSS additionnelle (optionnelle) */
  className?: string;
  
  /** Afficher le lien vers les détails (par défaut: true) */
  showDetailsLink?: boolean;
}

export default function SimpleTransparencyAlert({ 
  context, 
  className = "",
  showDetailsLink = true 
}: SimpleTransparencyAlertProps) {
  const notification = SimpleAssumptionsService.getTransparencyNotification(context);
  
  const handleDetailsClick = () => {
    // Navigation vers la page des hypothèses
    window.location.href = '/hypotheses';
  };
  
  return (
    <Alert className={`bg-blue-50 border-2 border-blue-200 mb-6 ${className}`}>
      <Info className="w-6 h-6 text-blue-600" />
      <AlertDescription className="text-blue-800 text-lg leading-relaxed">
        <div className="flex items-center justify-between">
          <span>{notification.message}</span>
          {showDetailsLink && (
            <button 
              onClick={handleDetailsClick}
              className="ml-4 text-blue-600 underline hover:text-blue-800 transition-colors font-medium whitespace-nowrap"
            >
              Voir les détails
            </button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Variante compacte pour les espaces restreints
 */
export function CompactTransparencyAlert({ context }: { context: TransparencyContext }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
      <div className="flex items-center gap-2 text-blue-800">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span className="text-sm">
          Calculs basés sur les normes IPF 2025
        </span>
        <button 
          onClick={() => window.location.href = '/hypotheses'}
          className="text-blue-600 underline hover:text-blue-800 text-sm ml-auto"
        >
          Détails
        </button>
      </div>
    </div>
  );
}

/**
 * Variante pour les rapports (sans interactivité)
 */
export function ReportTransparencyNotice({ context }: { context: TransparencyContext }) {
  const notification = SimpleAssumptionsService.getTransparencyNotification(context);
  
  return (
    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
        <div className="text-gray-700">
          <p className="font-medium mb-1">Méthodologie</p>
          <p className="text-sm leading-relaxed">{notification.message}</p>
          <p className="text-xs text-gray-600 mt-2">
            Pour plus de détails, consultez la section "Hypothèses de calcul" de l'application.
          </p>
        </div>
      </div>
    </div>
  );
}
