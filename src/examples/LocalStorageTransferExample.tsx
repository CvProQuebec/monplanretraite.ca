/**
 * Exemple d'utilisation du LocalStorageTransferDialog
 * Ce composant peut être intégré dans n'importe quelle page du site
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LocalStorageTransferDialog from '@/components/ui/LocalStorageTransferDialog';
import { Database, HardDrive, Shield } from 'lucide-react';

const LocalStorageTransferExample: React.FC = () => {
  const handleTransferComplete = () => {
    console.log('✅ Transfert terminé ! Les données ont été sauvegardées et le localStorage vidé.');
    
    // Optionnel : rediriger ou recharger la page
    // window.location.reload();
    
    // Ou afficher un message à l'utilisateur
    alert('Vos données ont été transférées avec succès vers un fichier local !');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-600" />
            Sauvegarde des données locales
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>Fonctionnalité :</strong> Ce bouton permet de transférer toutes vos données 
              stockées dans le navigateur vers un fichier local sur votre ordinateur.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Ce qui se passe lors du transfert :
              </h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Récupération de toutes les données sécurisées et régulières</li>
                <li>• Suggestion d'un nom de fichier intelligent</li>
                <li>• Possibilité de personnaliser le nom et la description</li>
                <li>• Sauvegarde dans un fichier JSON</li>
                <li>• Vidage automatique du localStorage après succès</li>
                <li>• Conservation des informations de la dernière sauvegarde</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-2">
                ⚠️ Important :
              </h4>
              <p className="text-amber-700 text-sm">
                Après la sauvegarde, toutes vos données seront supprimées du navigateur. 
                Assurez-vous que le fichier a bien été créé avant de continuer.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <HardDrive className="h-4 w-4" />
              Sauvegarde locale sécurisée
            </div>
            
            <LocalStorageTransferDialog 
              onTransferComplete={handleTransferComplete} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalStorageTransferExample;