// src/features/retirement/components/SecurityManager.tsx
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  Lock,
  Unlock,
  Download,
  Upload,
  Key,
  AlertTriangle,
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  FileJson,
  HardDrive
} from 'lucide-react';
import CryptoJS from 'crypto-js';
import { UserData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SecurityManagerProps {
  userData: UserData;
  onRestore: (data: UserData) => void;
}

export const SecurityManager: React.FC<SecurityManagerProps> = ({
  userData,
  onRestore
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [encryptedData, setEncryptedData] = useState('');
  const [decryptionPassword, setDecryptionPassword] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chiffrer les données
  const encryptData = async () => {
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }
    
    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
      return;
    }

    setIsEncrypting(true);
    setMessage(null);

    try {
      // Simuler un délai pour l'animation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dataString = JSON.stringify(userData);
      const encrypted = CryptoJS.AES.encrypt(dataString, password).toString();
      setEncryptedData(encrypted);
      
      setMessage({ type: 'success', text: 'Données chiffrées avec succès!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du chiffrement' });
    } finally {
      setIsEncrypting(false);
    }
  };

  // Déchiffrer les données
  const decryptData = async () => {
    if (!encryptedData || !decryptionPassword) {
      setMessage({ type: 'error', text: 'Veuillez fournir les données chiffrées et le mot de passe' });
      return;
    }

    setIsDecrypting(true);
    setMessage(null);

    try {
      // Simuler un délai pour l'animation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const decrypted = CryptoJS.AES.decrypt(encryptedData, decryptionPassword);
      const dataString = decrypted.toString(CryptoJS.enc.Utf8);
      const restoredData = JSON.parse(dataString);
      
      onRestore(restoredData);
      setMessage({ type: 'success', text: 'Données restaurées avec succès!' });
      
      // Réinitialiser les champs
      setDecryptionPassword('');
      setEncryptedData('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Mot de passe incorrect ou données corrompues' });
    } finally {
      setIsDecrypting(false);
    }
  };

  // Télécharger les données chiffrées
  const downloadEncryptedData = () => {
    const blob = new Blob([encryptedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plan-retraite-securise-${new Date().toISOString().split('T')[0]}.enc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Télécharger les données en clair (JSON)
  const downloadPlainData = () => {
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plan-retraite-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Charger un fichier
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Vérifier si c'est du JSON ou des données chiffrées
      try {
        const jsonData = JSON.parse(content);
        onRestore(jsonData);
        setMessage({ type: 'success', text: 'Données JSON importées avec succès!' });
      } catch {
        // Si ce n'est pas du JSON, c'est probablement chiffré
        setEncryptedData(content);
        setMessage({ type: 'success', text: 'Données chiffrées chargées. Entrez le mot de passe pour déchiffrer.' });
      }
    };
    reader.readAsText(file);
  };

  // Copier les données chiffrées
  const copyEncryptedData = async () => {
    try {
      await navigator.clipboard.writeText(encryptedData);
      setMessage({ type: 'success', text: 'Données copiées dans le presse-papiers!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la copie' });
    }
  };

  // Effacer toutes les données locales
  const clearLocalData = () => {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données locales?')) {
      localStorage.clear();
      sessionStorage.clear();
      setMessage({ type: 'success', text: 'Données locales effacées' });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Gestionnaire de sécurité
          </CardTitle>
          <CardDescription>
            Protégez et sauvegardez vos données financières en toute sécurité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="encrypt" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="encrypt">Chiffrer</TabsTrigger>
              <TabsTrigger value="decrypt">Déchiffrer</TabsTrigger>
              <TabsTrigger value="backup">Sauvegardes</TabsTrigger>
            </TabsList>
            
            {/* Onglet Chiffrement */}
            <TabsContent value="encrypt" className="space-y-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertTitle>Chiffrement AES-256</AlertTitle>
                <AlertDescription>
                  Vos données seront chiffrées localement avec un algorithme de sécurité militaire.
                  Conservez votre mot de passe en lieu sûr!
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe de chiffrement</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 caractères"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Retapez le mot de passe"
                  />
                </div>
                
                <Button 
                  onClick={encryptData} 
                  disabled={isEncrypting || !password || !confirmPassword}
                  className="w-full"
                >
                  {isEncrypting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                      </motion.div>
                      Chiffrement en cours...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Chiffrer les données
                    </>
                  )}
                </Button>
                
                {encryptedData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription>
                        Données chiffrées avec succès! Vous pouvez maintenant les sauvegarder.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="flex gap-2">
                      <Button onClick={downloadEncryptedData} variant="outline" className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                      <Button onClick={copyEncryptedData} variant="outline" className="flex-1">
                        <Copy className="mr-2 h-4 w-4" />
                        Copier
                      </Button>
                    </div>
                    
                    <div className="p-3 bg-gray-100 rounded-lg font-mono text-xs break-all">
                      {encryptedData.substring(0, 100)}...
                    </div>
                  </motion.div>
                )}
              </div>
            </TabsContent>
            
            {/* Onglet Déchiffrement */}
            <TabsContent value="decrypt" className="space-y-4">
              <Alert>
                <Unlock className="h-4 w-4" />
                <AlertTitle>Restaurer des données chiffrées</AlertTitle>
                <AlertDescription>
                  Importez un fichier chiffré ou collez les données pour les déchiffrer.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Données chiffrées</Label>
                  <textarea
                    className="w-full min-h-[100px] p-3 border rounded-lg font-mono text-xs"
                    value={encryptedData}
                    onChange={(e) => setEncryptedData(e.target.value)}
                    placeholder="Collez les données chiffrées ici..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="decrypt-password">Mot de passe de déchiffrement</Label>
                  <Input
                    id="decrypt-password"
                    type="password"
                    value={decryptionPassword}
                    onChange={(e) => setDecryptionPassword(e.target.value)}
                    placeholder="Entrez le mot de passe"
                  />
                </div>
                
                <Button 
                  onClick={decryptData} 
                  disabled={isDecrypting || !encryptedData || !decryptionPassword}
                  className="w-full"
                >
                  {isDecrypting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Unlock className="mr-2 h-4 w-4" />
                      </motion.div>
                      Déchiffrement en cours...
                    </>
                  ) : (
                    <>
                      <Unlock className="mr-2 h-4 w-4" />
                      Déchiffrer et restaurer
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            {/* Onglet Sauvegardes */}
            <TabsContent value="backup" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileJson className="h-4 w-4" />
                      Export JSON
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Exportez vos données en format lisible (non chiffré)
                    </p>
                    <Button onClick={downloadPlainData} variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger JSON
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Importer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Importez un fichier JSON ou chiffré (.enc)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,.enc,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button 
                      onClick={() => fileInputRef.current?.click()} 
                      variant="outline" 
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choisir un fichier
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-red-600">
                    <Trash2 className="h-4 w-4" />
                    Zone de danger
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Cette action est irréversible. Toutes les données stockées localement seront effacées.
                  </p>
                  <Button 
                    onClick={clearLocalData} 
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Effacer toutes les données locales
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Messages */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4"
              >
                <Alert className={message.type === 'error' ? 'border-red-200' : 'border-green-200'}>
                  {message.type === 'error' ? (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      {/* Conseils de sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4" />
            Conseils de sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Utilisez un mot de passe fort et unique que vous n'utilisez nulle part ailleurs</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Conservez votre mot de passe dans un gestionnaire de mots de passe sécurisé</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Faites des sauvegardes régulières de vos données chiffrées</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Ne partagez jamais votre mot de passe ou vos données non chiffrées</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span>Si vous perdez votre mot de passe, vos données chiffrées seront irrécupérables</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};