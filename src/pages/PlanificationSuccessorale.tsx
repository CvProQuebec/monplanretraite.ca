// src/pages/PlanificationSuccessorale.tsx
// Page dédiée à la planification successorale

import React from 'react';
import { SuccessionPlanningManager } from '@/features/retirement/components/SuccessionPlanningManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Heart,
  DollarSign,
  Users,
  Home,
  Scale
} from 'lucide-react';

const PlanificationSuccessorale: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-mpr-interactive-lt to-mpr-interactive-lt">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Introduction */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Planification successorale
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Préparez la transmission de vos biens et protégez vos proches après votre décès. 
              Chaque personne du couple peut avoir ses propres volontés et dispositions.
            </p>
          </div>

          {/* Informations importantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-mpr-interactive-lt border-mpr-border">
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-mpr-interactive mx-auto mb-2" />
                <h3 className="font-semibold text-mpr-navy">Testament</h3>
                <p className="text-sm text-mpr-navy">Volontés de transmission</p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-900">Biens et actifs</h3>
                <p className="text-sm text-green-700">Inventaire et répartition</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900">Bénéficiaires</h3>
                <p className="text-sm text-purple-700">Héritiers et légataires</p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-orange-900">Volontés finales</h3>
                <p className="text-sm text-orange-700">Funérailles et dernières volontés</p>
              </CardContent>
            </Card>
          </div>

          {/* Alertes importantes */}
          <div className="space-y-4 mb-8">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Pourquoi planifier sa succession ?</AlertTitle>
              <AlertDescription>
                Une planification successorale bien préparée évite les conflits familiaux, réduit les impôts 
                et assure que vos volontés soient respectées. Elle facilite aussi les démarches pour vos proches 
                dans un moment difficile.
              </AlertDescription>
            </Alert>

            <Alert>
              <Scale className="h-4 w-4" />
              <AlertTitle>Aspects légaux importants</AlertTitle>
              <AlertDescription>
                Ce module vous aide à organiser vos informations, mais il est fortement recommandé de consulter 
                un notaire pour la rédaction officielle de vos documents légaux (testament, mandat d'inaptitude, etc.).
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important : Mise à jour régulière</AlertTitle>
              <AlertDescription>
                Révisez votre planification successorale lors de changements majeurs : mariage, divorce, 
                naissance, décès dans la famille, acquisition de biens importants, changement de situation financière.
              </AlertDescription>
            </Alert>
          </div>

          {/* Avantages pour les couples */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-mpr-interactive" />
                Planification individuelle pour couples
              </CardTitle>
              <CardDescription>
                Chaque personne peut avoir des volontés et des biens différents à transmettre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-700">✓ Avantages de la planification séparée :</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Biens personnels et familiaux distincts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Héritiers et bénéficiaires différents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Volontés funéraires personnelles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Dons et legs caritatifs individuels</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-mpr-navy">🏠 Particulièrement utile pour :</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">Familles reconstituées</Badge>
                      <span className="text-xs">Enfants de mariages précédents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">Couples âgés</Badge>
                      <span className="text-xs">Patrimoines familiaux distincts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">Entrepreneurs</Badge>
                      <span className="text-xs">Entreprises et actifs d'affaires</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">Couples binationaux</Badge>
                      <span className="text-xs">Biens dans différents pays</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Composant principal de planification successorale */}
        <SuccessionPlanningManager />

        {/* Conseils et ressources */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-mpr-interactive" />
                Conseils et ressources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">📋 Liste de vérification :</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Consultez un notaire pour officialiser vos documents</li>
                    <li>• Informez vos proches de vos volontés principales</li>
                    <li>• Conservez les originaux en lieu sûr</li>
                    <li>• Mettez à jour après chaque changement majeur</li>
                    <li>• Révisez annuellement avec votre famille</li>
                    <li>• Préparez un inventaire détaillé de vos biens</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">🔗 Ressources utiles :</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <a href="https://www.notaires.qc.ca/" className="text-mpr-interactive hover:underline" target="_blank" rel="noopener noreferrer">Chambre des notaires du Québec</a></li>
                    <li>• <a href="https://www.quebec.ca/famille-et-soutien-aux-personnes/deces-et-succession" className="text-mpr-interactive hover:underline" target="_blank" rel="noopener noreferrer">Guide succession - Québec.ca</a></li>
                    <li>• <a href="https://www.revenuquebec.ca/fr/citoyens/succession/" className="text-mpr-interactive hover:underline" target="_blank" rel="noopener noreferrer">Revenu Québec - Succession</a></li>
                    <li>• <a href="https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets-impot-particuliers/deces-personne/succession.html" className="text-mpr-interactive hover:underline" target="_blank" rel="noopener noreferrer">ARC - Succession et impôts</a></li>
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

export default PlanificationSuccessorale;
