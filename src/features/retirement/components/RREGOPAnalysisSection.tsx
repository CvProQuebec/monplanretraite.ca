import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
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
  Users
} from 'lucide-react';
import { RREGOPService, RREGOPUserData, RREGOPCalculationResult } from '../services/RREGOPService';

interface RREGOPAnalysisSectionProps {
  userData?: any;
  onDataChange?: (data: any) => void;
}

export default function RREGOPAnalysisSection({ userData, onDataChange }: RREGOPAnalysisSectionProps) {
  const [rregopData, setRregopData] = useState<RREGOPUserData>({
    typeRegime: 'RREGOP',
    anneesServiceAdmissibilite: 0,
    anneesServiceCalcul: 0,
    pourcentageTempsPlein: 1.0,
    salaireActuel: 0,
    ageRetraite: 65,
    optionSurvivant: 50
  });

  const [results, setResults] = useState<RREGOPCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activePerson, setActivePerson] = useState<1 | 2>(1);

  useEffect(() => {
    if (userData?.retirement) {
      const personData = activePerson === 1 ? {
        typeRegime: userData.retirement.rregopTypeRegime1 || 'RREGOP',
        anneesServiceAdmissibilite: userData.retirement.rregopAnneesService1 || 0,
        anneesServiceCalcul: userData.retirement.rregopAnneesServiceCalcul1 || 0,
        pourcentageTempsPlein: 1.0,
        salaireActuel: userData.personal?.salaire1 || 0,
        ageRetraite: userData.personal?.ageRetraiteSouhaite1 || 65,
        optionSurvivant: userData.retirement.rregopRenteConjointSurvivant1 || 50
      } : {
        typeRegime: userData.retirement.rregopTypeRegime2 || 'RREGOP',
        anneesServiceAdmissibilite: userData.retirement.rregopAnneesService2 || 0,
        anneesServiceCalcul: userData.retirement.rregopAnneesServiceCalcul2 || 0,
        pourcentageTempsPlein: 1.0,
        salaireActuel: userData.personal?.salaire2 || 0,
        ageRetraite: userData.personal?.ageRetraiteSouhaite2 || 65,
        optionSurvivant: userData.retirement.rregopRenteConjointSurvivant2 || 50
      };
      
      setRregopData(personData);
    }
  }, [userData, activePerson]);

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const calculationResults = RREGOPService.calculerRREGOP(rregopData);
      setResults(calculationResults);
      
      // Mettre à jour les données utilisateur
      if (onDataChange && calculationResults.valide) {
        const updatedData = { ...userData };
        if (activePerson === 1) {
          updatedData.retirement = {
            ...updatedData.retirement,
            rregopTypeRegime1: rregopData.typeRegime,
            rregopAnneesService1: rregopData.anneesServiceAdmissibilite,
            rregopAnneesServiceCalcul1: rregopData.anneesServiceCalcul,
            rregopRenteConjointSurvivant1: rregopData.optionSurvivant
          };
        } else {
          updatedData.retirement = {
            ...updatedData.retirement,
            rregopTypeRegime2: rregopData.typeRegime,
            rregopAnneesService2: rregopData.anneesServiceAdmissibilite,
            rregopAnneesServiceCalcul2: rregopData.anneesServiceCalcul,
            rregopRenteConjointSurvivant2: rregopData.optionSurvivant
          };
        }
        onDataChange(updatedData);
      }
    } catch (error) {
      console.error('Erreur calcul RREGOP:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInputChange = (field: keyof RREGOPUserData, value: any) => {
    setRregopData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Analyse RREGOP/RRPE - Personne {activePerson}
          </CardTitle>
          <CardDescription>
            Calculez votre rente de retraite selon le régime des employés du gouvernement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sélecteur de personne */}
          <div className="flex gap-2">
            <Button
              variant={activePerson === 1 ? "default" : "outline"}
              onClick={() => setActivePerson(1)}
              size="sm"
            >
              <Users className="h-4 w-4 mr-2" />
              Personne 1
            </Button>
            <Button
              variant={activePerson === 2 ? "default" : "outline"}
              onClick={() => setActivePerson(2)}
              size="sm"
            >
              <Users className="h-4 w-4 mr-2" />
              Personne 2
            </Button>
          </div>

          <Separator />

          {/* Formulaire de saisie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="typeRegime">Type de régime</Label>
              <Select
                value={rregopData.typeRegime}
                onValueChange={(value: 'RREGOP' | 'RRPE') => handleInputChange('typeRegime', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le régime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RREGOP">RREGOP (Québec)</SelectItem>
                  <SelectItem value="RRPE">RRPE (Fédéral)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="anneesService">Années de service admissibilité</Label>
              <Input
                id="anneesService"
                type="number"
                min="0"
                max="50"
                value={rregopData.anneesServiceAdmissibilite}
                onChange={(e) => handleInputChange('anneesServiceAdmissibilite', parseInt(e.target.value) || 0)}
                placeholder="Ex: 25"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anneesCalcul">Années de service calcul</Label>
              <Input
                id="anneesCalcul"
                type="number"
                min="0"
                max="50"
                value={rregopData.anneesServiceCalcul}
                onChange={(e) => handleInputChange('anneesServiceCalcul', parseInt(e.target.value) || 0)}
                placeholder="Ex: 25"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaireActuel">Salaire actuel ($)</Label>
              <Input
                id="salaireActuel"
                type="number"
                min="0"
                value={rregopData.salaireActuel}
                onChange={(e) => handleInputChange('salaireActuel', parseFloat(e.target.value) || 0)}
                placeholder="Ex: 75000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ageRetraite">Âge de retraite souhaité</Label>
              <Input
                id="ageRetraite"
                type="number"
                min="55"
                max="70"
                value={rregopData.ageRetraite}
                onChange={(e) => handleInputChange('ageRetraite', parseInt(e.target.value) || 65)}
                placeholder="Ex: 65"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="optionSurvivant">Option conjoint survivant</Label>
              <Select
                value={rregopData.optionSurvivant.toString()}
                onValueChange={(value) => handleInputChange('optionSurvivant', parseInt(value) as 50 | 60)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez l'option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50%</SelectItem>
                  <SelectItem value="60">60%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleCalculate} 
            disabled={isCalculating}
            className="w-full"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {isCalculating ? 'Calcul en cours...' : 'Calculer ma rente RREGOP'}
          </Button>
        </CardContent>
      </Card>

      {/* Résultats */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Résultats du calcul
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.valide ? (
              <>
                {/* Montants principaux */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${results.montantPleineRente.toLocaleString('fr-CA')}
                    </div>
                    <div className="text-sm text-gray-600">Pleine rente annuelle</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      ${results.montantFinal.toLocaleString('fr-CA')}
                    </div>
                    <div className="text-sm text-gray-600">Montant final</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      ${results.montantAvecCoordination.toLocaleString('fr-CA')}
                    </div>
                    <div className="text-sm text-gray-600">Avec coordination RRQ</div>
                  </div>
                </div>

                {/* Détails des pénalités */}
                {results.penalites.applicable && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Pénalités appliquées :</strong> {results.penalites.tauxPenalite * 100}% 
                      pour {results.penalites.anneesAnticipation} année(s) d'anticipation
                    </AlertDescription>
                  </Alert>
                )}

                {/* Coordination RRQ */}
                {results.coordination.applicable && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Coordination RRQ :</strong> Réduction de ${results.coordination.montantReduction.toLocaleString('fr-CA')} 
                      à partir de {results.coordination.ageApplication} ans
                    </AlertDescription>
                  </Alert>
                )}

                {/* Rente conjoint survivant */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Rente conjoint survivant</h4>
                  <div className="flex items-center justify-between">
                    <span>Pourcentage : {results.renteConjoint.pourcentage}%</span>
                    <span className="font-semibold">
                      ${results.renteConjoint.montant.toLocaleString('fr-CA')}/an
                    </span>
                  </div>
                </div>

                {/* Recommandations */}
                {results.recommandations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Recommandations</h4>
                    {results.recommandations.map((rec, index) => (
                      <div key={index} className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                        <div className="font-medium">{rec.titre}</div>
                        <div className="text-sm text-gray-600">{rec.description}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          <strong>Impact :</strong> {rec.impact}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Scénarios alternatifs */}
                {results.scenarios.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Scénarios alternatifs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {results.scenarios.map((scenario, index) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg">
                          <div className="font-medium">{scenario.nom}</div>
                          <div className="text-sm text-gray-600">
                            Âge {scenario.ageRetraite} ans: ${scenario.montantAnnuel.toLocaleString('fr-CA')}/an
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Erreurs détectées :</strong>
                  <ul className="mt-2 list-disc list-inside">
                    {results.erreurs.map((erreur, index) => (
                      <li key={index}>{erreur}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
