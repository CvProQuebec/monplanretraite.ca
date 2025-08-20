// src/features/retirement/sections/AdvancedExpensesSection.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  TrendingUp,
  DollarSign,
  Home,
  Zap,
  Phone,
  ShoppingCart,
  Car,
  Heart,
  Gamepad2,
  Info,
  Calculator,
  PiggyBank,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Shield,
  Plus,
  X,
  Settings,
  Snowflake,
  Sun,
  Clock,
  Target,
  PieChart,
  CalendarDays,
  Receipt,
  Building,
  Leaf,
  Wrench,
  FileText,
  Rocket,
  Sparkles,
  Brain,
  Star,
  Crown,
  Lock
} from 'lucide-react';
import { UserData } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useTranslation } from '../translations/index';

interface AdvancedExpensesSectionProps {
  data: UserData;
  onUpdate: (section: keyof UserData, updates: any) => void;
}

// Fonction pour détecter la langue selon l'URL
const getLanguageFromURL = (): 'fr' | 'en' => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path.includes('/en/')) return 'en';
    if (path.includes('/fr/')) return 'fr';
  }
  return 'fr'; // par défaut
};

export const AdvancedExpensesSection: React.FC<AdvancedExpensesSectionProps> = ({ 
  data, 
  onUpdate 
}) => {
  const language = getLanguageFromURL();
  const t = useTranslation(language);
  const [activeTab, setActiveTab] = useState('overview');

  const handleChange = (field: string, value: any) => {
    onUpdate('expenses', { [field]: value });
  };

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
        <div className="absolute top-48 left-1/5 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-88 right-1/5 w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* En-tête spectaculaire */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
            {language === 'fr' ? '🚀 Dépenses Avancées Intelligentes' : '🚀 Intelligent Advanced Expenses'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            {language === 'fr' 
              ? 'Optimisez vos dépenses avec notre analyse IA avancée et planification intelligente'
              : 'Optimize your expenses with our advanced AI analysis and intelligent planning'
            }
          </p>
        </div>

        {/* Plan requis - Design moderne */}
        <Card className="bg-gradient-to-br from-yellow-800/90 to-orange-800/90 border-0 shadow-2xl backdrop-blur-sm mb-12">
          <CardHeader className="border-b border-yellow-600 bg-gradient-to-r from-yellow-600/20 to-orange-600/20">
            <CardTitle className="text-2xl font-bold text-yellow-300 flex items-center gap-3">
              <Star className="w-8 h-8" />
              {language === 'fr' ? '✩ Plan Professionnel requis' : '✩ Professional Plan Required'}
            </CardTitle>
            <CardDescription className="text-yellow-200">
              {language === 'fr' 
                ? 'Cette section nécessite un plan supérieur'
                : 'This section requires a superior plan'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-4 rounded-lg border border-slate-500/30">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-semibold">
                    {language === 'fr' ? 'Votre plan actuel :' : 'Your current plan:'}
                  </span>
                  <span className="text-red-400 font-bold">Gratuit</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-4 rounded-lg border border-slate-500/30">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-semibold">
                    {language === 'fr' ? 'Plan requis :' : 'Required plan:'}
                  </span>
                  <span className="text-green-400 font-bold">Professionnel</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-yellow-300 mb-4">
                {language === 'fr' ? 'Fonctionnalités du plan Professionnel :' : 'Professional plan features:'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-green-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>{language === 'fr' ? 'Simulations illimitées' : 'Unlimited simulations'}</span>
                </div>
                <div className="flex items-center gap-2 text-green-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>{language === 'fr' ? 'Rapports illimités' : 'Unlimited reports'}</span>
                </div>
                <div className="flex items-center gap-2 text-green-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>{language === 'fr' ? '3 profils utilisateurs' : '3 user profiles'}</span>
                </div>
                <div className="flex items-center gap-2 text-green-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>{language === 'fr' ? 'Analyses avancées' : 'Advanced analytics'}</span>
                </div>
                <div className="flex items-center gap-2 text-green-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>{language === 'fr' ? 'Simulations Monte Carlo' : 'Monte Carlo simulations'}</span>
                </div>
                <div className="flex items-center gap-2 text-green-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>{language === 'fr' ? 'Export PDF' : 'PDF Export'}</span>
                </div>
                <div className="flex items-center gap-2 text-green-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>{language === 'fr' ? 'Optimisation fiscale' : 'Tax optimization'}</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-lg py-4 shadow-2xl transform hover:scale-105 transition-all duration-300"
              size="lg"
            >
              <Zap className="w-6 h-6 mr-3" />
              {language === 'fr' ? 'Passer au plan supérieur →' : 'Upgrade to superior plan →'}
            </Button>
          </CardContent>
        </Card>

        {/* Aperçu des fonctionnalités - Design moderne */}
        <Card className="bg-gradient-to-br from-indigo-800/90 to-purple-800/90 border-0 shadow-2xl backdrop-blur-sm">
          <CardHeader className="border-b border-indigo-600 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
            <CardTitle className="text-2xl font-bold text-indigo-300 flex items-center gap-3">
              <Brain className="w-8 h-8" />
              {language === 'fr' ? 'Aperçu des Fonctionnalités Avancées' : 'Advanced Features Overview'}
            </CardTitle>
            <CardDescription className="text-indigo-200">
              {language === 'fr' 
                ? 'Découvrez ce que vous pourrez faire avec le plan Professionnel'
                : 'Discover what you can do with the Professional plan'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Analyse saisonnière */}
              <Card className="bg-gradient-to-br from-green-600/20 to-green-500/20 border border-green-500/30 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-300 mb-2">
                    {language === 'fr' ? 'Analyse Saisonnière' : 'Seasonal Analysis'}
                  </h3>
                  <p className="text-green-200">
                    {language === 'fr' 
                      ? 'Planifiez vos dépenses selon les saisons'
                      : 'Plan your expenses according to seasons'
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Catégorisation intelligente */}
              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-500/20 border border-blue-500/30 shadow-lg">
                <CardContent className="p-6 text-center">
                  <PieChart className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">
                    {language === 'fr' ? 'Catégorisation IA' : 'AI Categorization'}
                  </h3>
                  <p className="text-blue-200">
                    {language === 'fr' 
                      ? 'Classification automatique des dépenses'
                      : 'Automatic expense classification'
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Prévisions avancées */}
              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-500/20 border border-purple-500/30 shadow-lg">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-purple-300 mb-2">
                    {language === 'fr' ? 'Prévisions Avancées' : 'Advanced Forecasts'}
                  </h3>
                  <p className="text-purple-200">
                    {language === 'fr' 
                      ? 'Prédictions basées sur l\'IA'
                      : 'AI-based predictions'
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Optimisation fiscale */}
              <Card className="bg-gradient-to-br from-orange-600/20 to-orange-500/20 border border-orange-500/30 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Calculator className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-orange-300 mb-2">
                    {language === 'fr' ? 'Optimisation Fiscale' : 'Tax Optimization'}
                  </h3>
                  <p className="text-orange-200">
                    {language === 'fr' 
                      ? 'Maximisez vos déductions'
                      : 'Maximize your deductions'
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Rapports détaillés */}
              <Card className="bg-gradient-to-br from-pink-600/20 to-pink-500/20 border border-pink-500/30 shadow-lg">
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-pink-300 mb-2">
                    {language === 'fr' ? 'Rapports Détaillés' : 'Detailed Reports'}
                  </h3>
                  <p className="text-pink-200">
                    {language === 'fr' 
                      ? 'Analyses approfondies et export PDF'
                      : 'In-depth analysis and PDF export'
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Intégrations */}
              <Card className="bg-gradient-to-br from-cyan-600/20 to-cyan-500/20 border border-cyan-500/30 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Settings className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-cyan-300 mb-2">
                    {language === 'fr' ? 'Intégrations' : 'Integrations'}
                  </h3>
                  <p className="text-cyan-200">
                    {language === 'fr' 
                      ? 'Connectez vos comptes bancaires'
                      : 'Connect your bank accounts'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Call to action */}
            <div className="text-center mt-8">
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xl py-6 px-12 shadow-2xl transform hover:scale-110 transition-all duration-300"
                size="lg"
              >
                <Crown className="w-8 h-8 mr-4" />
                {language === 'fr' ? '🚀 DÉBLOQUER LES DÉPENSES AVANCÉES' : '🚀 UNLOCK ADVANCED EXPENSES'}
                <Zap className="w-8 h-8 ml-4" />
              </Button>
              <p className="text-gray-300 mt-4 text-lg">
                {language === 'fr' 
                  ? '✨ Transformez votre gestion financière avec l\'IA !'
                  : '✨ Transform your financial management with AI!'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};