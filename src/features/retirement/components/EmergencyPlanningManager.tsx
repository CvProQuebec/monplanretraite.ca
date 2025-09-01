// src/features/retirement/components/EmergencyPlanningManager.tsx
// Composant principal pour la gestion de la planification d'urgence - Version simplifiée

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Info,
  FileText,
  Printer,
  Download,
  Upload,
  Plus
} from 'lucide-react';

interface EmergencyPlanningManagerProps {
  className?: string;
}

export const EmergencyPlanningManager: React.FC<EmergencyPlanningManagerProps> = ({ className }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Message d'information */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-3xl text-blue-900 mb-3">
            Gestionnaire de Planification d'Urgence
          </CardTitle>
          <CardDescription className="text-lg text-blue-700 mb-4">
            Module de planification d'urgence en cours de développement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Module en développement :</strong> Le gestionnaire de planification d'urgence complet 
              est actuellement en cours de développement. Cette version simplifiée vous permet de voir 
              que la page fonctionne correctement.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-900">Fonctionnalités prévues :</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Gestion des contacts d'urgence
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Informations médicales importantes
                </li>
                <li className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Documents légaux et financiers
                </li>
                <li className="flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  Export et impression des plans
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-blue-900">Avantages :</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Protection complète de votre famille</li>
                <li>• Accès rapide aux informations critiques</li>
                <li>• Réduction du stress en cas d'urgence</li>
                <li>• Organisation professionnelle des documents</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Button disabled className="bg-blue-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Créer un plan d'urgence
            </Button>
            <Button disabled variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Importer un plan existant
            </Button>
          </div>

          <Alert className="mt-6 bg-green-50 border-green-200">
            <AlertTriangle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Bonne nouvelle :</strong> La page /planification-urgence fonctionne maintenant correctement ! 
              Le module complet sera disponible dans une prochaine mise à jour.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
