// UnifiedRetirementPage.tsx - Page de retraite unifiée bilingue
// Consolidation intelligente de RetraiteFr.tsx + RetraiteEn.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Shield, Calculator, TrendingUp, FileText, Users, DollarSign, Zap, Crown, 
  Lock, Database, AlertTriangle, ExternalLink, CheckCircle, XCircle,
  BarChart3, PieChart, Target, Briefcase, Home, Heart, Plane, Car
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../features/retirement/hooks/useLanguage';
import { RetirementNavigation } from '../features/retirement';

const UnifiedRetirementPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isFrench = language === 'fr';

  // Traductions unifiées
  const t = {
    title: isFrench ? 'Planification de Retraite Intelligente' : 'Intelligent Retirement Planning',
    subtitle: isFrench 
      ? 'Planifiez votre avenir financier avec nos outils professionnels et analyses avancées'
      : 'Plan your financial future with our professional tools and advanced analysis',
    
    // Cartes de fonctionnalités
    basicPlanning: {
      title: isFrench ? 'Planification de Base' : 'Basic Planning',
      description: isFrench ? 'Fonctionnalités gratuites pour commencer' : 'Free features to get started',
      features: [
        isFrench ? 'Profil personnel et objectifs' : 'Personal profile and goals',
        isFrench ? 'Calculs de retraite de base' : 'Basic retirement calculations',
        isFrench ? 'Gestion de l\'épargne' : 'Savings management'
      ],
      button: isFrench ? 'Commencer gratuitement' : 'Start Free'
    },
    
    advancedFeatures: {
      title: isFrench ? 'Fonctionnalités Avancées' : 'Advanced Features',
      description: isFrench ? 'Outils professionnels et analyses détaillées' : 'Professional tools and detailed analysis',
      features: [
        isFrench ? 'Rapports et analyses détaillés' : 'Detailed reports and analysis',
        isFrench ? 'Simulateurs avancés' : 'Advanced simulators',
        isFrench ? 'Optimisation fiscale' : 'Tax optimization'
      ],
      button: isFrench ? 'Découvrir Pro' : 'Discover Pro'
    },
    
    securityBackup: {
      title: isFrench ? 'Sécurité et Sauvegarde' : 'Security & Backup',
      description: isFrench ? 'Protection des données et conseils' : 'Data protection and advice',
      features: [
        isFrench ? 'Sauvegarde sécurisée' : 'Secure backup',
        isFrench ? 'Conseils de sécurité' : 'Security tips',
        isFrench ? 'Informations d\'urgence' : 'Emergency information'
      ],
      button: isFrench ? 'En savoir plus' : 'Learn More'
    },
    
    callToAction: isFrench ? '🚀 Accéder au module complet' : '🚀 Access Complete Module'
  };

  // Routes dynamiques selon la langue
  const getRoute = (path: string) => {
    const langPrefix = isFrench ? '/fr' : '/en';
    return `${langPrefix}${path}`;
  };

  return (
    <div className={`min-h-screen ${
      isFrench 
        ? 'bg-gradient-to-br from-mpr-navy via-mpr-navy-mid to-mpr-navy' 
        : 'bg-gradient-to-br from-slate-50 via-mpr-interactive-lt to-mpr-interactive-lt'
    }`}>
      {/* Navigation Phase 1 Intégrée */}
      <RetirementNavigation />
      
      {/* Contenu principal */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${
            isFrench ? 'text-white' : 'text-gray-800'
          }`}>
            {t.title}
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${
            isFrench ? 'text-mpr-interactive-lt' : 'text-gray-600'
          }`}>
            {t.subtitle}
          </p>
        </div>

        {/* Grille de fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Planification de base */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-mpr-interactive" />
                {t.basicPlanning.title}
              </CardTitle>
              <CardDescription>
                {t.basicPlanning.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {t.basicPlanning.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-green-600" />
                  {feature}
                </div>
              ))}
              <Button 
                onClick={() => navigate(getRoute('/retirement-module-phase1'))}
                className="w-full mt-4"
              >
                {t.basicPlanning.button}
              </Button>
            </CardContent>
          </Card>

          {/* Fonctionnalités avancées */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                {t.advancedFeatures.title}
              </CardTitle>
              <CardDescription>
                {t.advancedFeatures.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {t.advancedFeatures.features.map((feature, index) => {
                const icons = [FileText, Zap, Crown];
                const IconComponent = icons[index];
                return (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <IconComponent className="w-4 h-4 text-purple-600" />
                    {feature}
                  </div>
                );
              })}
              <Button 
                onClick={() => navigate(getRoute('/retirement-module'))}
                className="w-full mt-4"
                variant="outline"
              >
                {t.advancedFeatures.button}
              </Button>
            </CardContent>
          </Card>

          {/* Sécurité et sauvegarde */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                {t.securityBackup.title}
              </CardTitle>
              <CardDescription>
                {t.securityBackup.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {t.securityBackup.features.map((feature, index) => {
                const icons = [Database, AlertTriangle, ExternalLink];
                const IconComponent = icons[index];
                return (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <IconComponent className="w-4 h-4 text-green-600" />
                    {feature}
                  </div>
                );
              })}
              <Button 
                onClick={() => navigate(getRoute('/retirement-module?section=backup-security'))}
                className="w-full mt-4"
                variant="outline"
              >
                {t.securityBackup.button}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Appel à l'action */}
        <div className="text-center">
          <Button 
            onClick={() => navigate(getRoute('/retirement-module-phase1'))}
            size="lg"
            className="text-lg px-8 py-4"
          >
            {t.callToAction}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnifiedRetirementPage;
