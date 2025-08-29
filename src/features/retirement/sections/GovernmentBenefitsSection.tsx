import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import { Separator } from '../../ui/separator';
import { 
  Building2, 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Calendar,
  DollarSign,
  Users,
  Shield,
  Crown,
  MapPin
} from 'lucide-react';

// Import des composants gouvernementaux
import { SRGAnalysisSection } from '../components/SRGAnalysisSection';
import { RREGOPAnalysisSection } from '../components/RREGOPAnalysisSection';
import { CalculationService } from '../services/CalculationService';

interface GovernmentBenefitsSectionProps {
  userData?: any;
  onDataChange?: (data: any) => void;
}

export default function GovernmentBenefitsSection({ userData, onDataChange }: GovernmentBenefitsSectionProps) {
  const [governmentResults, setGovernmentResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleCalculateAll = async () => {
    setIsCalculating(true);
    try {
      console.log('🇨🇦 Lancement des calculs gouvernementaux combinés...');
      const results = CalculationService.calculateGovernmentBenefits(userData);
      setGovernmentResults(results);
      console.log('✅ Calculs gouvernementaux terminés');
    } catch (error) {
      console.error('Erreur calculs gouvernementaux:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDataChange = (newData: any) => {
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-blue-600" />
            Prestations Gouvernementales Complètes
          </CardTitle>
          <CardDescription>
            Analyse intégrée de tous vos droits gouvernementaux : RRQ, Sécurité de la vieillesse, SRG et RREGOP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button 
              onClick={handleCalculateAll} 
              disabled={isCalculating}
              className="flex-1"
            >
              <Calculator className="h-4 w-4 mr-2" />
              {isCalculating ? 'Calcul en cours...' : 'Calculer toutes les prestations'}
            </Button>
          </div>

          {/* Vue d'ensemble des résultats */}
          {governmentResults && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  ${governmentResults.revenuTotalGaranti?.toLocaleString('fr-CA') || '0'}
                </div>
                <div className="text-sm text-gray-600">Revenu total garanti</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {governmentResults.srg?.eligible ? 'Oui' : 'Non'}
                </div>
                <div className="text-sm text-gray-600">Éligible SRG</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {governmentResults.rregop?.personne1?.valide || governmentResults.rregop?.personne2?.valide ? 'Oui' : 'Non'}
                </div>
                <div className="text-sm text-gray-600">RREGOP actif</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {governmentResults.recommandations?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Recommandations</div>
              </div>
            </div>
          )}

          {/* Recommandations principales */}
          {governmentResults?.recommandations?.length > 0 && (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Recommandations principales :</strong>
                <ul className="mt-2 space-y-1">
                  {governmentResults.recommandations.slice(0, 3).map((rec: string, index: number) => (
                    <li key={index} className="text-sm">• {rec}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Onglets détaillés */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="srg" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            SRG
          </TabsTrigger>
          <TabsTrigger value="rregop" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            RREGOP
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Détails
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Résumé des Prestations Gouvernementales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {governmentResults ? (
                <>
                  {/* RRQ */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Régime de Rentes du Québec (RRQ)
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Personne 1:</span> 
                        ${governmentResults.rrq?.person1?.montantMensuel?.toLocaleString('fr-CA') || '0'}/mois
                      </div>
                      <div>
                        <span className="font-medium">Personne 2:</span> 
                        ${governmentResults.rrq?.person2?.montantMensuel?.toLocaleString('fr-CA') || '0'}/mois
                      </div>
                    </div>
                  </div>

                  {/* Sécurité de la vieillesse */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Sécurité de la vieillesse
                    </h4>
                    <div className="text-sm">
                      <span className="font-medium">Montant mensuel:</span> 
                      ${governmentResults.sv?.securiteVieillesse?.montantMensuel?.toLocaleString('fr-CA') || '0'}/mois
                    </div>
                  </div>

                  {/* SRG */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Supplément de Revenu Garanti (SRG)
                    </h4>
                    <div className="text-sm">
                      <span className="font-medium">Éligible:</span> 
                      <Badge variant={governmentResults.srg?.eligible ? "default" : "secondary"} className="ml-2">
                        {governmentResults.srg?.eligible ? 'Oui' : 'Non'}
                      </Badge>
                    </div>
                    {governmentResults.srg?.eligible && (
                      <div className="text-sm mt-1">
                        <span className="font-medium">Montant total:</span> 
                        ${governmentResults.srg?.montantTotal?.toLocaleString('fr-CA') || '0'}/an
                      </div>
                    )}
                  </div>

                  {/* RREGOP */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      RREGOP/RRPE
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Personne 1:</span> 
                        {governmentResults.rregop?.personne1?.valide ? (
                          <span className="text-green-600">${governmentResults.rregop.personne1.montantFinal?.toLocaleString('fr-CA') || '0'}/an</span>
                        ) : (
                          <span className="text-gray-500">Non applicable</span>
                        )}
                      </div>
                      <div>
                        <span className="font-medium">Personne 2:</span> 
                        {governmentResults.rregop?.personne2?.valide ? (
                          <span className="text-green-600">${governmentResults.rregop.personne2.montantFinal?.toLocaleString('fr-CA') || '0'}/an</span>
                        ) : (
                          <span className="text-gray-500">Non applicable</span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Cliquez sur "Calculer toutes les prestations" pour voir le résumé
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="srg">
          <SRGAnalysisSection userData={userData} onDataChange={handleDataChange} />
        </TabsContent>

        <TabsContent value="rregop">
          <RREGOPAnalysisSection userData={userData} onDataChange={handleDataChange} />
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Détails Techniques et Optimisations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <h4 className="font-semibold mb-2">💡 Conseils d'optimisation</h4>
                <ul className="text-sm space-y-1">
                  <li>• Le SRG est réduit de 50¢ par dollar de revenu au-dessus de 23 712$</li>
                  <li>• RREGOP : pénalité de 6% par année d'anticipation avant 61 ans</li>
                  <li>• Coordination RRQ : réduction automatique à partir de 65 ans</li>
                  <li>• Optimisez vos revenus pour maximiser le SRG</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-semibold mb-2">📊 Sources de revenus garantis</h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>RRQ (65 ans):</span>
                    <span className="font-medium">${governmentResults?.rrq?.person1?.montantMensuel ? (governmentResults.rrq.person1.montantMensuel * 12).toLocaleString('fr-CA') : '0'}/an</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SV (65 ans):</span>
                    <span className="font-medium">${governmentResults?.sv?.securiteVieillesse?.montantMensuel ? (governmentResults.sv.securiteVieillesse.montantMensuel * 12 * 2).toLocaleString('fr-CA') : '0'}/an</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SRG (si éligible):</span>
                    <span className="font-medium">${governmentResults?.srg?.montantTotal?.toLocaleString('fr-CA') || '0'}/an</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total garanti:</span>
                    <span className="text-blue-600">${governmentResults?.revenuTotalGaranti?.toLocaleString('fr-CA') || '0'}/an</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
