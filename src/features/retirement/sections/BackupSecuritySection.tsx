// src/features/retirement/sections/BackupSecuritySection.tsx
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Save, 
  Upload, 
  Lock, 
  FileText, 
  Shield, 
  AlertCircle, 
  FolderOpen, 
  Usb, 
  HardDrive, 
  Cloud, 
  Info,
  Rocket,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Key,
  Database,
  Eye,
  EyeOff,
  Download,
  Trash2,
  RefreshCw,
  Settings
} from 'lucide-react';
import { SecurityService } from '../services/SecurityService';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '../hooks/useLanguage';

interface BackupSecuritySectionProps {
  data: any;
  onDataLoad: (data: any) => void;
}

export const BackupSecuritySection: React.FC<BackupSecuritySectionProps> = ({ data, onDataLoad }) => {
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

  // États pour la sécurité
  const [showSecurityTips, setShowSecurityTips] = useState(false);
  const [securityLevel, setSecurityLevel] = useState<'basic' | 'advanced' | 'expert'>('basic');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Traductions
  const t = translations[language];

  // Générer un nom de fichier par défaut intelligent
  const generateDefaultFilename = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    return `retraite-${dateStr}-${timeStr}.json`;
  };

  // Gérer la sauvegarde
  const handleSave = async () => {
    if (savePassword !== saveConfirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    if (savePassword.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      const filename = saveFilename || generateDefaultFilename();
      
      // Utiliser le service de sécurité pour la sauvegarde complète
      const backupData = await SecurityService.createCompleteBackup(savePassword, saveDescription);

      // Télécharger le fichier
      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: "Données sauvegardées avec succès",
        variant: "default"
      });

      setSaveDialogOpen(false);
      setSavePassword('');
      setSaveConfirmPassword('');
      setSaveFilename('');
      setSaveDescription('');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Gérer le chargement
  const handleLoad = async () => {
    if (!selectedFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Utiliser le service de sécurité pour le chargement
      const loadedData = await SecurityService.loadFromLocalFile(selectedFile, loadPassword);
      
      // Appliquer les données chargées
      onDataLoad(loadedData);

      toast({
        title: "Succès",
        description: "Données chargées avec succès",
        variant: "default"
      });

      setLoadDialogOpen(false);
      setLoadPassword('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement. Vérifiez le mot de passe et le format du fichier.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Conseils de sécurité selon le niveau
  const getSecurityTips = () => {
    switch (securityLevel) {
      case 'basic':
        return [
          "Utilisez des mots de passe forts (min. 8 caractères)",
          "Ne partagez jamais vos mots de passe",
          "Sauvegardez régulièrement vos données",
          "Utilisez des appareils sécurisés"
        ];
      case 'advanced':
        return [
          "Utilisez un gestionnaire de mots de passe",
          "Activez l'authentification à deux facteurs",
          "Chiffrez vos sauvegardes avec des clés fortes",
          "Vérifiez régulièrement l'intégrité des données",
          "Utilisez des connexions sécurisées (HTTPS)"
        ];
      case 'expert':
        return [
          "Implémentez une stratégie de rotation des clés",
          "Utilisez des certificats numériques",
          "Surveillez les tentatives d'accès non autorisées",
          "Maintenez des sauvegardes hors site",
          "Testez régulièrement vos procédures de récupération",
          "Documentez vos procédures de sécurité"
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      {/* Particules animées en arrière-plan */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute top-60 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 p-6 space-y-8">
        {/* En-tête principal */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl mb-4">
            Sauvegarde & Sécurité
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Protégez et sécurisez vos données de retraite avec nos outils avancés
          </p>
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section Sauvegarde */}
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Save className="w-6 h-6 text-blue-400" />
                Gestion des Sauvegardes
              </CardTitle>
              <CardDescription className="text-gray-300">
                Sauvegardez et chargez vos données en toute sécurité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg">
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-600">
                    <DialogHeader>
                      <DialogTitle className="text-white">Sauvegarder les Données</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="filename" className="text-gray-300">Nom du fichier</Label>
                        <Input
                          id="filename"
                          value={saveFilename}
                          onChange={(e) => setSaveFilename(e.target.value)}
                          placeholder={generateDefaultFilename()}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-gray-300">Description (optionnel)</Label>
                        <Textarea
                          id="description"
                          value={saveDescription}
                          onChange={(e) => setSaveDescription(e.target.value)}
                          placeholder="Description de la sauvegarde"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password" className="text-gray-300">Mot de passe</Label>
                        <Input
                          id="password"
                          type="password"
                          value={savePassword}
                          onChange={(e) => setSavePassword(e.target.value)}
                          placeholder="Mot de passe fort (min. 8 caractères)"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword" className="text-gray-300">Confirmer le mot de passe</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={saveConfirmPassword}
                          onChange={(e) => setSaveConfirmPassword(e.target.value)}
                          placeholder="Confirmez votre mot de passe"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        >
                          {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSaveDialogOpen(false)}
                          className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 shadow-lg">
                      <Upload className="w-4 h-4 mr-2" />
                      Charger
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-600">
                    <DialogHeader>
                      <DialogTitle className="text-white">Charger les Données</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="file" className="text-gray-300">Sélectionner un fichier</Label>
                        <Input
                          id="file"
                          type="file"
                          accept=".json"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="loadPassword" className="text-gray-300">Mot de passe</Label>
                        <Input
                          id="loadPassword"
                          type="password"
                          value={loadPassword}
                          onChange={(e) => setLoadPassword(e.target.value)}
                          placeholder="Mot de passe de la sauvegarde"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleLoad}
                          disabled={isLoading || !selectedFile}
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        >
                          {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                          {isLoading ? 'Chargement...' : 'Charger'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setLoadDialogOpen(false)}
                          className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Alert className="bg-blue-900/20 border-blue-400 text-blue-200">
                <Info className="h-4 w-4" />
                <AlertTitle>Information de sécurité</AlertTitle>
                <AlertDescription>
                  Vos données sont chiffrées avec votre mot de passe. Utilisez un mot de passe fort et gardez-le en sécurité.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Section Sécurité */}
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Shield className="w-6 h-6 text-green-400" />
                Conseils de Sécurité
              </CardTitle>
              <CardDescription className="text-gray-300">
                Améliorez la sécurité de vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="securityLevel" className="text-gray-300">Niveau de sécurité</Label>
                <Select value={securityLevel} onValueChange={(value: any) => setSecurityLevel(value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="basic" className="text-white hover:bg-slate-600">Basique</SelectItem>
                    <SelectItem value="advanced" className="text-white hover:bg-slate-600">Avancé</SelectItem>
                    <SelectItem value="expert" className="text-white hover:bg-slate-600">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {getSecurityTips().map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-200 text-sm">{tip}</span>
                  </div>
                ))}
              </div>

              <Alert className="bg-green-900/20 border-green-400 text-green-200">
                <Shield className="h-4 w-4" />
                <AlertTitle>Niveau de sécurité actuel</AlertTitle>
                <AlertDescription>
                  Votre niveau de sécurité est configuré sur <strong>{securityLevel}</strong>. 
                  Suivez les conseils ci-dessus pour améliorer votre protection.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Section Informations supplémentaires */}
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Info className="w-6 h-6 text-yellow-400" />
              Informations Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <Database className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Sauvegarde Automatique</h3>
                <p className="text-sm text-gray-300">Vos données sont sauvegardées automatiquement en session</p>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <Lock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Chiffrement AES-256</h3>
                <p className="text-sm text-gray-300">Vos sauvegardes sont protégées par un chiffrement militaire</p>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <Cloud className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Stockage Local</h3>
                <p className="text-sm text-gray-300">Vos données restent sur votre appareil, pas sur nos serveurs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Traductions
const translations = {
  fr: {
    title: "Sauvegarde & Sécurité",
    subtitle: "Protégez et sécurisez vos données de retraite avec nos outils avancés",
    saveTitle: "Sauvegarder les Données",
    loadTitle: "Charger les Données",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    filename: "Nom du fichier",
    description: "Description (optionnel)",
    save: "Sauvegarder",
    load: "Charger",
    cancel: "Annuler",
    securityTips: "Conseils de Sécurité",
    securityLevel: "Niveau de sécurité",
    basic: "Basique",
    advanced: "Avancé",
    expert: "Expert"
  },
  en: {
    title: "Backup & Security",
    subtitle: "Protect and secure your retirement data with our advanced tools",
    saveTitle: "Save Data",
    loadTitle: "Load Data",
    password: "Password",
    confirmPassword: "Confirm Password",
    filename: "Filename",
    description: "Description (optional)",
    save: "Save",
    load: "Load",
    cancel: "Cancel",
    securityTips: "Security Tips",
    securityLevel: "Security Level",
    basic: "Basic",
    advanced: "Advanced",
    expert: "Expert"
  }
};
