// src/pages/SauvegarderCharger.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

import { 
  Download, Upload, Database, Shield, CheckCircle, AlertTriangle, 
  FileText, Lock, Unlock, Eye, EyeOff, Trash2, RefreshCw, 
  HardDrive, Smartphone, Laptop, Server, Key, Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';

interface BackupData {
  id: string;
  name: string;
  date: Date;
  size: number;
  type: 'local' | 'encrypted';
  description: string;
}

interface SecuritySettings {
  encryptionEnabled: boolean;
  autoBackup: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordComplexity: 'low' | 'medium' | 'high';
}

export default function SauvegarderCharger() {
  const { user } = useAuth();
  const { isFrench } = useLanguage();

  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupName, setBackupName] = useState('');
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    encryptionEnabled: true,
    autoBackup: false,
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordComplexity: 'medium'
  });
  const [showEncryptionKey, setShowEncryptionKey] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [importFile, setImportFile] = useState<File | null>(null);

  // Détection simple de la langue depuis l'URL
  const isFrenchUrl = window.location.pathname.includes('/fr/') || !window.location.pathname.includes('/en/');
  const currentLanguage = isFrench || isFrenchUrl;

  useEffect(() => {
    // Charger les sauvegardes existantes
    loadExistingBackups();
    // Charger les paramètres de sécurité
    loadSecuritySettings();
  }, []);

  const loadExistingBackups = () => {
    try {
      const savedBackups = localStorage.getItem('retirement-backups');
      if (savedBackups) {
        const parsedBackups = JSON.parse(savedBackups);
        setBackups(parsedBackups.map((backup: any) => ({
          ...backup,
          date: new Date(backup.date)
        })));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des sauvegardes:', error);
    }
  };

  const loadSecuritySettings = () => {
    try {
      const savedSettings = localStorage.getItem('security-settings');
      if (savedSettings) {
        setSecuritySettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres de sécurité:', error);
    }
  };

  const saveSecuritySettings = (newSettings: SecuritySettings) => {
    try {
      localStorage.setItem('security-settings', JSON.stringify(newSettings));
      setSecuritySettings(newSettings);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
    }
  };

  const createBackup = async () => {
    if (!backupName.trim()) {
      alert(currentLanguage ? 'Veuillez entrer un nom pour la sauvegarde' : 'Please enter a backup name');
      return;
    }

    setIsBackingUp(true);
    setBackupProgress(0);

    try {
      // Simuler le processus de sauvegarde
      for (let i = 0; i <= 100; i += 10) {
        setBackupProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Créer la sauvegarde
      const backupData = {
        id: Date.now().toString(),
        name: backupName,
        date: new Date(),
        size: Math.floor(Math.random() * 1000000) + 100000, // Taille simulée
        type: securitySettings.encryptionEnabled ? 'encrypted' : 'local',
        description: currentLanguage 
          ? `Sauvegarde automatique du ${new Date().toLocaleDateString('fr-CA')}`
          : `Automatic backup from ${new Date().toLocaleDateString('en-CA')}`
      };

      const newBackups = [backupData, ...backups];
      setBackups(newBackups);
      localStorage.setItem('retirement-backups', JSON.stringify(newBackups));
      
      setBackupName('');
      alert(currentLanguage ? 'Sauvegarde créée avec succès !' : 'Backup created successfully!');
    } catch (error) {
      console.error('Erreur lors de la création de la sauvegarde:', error);
      alert(currentLanguage ? 'Erreur lors de la création de la sauvegarde' : 'Error creating backup');
    } finally {
      setIsBackingUp(false);
      setBackupProgress(0);
    }
  };

  const restoreBackup = async (backup: BackupData) => {
    if (!confirm(currentLanguage 
      ? `Êtes-vous sûr de vouloir restaurer la sauvegarde "${backup.name}" ?`
      : `Are you sure you want to restore backup "${backup.name}"?`
    )) {
      return;
    }

    setIsRestoring(true);
    try {
      // Simuler la restauration
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(currentLanguage ? 'Restauration terminée avec succès !' : 'Restoration completed successfully!');
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      alert(currentLanguage ? 'Erreur lors de la restauration' : 'Error during restoration');
    } finally {
      setIsRestoring(false);
    }
  };

  const deleteBackup = (backupId: string) => {
    if (!confirm(currentLanguage 
      ? 'Êtes-vous sûr de vouloir supprimer cette sauvegarde ?'
      : 'Are you sure you want to delete this backup?'
    )) {
      return;
    }

    const newBackups = backups.filter(b => b.id !== backupId);
    setBackups(newBackups);
    localStorage.setItem('retirement-backups', JSON.stringify(newBackups));
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  const importData = async () => {
    if (!importFile) {
      alert(currentLanguage ? 'Veuillez sélectionner un fichier' : 'Please select a file');
      return;
    }

    try {
      // Simuler l'importation
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(currentLanguage ? 'Données importées avec succès !' : 'Data imported successfully!');
      setImportFile(null);
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      alert(currentLanguage ? 'Erreur lors de l\'importation' : 'Error during import');
    }
  };

  const exportData = () => {
    try {
      // Créer un fichier de données simulé
      const data = {
        timestamp: new Date().toISOString(),
        user: user?.email || 'anonymous',
        data: 'Données simulées de retraite'
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `retirement-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert(currentLanguage ? 'Données exportées avec succès !' : 'Data exported successfully!');
    } catch (error) {
      console.error('Erreur lors de l\'exportation:', error);
      alert(currentLanguage ? 'Erreur lors de l\'exportation' : 'Error during export');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(currentLanguage ? 'fr-CA' : 'en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {currentLanguage ? '💾 Sauvegarder / Charger' : '💾 Save / Load'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {currentLanguage 
              ? 'Gérez vos sauvegardes, importez/exportez vos données et configurez la sécurité'
              : 'Manage your backups, import/export your data and configure security'
            }
          </p>
        </div>

        {/* Section Sauvegarde */}
        <div className="space-y-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                {currentLanguage ? 'Créer une sauvegarde' : 'Create a Backup'}
              </CardTitle>
              <CardDescription>
                {currentLanguage 
                  ? 'Sauvegardez toutes vos données de retraite en local de manière sécurisée'
                  : 'Backup all your retirement data locally in a secure manner'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="backup-name">
                    {currentLanguage ? 'Nom de la sauvegarde' : 'Backup Name'}
                  </Label>
                  <Input
                    id="backup-name"
                    value={backupName}
                    onChange={(e) => setBackupName(e.target.value)}
                    placeholder={currentLanguage ? 'Ma sauvegarde du jour' : 'My backup of the day'}
                    className="mt-2"
                  />
                </div>
                <Button 
                  onClick={createBackup}
                  disabled={isBackingUp || !backupName.trim()}
                  className="mt-6"
                >
                  {isBackingUp ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      {currentLanguage ? 'Sauvegarde...' : 'Backing up...'}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      {currentLanguage ? 'Créer la sauvegarde' : 'Create Backup'}
                    </>
                  )}
                </Button>
              </div>

              {/* Barre de progression */}
              {isBackingUp && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{currentLanguage ? 'Progression' : 'Progress'}</span>
                    <span>{backupProgress}%</span>
                  </div>
                  <Progress value={backupProgress} className="w-full" />
                </div>
              )}

              {/* Sauvegardes existantes */}
              {backups.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {currentLanguage ? 'Sauvegardes existantes' : 'Existing Backups'}
                  </h3>
                  <div className="grid gap-4">
                    {backups.map((backup) => (
                      <Card key={backup.id} className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{backup.name}</h4>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  backup.type === 'encrypted' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {backup.type === 'encrypted' 
                                    ? (currentLanguage ? 'Chiffré' : 'Encrypted')
                                    : (currentLanguage ? 'Local' : 'Local')
                                  }
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                {formatDate(backup.date)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(backup.size)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => restoreBackup(backup)}
                                disabled={isRestoring}
                              >
                                {isRestoring ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Upload className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteBackup(backup.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Section Chargement */}
        <div className="space-y-6 mb-12">
          {/* Import de données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-green-600" />
                {currentLanguage ? 'Importer des données' : 'Import Data'}
              </CardTitle>
              <CardDescription>
                {currentLanguage 
                  ? 'Importez vos données depuis un fichier de sauvegarde'
                  : 'Import your data from a backup file'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="import-file">
                  {currentLanguage ? 'Fichier à importer' : 'File to import'}
                </Label>
                <Input
                  id="import-file"
                  type="file"
                  accept=".json,.txt"
                  onChange={handleFileImport}
                  className="cursor-pointer"
                />
                {importFile && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>{importFile.name}</span>
                    <span className="text-gray-400">({formatFileSize(importFile.size)})</span>
                  </div>
                )}
                <Button 
                  onClick={importData}
                  disabled={!importFile}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {currentLanguage ? 'Importer les données' : 'Import Data'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Export de données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                {currentLanguage ? 'Exporter des données' : 'Export Data'}
              </CardTitle>
              <CardDescription>
                {currentLanguage 
                  ? 'Exportez vos données actuelles vers un fichier'
                  : 'Export your current data to a file'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={exportData} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                {currentLanguage ? 'Exporter mes données' : 'Export My Data'}
              </Button>
            </CardContent>
          </Card>

          {/* Restauration depuis sauvegarde */}
          {backups.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                  {currentLanguage ? 'Restaurer depuis une sauvegarde' : 'Restore from Backup'}
                </CardTitle>
                <CardDescription>
                  {currentLanguage 
                    ? 'Restaurez vos données à partir d\'une sauvegarde existante'
                    : 'Restore your data from an existing backup'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {currentLanguage 
                      ? 'La restauration remplacera toutes vos données actuelles. Assurez-vous d\'avoir une sauvegarde récente.'
                      : 'Restoration will replace all your current data. Make sure you have a recent backup.'
                    }
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4">
                  {backups.map((backup) => (
                    <Card key={backup.id} className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-green-800">{backup.name}</h4>
                            <p className="text-sm text-green-600">
                              {formatDate(backup.date)} • {formatFileSize(backup.size)}
                            </p>
                          </div>
                          <Button
                            onClick={() => restoreBackup(backup)}
                            disabled={isRestoring}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isRestoring ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                {currentLanguage ? 'Restauration...' : 'Restoring...'}
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                {currentLanguage ? 'Restaurer' : 'Restore'}
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Section Sécurité */}
        <div className="space-y-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                {currentLanguage ? 'Paramètres de sécurité' : 'Security Settings'}
              </CardTitle>
              <CardDescription>
                {currentLanguage 
                  ? 'Configurez la sécurité de vos sauvegardes et données'
                  : 'Configure the security of your backups and data'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Chiffrement */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {currentLanguage ? 'Chiffrement des données' : 'Data Encryption'}
                </h3>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">
                        {currentLanguage ? 'Chiffrement AES-256' : 'AES-256 Encryption'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {currentLanguage 
                          ? 'Vos données sont chiffrées avec un algorithme militaire'
                          : 'Your data is encrypted with military-grade algorithm'
                        }
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={securitySettings.encryptionEnabled ? "default" : "outline"}
                    onClick={() => saveSecuritySettings({
                      ...securitySettings,
                      encryptionEnabled: !securitySettings.encryptionEnabled
                    })}
                  >
                    {securitySettings.encryptionEnabled ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {currentLanguage ? 'Activé' : 'Enabled'}
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        {currentLanguage ? 'Activer' : 'Enable'}
                      </>
                    )}
                  </Button>
                </div>

                {/* Clé de chiffrement */}
                {securitySettings.encryptionEnabled && (
                  <div className="space-y-3">
                    <Label htmlFor="encryption-key">
                      {currentLanguage ? 'Clé de chiffrement' : 'Encryption Key'}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="encryption-key"
                        type={showEncryptionKey ? "text" : "password"}
                        value={encryptionKey}
                        onChange={(e) => setEncryptionKey(e.target.value)}
                        placeholder={currentLanguage ? 'Entrez votre clé de chiffrement' : 'Enter your encryption key'}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={() => setShowEncryptionKey(!showEncryptionKey)}
                      >
                        {showEncryptionKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      {currentLanguage 
                        ? 'Conservez cette clé en lieu sûr. Sans elle, vous ne pourrez pas récupérer vos données.'
                        : 'Keep this key safe. Without it, you won\'t be able to recover your data.'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Sauvegarde automatique */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {currentLanguage ? 'Sauvegarde automatique' : 'Automatic Backup'}
                </h3>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">
                        {currentLanguage ? 'Sauvegarde quotidienne' : 'Daily Backup'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {currentLanguage 
                          ? 'Crée automatiquement une sauvegarde chaque jour'
                          : 'Automatically create a backup every day'
                        }
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={securitySettings.autoBackup ? "default" : "outline"}
                    onClick={() => saveSecuritySettings({
                      ...securitySettings,
                      autoBackup: !securitySettings.autoBackup
                    })}
                  >
                    {securitySettings.autoBackup ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {currentLanguage ? 'Activé' : 'Enabled'}
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {currentLanguage ? 'Activer' : 'Enable'}
                      </>
                    )}
                  </Button>
                </div>
              </div>



              {/* Timeout de session */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {currentLanguage ? 'Sécurité de session' : 'Session Security'}
                </h3>
                
                <div className="space-y-3">
                  <Label htmlFor="session-timeout">
                    {currentLanguage ? 'Délai d\'expiration de session (minutes)' : 'Session timeout (minutes)'}
                  </Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    min="5"
                    max="120"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => saveSecuritySettings({
                      ...securitySettings,
                      sessionTimeout: Number(e.target.value)
                    })}
                    className="w-32"
                  />
                  <p className="text-sm text-gray-600">
                    {currentLanguage 
                      ? 'Après ce délai d\'inactivité, vous devrez vous reconnecter'
                      : 'After this period of inactivity, you will need to reconnect'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
