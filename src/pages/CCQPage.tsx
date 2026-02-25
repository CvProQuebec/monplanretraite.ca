import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Phone, Mail, ExternalLink, HardHat, Calculator, FileText, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import CCQModule from '../components/ui/CCQModule';
import { useLanguage } from '../features/retirement/hooks/useLanguage';
import { UserData } from '../types';

const CCQPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEnglish = language === 'en';
  
  const [userData, setUserData] = useState<UserData>({
    personal: {
      prenom1: '',
      prenom2: '',
      naissance1: '',
      naissance2: '',
      sexe1: 'M',
      sexe2: 'F',
      salaire1: 0,
      salaire2: 0,
      province: 'QC',
      travailleurConstruction1: true,
      certificatCCQ1: ''
    },
    retirement: {
      rrqAgeActuel1: 65,
      rrqMontantActuel1: 0,
      rrqMontant70_1: 0,
      esperanceVie1: 85,
      rrqAgeActuel2: 65,
      rrqMontantActuel2: 0,
      rrqMontant70_2: 0,
      esperanceVie2: 85,
      rregopMembre1: 'non',
      rregopAnnees1: 0,
      pensionPrivee1: 0,
      pensionPrivee2: 0
    },
    savings: {
      reer1: 0,
      reer2: 0,
      celi1: 0,
      celi2: 0,
      placements1: 0,
      placements2: 0,
      epargne1: 0,
      epargne2: 0,
      cri1: 0,
      cri2: 0,
      residenceValeur: 0,
      residenceHypotheque: 0
    },
    cashflow: {
      logement: 0,
      servicesPublics: 0,
      assurances: 0,
      telecom: 0,
      alimentation: 0,
      transport: 0,
      sante: 0,
      loisirs: 0
    },
    ccqData: {
      certificatCompetence: '',
      dateEntreeIndustrie: new Date(),
      secteursActivite: [],
      heuresAnnuelles: 0,
      salaireAnnuel: 0,
      heuresAccumuleesPre2005: 0,
      heuresAccumuleesPost2005: 0,
      valeursCompteGeneral: 0,
      valeursCompteComplementaire: 0,
      cotisationsAnnuelles: 0,
      ageRetraitePrevu: 65,
      typeRetraite: 'normale',
      optionRente: 'nivelee'
    }
  });

  const handleDataUpdate = (newData: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  const expertConsultationContent = {
    fr: {
      title: "⚠️ CONSULTATION D'EXPERT FORTEMENT RECOMMANDÉE",
      subtitle: "Secteur de la Construction - Régime CCQ",
      description: "Le régime de retraite CCQ est complexe avec des règles spécifiques. Une consultation avec un expert en planification financière spécialisé dans le secteur de la construction est fortement recommandée.",
      benefits: [
        "Optimisation des stratégies de retraite CCQ",
        "Coordination avec RRQ, PSV et autres régimes",
        "Analyse des options de rente (nivelée vs majorée-réduite)",
        "Planification fiscale spécialisée construction",
        "Validation des calculs et projections"
      ],
      contacts: {
        ccq: "Commission de la Construction du Québec: 1-888-842-8282",
        website: "Site officiel: ccq.org"
      },
      disclaimer: "Les calculs présentés sont des estimations. Pour des montants officiels, contactez directement la CCQ."
    },
    en: {
      title: "⚠️ EXPERT CONSULTATION STRONGLY RECOMMENDED",
      subtitle: "Construction Sector - CCQ Plan",
      description: "The CCQ retirement plan is complex with specific rules. Consultation with a financial planning expert specialized in the construction sector is strongly recommended.",
      benefits: [
        "CCQ retirement strategy optimization",
        "Coordination with QPP, OAS and other plans",
        "Analysis of pension options (level vs major-reduced)",
        "Specialized construction tax planning",
        "Validation of calculations and projections"
      ],
      contacts: {
        ccq: "Commission de la Construction du Québec: 1-888-842-8282",
        website: "Official website: ccq.org"
      },
      disclaimer: "The calculations presented are estimates. For official amounts, contact CCQ directly."
    }
  };

  const content = expertConsultationContent[isEnglish ? 'en' : 'fr'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header avec thème construction */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <HardHat className="w-12 h-12 text-orange-600 mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {isEnglish ? 'CCQ Construction Workers' : 'CCQ Travailleurs de la Construction'}
              </h1>
              <p className="text-xl text-gray-600">
                {isEnglish ? 'Retirement Planning Module' : 'Module de Planification de Retraite'}
              </p>
            </div>
          </div>
        </div>

        {/* Avis de consultation d'expert - TRÈS VISIBLE */}
        <div className="mb-8">
          <Alert className="border-2 border-orange-500 bg-gradient-to-r from-orange-100 to-yellow-100 shadow-lg">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <AlertDescription className="text-lg">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-orange-800 mb-2">{content.title}</h3>
                  <p className="text-orange-700 font-medium">{content.subtitle}</p>
                  <p className="text-gray-700 mt-2">{content.description}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">
                      {isEnglish ? 'Benefits of Expert Consultation:' : 'Avantages de la consultation d\'expert:'}
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {content.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-orange-600 mr-2">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">
                      {isEnglish ? 'Official Contacts:' : 'Contacts Officiels:'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-orange-600 mr-2" />
                        <span className="text-gray-700">{content.contacts.ccq}</span>
                      </div>
                      <div className="flex items-center">
                        <ExternalLink className="w-4 h-4 text-orange-600 mr-2" />
                        <a 
                          href="https://www.ccq.org/fr-CA/avantages-sociaux/retraite" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-mpr-interactive hover:text-mpr-navy underline"
                        >
                          {content.contacts.website}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 font-medium">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    {content.disclaimer}
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* Statistiques CCQ */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-orange-200 bg-white/80">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-orange-700">
                <Users className="w-5 h-5 mr-2" />
                {isEnglish ? 'Active Participants' : 'Participants Actifs'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">202,000</div>
              <p className="text-sm text-gray-600">
                {isEnglish ? 'Construction workers in Quebec' : 'Travailleurs de la construction au Québec'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-white/80">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-orange-700">
                <Calculator className="w-5 h-5 mr-2" />
                {isEnglish ? 'Hybrid System' : 'Système Hybride'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-orange-600">
                {isEnglish ? 'Pre/Post 2005' : 'Pré/Post 2005'}
              </div>
              <p className="text-sm text-gray-600">
                {isEnglish ? 'Two distinct accounts' : 'Deux comptes distincts'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-white/80">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-orange-700">
                <FileText className="w-5 h-5 mr-2" />
                {isEnglish ? 'Current Retirees' : 'Retraités Actuels'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">104,000</div>
              <p className="text-sm text-gray-600">
                {isEnglish ? 'Receiving benefits' : 'Recevant des prestations'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Module CCQ principal */}
        <Card className="border-orange-200 bg-white/90 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
            <CardTitle className="flex items-center text-xl">
              <HardHat className="w-6 h-6 mr-3" />
              {isEnglish ? 'CCQ Retirement Calculator' : 'Calculateur de Retraite CCQ'}
            </CardTitle>
            <CardDescription className="text-orange-100">
              {isEnglish 
                ? 'Complete analysis of your CCQ retirement plan with hybrid system calculations'
                : 'Analyse complète de votre régime de retraite CCQ avec calculs du système hybride'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <CCQModule 
              data={userData} 
              onUpdate={handleDataUpdate}
              language={isEnglish ? 'en' : 'fr'}
            />
          </CardContent>
        </Card>

        {/* Liens utiles */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card className="border-orange-200 bg-white/80">
            <CardHeader>
              <CardTitle className="text-orange-700">
                {isEnglish ? 'Useful Resources' : 'Ressources Utiles'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a 
                href="https://www.ccq.org/fr-CA/avantages-sociaux/retraite" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-mpr-interactive hover:text-mpr-navy underline"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {isEnglish ? 'Official CCQ Retirement Page' : 'Page Officielle Retraite CCQ'}
              </a>
              <a 
                href="https://www.ccq.org/fr-CA/avantages-sociaux/retraite/releve-annuel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-mpr-interactive hover:text-mpr-navy underline"
              >
                <FileText className="w-4 h-4 mr-2" />
                {isEnglish ? 'Annual Statement' : 'Relevé Annuel'}
              </a>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-white/80">
            <CardHeader>
              <CardTitle className="text-orange-700">
                {isEnglish ? 'Need Help?' : 'Besoin d\'Aide?'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-orange-600 mr-2" />
                <span className="text-gray-700">CCQ: 1-888-842-8282</span>
              </div>
              <Button 
                onClick={() => navigate('/assistant-financier')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isEnglish ? 'Financial Assistant' : 'Assistant Financier'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CCQPage;
