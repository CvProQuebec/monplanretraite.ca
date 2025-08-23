// src/components/TestSecuritySystem.tsx
// Composant de test pour le nouveau système de sécurité

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { secureFileStorage } from '@/services/SecureFileOnlyStorage';
import SecurityNotificationManager from './SecurityNotificationManager';

interface TestData {
  name: string;
  age: number;
  email: string;
  notes: string;
}

export default function TestSecuritySystem() {
  const [testData, setTestData] = useState<TestData>({
    name: '',
    age: 0,
    email: '',
    notes: ''
  });
  
  const securityManagerRef = useRef<{ markDataAsLoaded: () => void }>(null);

  // Simuler la modification des données
  const handleDataChange = (field: keyof TestData, value: string | number) => {
    setTestData(prev => ({ ...prev, [field]: value }));
    // Marquer les données comme modifiées
    secureFileStorage.markDataAsModified();
  };

  // Simuler l'export des données
  const handleExport = () => {
    const filename = `test-data-${new Date().toISOString().split('T')[0]}.json`;
    secureFileStorage.exportToFile(testData, filename, 'test_data');
  };

  // Simuler l'import des données
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const importedData = await secureFileStorage.importFromFile(file);
          setTestData(importedData);
          
          // Marquer les données comme chargées
          if (securityManagerRef.current) {
            securityManagerRef.current.markDataAsLoaded();
          }
          
          console.log('Données importées avec succès:', importedData);
        } catch (error) {
          console.error('Erreur lors de l\'import:', error);
          alert('Erreur lors de l\'import: ' + error.message);
        }
      }
    };
    
    input.click();
  };

  // Simuler le vidage des données
  const handleClearData = () => {
    setTestData({
      name: '',
      age: 0,
      email: '',
      notes: ''
    });
  };

  // Forcer l'affichage du message de chargement obligatoire
  const handleForceLoadWarning = () => {
    secureFileStorage.showMustLoadDataWarning();
  };

  // Simuler des données d'urgence
  const handleEmergencyStore = () => {
    secureFileStorage.storeEmergencyData('test_data', testData);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Test du Système de Sécurité</CardTitle>
          <CardDescription>
            Testez le nouveau système de sauvegarde obligatoire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formulaire de test */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nom</label>
              <Input
                value={testData.name}
                onChange={(e) => handleDataChange('name', e.target.value)}
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Âge</label>
              <Input
                type="number"
                value={testData.age}
                onChange={(e) => handleDataChange('age', parseInt(e.target.value) || 0)}
                placeholder="Votre âge"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={testData.email}
                onChange={(e) => handleDataChange('email', e.target.value)}
                placeholder="votre@email.com"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Notes</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={testData.notes}
                onChange={(e) => handleDataChange('notes', e.target.value)}
                placeholder="Vos notes..."
              />
            </div>
          </div>

          {/* Boutons de test */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleExport} variant="default">
              Exporter les données
            </Button>
            <Button onClick={handleImport} variant="outline">
              Importer les données
            </Button>
            <Button onClick={handleClearData} variant="destructive">
              Vider les données
            </Button>
          </div>

          {/* Boutons de test avancés */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Tests avancés</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleForceLoadWarning} variant="secondary" size="sm">
                Forcer avertissement de chargement
              </Button>
              <Button onClick={handleEmergencyStore} variant="secondary" size="sm">
                Sauvegarder en urgence
              </Button>
            </div>
          </div>

          {/* Informations de session */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Informations de session</h3>
            <div className="text-xs space-y-1 bg-gray-50 p-3 rounded">
              <div>Données chargées: {secureFileStorage.hasUserLoadedData() ? '✅ Oui' : '❌ Non'}</div>
              <div>Données modifiées: {secureFileStorage.isDataDirty() ? '⚠️ Oui' : '✅ Non'}</div>
              <div>Session ID: {secureFileStorage.getSessionInfo().sessionId}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestionnaire de notifications de sécurité */}
      <SecurityNotificationManager
        ref={securityManagerRef}
        onExportRequest={handleExport}
        onImportRequest={handleImport}
        onDataClear={handleClearData}
      />
    </div>
  );
}
