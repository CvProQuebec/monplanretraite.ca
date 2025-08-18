import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Upload, Lock, FileText, Shield, AlertCircle, FolderOpen, Usb, HardDrive, Cloud, Info } from 'lucide-react';
import { SecurityService } from '../services/SecurityService';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '../hooks/useLanguage';

interface DataBackupManagerProps {
  data: any;
  onDataLoad: (data: any) => void;
}

const DataBackupManager: React.FC<DataBackupManagerProps> = ({ data, onDataLoad }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  // États pour la sauvegarde
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [savePassword, setSavePassword] = useState('');
  const [saveConfirmPassword, setSaveConfirmPassword] = useState('');
  const [saveFilename, setSaveFilename] = useState('');
  const [saveDescription, setSaveDescription] = useState('');
  const [saveLocation, setSaveLocation] = useState<'downloads' | 'custom'>('downloads');
  const [isSaving, setIsSaving] = useState(false);
  
  // États pour le chargement
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [loadPassword, setLoadPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Traductions
  const translations = {
    fr: {
      title: "Gestion des sauvegardes",
      description: "Sauvegardez et chargez vos données de retraite en toute sécurité",
      saveButton: "Sauvegarder",
      loadButton: "Charger",
      saveTitle: "Sauvegarder les Données",
      loadTitle: "Charger les Données",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      filename: "Nom du fichier",
      backupDescription: "Description de la sauvegarde (optionnel)",
      location: "Emplacement de sauvegarde",
      downloads: "Dossier Téléchargements",
      custom: "Choisir l'emplacement",
      selectLocation: "Sélectionner l'emplacement",
      selectFile: "Sélectionner un fichier",
      save: "Sauvegarder",
      load: "Charger",
      cancel: "Annuler",
      passwordMismatch: "Les mots de passe ne correspondent pas",
      passwordRequired: "Le mot de passe est requis",
      fileRequired: "Veuillez sélectionner un fichier",
      saveSuccess: "Données sauvegardées avec succès",
      loadSuccess: "Données chargées avec succès",
      saveError: "Erreur lors de la sauvegarde",
      loadError: "Erreur lors du chargement",
      securityNote: "Vos données sont chiffrées avec votre mot de passe",
      fileNote: "Fichier accepté: .json uniquement",
      passwordStrength: "Utilisez un mot de passe fort (min. 8 caractères)",
      locationNote: "Choisissez où sauvegarder vos données (clé USB, disque externe, etc.)",
      filenamePlaceholder: "ex: retraite-2024-12-19-v2.json",
      descriptionPlaceholder: "ex: Sauvegarde avant modifications des dépenses",
      backupInfo: "Informations de sauvegarde",
      backupType: "Type de sauvegarde",
      manualBackup: "Sauvegarde manuelle",
      autoBackup: "Sauvegarde automatique",
      lastBackup: "Dernière sauvegarde",
      never: "Jamais",
      backupSize: "Taille estimée",
      securityLevel: "Niveau de sécurité",
      high: "Élevé (chiffrement AES-256)"
    },
    en: {
      title: "Backup Management",
      description: "Save and load your retirement data securely",
      saveButton: "Save",
      loadButton: "Load",
      saveTitle: "Save Data",
      loadTitle: "Load Data",
      password: "Password",
      confirmPassword: "Confirm Password",
      filename: "Filename",
      backupDescription: "Backup description (optional)",
      location: "Backup location",
      downloads: "Downloads folder",
      custom: "Choose location",
      selectLocation: "Select location",
      selectFile: "Select File",
      save: "Save",
      load: "Load",
      cancel: "Cancel",
      passwordMismatch: "Passwords do not match",
      passwordRequired: "Password is required",
      fileRequired: "Please select a file",
      saveSuccess: "Data saved successfully",
      loadSuccess: "Data loaded successfully",
      saveError: "Error saving data",
      loadError: "Error loading data",
      securityNote: "Your data is encrypted with your password",
      fileNote: "Accepted file: .json only",
      passwordStrength: "Use a strong password (min. 8 characters)",
      locationNote: "Choose where to save your data (USB key, external drive, etc.)",
      filenamePlaceholder: "ex: retirement-2024-12-19-v2.json",
      descriptionPlaceholder: "ex: Backup before expense modifications",
      backupInfo: "Backup information",
      backupType: "Backup type",
      manualBackup: "Manual backup",
      autoBackup: "Auto backup",
      lastBackup: "Last backup",
      never: "Never",
      backupSize: "Estimated size",
      securityLevel: "Security level",
      high: "High (AES-256 encryption)"
    }
  };

  const tr = translations[language as keyof typeof translations];

  // Générer un nom de fichier par défaut intelligent
  const generateDefaultFilename = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    return `retirement-backup-${date}-${time}.json`;
  };

  // Initialiser le nom de fichier par défaut
  React.useEffect(() => {
    if (!saveFilename) {
      setSaveFilename(generateDefaultFilename());
    }
  }, [saveDialogOpen]);

  const handleSave = async () => {
    if (!savePassword) {
      toast({
        title: tr.saveError,
        description: tr.passwordRequired,
        variant: "destructive"
      });
      return;
    }

    if (savePassword !== saveConfirmPassword) {
      toast({
        title: tr.saveError,
        description: tr.passwordMismatch,
        variant: "destructive"
      });
      return;
    }

    if (savePassword.length < 8) {
      toast({
        title: tr.saveError,
        description: tr.passwordStrength,
        variant: "destructive"
      });
      return;
    }

    if (!saveFilename.trim()) {
      toast({
        title: tr.saveError,
        description: "Le nom de fichier est requis",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      let filename = saveFilename;
      if (!filename.endsWith('.json')) {
        filename += '.json';
      }

      if (saveLocation === 'custom') {
        // Utiliser l'API File System Access pour choisir l'emplacement
        await saveToCustomLocation(data, savePassword, filename, saveDescription);
      } else {
        // Sauvegarde classique dans le dossier téléchargements
        await SecurityService.saveToLocalFile(data, savePassword, filename, saveDescription);
      }
      
      toast({
        title: tr.saveSuccess,
        description: `${filename} - ${tr.manualBackup}`,
        variant: "default"
      });
      
      // Reset et fermer
      setSavePassword('');
      setSaveConfirmPassword('');
      setSaveFilename('');
      setSaveDescription('');
      setSaveLocation('downloads');
      setSaveDialogOpen(false);
    } catch (error) {
      toast({
        title: tr.saveError,
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarde dans un emplacement personnalisé
  const saveToCustomLocation = async (data: any, password: string, filename: string, description: string) => {
    try {
      // Vérifier si l'API File System Access est supportée
      if ('showSaveFilePicker' in window) {
        const options = {
          suggestedName: filename,
          types: [{
            description: 'Fichier de sauvegarde iAssistant',
            accept: {
              'application/json': ['.json']
            }
          }]
        };

        const fileHandle = await (window as any).showSaveFilePicker(options);
        const writable = await fileHandle.createWritable();
        
        // Créer le fichier de sauvegarde avec métadonnées
        const backupData = await SecurityService.createBackupData(data, password, description);
        await writable.write(JSON.stringify(backupData, null, 2));
        await writable.close();
        
        return fileHandle;
      } else {
        // Fallback pour les navigateurs non supportés
        throw new Error('Sélection d\'emplacement non supportée dans ce navigateur. Utilisez le dossier Téléchargements.');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Sauvegarde annulée par l\'utilisateur');
      }
      throw error;
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      setSelectedFile(file);
    } else {
      toast({
        title: tr.loadError,
        description: tr.fileNote,
        variant: "destructive"
      });
    }
  };

  const handleLoad = async () => {
    if (!selectedFile) {
      toast({
        title: tr.loadError,
        description: tr.fileRequired,
        variant: "destructive"
      });
      return;
    }

    if (!loadPassword) {
      toast({
        title: tr.loadError,
        description: tr.passwordRequired,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔄 Début du chargement du fichier:', selectedFile.name);
      
      const loadedData = await SecurityService.loadFromLocalFile(selectedFile, loadPassword);
      
      console.log('✅ Données chargées avec succès:', loadedData);
      
      if (typeof onDataLoad === 'function') {
        console.log('🔄 Appel de onDataLoad avec les données chargées');
        onDataLoad(loadedData);
        
        // Attendre un peu pour que les données soient appliquées
        await new Promise(resolve => setTimeout(resolve, 100));
        
        toast({
          title: tr.loadSuccess,
          description: `Données restaurées depuis ${selectedFile.name}`,
          variant: "default"
        });
        
        // Reset et fermer seulement après succès
        setLoadPassword('');
        setSelectedFile(null);
        setLoadDialogOpen(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        console.log('✅ Chargement terminé et dialogue fermé');
      } else {
        console.warn('⚠️ onDataLoad n\'est pas une fonction');
        toast({
          title: tr.loadError,
          description: 'Erreur de configuration du composant',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      toast({
        title: tr.loadError,
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      console.log('🔄 État de chargement réinitialisé');
    }
  };

  // Calculer la taille estimée des données
  const getEstimatedSize = () => {
    const dataSize = JSON.stringify(data).length;
    const encryptedSize = Math.ceil(dataSize * 1.5); // Estimation du chiffrement
    return (encryptedSize / 1024).toFixed(1) + ' KB';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {tr.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{tr.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          {/* Bouton Sauvegarder */}
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                {tr.saveButton}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  {tr.saveTitle}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Informations de sauvegarde - Version compacte */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <Info className="h-4 w-4" />
                      <span className="font-medium">{tr.backupInfo}</span>
                    </div>
                    <span className="text-xs text-blue-600 font-medium">
                      {getEstimatedSize()}
                    </span>
                  </div>
                  
                  <div className="text-xs text-blue-700">
                    <span className="font-medium">{tr.securityLevel}:</span> {tr.high}
                  </div>
                </div>

                {/* Sécurité */}
                <div className="space-y-2">
                  <Label htmlFor="save-password">{tr.password}</Label>
                  <Input
                    id="save-password"
                    type="password"
                    value={savePassword}
                    onChange={(e) => setSavePassword(e.target.value)}
                    placeholder={tr.passwordStrength}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="save-confirm-password">{tr.confirmPassword}</Label>
                  <Input
                    id="save-confirm-password"
                    type="password"
                    value={saveConfirmPassword}
                    onChange={(e) => setSaveConfirmPassword(e.target.value)}
                  />
                </div>

                {/* Nom du fichier */}
                <div className="space-y-2">
                  <Label htmlFor="save-filename">{tr.filename}</Label>
                  <Input
                    id="save-filename"
                    type="text"
                    value={saveFilename}
                    onChange={(e) => setSaveFilename(e.target.value)}
                    placeholder={tr.filenamePlaceholder}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="save-description">{tr.backupDescription}</Label>
                  <Textarea
                    id="save-description"
                    value={saveDescription}
                    onChange={(e) => setSaveDescription(e.target.value)}
                    placeholder={tr.descriptionPlaceholder}
                    rows={2}
                  />
                </div>

                {/* Emplacement de sauvegarde */}
                <div className="space-y-2">
                  <Label htmlFor="save-location">{tr.location}</Label>
                  <Select value={saveLocation} onValueChange={(value: 'downloads' | 'custom') => setSaveLocation(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="downloads">
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4" />
                          {tr.downloads}
                        </div>
                      </SelectItem>
                      <SelectItem value="custom">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-4 w-4" />
                          {tr.custom}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Usb className="h-3 w-3" />
                    {tr.locationNote}
                  </p>
                </div>

                {/* Note de sécurité */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  {tr.securityNote}
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                    {isSaving ? 'Sauvegarde...' : tr.save}
                  </Button>
                  <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                    {tr.cancel}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Bouton Charger */}
          <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                {tr.loadButton}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  {tr.loadTitle}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file-input">{tr.selectFile}</Label>
                  <Input
                    id="file-input"
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                  />
                  {selectedFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {selectedFile.name}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="load-password">{tr.password}</Label>
                  <Input
                    id="load-password"
                    type="password"
                    value={loadPassword}
                    onChange={(e) => setLoadPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-yellow-600">
                  <AlertCircle className="h-4 w-4" />
                  {tr.fileNote}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleLoad} disabled={isLoading} className="flex-1">
                    {isLoading ? 'Chargement...' : tr.load}
                  </Button>
                  <Button variant="outline" onClick={() => setLoadDialogOpen(false)}>
                    {tr.cancel}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataBackupManager;