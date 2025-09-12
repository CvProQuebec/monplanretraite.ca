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
              Rapports de retraite
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

        {/* Types de rapports disponibles - RESTRUCTURÉ PAR FORFAIT */}
        <Card className="mb-12 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              Rapports par forfait
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
              Rapports organisés selon votre niveau d'abonnement et destinataire professionnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            
            {/* 🟢 RAPPORTS GRATUITS */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-900">🟢 RAPPORTS GRATUITS</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Rapport Urgence Familiale */}
                <div className="border-l-4 border-l-green-500 bg-green-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <Badge className="bg-green-500 text-white text-xs">Gratuit</Badge>
                  </div>
                  <h4 className="font-semibold text-green-900 mb-2">Trousse d'urgence familiale</h4>
                  <p className="text-sm text-green-800 mb-4">
                    Document essentiel pour vos proches en cas d'urgence
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Contacts d'urgence</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Informations médicales</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Documents importants</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewReport('emergency-family')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </div>

                {/* Rapport Budget Personnel */}
                <div className="border-l-4 border-l-green-500 bg-green-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                    <Badge className="bg-green-500 text-white text-xs">Gratuit</Badge>
                  </div>
                  <h4 className="font-semibold text-green-900 mb-2">Analyse budget personnel</h4>
                  <p className="text-sm text-green-800 mb-4">
                    Résumé de vos revenus, dépenses et épargne
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Revenus détaillés</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Catégories de dépenses</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Capacité d'épargne</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewReport('budget-personal')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </div>

                {/* Rapport RRQ/CPP de Base */}
                <div className="border-l-4 border-l-green-500 bg-green-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <Badge className="bg-green-500 text-white text-xs">Gratuit</Badge>
                  </div>
                  <h4 className="font-semibold text-green-900 mb-2">Prestations RRQ/CPP</h4>
                  <p className="text-sm text-green-800 mb-4">
                    Estimation de vos prestations gouvernementales
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Estimation RRQ/CPP</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Âge optimal de demande</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Impact sur revenus</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewReport('rrq-cpp-basic')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </div>
              </div>
            </div>

            {/* 🔵 RAPPORTS PROFESSIONNELS */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900">🔵 RAPPORTS PROFESSIONNELS</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Rapport pour Planificateur Financier */}
                <div className="border-l-4 border-l-blue-500 bg-blue-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge className="bg-blue-500 text-white text-xs">Professionnel</Badge>
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-2">Pour planificateur financier</h4>
                  <p className="text-sm text-blue-800 mb-4">
                    Analyse complète avec tous les modules avancés
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Optimisation FERR/REER/CÉLI</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Stratégies de retrait</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Analyse Monte Carlo</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewReport('financial-planner')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </div>

                {/* Rapport pour Comptable */}
                <div className="border-l-4 border-l-blue-500 bg-blue-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge className="bg-blue-500 text-white text-xs">Professionnel</Badge>
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-2">Pour comptable</h4>
                  <p className="text-sm text-blue-800 mb-4">
                    Focus sur optimisation fiscale et stratégies
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Optimisation fiscale multi-sources</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Impact fiscal à 65 ans</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Fractionnement de revenus</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewReport('accountant')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </div>

                {/* Rapport pour Banque/Conseiller */}
                <div className="border-l-4 border-l-blue-500 bg-blue-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge className="bg-blue-500 text-white text-xs">Professionnel</Badge>
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-2">Pour banque/conseiller</h4>
                  <p className="text-sm text-blue-800 mb-4">
                    Analyse de solvabilité et capacité d'emprunt
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Cashflow détaillé</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Actifs et passifs</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Projections de revenus</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewReport('bank-advisor')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </div>

                {/* Rapport Conjoint/Famille */}
                <div className="border-l-4 border-l-blue-500 bg-blue-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge className="bg-blue-500 text-white text-xs">Professionnel</Badge>
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-2">Pour conjoint/famille</h4>
                  <p className="text-sm text-blue-800 mb-4">
                    Résumé accessible de la planification familiale
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Objectifs familiaux</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Stratégies simplifiées</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Actions recommandées</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewReport('family-spouse')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </div>

                {/* Rapport RREGOP/SRG Avancé */}
                <div className="border-l-4 border-l-blue-500 bg-blue-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge className="bg-blue-500 text-white text-xs">Professionnel</Badge>
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-2">RREGOP/SRG avancé</h4>
                  <p className="text-sm text-blue-800 mb-4">
                    Analyse complète des régimes gouvernementaux
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Optimisation RREGOP</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Stratégies SRG</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Coordination prestations</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewReport('rregop-srg-advanced')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </div>

                {/* Rapport Analyse Rendement */}
                <div className="border-l-4 border-l-blue-500 bg-blue-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge className="bg-blue-500 text-white text-xs">Professionnel</Badge>
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-2">Analyse de rendement</h4>
                  <p className="text-sm text-blue-800 mb-4">
                    Performance détaillée des investissements
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>IRR, TWR, rendements</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Comparaison benchmarks</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Recommandations</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewReport('performance-analysis')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </div>
              </div>
            </div>

            {/* 🟣 RAPPORTS EXPERTS */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-purple-900">🟣 RAPPORTS EXPERTS</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Rapport pour Notaire */}
                <div className="border-l-4 border-l-purple-500 bg-purple-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Crown className="w-6 h-6 text-purple-600" />
                    </div>
                    <Badge className="bg-purple-600 text-white text-xs">Expert</Badge>
                  </div>
                  <h4 className="font-semibold text-purple-900 mb-2">Pour notaire</h4>
                  <p className="text-sm text-purple-800 mb-4">
                    Planification successorale et transmission
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Stratégies successorales</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Optimisation fiscale succession</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Documents recommandés</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewReport('notary')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </div>

                {/* Rapport pour Avocat */}
                <div className="border-l-4 border-l-purple-500 bg-purple-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <Badge className="bg-purple-600 text-white text-xs">Expert</Badge>
                  </div>
                  <h4 className="font-semibold text-purple-900 mb-2">Pour avocat</h4>
                  <p className="text-sm text-purple-800 mb-4">
                    Protection juridique et structures légales
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Protection d'actifs</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Structures familiales</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Risques légaux</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewReport('lawyer')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </div>

                {/* Rapport Monte Carlo Expert */}
                <div className="border-l-4 border-l-purple-500 bg-purple-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <Badge className="bg-purple-600 text-white text-xs">Expert</Badge>
                  </div>
                  <h4 className="font-semibold text-purple-900 mb-2">Monte Carlo expert</h4>
                  <p className="text-sm text-purple-800 mb-4">
                    Simulations avancées 1000+ itérations
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Analyse de sensibilité</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Scénarios de stress</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Probabilités détaillées</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewReport('monte-carlo-expert')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </div>

                {/* Rapport Immobilier Expert */}
                <div className="border-l-4 border-l-purple-500 bg-purple-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <Badge className="bg-purple-600 text-white text-xs">Expert</Badge>
                  </div>
                  <h4 className="font-semibold text-purple-900 mb-2">Optimisation immobilière</h4>
                  <p className="text-sm text-purple-800 mb-4">
                    Stratégies avancées patrimoine immobilier
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Optimisation fiscale immobilière</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Stratégies de liquidation</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Transmission patrimoine</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewReport('real-estate-expert')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </div>

                {/* Rapport Consolidation Avancée */}
                <div className="border-l-4 border-l-purple-500 bg-purple-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <Badge className="bg-purple-600 text-white text-xs">Expert</Badge>
                  </div>
                  <h4 className="font-semibold text-purple-900 mb-2">Consolidation avancée</h4>
                  <p className="text-sm text-purple-800 mb-4">
                    Optimisation multi-comptes et institutions
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Analyse coûts cachés</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Recommandations consolidation</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Impact fiscal transferts</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewReport('advanced-consolidation')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </div>

                {/* Rapport Psychologie Financière */}
                <div className="border-l-4 border-l-purple-500 bg-purple-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <Badge className="bg-purple-600 text-white text-xs">Expert</Badge>
                  </div>
                  <h4 className="font-semibold text-purple-900 mb-2">Psychologie des dépenses</h4>
                  <p className="text-sm text-purple-800 mb-4">
                    Analyse comportementale et recommandations
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Profil comportemental</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Biais cognitifs identifiés</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-purple-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Stratégies d'adaptation</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleViewReport('spending-psychology')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Section Anciens Rapports - Maintenant dépréciée */}
        <Card className="mb-12 bg-gray-50/80 backdrop-blur-sm border border-gray-200 shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-700 mb-4">
              📋 Rapports Traditionnels (Dépréciés)
            </CardTitle>
            <CardDescription className="text-base text-gray-600 max-w-4xl mx-auto">
              Ces rapports sont maintenant intégrés dans les nouvelles catégories ci-dessus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">

              {/* Rapport Exécutif - Maintenant dans Professionnel */}
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-500" />
                  </div>
                  <Badge variant="outline" className="text-xs text-gray-500">Déprécié</Badge>
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">Rapport Exécutif</h3>
                <p className="text-sm text-gray-500 mb-4">
                  ➜ Maintenant inclus dans "Pour Planificateur Financier"
                </p>
                <Button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir nouveau format
                </Button>
              </div>

              {/* Rapport Complet - Maintenant dans Professionnel */}
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-gray-500" />
                  </div>
                  <Badge variant="outline" className="text-xs text-gray-500">Déprécié</Badge>
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">Rapport Complet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  ➜ Maintenant inclus dans "Pour Comptable" et "Pour Banque"
                </p>
                <Button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir nouveau format
                </Button>
              </div>

              {/* Rapport Cashflow - Maintenant dans Professionnel */}
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-gray-500" />
                  </div>
                  <Badge variant="outline" className="text-xs text-gray-500">Déprécié</Badge>
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">Rapport Cashflow</h3>
                <p className="text-sm text-gray-500 mb-4">
                  ➜ Maintenant inclus dans "Pour Banque/Conseiller"
                </p>
                <Button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir nouveau format
                </Button>
              </div>

              {/* Rapport Monte Carlo - Maintenant dans Expert */}
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-gray-500" />
                  </div>
                  <Badge variant="outline" className="text-xs text-gray-500">Déprécié</Badge>
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">Simulation Monte Carlo</h3>
                <p className="text-sm text-gray-500 mb-4">
                  ➜ Maintenant "Monte Carlo Expert" dans forfait Expert
                </p>
                <Button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir nouveau format
                </Button>
              </div>

              {/* Rapport Planification Successorale - Maintenant dans Expert */}
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Crown className="w-6 h-6 text-gray-500" />
                  </div>
                  <Badge variant="outline" className="text-xs text-gray-500">Déprécié</Badge>
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">Planification Successorale</h3>
                <p className="text-sm text-gray-500 mb-4">
                  ➜ Maintenant "Pour Notaire" dans forfait Expert
                </p>
                <Button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir nouveau format
                </Button>
              </div>

              {/* Rapport Personnalisé - Toujours disponible */}
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-500" />
                  </div>
                  <Badge variant="secondary" className="text-xs">Sur mesure</Badge>
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">Rapport Personnalisé</h3>
                <p className="text-sm text-gray-500 mb-4">
                  ➜ Toujours disponible sur demande
                </p>
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

        {/* Section Nouveaux Modules Inclus */}
        <Card className="mb-12 bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              ✨ Nouveaux modules inclus dans les rapports
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
              Tous ces nouveaux outils de calcul sont maintenant intégrés dans les rapports appropriés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Modules Professionnels */}
              <div className="bg-blue-50 border-l-4 border-l-blue-500 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-white" />
                  </div>
                  🔵 Niveau Professionnel
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Optimisation FERR</li>
                  <li>• Planification CÉLI-APP</li>
                  <li>• Séquence de retrait</li>
                  <li>• Coûts de santé</li>
                  <li>• Optimisation fiscale multi-sources</li>
                  <li>• Planification longévité</li>
                  <li>• Consolidation financière</li>
                  <li>• Retraite progressive</li>
                  <li>• Protection inflation</li>
                  <li>• Stratégies REER meltdown</li>
                  <li>• Optimisation CPP</li>
                  <li>• Calculette de rendement avancée</li>
                </ul>
              </div>

              {/* Modules Experts */}
              <div className="bg-purple-50 border-l-4 border-l-purple-500 rounded-lg p-6">
                <h4 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                  🟣 Niveau Expert
                </h4>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li>• Psychologie des dépenses</li>
                  <li>• Planification dynamique</li>
                  <li>• Analyse comportementale</li>
                  <li>• Optimisation immobilière</li>
                  <li>• Stratégies avancées</li>
                  <li>• Monte Carlo expert</li>
                  <li>• Consolidation avancée</li>
                </ul>
              </div>

              {/* Rapports Professionnels */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 border-l-4 border-l-green-500 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <FileText className="w-3 h-3 text-white" />
                  </div>
                  👥 Rapports Professionnels
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Pour Planificateur Financier</li>
                  <li>• Pour Comptable</li>
                  <li>• Pour Banque/Conseiller</li>
                  <li>• Pour Notaire</li>
                  <li>• Pour Avocat</li>
                  <li>• Pour Conjoint/Famille</li>
                  <li>• Analyse de rendement</li>
                </ul>
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
