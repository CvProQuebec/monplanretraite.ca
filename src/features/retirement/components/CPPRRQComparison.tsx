// src/features/retirement/components/CPPRRQComparison.tsx

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Flag, 
  Shield, 
  TrendingUp, 
  Calculator,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Minus
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CPPRRQComparisonProps {
  className?: string;
}

export const CPPRRQComparison: React.FC<CPPRRQComparisonProps> = ({ className }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  const texts = {
    fr: {
      title: 'Comparaison CPP vs RRQ',
      subtitle: 'Comprendre les différences entre les deux régimes de retraite',
      overview: 'Vue d\'ensemble',
      differences: 'Différences clés',
      similarities: 'Similitudes',
      eligibility: 'Admissibilité',
      calculation: 'Calcul',
      benefits: 'Avantages',
      cpp: 'CPP - Régime de pensions du Canada',
      rrq: 'RRQ - Régime de rentes du Québec',
      cppDescription: 'Pension fédérale canadienne',
      rrqDescription: 'Pension provinciale québécoise',
      overviewDescription: 'Le CPP et le RRQ sont deux régimes de retraite complémentaires qui peuvent être reçus simultanément par les Québécois.',
      keyDifferences: [
        {
          aspect: 'Couverture géographique',
          cpp: 'Tout le Canada',
          rrq: 'Québec uniquement',
          icon: 'globe'
        },
        {
          aspect: 'Administration',
          cpp: 'Gouvernement fédéral',
          rrq: 'Gouvernement québécois',
          icon: 'building'
        },
        {
          aspect: 'Taux de cotisation',
          cpp: '5.95% (2025)',
          rrq: '6.40% (2025)',
          icon: 'percent'
        },
        {
          aspect: 'Gains maximums',
          cpp: '66,600 $ (2025)',
          rrq: '66,600 $ (2025)',
          icon: 'dollar'
        },
        {
          aspect: 'Âge de retraite',
          cpp: '60-70 ans',
          rrq: '60-70 ans',
          icon: 'calendar'
        }
      ],
      commonSimilarities: [
        'Calcul basé sur 25% des gains moyens cotisables',
        'Exclusion des 8 années les plus faibles',
        'Facteurs d\'ajustement selon l\'âge de retraite',
        'Indexation annuelle selon l\'inflation',
        'Prestations imposables',
        'Possibilité de retraite anticipée ou reportée'
      ],
      eligibilityRules: {
        cpp: [
          'Être âgé d\'au moins 60 ans',
          'Avoir cotisé au CPP pendant au moins 1 an',
          'Avoir des gains cotisables suffisants',
          'Résider au Canada ou avoir résidé au Canada'
        ],
        rrq: [
          'Être âgé d\'au moins 60 ans',
          'Avoir cotisé au RRQ pendant au moins 1 an',
          'Avoir des gains cotisables suffisants',
          'Résider au Québec ou avoir résidé au Québec'
        ]
      },
      calculationMethod: {
        cpp: [
          'Gains moyens cotisables (excluant 8 années)',
          'Multiplication par 25%',
          'Application des facteurs d\'ajustement',
          'Limitation au maximum CPP'
        ],
        rrq: [
          'Gains moyens cotisables (excluant 8 années)',
          'Multiplication par 25%',
          'Application des facteurs d\'ajustement',
          'Limitation au maximum RRQ'
        ]
      },
      benefitFeatures: {
        cpp: [
          'Couverture nationale',
          'Portabilité entre provinces',
          'Règles uniformes partout au Canada',
          'Administration fédérale centralisée'
        ],
        rrq: [
          'Spécialisation québécoise',
          'Intégration avec les services provinciaux',
          'Règles adaptées au contexte québécois',
          'Gestion locale des prestations'
        ]
      },
      note: 'Note : Les montants et taux mentionnés sont ceux de 2025. Les deux régimes peuvent être reçus simultanément, offrant ainsi une couverture de retraite complète.'
    },
    en: {
      title: 'CPP vs RRQ Comparison',
      subtitle: 'Understanding the differences between the two retirement plans',
      overview: 'Overview',
      differences: 'Key Differences',
      similarities: 'Similarities',
      eligibility: 'Eligibility',
      calculation: 'Calculation',
      benefits: 'Benefits',
      cpp: 'CPP - Canada Pension Plan',
      rrq: 'RRQ - Quebec Pension Plan',
      cppDescription: 'Federal Canadian pension',
      rrqDescription: 'Provincial Quebec pension',
      overviewDescription: 'CPP and RRQ are two complementary retirement plans that can be received simultaneously by Quebecers.',
      keyDifferences: [
        {
          aspect: 'Geographic coverage',
          cpp: 'All of Canada',
          rrq: 'Quebec only',
          icon: 'globe'
        },
        {
          aspect: 'Administration',
          cpp: 'Federal government',
          rrq: 'Quebec government',
          icon: 'building'
        },
        {
          aspect: 'Contribution rate',
          cpp: '5.95% (2025)',
          rrq: '6.40% (2025)',
          icon: 'percent'
        },
        {
          aspect: 'Maximum earnings',
          cpp: '$66,600 (2025)',
          rrq: '$66,600 (2025)',
          icon: 'dollar'
        },
        {
          aspect: 'Retirement age',
          cpp: '60-70 years',
          rrq: '60-70 years',
          icon: 'calendar'
        }
      ],
      commonSimilarities: [
        'Calculation based on 25% of average contributable earnings',
        'Exclusion of the 8 lowest years',
        'Adjustment factors based on retirement age',
        'Annual indexing based on inflation',
        'Taxable benefits',
        'Possibility of early or delayed retirement'
      ],
      eligibilityRules: {
        cpp: [
          'Be at least 60 years old',
          'Have contributed to CPP for at least 1 year',
          'Have sufficient contributable earnings',
          'Reside in Canada or have resided in Canada'
        ],
        rrq: [
          'Be at least 60 years old',
          'Have contributed to RRQ for at least 1 year',
          'Have sufficient contributable earnings',
          'Reside in Quebec or have resided in Quebec'
        ]
      },
      calculationMethod: {
        cpp: [
          'Average contributable earnings (excluding 8 years)',
          'Multiplication by 25%',
          'Application of adjustment factors',
          'Limitation to CPP maximum'
        ],
        rrq: [
          'Average contributable earnings (excluding 8 years)',
          'Multiplication by 25%',
          'Application of adjustment factors',
          'Limitation to RRQ maximum'
        ]
      },
      benefitFeatures: {
        cpp: [
          'National coverage',
          'Portability between provinces',
          'Uniform rules across Canada',
          'Centralized federal administration'
        ],
        rrq: [
          'Quebec specialization',
          'Integration with provincial services',
          'Rules adapted to Quebec context',
          'Local benefit management'
        ]
      },
      note: 'Note: The amounts and rates mentioned are those of 2025. Both plans can be received simultaneously, thus providing complete retirement coverage.'
    }
  };

  const t = texts[language];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'globe': return <TrendingUp className="w-4 h-4" />;
      case 'building': return <Calculator className="w-4 h-4" />;
      case 'percent': return <TrendingUp className="w-4 h-4" />;
      case 'dollar': return <TrendingUp className="w-4 h-4" />;
      case 'calendar': return <TrendingUp className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl text-gray-900 mb-3">
          {t.title}
        </CardTitle>
        <CardDescription className="text-lg text-gray-600">
          {t.subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="differences">{t.differences}</TabsTrigger>
            <TabsTrigger value="similarities">{t.similarities}</TabsTrigger>
            <TabsTrigger value="eligibility">{t.eligibility}</TabsTrigger>
            <TabsTrigger value="calculation">{t.calculation}</TabsTrigger>
            <TabsTrigger value="benefits">{t.benefits}</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
                {t.overviewDescription}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Flag className="w-8 h-8 text-red-600" />
                  </div>
                  <CardTitle className="text-xl text-red-900">{t.cpp}</CardTitle>
                  <CardDescription className="text-red-700">{t.cppDescription}</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-blue-900">{t.rrq}</CardTitle>
                  <CardDescription className="text-red-700">{t.rrqDescription}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          {/* Différences clés */}
          <TabsContent value="differences" className="space-y-6">
            <div className="space-y-4">
              {t.keyDifferences.map((difference, index) => (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="flex items-center gap-2">
                        {getIcon(difference.icon)}
                        <span className="font-medium text-gray-900">{difference.aspect}</span>
                      </div>
                      <div className="text-center">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {difference.cpp}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {difference.rrq}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Similitudes */}
          <TabsContent value="similarities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Similitudes entre CPP et RRQ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {t.commonSimilarities.map((similarity, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{similarity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Règles d'admissibilité */}
          <TabsContent value="eligibility" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-900">
                    <Flag className="w-5 h-5" />
                    CPP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {t.eligibilityRules.cpp.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Shield className="w-5 h-5" />
                    RRQ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {t.eligibilityRules.rrq.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Méthode de calcul */}
          <TabsContent value="calculation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-900">
                    <Flag className="w-5 h-5" />
                    CPP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 list-decimal list-inside">
                    {t.calculationMethod.cpp.map((step, index) => (
                      <li key={index} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Shield className="w-5 h-5" />
                    RRQ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 list-decimal list-inside">
                    {t.calculationMethod.rrq.map((step, index) => (
                      <li key={index} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Avantages */}
          <TabsContent value="benefits" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-900">
                    <Flag className="w-5 h-5" />
                    CPP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {t.benefitFeatures.cpp.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Shield className="w-5 h-5" />
                    RRQ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {t.benefitFeatures.rrq.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Note importante */}
        <div className="mt-8">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t.note}
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};
