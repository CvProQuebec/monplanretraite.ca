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
      save: 'Sauvegarder',
      load: 'Charger',
      saveSuccess: 'Sauvegarde réussie',
      saveError: 'Erreur de sauvegarde',
      loadSuccess: 'Chargement réussi',
      loadError: 'Erreur de chargement',
      passwordRequired: 'Le mot de passe est requis',
      passwordMismatch: 'Les mots de passe ne correspondent pas',
      passwordStrength: 'Le mot de passe doit contenir au moins 8 caractères',
      manualBackup: 'Sauvegarde manuelle',
      fileRequired: 'Veuillez sélectionner un fichier',
      invalidFile: 'Fichier invalide',
      backupFile: 'Fichier de sauvegarde',
      backupDescription: 'Description',
      location: 'Emplacement',
      downloads: 'Téléchargements',
      custom: 'Personnalisé',
      chooseFile: 'Choisir un fichier',
      noFileSelected: 'Aucun fichier sélectionné',
      createTestFile: 'Créer un fichier de test',
      testFileCreated: 'Fichier de test créé avec succès',
      title: 'Gestionnaire de sauvegarde',
      description: 'Sauvegardez et chargez vos données de retraite',
      saveButton: 'Sauvegarder',
      saveTitle: 'Sauvegarder les données',
      backupInfo: 'Informations de sauvegarde',
      securityLevel: 'Niveau de sécurité',
      high: 'Élevé',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      filename: 'Nom du fichier',
      filenamePlaceholder: 'retirement-backup-2025-01-27.json',
      backupDescriptionText: 'Description de la sauvegarde',
      descriptionPlaceholder: 'Sauvegarde complète des données de retraite',
      locationNote: 'Choisissez où sauvegarder vos données',
      securityNote: 'Vos données sont chiffrées avec AES-256',
      cancel: 'Annuler',
      loadButton: 'Charger',
      loadTitle: 'Charger les données',
      selectFile: 'Sélectionner un fichier',
      fileNote: 'Assurez-vous que le fichier provient d\'une source fiable'
    },
    en: {
      save: 'Save',
      load: 'Load',
      saveSuccess: 'Save successful',
      saveError: 'Save error',
      loadSuccess: 'Load successful',
      loadError: 'Load error',
      passwordRequired: 'Password is required',
      passwordMismatch: 'Passwords do not match',
      passwordStrength: 'Password must be at least 8 characters',
      manualBackup: 'Manual backup',
      fileRequired: 'Please select a file',
      invalidFile: 'Invalid file',
      backupFile: 'Backup file',
      backupDescription: 'Description',
      location: 'Location',
      downloads: 'Downloads',
      custom: 'Custom',
      chooseFile: 'Choose a file',
      noFileSelected: 'No file selected',
      createTestFile: 'Create test file',
      testFileCreated: 'Test file created successfully',
      title: 'Backup Manager',
      description: 'Save and load your retirement data',
      saveButton: 'Save',
      saveTitle: 'Save Data',
      backupInfo: 'Backup Information',
      securityLevel: 'Security Level',
      high: 'High',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      filename: 'Filename',
      filenamePlaceholder: 'retirement-backup-2025-01-27.json',
      backupDescriptionText: 'Backup Description',
      descriptionPlaceholder: 'Complete retirement data backup',
      locationNote: 'Choose where to save your data',
      securityNote: 'Your data is encrypted with AES-256',
      cancel: 'Cancel',
      loadButton: 'Load',
      loadTitle: 'Load Data',
      selectFile: 'Select File',
      fileNote: 'Make sure the file comes from a trusted source'
    }
  };

  const t = translations[language];

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
        title: t.saveError,
        description: t.passwordRequired,
        variant: "destructive"
      });
      return;
    }

    if (savePassword !== saveConfirmPassword) {
      toast({
        title: t.saveError,
        description: t.passwordMismatch,
        variant: "destructive"
      });
      return;
    }

    if (savePassword.length < 8) {
      toast({
        title: t.saveError,
        description: t.passwordStrength,
        variant: "destructive"
      });
      return;
    }

    if (!saveFilename.trim()) {
      toast({
        title: t.saveError,
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
        title: t.saveSuccess,
        description: `${filename} - ${t.manualBackup}`,
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
        title: t.saveError,
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
            description: 'Fichier de sauvegarde MonPlanRetraite',
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
        title: t.loadError,
        description: t.fileNote,
        variant: "destructive"
      });
    }
  };

  const handleLoad = async () => {
    if (!selectedFile) {
      toast({
        title: t.loadError,
        description: t.fileRequired,
        variant: "destructive"
      });
      return;
    }

    if (!loadPassword) {
      toast({
        title: t.loadError,
        description: t.passwordRequired,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔄 Début du chargement du fichier:', selectedFile.name);
      
      // Afficher un toast de progression
      toast({
        title: "Chargement en cours...",
        description: `Analyse du fichier ${selectedFile.name}`,
        variant: "default"
      });
      
      const loadedData = await SecurityService.loadFromLocalFile(selectedFile, loadPassword);
      
      console.log('✅ Données chargées avec succès:', loadedData);
      
      if (typeof onDataLoad === 'function') {
        console.log('🔄 Appel de onDataLoad avec les données chargées');
        
        // Afficher un toast de succès
        toast({
          title: "✅ Chargement réussi !",
          description: `Données restaurées depuis ${selectedFile.name}`,
          variant: "default"
        });
        
        // Appeler la fonction de chargement des données
        onDataLoad(loadedData);
        
        // Attendre un peu pour que les données soient appliquées
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Reset et fermer seulement après succès
        setLoadPassword('');
        setSelectedFile(null);
        setLoadDialogOpen(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        console.log('✅ Chargement terminé et dialogue fermé');
        
        // Afficher un toast final de confirmation
        toast({
          title: "🎉 Données restaurées !",
          description: "Vos données ont été chargées avec succès. Vous pouvez maintenant naviguer dans les différentes sections.",
          variant: "default"
        });
        
      } else {
        console.warn('⚠️ onDataLoad n\'est pas une fonction');
        toast({
          title: t.loadError,
          description: 'Erreur de configuration du composant - contactez le support',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      
      // Analyser l'erreur pour donner un message plus précis
      let errorMessage = 'Erreur inconnue lors du chargement';
      
      if (error instanceof Error) {
        if (error.message.includes('Mot de passe incorrect')) {
          errorMessage = '❌ Mot de passe incorrect - vérifiez votre saisie';
        } else if (error.message.includes('JSON invalide')) {
          errorMessage = '❌ Format de fichier invalide - vérifiez que c\'est un fichier JSON valide';
        } else if (error.message.includes('Format de fichier non reconnu')) {
          errorMessage = '❌ Format de fichier non reconnu - utilisez un fichier de sauvegarde MonPlanRetraite';
        } else if (error.message.includes('Lecture du fichier')) {
          errorMessage = '❌ Erreur de lecture du fichier - vérifiez que le fichier n\'est pas corrompu';
        } else {
          errorMessage = `❌ ${error.message}`;
        }
      }
      
      toast({
        title: t.loadError,
        description: errorMessage,
        variant: "destructive"
      });
      
      // Garder le dialogue ouvert en cas d'erreur pour permettre à l'utilisateur de corriger
      console.log('🔄 Dialogue maintenu ouvert en cas d\'erreur');
      
    } finally {
      setIsLoading(false);
      console.log('🔄 État de chargement réinitialisé');
    }
  };

  // Calculer la taille estimée des données
  const getEstimatedSize = () => {
    if (!data) {
      return '0.0 KB';
    }
    
    try {
      const dataSize = JSON.stringify(data).length;
      const encryptedSize = Math.ceil(dataSize * 1.5); // Estimation du chiffrement
      return (encryptedSize / 1024).toFixed(1) + ' KB';
    } catch (error) {
      console.warn('Erreur lors du calcul de la taille des données:', error);
      return '0.0 KB';
    }
  };

  const handleCreateTestFile = async () => {
    const testData = {
      name: "Test User",
      age: 35,
      retirementAge: 65,
      currentSavings: 150000,
      monthlyContributions: 1000,
      expectedReturn: 0.07,
      inflationRate: 0.03,
      yearsUntilRetirement: 30,
      retirementYear: new Date().getFullYear() + 30,
      monthlyExpenses: 2500,
      emergencyFund: 10000,
      investments: [
        { name: "Stocks", allocation: 0.6, expectedReturn: 0.12 },
        { name: "Bonds", allocation: 0.4, expectedReturn: 0.06 }
      ]
    };

    const filename = `test-backup-${new Date().toISOString().split('T')[0]}-${new Date().toTimeString().split(' ')[0].replace(/:/g, '-')}.json`;

    try {
      await saveToCustomLocation(testData, 'testPassword123', filename, 'Fichier de test pour vérifier le chargement');
      toast({
        title: "Fichier de test créé avec succès !",
        description: `Fichier de test créé: ${filename}`,
        variant: "default"
      });
      setLoadDialogOpen(true); // Ouvrir le dialogue de chargement pour tester
      setSelectedFile(null); // Reset le sélecteur de fichier
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: "Erreur lors de la création du fichier de test",
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          {/* Bouton Sauvegarder */}
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                {t.saveButton}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  {t.saveTitle}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Informations de sauvegarde - Version compacte */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <Info className="h-4 w-4" />
                      <span className="font-medium">{t.backupInfo}</span>
                    </div>
                    <span className="text-xs text-blue-600 font-medium">
                      {getEstimatedSize()}
                    </span>
                  </div>
                  
                  <div className="text-xs text-blue-700">
                    <span className="font-medium">{t.securityLevel}:</span> {t.high}
                  </div>
                </div>

                {/* Sécurité */}
                <div className="space-y-2">
                  <Label htmlFor="save-password">{t.password}</Label>
                  <Input
                    id="save-password"
                    type="password"
                    value={savePassword}
                    onChange={(e) => setSavePassword(e.target.value)}
                    placeholder={t.passwordStrength}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="save-confirm-password">{t.confirmPassword}</Label>
                  <Input
                    id="save-confirm-password"
                    type="password"
                    value={saveConfirmPassword}
                    onChange={(e) => setSaveConfirmPassword(e.target.value)}
                  />
                </div>

                {/* Nom du fichier */}
                <div className="space-y-2">
                  <Label htmlFor="save-filename">{t.filename}</Label>
                  <Input
                    id="save-filename"
                    type="text"
                    value={saveFilename}
                    onChange={(e) => setSaveFilename(e.target.value)}
                    placeholder={t.filenamePlaceholder}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="save-description">{t.backupDescription}</Label>
                  <Textarea
                    id="save-description"
                    value={saveDescription}
                    onChange={(e) => setSaveDescription(e.target.value)}
                    placeholder={t.descriptionPlaceholder}
                    rows={2}
                  />
                </div>

                {/* Emplacement de sauvegarde */}
                <div className="space-y-2">
                  <Label htmlFor="save-location">{t.location}</Label>
                  <Select value={saveLocation} onValueChange={(value: 'downloads' | 'custom') => setSaveLocation(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="downloads">
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4" />
                          {t.downloads}
                        </div>
                      </SelectItem>
                      <SelectItem value="custom">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-4 w-4" />
                          {t.custom}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Usb className="h-3 w-3" />
                    {t.locationNote}
                  </p>
                </div>

                {/* Note de sécurité */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  {t.securityNote}
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                    {isSaving ? 'Sauvegarde...' : t.save}
                  </Button>
                  <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                    {t.cancel}
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
                {t.loadButton}
              </Button>
            </DialogTrigger>
                         <DialogContent className="sm:max-w-lg">
               <DialogHeader>
                 <DialogTitle className="flex items-center gap-2 text-xl">
                   <Upload className="h-6 w-6" />
                   {t.loadTitle}
                 </DialogTitle>
               </DialogHeader>
               <div className="space-y-6">
                 {/* Section 1: Sélection de fichier */}
                 <div className="space-y-3">
                   <Label htmlFor="file-input" className="text-base font-semibold">
                     {t.selectFile}
                   </Label>
                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                     <Input
                       id="file-input"
                       ref={fileInputRef}
                       type="file"
                       accept=".json"
                       onChange={handleFileSelect}
                       className="cursor-pointer"
                     />
                     {selectedFile && (
                       <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                         <div className="flex items-center gap-2 text-sm text-blue-800">
                           <FileText className="h-4 w-4" />
                           <span className="font-medium">Fichier sélectionné:</span>
                         </div>
                         <div className="mt-1 text-sm text-blue-700 font-mono">
                           {selectedFile.name}
                         </div>
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Section 2: Mot de passe */}
                 <div className="space-y-3">
                   <Label htmlFor="load-password" className="text-base font-semibold">
                     {t.password}
                   </Label>
                   <Input
                     id="load-password"
                     type="password"
                     value={loadPassword}
                     onChange={(e) => setLoadPassword(e.target.value)}
                     placeholder="Entrez le mot de passe de sauvegarde"
                     className="text-lg p-3"
                   />
                 </div>

                 {/* Section 3: Avertissement de sécurité */}
                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                   <div className="flex items-start gap-3">
                     <AlertCircle className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                     <div className="text-sm text-yellow-800">
                       <strong className="font-semibold">⚠️ Sécurité :</strong> {t.fileNote}
                     </div>
                   </div>
                 </div>
                 
                 {/* Section 4: Test du système */}
                 <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                   <div className="text-sm text-green-800 mb-3">
                     <strong className="font-semibold">🧪 Test du système :</strong> 
                     Créez un fichier de test pour vérifier le chargement
                   </div>
                   <Button 
                     variant="outline" 
                     size="sm"
                     onClick={handleCreateTestFile}
                     className="w-full text-green-700 border-green-300 hover:bg-green-100 h-10"
                   >
                     📁 Créer fichier de test
                   </Button>
                 </div>
                 
                 {/* Section 5: Boutons d'action */}
                 <div className="flex gap-3 pt-2">
                   <Button 
                     onClick={handleLoad} 
                     disabled={isLoading || !selectedFile || !loadPassword} 
                     className="flex-1 h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                   >
                     {isLoading ? (
                       <div className="flex items-center gap-2">
                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         Chargement...
                       </div>
                     ) : (
                       <div className="flex items-center gap-2">
                         <Upload className="h-5 w-5" />
                         {t.load}
                       </div>
                     )}
                   </Button>
                   <Button 
                     variant="outline" 
                     onClick={() => setLoadDialogOpen(false)}
                     className="h-12 px-6"
                   >
                     {t.cancel}
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