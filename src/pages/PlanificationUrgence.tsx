// src/pages/PlanificationUrgence.tsx
// Page dédiée à la planification d'urgence

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Heart,
  FileText,
  Users,
  Phone,
  Clock
} from 'lucide-react';

// Import du vrai composant EmergencyPlanningManager
import { EmergencyPlanningManager } from '../features/retirement/components/EmergencyPlanningManager';

const PlanificationUrgence: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Introduction */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Planification d'urgence
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Préparez un plan complet pour les situations d'urgence,
              d'invalidité ou de décès. Chaque personne du couple peut avoir son propre plan personnalisé.
            </p>
          </div>

          {/* Informations importantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <Phone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900">Contacts d'urgence</h3>
                <p className="text-sm text-blue-700">Personnes à contacter en cas d'urgence</p>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <h3 className="font-semibold text-red-900">Informations médicales</h3>
                <p className="text-sm text-red-700">Allergies, médicaments, directives</p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-900">Documents légaux</h3>
                <p className="text-sm text-green-700">Testament, mandats, assurances</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900">Responsabilités</h3>
                <p className="text-sm text-purple-700">Enfants, parents, animaux</p>
              </CardContent>
            </Card>
          </div>

          {/* Alertes importantes */}
          <div className="space-y-4 mb-8">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Pourquoi créer un plan d'urgence ?</AlertTitle>
              <AlertDescription>
                Un plan d'urgence bien préparé peut faire toute la différence lors d'une crise. Il permet à vos proches 
                d'accéder rapidement aux informations essentielles et de prendre les bonnes décisions en votre nom.
              </AlertDescription>
            </Alert>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Sécurité et confidentialité</AlertTitle>
              <AlertDescription>
                Toutes vos informations sont stockées localement sur votre appareil. Vous pouvez choisir quelles 
                informations inclure lors de l'impression et masquer les données sensibles si nécessaire.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important : Mise à jour régulière</AlertTitle>
              <AlertDescription>
                Pensez à réviser et mettre à jour votre plan d'urgence au moins une fois par année ou lors de 
                changements importants dans votre vie (déménagement, nouveau médecin, changement d'assurance, etc.).
              </AlertDescription>
            </Alert>
          </div>

          {/* Avantages pour les couples */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Planification individuelle pour couples
              </CardTitle>
              <CardDescription>
                Chaque personne du couple peut avoir des besoins et des volontés différents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-700">✓ Avantages de la planification séparée :</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Comptes bancaires et épargnes séparés</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Historiques médicaux différents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Responsabilités familiales spécifiques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Volontés personnelles distinctes</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-blue-700">🏠 Idéal pour :</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">Familles reconstituées</Badge>
                      <span className="text-xs">Enfants de relations précédentes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">Couples âgés</Badge>
                      <span className="text-xs">Besoins médicaux différents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">Entrepreneurs</Badge>
                      <span className="text-xs">Actifs d'affaires séparés</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">Couples binationaux</Badge>
                      <span className="text-xs">Considérations légales différentes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Composant principal de planification d'urgence - VRAI COMPOSANT */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center mb-6">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Gestionnaire de planification d'urgence
            </h2>
            <p className="text-gray-600">
              Interface complète pour la gestion de vos plans d'urgence
            </p>
          </div>
          
          {/* Utilisation du vrai composant EmergencyPlanningManager */}
          <EmergencyPlanningManager />
        </div>

        {/* Conseils et ressources */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Conseils et ressources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">📋 Liste de vérification :</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Informez vos proches de l'existence de ce plan</li>
                    <li>• Conservez une copie physique en lieu sûr</li>
                    <li>• Partagez les mots de passe importants avec une personne de confiance</li>
                    <li>• Mettez à jour après chaque changement majeur</li>
                    <li>• Révisez annuellement avec votre famille</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">🔗 Ressources utiles :</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <a href="https://www.quebec.ca/famille-et-soutien-aux-personnes/deces-et-succession" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Guide succession - Québec.ca</a></li>
                    <li>• <a href="https://www.notaires.qc.ca/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Chambre des notaires du Québec</a></li>
                    <li>• <a href="https://www.ramq.gouv.qc.ca/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">RAMQ - Assurance maladie</a></li>
                    <li>• <a href="https://www.canada.ca/fr/emploi-developpement-social/programmes/pension-survivant.html" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Prestations de survivant - Canada.ca</a></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlanificationUrgence;
