// src/components/SecurityNotificationManager.tsx
// Gestionnaire des notifications de sécurité pour le système de sauvegarde

import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertTriangle, 
  Download, 
  Upload, 
  Clock, 
  Shield, 
  FileText,
  X,
  CheckCircle,
  Info
} from 'lucide-react';
import { secureFileStorage } from '@/services/SecureFileOnlyStorage';

interface NotificationEvent {
  message: string;
  type: 'warning' | 'error' | 'info' | 'success';
}

interface SecurityNotificationManagerProps {
  onExportRequest?: () => void;
  onImportRequest?: () => void;
  onDataClear?: () => void;
}

const SecurityNotificationManager = React.forwardRef<
  { markDataAsLoaded: () => void },
  SecurityNotificationManagerProps
>(({ onExportRequest, onImportRequest, onDataClear }, ref) => {
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [sessionInfo, setSessionInfo] = useState(secureFileStorage.getSessionInfo());
  const [showSessionTimer, setShowSessionTimer] = useState(false);
  const [showMustLoadWarning, setShowMustLoadWarning] = useState(!secureFileStorage.hasUserLoadedData());

  // Gérer le chargement des données
  const handleDataLoaded = () => {
    secureFileStorage.markDataAsLoaded();
    setShowMustLoadWarning(false);
    setSessionInfo(secureFileStorage.getSessionInfo());
  };

  // Exposer la méthode via ref
  React.useImperativeHandle(ref, () => ({
    markDataAsLoaded: handleDataLoaded
  }));

  useEffect(() => {
    // Écouter les événements de sécurité
    const handleSaveWarning = (event: CustomEvent) => {
      addNotification(event.detail.message, event.detail.type);
      setShowSessionTimer(true);
    };

    const handleSaveReminder = (event: CustomEvent) => {
      addNotification(event.detail.message, event.detail.type);
    };

    const handleMustLoadData = (event: CustomEvent) => {
      addNotification(event.detail.message, event.detail.type);
      setShowMustLoadWarning(true);
    };

    const handleEmergencyDataStored = (event: CustomEvent) => {
      addNotification(event.detail.message, event.detail.type);
    };

    const handleSessionExpired = (event: CustomEvent) => {
      addNotification(event.detail.message, event.detail.type);
      setShowMustLoadWarning(true);
      if (onDataClear) {
        onDataClear();
      }
    };

    const handleCacheCleared = (event: CustomEvent) => {
      addNotification(event.detail.message, event.detail.type);
      setShowMustLoadWarning(true);
      if (onDataClear) {
        onDataClear();
      }
    };

    const handleExportSuccess = (event: CustomEvent) => {
      addNotification(event.detail.message, event.detail.type);
      // Marquer les données comme sauvegardées
      secureFileStorage.markDataAsSaved();
    };

    const handleForceDataClear = (event: CustomEvent) => {
      setShowMustLoadWarning(true);
      if (onDataClear) {
        onDataClear();
      }
    };

    // Ajouter les écouteurs d'événements
    window.addEventListener('showSaveWarning', handleSaveWarning as EventListener);
    window.addEventListener('showSaveReminder', handleSaveReminder as EventListener);
    window.addEventListener('showMustLoadData', handleMustLoadData as EventListener);
    window.addEventListener('showEmergencyDataStored', handleEmergencyDataStored as EventListener);
    window.addEventListener('showSessionExpired', handleSessionExpired as EventListener);
    window.addEventListener('showCacheCleared', handleCacheCleared as EventListener);
    window.addEventListener('showExportSuccess', handleExportSuccess as EventListener);
    window.addEventListener('forceDataClear', handleForceDataClear as EventListener);

    // Mettre à jour les informations de session toutes les minutes
    const sessionTimer = setInterval(() => {
      const newSessionInfo = secureFileStorage.getSessionInfo();
      setSessionInfo(newSessionInfo);
      setShowMustLoadWarning(!newSessionInfo.hasLoadedData);
    }, 60000);

    return () => {
      window.removeEventListener('showSaveWarning', handleSaveWarning as EventListener);
      window.removeEventListener('showSaveReminder', handleSaveReminder as EventListener);
      window.removeEventListener('showMustLoadData', handleMustLoadData as EventListener);
      window.removeEventListener('showEmergencyDataStored', handleEmergencyDataStored as EventListener);
      window.removeEventListener('showSessionExpired', handleSessionExpired as EventListener);
      window.removeEventListener('showCacheCleared', handleCacheCleared as EventListener);
      window.removeEventListener('showExportSuccess', handleExportSuccess as EventListener);
      window.removeEventListener('forceDataClear', handleForceDataClear as EventListener);
      clearInterval(sessionTimer);
    };
  }, [onDataClear]);

  // Wrapper pour onImportRequest qui marque les données comme chargées
  const handleImportRequest = () => {
    if (onImportRequest) {
      onImportRequest();
      // Note: markDataAsLoaded sera appelé après le succès de l'import
    }
  };

  const addNotification = (message: string, type: NotificationEvent['type']) => {
    const newNotification: NotificationEvent = { message, type };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Garder max 5 notifications

    // Auto-supprimer après 10 secondes pour les succès et infos
    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        removeNotification(newNotification);
      }, 10000);
    }
  };

  const removeNotification = (notificationToRemove: NotificationEvent) => {
    setNotifications(prev => prev.filter(n => n !== notificationToRemove));
  };

  const formatTimeRemaining = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getNotificationIcon = (type: NotificationEvent['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'info':
        return <Info className="w-4 h-4 text-mpr-interactive" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getNotificationStyle = (type: NotificationEvent['type']) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'info':
        return 'border-mpr-border bg-mpr-interactive-lt';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {/* Avertissement obligatoire de chargement des données */}
      {showMustLoadWarning && (
        <Card className="border-red-300 bg-red-50 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              CHARGEMENT OBLIGATOIRE
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-xs text-red-700 mb-3 font-medium">
              Vous DEVEZ charger vos données depuis votre dernière sauvegarde avant d'utiliser l'application. 
              Aucune donnée ne sera conservée sans sauvegarde manuelle.
            </CardDescription>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleImportRequest}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Upload className="w-3 h-3 mr-1" />
                Charger mes données
              </Button>
            </div>
            {sessionInfo.isDataModified && (
              <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800">
                ⚠️ Modifications détectées mais non sauvegardées!
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Timer de session */}
      {showSessionTimer && sessionInfo.timeRemaining > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              Session active
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-700">
                Temps restant: {formatTimeRemaining(sessionInfo.timeRemaining)}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowSessionTimer(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            {sessionInfo.hasTemporaryData && (
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  onClick={onExportRequest}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Sauvegarder
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {notifications.map((notification, index) => (
        <Alert key={index} className={getNotificationStyle(notification.type)}>
          <div className="flex items-start gap-2">
            {getNotificationIcon(notification.type)}
            <div className="flex-1">
              <AlertDescription className="text-sm">
                {notification.message}
              </AlertDescription>
              {notification.type === 'warning' && (
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    onClick={onExportRequest}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Sauvegarder maintenant
                  </Button>
                </div>
              )}
              {(notification.type === 'error' || notification.type === 'info') && 
               notification.message.includes('cache') && (
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    onClick={onImportRequest}
                    variant="outline"
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    Charger mes données
                  </Button>
                </div>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeNotification(notification)}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </Alert>
      ))}

      {/* Panneau de sécurité permanent */}
      <Card className={sessionInfo.hasLoadedData ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className={`w-4 h-4 ${sessionInfo.hasLoadedData ? 'text-green-600' : 'text-gray-600'}`} />
            Sécurité des données
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className={`text-xs mb-2 ${sessionInfo.hasLoadedData ? 'text-green-700' : 'text-gray-700'}`}>
            {sessionInfo.hasLoadedData 
              ? `Données chargées. ${sessionInfo.isDataModified ? 'MODIFICATIONS NON SAUVEGARDÉES!' : 'Sauvegardez avant de quitter.'}`
              : 'Aucune donnée chargée. Chargez vos données pour commencer.'
            }
          </CardDescription>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onExportRequest}
              disabled={!sessionInfo.hasLoadedData}
              className={`flex-1 ${sessionInfo.hasLoadedData 
                ? (sessionInfo.isDataModified ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700')
                : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <Download className="w-3 h-3 mr-1" />
              {sessionInfo.isDataModified ? 'SAUVEGARDER!' : 'Sauvegarder'}
            </Button>
            <Button
              size="sm"
              onClick={handleImportRequest}
              variant="outline"
              className={`flex-1 ${sessionInfo.hasLoadedData 
                ? 'border-green-300 text-green-700 hover:bg-green-100' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Upload className="w-3 h-3 mr-1" />
              Charger
            </Button>
          </div>
          {sessionInfo.isDataModified && sessionInfo.hasLoadedData && (
            <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800 font-medium">
              ⚠️ Vous avez des modifications non sauvegardées!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

SecurityNotificationManager.displayName = 'SecurityNotificationManager';

export default SecurityNotificationManager;
