// src/pages/RapportsRetraiteFr.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, BarChart3, TrendingUp, Download, Eye, Crown, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RapportsRetraiteFr: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToModule = () => {
    navigate('/fr/retraite-module');
  };

  const handleViewReport = (reportType: string) => {
    // Navigation vers le module Retraite avec la section rapports active
    navigate('/fr/retraite-module?section=reports');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        
        {/* Header avec bouton retour */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToModule}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au module Retraite
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              Rapports de Retraite
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Générez et consultez des rapports détaillés pour optimiser votre planification de retraite
            </p>
          </div>
        </div>

        {/* Section Introduction */}
        <Card className="mb-12 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi des rapports détaillés ?
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
              Les rapports vous donnent une vision claire de votre situation financière et vous aident à prendre des décisions éclairées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Analyse complète</h3>
                <p className="text-sm text-gray-600">
                  Vue d'ensemble de tous vos actifs, passifs et projections
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Projections futures</h3>
                <p className="text-sm text-gray-600">
                  Simulations basées sur vos données et objectifs
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Export et partage</h3>
                <p className="text-sm text-gray-600">
                  Rapports PDF pour vos conseillers ou archives
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Types de rapports disponibles */}
        <Card className="mb-12 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              Types de rapports disponibles
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
              Choisissez le rapport qui correspond à vos besoins actuels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Rapport Exécutif */}
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge variant="outline" className="text-xs">Professionnel+</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Rapport Exécutif</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Résumé concis de votre situation financière avec recommandations clés
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Vue d'ensemble des actifs</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Objectifs et projections</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Recommandations prioritaires</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewReport('executive')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Consulter
                </Button>
              </div>

              {/* Rapport Complet */}
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <Badge variant="outline" className="text-xs">Professionnel+</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Rapport Complet</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Analyse détaillée avec toutes les données et calculs
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Analyse détaillée CPP/RRQ</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Projections cashflow</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Scénarios multiples</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewReport('comprehensive')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Consulter
                </Button>
              </div>

              {/* Rapport Cashflow */}
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <Badge variant="outline" className="text-xs">Professionnel+</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Rapport Cashflow</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Analyse détaillée de vos flux de trésorerie
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Revenus et dépenses</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Projections mensuelles</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Optimisations possibles</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewReport('cashflow')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Consulter
                </Button>
              </div>

              {/* Rapport Monte Carlo */}
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <Badge variant="outline" className="text-xs">Professionnel+</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Simulation Monte Carlo</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Analyse des risques avec simulations probabilistes
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Scénarios de marché</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Analyse des risques</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Probabilités de succès</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewReport('monte-carlo')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Consulter
                </Button>
              </div>

              {/* Rapport Planification Successorale */}
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Crown className="w-6 h-6 text-red-600" />
                  </div>
                  <Badge variant="default" className="text-xs">Ultime</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Planification Successorale</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Planification avancée pour la transmission de patrimoine
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Stratégies fiscales</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Planification familiale</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Protection du patrimoine</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewReport('estate-planning')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Consulter
                </Button>
              </div>

              {/* Rapport Personnalisé */}
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">Sur mesure</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Rapport Personnalisé</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Rapport adapté à vos besoins spécifiques
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span>Contenu sur mesure</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span>Format adapté</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span>Contactez-nous</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewReport('custom')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Consulter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Fonctionnalités avancées */}
        <Card className="mb-12 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités avancées
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
              Découvrez les outils supplémentaires pour optimiser vos rapports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg text-gray-900 mb-4">Export et partage</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm">Export PDF haute qualité</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm">Partage sécurisé par email</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm">Archivage automatique</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm">Comparaison de versions</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg text-gray-900 mb-4">Personnalisation</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm">Templates personnalisables</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm">Ajout de notes et commentaires</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm">Filtres et tri personnalisés</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm">Planification des rapports</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Prêt à générer vos rapports ?</h2>
              <p className="text-xl mb-8 opacity-90">
                Accédez au module complet pour créer des rapports personnalisés et détaillés
              </p>
              <Button
                onClick={handleBackToModule}
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
              >
                Accéder au module Retraite
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RapportsRetraiteFr;
