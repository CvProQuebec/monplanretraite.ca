// ===== MODULE CCQ - COMMISSION DE LA CONSTRUCTION DU QUÉBEC =====
// Composant principal pour le régime de retraite des travailleurs de la construction

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Alert, AlertDescription } from './alert';
import { Badge } from './badge';
import { 
  HardHat, 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  FileText,
  Users,
  Calendar,
  Target,
  Lightbulb
} from 'lucide-react';

import { CCQService } from '../../services/CCQService';
import { 
  CCQData, 
  CCQCalculationResult, 
  CCQFormData, 
  CCQSecteur, 
  CCQRetirementType, 
  CCQRenteOption,
  CCQProjectionScenario
} from '../../types/ccq';
import { useLanguage } from '../../hooks/useLanguage';

interface CCQModuleProps {
  data: any;
  onUpdate: (updates: any) => void;
  language?: 'fr' | 'en';
}

// Fonction utilitaire pour formater les montants
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export default function CCQModule({ data, onUpdate, language = 'fr' }: CCQModuleProps) {
  const [activeTab, setActiveTab] = useState('identification');
  const [formData, setFormData] = useState<CCQFormData>({
    certificatCompetence: '',
    dateEntreeIndustrie: '',
    secteursActivite: [],
    saisieManuelle: true,
    heuresTravaileesAvant2005: '',
    heuresAjusteesAvant2005: '',
    heuresTravaileesDepuis2005: '',
    valeurCompteGeneral: '',
    valeurCompteComplementaire: '',
    continuerTravaillerConstruction: true,
    heuresAnnuellesEstimees: '',
    ageRetraiteSouhaite: '',
    typeRetraitePreferee: 'normale',
    optionRentePreferee: 'majoree-reduite'
  });
  
  const [calculationResult, setCalculationResult] = useState<CCQCalculationResult | null>(null);
  const [scenarios, setScenarios] = useState<CCQProjectionScenario[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Traductions
  const translations = {
    fr: {
      title: "Régime de retraite CCQ",
      subtitle: "Commission de la Construction du Québec",
      identification: "Identification",
      historique: "Données historiques",
      projections: "Projections",
      resultats: "Résultats",
      scenarios: "Scénarios",
      
      // Identification
      certificat: "Certificat de compétence CCQ",
      dateEntree: "Date d'entrée dans l'industrie",
      secteurs: "Secteurs d'activité",
      secteurResidentiel: "Résidentiel",
      secteurInstitutionnel: "Institutionnel-commercial",
      secteurIndustriel: "Industriel",
      secteurGenieCivil: "Génie civil et voirie",
      
      // Données historiques
      heuresAvant2005: "Heures travaillées avant 2005",
      heuresAjustees: "Heures ajustées avant 2005",
      heuresDepuis2005: "Heures travaillées depuis 2005",
      valeurGeneral: "Valeur compte général",
      valeurComplementaire: "Valeur compte complémentaire",
      
      // Projections
      continuerTravail: "Continuer à travailler dans la construction",
      heuresAnnuelles: "Heures annuelles estimées",
      ageRetraite: "Âge de retraite souhaité",
      typeRetraite: "Type de retraite préféré",
      optionRente: "Option de rente préférée",
      
      // Types de retraite
      retraiteNormale: "Retraite normale (65 ans)",
      retraiteAnticipee: "Retraite anticipée (55 ans)",
      retraiteInvalidite: "Retraite pour invalidité",
      retraitePartielle: "Retraite partielle",
      
      // Options de rente
      renteNivelee: "Rente nivelée",
      renteMajoreeReduite: "Rente majorée-réduite",
      
      // Boutons
      calculer: "Calculer ma pension CCQ",
      
      // Résultats
      compteGeneral: "Compte Général (pré-2005)",
      compteComplementaire: "Compte Complémentaire (post-2005)",
      renteAnnuelle: "Rente annuelle totale",
      renteMensuelle: "Rente mensuelle totale",
      
      // Messages
      calculEnCours: "Calcul en cours...",
      erreurCalcul: "Erreur lors du calcul",
      
      // Avertissement légal
      avertissementLegal: "Les calculs présentés sont des estimations basées sur les informations fournies et la réglementation en vigueur. Pour obtenir des montants officiels et définitifs, communiquez directement avec la CCQ au 1-888-842-8282. Ce calculateur ne constitue pas un conseil financier."
    },
    en: {
      title: "CCQ Retirement Plan",
      subtitle: "Quebec Construction Commission",
      identification: "Identification",
      historique: "Historical Data",
      projections: "Projections",
      resultats: "Results",
      scenarios: "Scenarios",
      
      // Identification
      certificat: "CCQ Competency Certificate",
      dateEntree: "Industry entry date",
      secteurs: "Activity sectors",
      secteurResidentiel: "Residential",
      secteurInstitutionnel: "Institutional-commercial",
      secteurIndustriel: "Industrial",
      secteurGenieCivil: "Civil engineering and roadwork",
      
      // Données historiques
      heuresAvant2005: "Hours worked before 2005",
      heuresAjustees: "Adjusted hours before 2005",
      heuresDepuis2005: "Hours worked since 2005",
      valeurGeneral: "General account value",
      valeurComplementaire: "Complementary account value",
      
      // Projections
      continuerTravail: "Continue working in construction",
      heuresAnnuelles: "Estimated annual hours",
      ageRetraite: "Desired retirement age",
      typeRetraite: "Preferred retirement type",
      optionRente: "Preferred pension option",
      
      // Types de retraite
      retraiteNormale: "Normal retirement (65 years)",
      retraiteAnticipee: "Early retirement (55 years)",
      retraiteInvalidite: "Disability retirement",
      retraitePartielle: "Partial retirement",
      
      // Options de rente
      renteNivelee: "Level pension",
      renteMajoreeReduite: "Enhanced-reduced pension",
      
      // Boutons
      calculer: "Calculate my CCQ pension",
      
      // Résultats
      compteGeneral: "General Account (pre-2005)",
      compteComplementaire: "Complementary Account (post-2005)",
      renteAnnuelle: "Total annual pension",
      renteMensuelle: "Total monthly pension",
      
      // Messages
      calculEnCours: "Calculating...",
      erreurCalcul: "Calculation error",
      
      // Avertissement légal
      avertissementLegal: "The calculations presented are estimates based on the information provided and current regulations. For official and definitive amounts, contact CCQ directly at 1-888-842-8282. This calculator does not constitute financial advice."
    }
  };

  const tr = translations[language];

  // Gestion des changements de formulaire
  const handleFormChange = (field: keyof CCQFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gestion des secteurs d'activité (choix multiples)
  const handleSecteurToggle = (secteur: CCQSecteur) => {
    setFormData(prev => ({
      ...prev,
      secteursActivite: prev.secteursActivite.includes(secteur)
        ? prev.secteursActivite.filter(s => s !== secteur)
        : [...prev.secteursActivite, secteur]
    }));
  };

  // Conversion des données du formulaire vers CCQData
  const convertFormDataToCCQData = (): CCQData => {
    return {
      certificatCompetence: formData.certificatCompetence,
      dateEntreeIndustrie: new Date(formData.dateEntreeIndustrie),
      statutTravailleur: 'actif',
      secteursActivite: formData.secteursActivite,
      secteurPrincipal: formData.secteursActivite[0] || 'residentiel',
      heuresTravaileesAvant2005: parseFloat(formData.heuresTravaileesAvant2005) || 0,
      heuresAjusteesAvant2005: parseFloat(formData.heuresAjusteesAvant2005) || 0,
      heuresTravaileesDepuis2005: parseFloat(formData.heuresTravaileesDepuis2005) || 0,
      heuresTotales: (parseFloat(formData.heuresTravaileesAvant2005) || 0) + 
                     (parseFloat(formData.heuresTravaileesDepuis2005) || 0),
      valeurCompteGeneral: parseFloat(formData.valeurCompteGeneral) || 0,
      valeurCompteComplementaire: parseFloat(formData.valeurCompteComplementaire) || 0,
      cotisationsPatronales: 0,
      cotisationsSalariales: 0,
      rendements: 0,
      heuresAnnuellesEstimees: parseFloat(formData.heuresAnnuellesEstimees) || 1800,
      ageRetraiteSouhaite: parseInt(formData.ageRetraiteSouhaite) || 65,
      continuerTravaillerConstruction: formData.continuerTravaillerConstruction,
      typeRetraite: formData.typeRetraitePreferee,
      optionRente: formData.optionRentePreferee,
      prestationsDecesActuelles: 0
    };
  };

  // Calcul de la pension CCQ
  const handleCalculate = async () => {
    setIsCalculating(true);
    setErrors([]);
    
    try {
      const ccqData = convertFormDataToCCQData();
      
      // Validation
      const validation = CCQService.validateCCQData(ccqData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
      
      // Calcul principal
      const result = CCQService.calculateCCQPension(ccqData);
      setCalculationResult(result);
      
      // Génération des scénarios
      const projectionScenarios = CCQService.generateProjectionScenarios(ccqData);
      setScenarios(projectionScenarios);
      
      // Sauvegarde dans les données utilisateur
      onUpdate({
        ccqData: ccqData,
        ccqResult: result,
        ccqScenarios: projectionScenarios
      });
      
      // Passer à l'onglet résultats
      setActiveTab('resultats');
      
    } catch (error: any) {
      console.error('Erreur calcul CCQ:', error);
      setErrors([error.message || tr.erreurCalcul]);
    } finally {
      setIsCalculating(false);
    }
  };

  // Chargement des données existantes
  useEffect(() => {
    if (data?.ccqData) {
      const ccqData = data.ccqData as CCQData;
      setFormData({
        certificatCompetence: ccqData.certificatCompetence || '',
        dateEntreeIndustrie: ccqData.dateEntreeIndustrie?.toISOString().split('T')[0] || '',
        secteursActivite: ccqData.secteursActivite || [],
        saisieManuelle: true,
        heuresTravaileesAvant2005: ccqData.heuresTravaileesAvant2005?.toString() || '',
        heuresAjusteesAvant2005: ccqData.heuresAjusteesAvant2005?.toString() || '',
        heuresTravaileesDepuis2005: ccqData.heuresTravaileesDepuis2005?.toString() || '',
        valeurCompteGeneral: ccqData.valeurCompteGeneral?.toString() || '',
        valeurCompteComplementaire: ccqData.valeurCompteComplementaire?.toString() || '',
        continuerTravaillerConstruction: ccqData.continuerTravaillerConstruction ?? true,
        heuresAnnuellesEstimees: ccqData.heuresAnnuellesEstimees?.toString() || '',
        ageRetraiteSouhaite: ccqData.ageRetraiteSouhaite?.toString() || '',
        typeRetraitePreferee: ccqData.typeRetraite || 'normale',
        optionRentePreferee: ccqData.optionRente || 'majoree-reduite'
      });
    }
    
    if (data?.ccqResult) {
      setCalculationResult(data.ccqResult);
    }
    
    if (data?.ccqScenarios) {
      setScenarios(data.ccqScenarios);
    }
  }, [data]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* En-tête */}
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HardHat className="w-8 h-8 text-orange-600" />
            <div>
              <CardTitle className="text-2xl font-bold text-orange-800">
                {tr.title}
              </CardTitle>
              <CardDescription className="text-orange-600 font-medium">
                {tr.subtitle}
              </CardDescription>
            </div>
          </div>
          
          {/* Statistiques CCQ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/70 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-700">202 000</div>
              <div className="text-sm text-orange-600">Participants actifs</div>
            </div>
            <div className="bg-white/70 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-700">176 000</div>
              <div className="text-sm text-orange-600">Participants inactifs</div>
            </div>
            <div className="bg-white/70 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-700">104 000</div>
              <div className="text-sm text-orange-600">Retraités</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages d'erreur */}
      {errors.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="identification" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {tr.identification}
          </TabsTrigger>
          <TabsTrigger value="historique" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {tr.historique}
          </TabsTrigger>
          <TabsTrigger value="projections" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            {tr.projections}
          </TabsTrigger>
          <TabsTrigger value="resultats" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            {tr.resultats}
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {tr.scenarios}
          </TabsTrigger>
        </TabsList>

        {/* Onglet Identification */}
        <TabsContent value="identification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {tr.identification}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="certificat">{tr.certificat}</Label>
                  <Input
                    id="certificat"
                    value={formData.certificatCompetence}
                    onChange={(e) => handleFormChange('certificatCompetence', e.target.value)}
                    placeholder="Ex: 123456789"
                  />
                </div>
                <div>
                  <Label htmlFor="dateEntree">{tr.dateEntree}</Label>
                  <Input
                    id="dateEntree"
                    type="date"
                    value={formData.dateEntreeIndustrie}
                    onChange={(e) => handleFormChange('dateEntreeIndustrie', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label>{tr.secteurs}</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { key: 'residentiel', label: tr.secteurResidentiel },
                    { key: 'institutionnel-commercial', label: tr.secteurInstitutionnel },
                    { key: 'industriel', label: tr.secteurIndustriel },
                    { key: 'genie-civil-voirie', label: tr.secteurGenieCivil }
                  ].map(secteur => (
                    <Button
                      key={secteur.key}
                      variant={formData.secteursActivite.includes(secteur.key as CCQSecteur) ? "default" : "outline"}
                      onClick={() => handleSecteurToggle(secteur.key as CCQSecteur)}
                      className="justify-start"
                    >
                      {secteur.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Données historiques */}
        <TabsContent value="historique" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {tr.historique}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="heuresAvant2005">{tr.heuresAvant2005}</Label>
                  <Input
                    id="heuresAvant2005"
                    type="number"
                    value={formData.heuresTravaileesAvant2005}
                    onChange={(e) => handleFormChange('heuresTravaileesAvant2005', e.target.value)}
                    placeholder="Ex: 15000"
                  />
                </div>
                <div>
                  <Label htmlFor="heuresAjustees">{tr.heuresAjustees}</Label>
                  <Input
                    id="heuresAjustees"
                    type="number"
                    value={formData.heuresAjusteesAvant2005}
                    onChange={(e) => handleFormChange('heuresAjusteesAvant2005', e.target.value)}
                    placeholder="Ex: 14500"
                  />
                </div>
                <div>
                  <Label htmlFor="heuresDepuis2005">{tr.heuresDepuis2005}</Label>
                  <Input
                    id="heuresDepuis2005"
                    type="number"
                    value={formData.heuresTravaileesDepuis2005}
                    onChange={(e) => handleFormChange('heuresTravaileesDepuis2005', e.target.value)}
                    placeholder="Ex: 25000"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valeurGeneral">{tr.valeurGeneral} ($)</Label>
                  <Input
                    id="valeurGeneral"
                    type="number"
                    value={formData.valeurCompteGeneral}
                    onChange={(e) => handleFormChange('valeurCompteGeneral', e.target.value)}
                    placeholder="Ex: 125000"
                  />
                </div>
                <div>
                  <Label htmlFor="valeurComplementaire">{tr.valeurComplementaire} ($)</Label>
                  <Input
                    id="valeurComplementaire"
                    type="number"
                    value={formData.valeurCompteComplementaire}
                    onChange={(e) => handleFormChange('valeurCompteComplementaire', e.target.value)}
                    placeholder="Ex: 85000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Projections */}
        <TabsContent value="projections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                {tr.projections}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="heuresAnnuelles">{tr.heuresAnnuelles}</Label>
                  <Input
                    id="heuresAnnuelles"
                    type="number"
                    value={formData.heuresAnnuellesEstimees}
                    onChange={(e) => handleFormChange('heuresAnnuellesEstimees', e.target.value)}
                    placeholder="Ex: 1800"
                  />
                </div>
                <div>
                  <Label htmlFor="ageRetraite">{tr.ageRetraite}</Label>
                  <Input
                    id="ageRetraite"
                    type="number"
                    min="50"
                    max="71"
                    value={formData.ageRetraiteSouhaite}
                    onChange={(e) => handleFormChange('ageRetraiteSouhaite', e.target.value)}
                    placeholder="Ex: 65"
                  />
                </div>
                <div>
                  <Label>{tr.continuerTravail}</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={formData.continuerTravaillerConstruction ? "default" : "outline"}
                      onClick={() => handleFormChange('continuerTravaillerConstruction', true)}
                    >
                      Oui
                    </Button>
                    <Button
                      variant={!formData.continuerTravaillerConstruction ? "default" : "outline"}
                      onClick={() => handleFormChange('continuerTravaillerConstruction', false)}
                    >
                      Non
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{tr.typeRetraite}</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      { key: 'normale', label: tr.retraiteNormale },
                      { key: 'anticipee-avec-reduction', label: tr.retraiteAnticipee },
                      { key: 'invalidite', label: tr.retraiteInvalidite },
                      { key: 'partielle', label: tr.retraitePartielle }
                    ].map(type => (
                      <Button
                        key={type.key}
                        variant={formData.typeRetraitePreferee === type.key ? "default" : "outline"}
                        onClick={() => handleFormChange('typeRetraitePreferee', type.key as CCQRetirementType)}
                        className="w-full justify-start"
                      >
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>{tr.optionRente}</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      { key: 'nivelee', label: tr.renteNivelee },
                      { key: 'majoree-reduite', label: tr.renteMajoreeReduite }
                    ].map(option => (
                      <Button
                        key={option.key}
                        variant={formData.optionRentePreferee === option.key ? "default" : "outline"}
                        onClick={() => handleFormChange('optionRentePreferee', option.key as CCQRenteOption)}
                        className="w-full justify-start"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  size="lg"
                >
                  {isCalculating ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      {tr.calculEnCours}
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      {tr.calculer}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Résultats */}
        <TabsContent value="resultats" className="space-y-6">
          {calculationResult ? (
            <>
              {/* Vue d'ensemble */}
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <DollarSign className="w-5 h-5" />
                    Vue d'ensemble de votre pension CCQ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-700">
                        {formatCurrency(calculationResult.renteAnnuelleTotale)}
                      </div>
                      <div className="text-sm text-green-600">{tr.renteAnnuelle}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700">
                        {formatCurrency(calculationResult.renteMensuelleTotale)}
                      </div>
                      <div className="text-sm text-blue-600">{tr.renteMensuelle}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-700">
                        {calculationResult.ageOptimalRetraite} ans
                      </div>
                      <div className="text-sm text-purple-600">Âge optimal</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Détail des comptes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-orange-700">{tr.compteGeneral}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Heures ajustées:</span>
                        <span className="font-semibold">
                          {calculationResult.compteGeneral.heuresAjustees.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rente annuelle:</span>
                        <span className="font-semibold text-orange-700">
                          {formatCurrency(calculationResult.compteGeneral.renteAnnuelle)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">{tr.compteComplementaire}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Valeur accumulée:</span>
                        <span className="font-semibold">
                          {formatCurrency(calculationResult.compteComplementaire.valeurAccumulee)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rente annuelle:</span>
                        <span className="font-semibold text-blue-700">
                          {formatCurrency(calculationResult.compteComplementaire.renteAnnuelle)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Admissibilité */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Admissibilité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={calculationResult.admissibilite.retraiteNormale.eligible ? "default" : "secondary"}>
                          {calculationResult.admissibilite.retraiteNormale.eligible ? "✓" : "✗"}
                        </Badge>
                        <span>Retraite normale (65 ans)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={calculationResult.admissibilite.retraiteAnticipeeAvecReduction.eligible ? "default" : "secondary"}>
                          {calculationResult.admissibilite.retraiteAnticipeeAvecReduction.eligible ? "✓" : "✗"}
                        </Badge>
                        <span>Retraite anticipée (55 ans)</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-semibold">Statut actuel:</span>
                        <p className="text-sm text-gray-600">{calculationResult.admissibilite.statutActuel}</p>
                      </div>
                      <div>
                        <span className="font-semibold">Prochaine étape:</span>
                        <p className="text-sm text-gray-600">{calculationResult.admissibilite.prochaineMilestone}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommandations */}
              {calculationResult.optimisationSuggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      Recommandations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {calculationResult.optimisationSuggestions.map((suggestion, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={suggestion.priorite === 'haute' ? 'destructive' : suggestion.priorite === 'moyenne' ? 'default' : 'secondary'}>
                              {suggestion.priorite}
                            </Badge>
                            <h4 className="font-semibold">{suggestion.strategie}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                          <div className="text-sm">
                            <span className="font-semibold text-green-600">
                              Impact potentiel: {formatCurrency(suggestion.impact)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Complétez les informations et cliquez sur "Calculer" pour voir vos résultats.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Scénarios */}
        <TabsContent value="scenarios" className="space-y-6">
          {scenarios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scenarios.map((scenario, index) => (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg">{scenario.nom}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(scenario.resultat.renteMensuelleTotale)}
                        </div>
                        <div className="text-sm text-gray-600">par mois</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-semibold">Âge:</span> {scenario.ageRetraite} ans
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold">Type:</span> {scenario.typeRetraite}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-green-600 text-sm mb-1">Avantages:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {scenario.avantages.map((avantage, i) => (
                            <li key={i}>• {avantage}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold text-red-600 text-sm mb-1">Risques:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {scenario.risques.map((risque, i) => (
                            <li key={i}>• {risque}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Les scénarios apparaîtront après le calcul de votre pension.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Avertissement légal */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="w-4 h-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800 text-sm">
          {tr.avertissementLegal}
        </AlertDescription>
      </Alert>
    </div>
  );
}
