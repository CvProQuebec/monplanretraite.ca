import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  RefreshCw, 
  Download, 
  Upload, 
  Trash2, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useRetirementData } from '../hooks/useRetirementData';
import { useLanguage } from '../hooks/useLanguage';

export const SessionManager: React.FC = () => {
  const { language } = useLanguage();
  const { 
    userData, 
    resetData, 
    exportData, 
    importData, 
    restoreFromBackup, 
    clearBackup, 
    hasBackup,
    sessionId,
    clearError,
    error
  } = useRetirementData();
  
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const isFrench = language === 'fr';

  const translations = {
    fr: {
      title: 'Gestion de Session',
      subtitle: 'Contrôlez vos données et votre session',
      sessionInfo: 'Informations de Session',
      sessionId: 'ID de Session',
      dataStatus: 'État des Données',
      hasData: 'Données saisies',
      noData: 'Aucune donnée',
      actions: 'Actions',
      resetSession: 'Réinitialiser la Session',
      resetDescription: 'Efface toutes les données de la session actuelle',
      exportData: 'Exporter les Données',
      exportDescription: 'Téléchargez vos données au format JSON',
      importData: 'Importer des Données',
      importDescription: 'Chargez des données depuis un fichier JSON',
      restoreBackup: 'Restaurer la Sauvegarde',
      restoreDescription: 'Récupérez vos données de la dernière session',
      clearBackup: 'Supprimer la Sauvegarde',
      clearDescription: 'Supprime définitivement la sauvegarde locale',
      backupAvailable: 'Sauvegarde disponible',
      noBackup: 'Aucune sauvegarde',
      securityNotice: 'Avis de Sécurité',
      securityText: 'Vos données sont sauvegardées localement uniquement et sont automatiquement effacées à la fermeture de la session.',
      dataLossWarning: 'Attention : La réinitialisation effacera définitivement toutes les données de la session actuelle.',
      confirmReset: 'Êtes-vous sûr de vouloir réinitialiser la session ?',
      confirmClearBackup: 'Êtes-vous sûr de vouloir supprimer la sauvegarde locale ?',
      selectFile: 'Sélectionner un fichier',
      noFileSelected: 'Aucun fichier sélectionné'
    },
    en: {
      title: 'Session Management',
      subtitle: 'Control your data and session',
      sessionInfo: 'Session Information',
      sessionId: 'Session ID',
      dataStatus: 'Data Status',
      hasData: 'Data entered',
      noData: 'No data',
      actions: 'Actions',
      resetSession: 'Reset Session',
      resetDescription: 'Clear all data from the current session',
      exportData: 'Export Data',
      exportDescription: 'Download your data in JSON format',
      restoreBackup: 'Restore Backup',
      restoreDescription: 'Recover your data from the last session',
      clearBackup: 'Clear Backup',
      clearDescription: 'Permanently delete the local backup',
      backupAvailable: 'Backup available',
      noBackup: 'No backup',
      securityNotice: 'Security Notice',
      securityText: 'Your data is saved locally only and is automatically cleared when the session is closed.',
      dataLossWarning: 'Warning: Resetting will permanently clear all data from the current session.',
      confirmReset: 'Are you sure you want to reset the session?',
      confirmClearBackup: 'Are you sure you want to delete the local backup?',
      selectFile: 'Select a file',
      noFileSelected: 'No file selected'
    }
  };

  const t = translations[isFrench ? 'fr' : 'en'];

  // Vérifier si l'utilisateur a saisi des données
  const hasUserData = () => {
    return userData.personal.prenom1 !== '' || 
           userData.personal.salaire1 > 0 || 
           userData.savings.reer1 > 0 ||
           userData.cashflow.logement > 0;
  };

  // Gérer la réinitialisation
  const handleReset = () => {
    if (window.confirm(t.confirmReset)) {
      resetData();
    }
  };

  // Gérer la suppression de la sauvegarde
  const handleClearBackup = () => {
    if (window.confirm(t.confirmClearBackup)) {
      clearBackup();
    }
  };

  // Gérer l'import de fichier
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      setImportFile(file);
    }
  };

  const handleImport = () => {
    if (importFile) {
      setIsImporting(true);
      importData(importFile);
      setImportFile(null);
      setIsImporting(false);
    }
  };

  // Gérer la restauration depuis la sauvegarde
  const handleRestore = () => {
    const restored = restoreFromBackup();
    if (restored) {
      // Afficher un message de succès
      setTimeout(() => clearError(), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* Informations de session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {t.sessionInfo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">{t.sessionId}</span>
            <Badge variant="outline" className="font-mono text-xs">
              {sessionId.slice(-12)}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">{t.dataStatus}</span>
            <Badge variant={hasUserData() ? "default" : "secondary"}>
              {hasUserData() ? t.hasData : t.noData}
            </Badge>
          </div>

          {hasBackup() && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Sauvegarde</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                {t.backupAvailable}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            {t.actions}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Réinitialisation */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">{t.resetSession}</h4>
              <p className="text-sm text-gray-600">{t.resetDescription}</p>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleReset}
              disabled={!hasUserData()}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Export */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">{t.exportData}</h4>
              <p className="text-sm text-gray-600">{t.exportDescription}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={exportData}
              disabled={!hasUserData()}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Import */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">{t.importData}</h4>
              <p className="text-sm text-gray-600">{t.importDescription}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
                id="import-file"
              />
              <label htmlFor="import-file">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {t.selectFile}
                  </span>
                </Button>
              </label>
              {importFile && (
                <Button 
                  size="sm" 
                  onClick={handleImport}
                  disabled={isImporting}
                >
                  {isImporting ? 'Importing...' : 'Import'}
                </Button>
              )}
            </div>
          </div>

          {/* Restauration depuis sauvegarde */}
          {hasBackup() && (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
              <div>
                <h4 className="font-medium">{t.restoreBackup}</h4>
                <p className="text-sm text-gray-600">{t.restoreDescription}</p>
              </div>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleRestore}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Restore
              </Button>
            </div>
          )}

          {/* Suppression de la sauvegarde */}
          {hasBackup() && (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
              <div>
                <h4 className="font-medium">{t.clearBackup}</h4>
                <p className="text-sm text-gray-600">{t.clearDescription}</p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleClearBackup}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Avis de sécurité */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>{t.securityNotice}:</strong> {t.securityText}
        </AlertDescription>
      </Alert>

      {/* Avertissement de perte de données */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {t.dataLossWarning}
        </AlertDescription>
      </Alert>

      {/* Affichage des erreurs */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearError}
              className="ml-2 h-6 px-2"
            >
              ✕
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
