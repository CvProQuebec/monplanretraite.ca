/**
 * Étape d'accueil - Bienvenue sur MonPlanRetraite.ca
 */

import React from 'react';
import { Shield, Lock, Database, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../card';
import { Button } from '../button';
import { Badge } from '../badge';

interface WelcomeStepProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onComplete, onSkip }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Contenu principal - Version ultra-compacte */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {/* Message de bienvenue principal - Version compacte */}
        <div className="text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Bienvenue sur MonPlanRetraite.ca
          </h2>
          <p className="text-sm text-gray-600">
            Découvrez les fonctionnalités principales et la philosophie de sécurité de notre plateforme.
          </p>
        </div>

        {/* Principes de sécurité - Version ultra-compacte */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-3">
            <div className="flex items-center mb-2">
              <Lock className="h-4 w-4 text-green-600 mr-2" />
              <h3 className="text-sm font-semibold text-green-800">
                🛡️ Vos données restent sur VOTRE appareil
              </h3>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <Database className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <h4 className="font-medium text-green-800 text-xs mb-1">Stockage local</h4>
                <p className="text-xs text-green-700">
                  Données dans votre navigateur
                </p>
              </div>
              
              <div>
                <Shield className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <h4 className="font-medium text-green-800 text-xs mb-1">AES-256</h4>
                <p className="text-xs text-green-700">
                  Protection bancaire
                </p>
              </div>
              
              <div>
                <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <h4 className="font-medium text-green-800 text-xs mb-1">Zéro transmission</h4>
                <p className="text-xs text-green-700">
                  Aucun envoi serveur
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fonctionnalités principales - Version ultra-compacte */}
        <div className="grid grid-cols-2 gap-2">
          <Card>
            <CardContent className="p-3">
              <h3 className="text-sm font-semibold mb-2">🧮 Calculateurs</h3>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Planification retraite</li>
                <li>• Optimisation fiscale</li>
                <li>• Gestion budget</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <h3 className="text-sm font-semibold mb-2">📊 Analyses</h3>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Rapports détaillés</li>
                <li>• Comparaisons scénarios</li>
                <li>• Conseils personnalisés</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions - TOUJOURS VISIBLE EN BAS */}
      <div className="flex justify-center pt-3 border-t bg-white">
        <Button 
          onClick={onComplete}
          className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg font-bold"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          J'ai compris, continuons !
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
