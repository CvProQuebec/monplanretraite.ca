/**
 * Composant SmartAlerts - Phase 1 Modules Néophytes
 * Affiche les alertes intelligentes de prévention d'erreurs
 * Interface conviviale pour les débutants en planification financière
 */

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Info, AlertCircle, X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { ErrorAlert, ErrorPreventionService, FinancialData } from '../../services/ErrorPreventionService';

interface SmartAlertsProps {
  financialData: FinancialData;
  onDismiss?: (alertId: string) => void;
  showHealthScore?: boolean;
  maxAlertsToShow?: number;
  className?: string;
}

interface AlertStats {
  critical: number;
  warning: number;
  info: number;
  total: number;
}

export const SmartAlerts: React.FC<SmartAlertsProps> = ({
  financialData,
  onDismiss,
  showHealthScore = true,
  maxAlertsToShow = 5,
  className = ''
}) => {
  const [alerts, setAlerts] = useState<ErrorAlert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [healthScore, setHealthScore] = useState(100);
  const [personalizedAdvice, setPersonalizedAdvice] = useState<string[]>([]);
  const [alertStats, setAlertStats] = useState<AlertStats>({ critical: 0, warning: 0, info: 0, total: 0 });

  const errorPreventionService = ErrorPreventionService.getInstance();

  useEffect(() => {
    const analysisResults = errorPreventionService.analyzeFinancialData(financialData);
    const visibleAlerts = analysisResults.filter(alert => !dismissedAlerts.has(alert.id));
    
    setAlerts(visibleAlerts);
    setHealthScore(errorPreventionService.calculateFinancialHealthScore(visibleAlerts));
    setPersonalizedAdvice(errorPreventionService.getPersonalizedAdvice(visibleAlerts));
    
    // Calculer les statistiques
    const stats = visibleAlerts.reduce((acc, alert) => {
      acc[alert.type]++;
      acc.total++;
      return acc;
    }, { critical: 0, warning: 0, info: 0, total: 0 });
    
    setAlertStats(stats);
  }, [financialData, dismissedAlerts]);

  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    onDismiss?.(alertId);
  };

  const toggleAlertExpansion = (alertId: string) => {
    setExpandedAlerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(alertId)) {
        newSet.delete(alertId);
      } else {
        newSet.add(alertId);
      }
      return newSet;
    });
  };

  const getAlertIcon = (type: ErrorAlert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertColor = (type: ErrorAlert['type']) => {
    switch (type) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getHealthScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellente santé financière !';
    if (score >= 80) return 'Bonne santé financière';
    if (score >= 60) return 'Santé financière à améliorer';
    if (score >= 40) return 'Attention requise';
    return 'Action urgente nécessaire';
  };

  const alertsToShow = showAllAlerts ? alerts : alerts.slice(0, maxAlertsToShow);
  const hasMoreAlerts = alerts.length > maxAlertsToShow;

  if (alerts.length === 0) {
    return (
      <Card className={`${className} border-green-200 bg-green-50`}>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">✓</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                Félicitations ! Aucune erreur détectée
              </h3>
              <p className="text-green-700">
                Votre planification financière semble bien équilibrée. Continuez sur cette excellente voie !
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Score de santé financière */}
      {showHealthScore && (
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Score de santé financière</CardTitle>
              <Badge className={`text-lg px-3 py-1 ${getHealthScoreColor(healthScore)}`}>
                {healthScore}/100
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    healthScore >= 80 ? 'bg-green-500' :
                    healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${healthScore}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">{getHealthScoreMessage(healthScore)}</p>
              
              {/* Statistiques des alertes */}
              <div className="flex space-x-4 text-sm">
                {alertStats.critical > 0 && (
                  <span className="flex items-center text-red-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {alertStats.critical} critique{alertStats.critical > 1 ? 's' : ''}
                  </span>
                )}
                {alertStats.warning > 0 && (
                  <span className="flex items-center text-yellow-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {alertStats.warning} avertissement{alertStats.warning > 1 ? 's' : ''}
                  </span>
                )}
                {alertStats.info > 0 && (
                  <span className="flex items-center text-blue-600">
                    <Info className="h-4 w-4 mr-1" />
                    {alertStats.info} conseil{alertStats.info > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conseils personnalisés */}
      {personalizedAdvice.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-800 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Conseils personnalisés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {personalizedAdvice.map((advice, index) => (
                <li key={index} className="text-blue-700 text-sm flex items-start">
                  <span className="mr-2">•</span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Liste des alertes */}
      <div className="space-y-3">
        {alertsToShow.map((alert) => (
          <Alert key={alert.id} className={`${getAlertColor(alert.type)} border-l-4`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTitle className="text-base font-semibold">
                      {alert.title}
                    </AlertTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        Priorité {alert.priority}/10
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAlertExpansion(alert.id)}
                        className="h-6 w-6 p-0"
                      >
                        {expandedAlerts.has(alert.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <AlertDescription className="text-sm mb-3">
                    {alert.message}
                  </AlertDescription>

                  {expandedAlerts.has(alert.id) && (
                    <div className="space-y-3 pt-3 border-t border-gray-200">
                      <div className="bg-white p-3 rounded-md">
                        <h4 className="font-medium text-sm mb-2 text-green-800">
                          💡 Suggestion d'amélioration :
                        </h4>
                        <p className="text-sm text-gray-700">{alert.suggestion}</p>
                      </div>
                      
                      {alert.learnMoreUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => window.open(alert.learnMoreUrl, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          En savoir plus
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismissAlert(alert.id)}
                className="h-6 w-6 p-0 ml-2 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        ))}
      </div>

      {/* Bouton pour afficher plus d'alertes */}
      {hasMoreAlerts && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllAlerts(!showAllAlerts)}
            className="text-sm"
          >
            {showAllAlerts ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Afficher moins
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Afficher {alerts.length - maxAlertsToShow} alerte{alerts.length - maxAlertsToShow > 1 ? 's' : ''} de plus
              </>
            )}
          </Button>
        </div>
      )}

      {/* Message d'encouragement */}
      {alertStats.critical === 0 && alertStats.total > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <p className="text-sm text-green-700 text-center">
              🎉 Aucun problème critique ! Vous êtes sur la bonne voie. 
              Continuez à améliorer votre situation financière étape par étape.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartAlerts;
