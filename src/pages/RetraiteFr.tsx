// src/pages/RetraiteFr.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Shield, Calculator, TrendingUp, FileText, Users, DollarSign, Zap, Crown, Lock, Database, AlertTriangle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../features/retirement/hooks/useLanguage';
import { translations } from '../features/retirement/translations';
import { RetirementNavigation } from '../features/retirement';

const RetraiteFr: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Phase 1 Intégrée */}
      <RetirementNavigation />
      
      {/* Contenu principal */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Planification de Retraite Intelligente
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Planifiez votre avenir financier avec nos outils professionnels et nos analyses avancées
          </p>
        </div>

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Planification de base */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Planification de Base
              </CardTitle>
              <CardDescription>
                Fonctionnalités gratuites pour commencer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-green-600" />
                Profil personnel et objectifs
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calculator className="w-4 h-4 text-green-600" />
                Calculs de retraite de base
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-green-600" />
                Gestion de l'épargne
              </div>
              <Button 
                onClick={() => navigate('/fr/retraite-module-phase1')}
                className="w-full mt-4"
              >
                Commencer Gratuitement
              </Button>
            </CardContent>
          </Card>

          {/* Fonctionnalités avancées */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Fonctionnalités Avancées
              </CardTitle>
              <CardDescription>
                Outils professionnels et analyses détaillées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-purple-600" />
                Rapports détaillés et analyses
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-purple-600" />
                Simulateurs avancés
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Crown className="w-4 h-4 text-purple-600" />
                Optimisation fiscale
              </div>
              <Button 
                onClick={() => navigate('/fr/retraite-module')}
                className="w-full mt-4"
                variant="outline"
              >
                Découvrir les Pro
              </Button>
            </CardContent>
          </Card>

          {/* Sécurité et sauvegarde */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                Sécurité & Sauvegarde
              </CardTitle>
              <CardDescription>
                Protection de vos données et conseils
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Database className="w-4 h-4 text-green-600" />
                Sauvegarde sécurisée
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-green-600" />
                Conseils de sécurité
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="w-4 h-4 text-green-600" />
                Informations d'urgence
              </div>
              <Button 
                onClick={() => navigate('/fr/retraite-module?section=backup-security')}
                className="w-full mt-4"
                variant="outline"
              >
                En savoir plus
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <Button 
            onClick={() => navigate('/fr/retraite-module-phase1')}
            size="lg"
            className="text-lg px-8 py-4"
          >
            🚀 Accéder au module complet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RetraiteFr;