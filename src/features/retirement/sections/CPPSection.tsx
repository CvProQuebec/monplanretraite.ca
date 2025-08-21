// src/features/retirement/sections/CPPSection.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Flag, 
  Info, 
  TrendingUp, 
  Calculator,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Rocket,
  Sparkles
} from 'lucide-react';
import { CPPCalculator } from '../components/CPPCalculator';
import { useLanguage } from '../hooks/useLanguage';
import { PlanRestrictedSection } from '../components/PlanRestrictedSection';

interface CPPSectionProps {
  className?: string;
}

export const CPPSection: React.FC<CPPSectionProps> = ({ className }) => {
  const { language } = useLanguage();

  const texts = {
    fr: {
      title: 'Régime de pensions du Canada (CPP)',
      subtitle: 'Calculez votre pension fédérale canadienne avec précision',
      description: 'Le CPP est une prestation mensuelle imposable qui assure un remplacement partiel du revenu au moment de la retraite. Contrairement au RRQ québécois, le CPP couvre tous les Canadiens.',
      features: [
        'Calcul basé sur les règles officielles 2025',
        'Exclusion des 8 années les plus faibles',
        'Facteurs d\'ajustement selon l\'âge de retraite',
        'Projections à différents âges (60, 65, 70, 75 ans)',
        'Historique détaillé des cotisations',
        'Support multilingue français/anglais'
      ],
      differences: [
        'CPP : Pension fédérale canadienne',
        'RRQ : Pension provinciale québécoise',
        'Règles très similaires avec quelques différences',
        'Possibilité de recevoir les deux pensions'
      ],
      officialLink: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc.html',
      officialText: 'Site officiel du CPP',
      note: 'Note : Ce calculateur utilise les paramètres officiels 2025 du CPP. Les montants réels peuvent varier selon votre situation personnelle.'
    },
    en: {
      title: 'Canada Pension Plan (CPP)',
      subtitle: 'Calculate your federal Canadian pension with precision',
      description: 'The CPP is a taxable monthly benefit that provides partial income replacement at retirement. Unlike the Quebec RRQ, the CPP covers all Canadians.',
      features: [
        'Calculation based on official 2025 rules',
        'Exclusion of the 8 lowest years',
        'Adjustment factors based on retirement age',
        'Projections at different ages (60, 65, 70, 75 years)',
        'Detailed contribution history',
        'French/English multilingual support'
      ],
      differences: [
        'CPP: Federal Canadian pension',
        'RRQ: Provincial Quebec pension',
        'Very similar rules with some differences',
        'Possibility to receive both pensions'
      ],
      officialLink: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp.html',
      officialText: 'Official CPP website',
      note: 'Note: This calculator uses the official 2025 CPP parameters. Actual amounts may vary based on your personal situation.'
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      {/* Particules de fond visibles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
        <div className="absolute top-96 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        <div className="absolute top-72 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="space-y-8">
        {/* En-tête de la section avec nouveau look Phase 2 */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Description et différences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                {language === 'fr' ? 'À propos du CPP' : 'About CPP'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {t.description}
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">
                  {language === 'fr' ? 'Fonctionnalités principales :' : 'Main features:'}
                </h4>
                <ul className="space-y-2">
                  {t.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Différences CPP vs RRQ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {language === 'fr' ? 'CPP vs RRQ' : 'CPP vs RRQ'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {t.differences.map((difference, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{difference}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t">
                <a
                  href={t.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t.officialText}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Note importante */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {language === 'fr' ? 'Information importante' : 'Important information'}
          </AlertTitle>
          <AlertDescription>
            {t.note}
          </AlertDescription>
        </Alert>

        {/* Calculateur CPP */}
        <div className="mt-8">
          <CPPCalculator />
        </div>
        </div>
      </div>
    </div>
  );
};
