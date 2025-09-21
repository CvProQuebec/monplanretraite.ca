import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OnboardingWizard from '@/components/ui/OnboardingWizard';
import {
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  Calendar,
  Zap,
  Shield,
  Heart,
  Crown,
  Sparkles,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  Home,
  Target,
  Users,
  Calculator,
  Phone,
  FileText,
  Key,
  Unlock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdvancedUpgradeModal from '@/components/ui/advanced-upgrade-modal';
import { ComparisonTeaser } from '@/components/home/ComparisonTeaser';
import { FEATURE_CATALOG, Tier } from '@/config/plans';
import { getAllPosts } from '@/pages/blog/utils/content';

const Accueil: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [targetPlan, setTargetPlan] = useState<'professional' | 'expert'>('professional');
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  
  // Système de code de test temporaire
  const [testCode, setTestCode] = useState('');
  const [isTestModeActive, setIsTestModeActive] = useState(false);
  const [showTestCodeInput, setShowTestCodeInput] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleUpgradeClick = (plan: 'professional' | 'expert') => {
    setTargetPlan(plan);
    setIsUpgradeModalOpen(true);
  };

  const handleOnboardingComplete = () => {
    console.log('✅ Onboarding terminé avec succès');
    setShowOnboardingWizard(false);
    navigate('/ma-retraite');
  };

  const handleOnboardingSkip = () => {
    setShowOnboardingWizard(false);
  };

  const handleTestCodeSubmit = () => {
    if (testCode.trim().toUpperCase() === 'TESTER100') {
      setIsTestModeActive(true);
      setTestCode('');
      setShowTestCodeInput(false);
      // Store test mode in localStorage for persistence across pages
      localStorage.setItem('testModeActive', 'true');
      alert(isFrench ? '✅ Mode test activé! Tous les modules sont maintenant débloqués.' : '✅ Test mode activated! All modules are now unlocked.');
    } else {
      alert(isFrench ? '❌ Code incorrect. Veuillez réessayer.' : '❌ Incorrect code. Please try again.');
      setTestCode('');
    }
  };

  const handleTestCodeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTestCodeSubmit();
    }
  };

  // Check if test mode was previously activated
  React.useEffect(() => {
    const testModeStored = localStorage.getItem('testModeActive');
    if (testModeStored === 'true') {
      setIsTestModeActive(true);
    }
  }, []);

  // Catalogue des fonctionnalités (palier minimal requis)
  const totalBlogCount = useMemo(() => getAllPosts().filter(p => p.status === 'published').length, []);
  const featureCatalog = FEATURE_CATALOG;

  const labelOf = (f: { labelFr: string; labelEn: string }) => (isFrench ? f.labelFr : f.labelEn);
  const sortByLabel = (a: typeof featureCatalog[number], b: typeof featureCatalog[number]) =>
    labelOf(a).localeCompare(labelOf(b), isFrench ? 'fr-CA' : 'en-CA');

  // Prioriser certains éléments (ex.: trousse d'urgence en premier)
  const freePriority = new Map<string, number>([['emergency', 0]]);
  const sortFree = (
    a: typeof featureCatalog[number],
    b: typeof featureCatalog[number]
  ) => {
    const pa = freePriority.has(a.key) ? (freePriority.get(a.key) as number) : 999;
    const pb = freePriority.has(b.key) ? (freePriority.get(b.key) as number) : 999;
    if (pa !== pb) return pa - pb;
    return labelOf(a).localeCompare(labelOf(b), isFrench ? 'fr-CA' : 'en-CA');
  };

  const freeList = featureCatalog.filter(f => f.tier === 'free').sort(sortFree);
  const proOnlyList = featureCatalog.filter(f => f.tier === 'pro').sort(sortByLabel);
  const expertOnlyList = featureCatalog.filter(f => f.tier === 'expert').sort(sortByLabel);

  const included = (tier: Tier, plan: Tier) => {
    const order = { free: 0, pro: 1, expert: 2 } as const;
    return order[plan] >= order[tier];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      {/* Section de code de test temporaire */}
      {!isTestModeActive && (
        <div className="fixed bottom-4 right-4 z-50">
          {!showTestCodeInput ? (
            <Button
              onClick={() => setShowTestCodeInput(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg"
              title={isFrench ? "Code de test" : "Test code"}
            >
              <Key className="w-5 h-5" />
            </Button>
          ) : (
            <Card className="bg-white shadow-xl border-2 border-gray-300 p-4 min-w-[280px]">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Unlock className="w-4 h-4" />
                  <span>{isFrench ? 'Code de test' : 'Test code'}</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder={isFrench ? "Entrez le code..." : "Enter code..."}
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value)}
                    onKeyPress={handleTestCodeKeyPress}
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    onClick={handleTestCodeSubmit}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isFrench ? 'OK' : 'OK'}
                  </Button>
                </div>
                <Button
                  onClick={() => {
                    setShowTestCodeInput(false);
                    setTestCode('');
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-gray-500"
                >
                  {isFrench ? 'Annuler' : 'Cancel'}
                </Button>
              </div>
            </Card>

          )}
        </div>
      )}

      {/* Indicateur de mode test actif */}
      {isTestModeActive && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Unlock className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isFrench ? 'Mode Test Actif' : 'Test Mode Active'}
            </span>
            <Button
              onClick={() => {
                setIsTestModeActive(false);
                localStorage.removeItem('testModeActive');
              }}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-green-600 p-1 h-auto"
            >
              <XCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Contenu principal optimisé */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">

          {/* SECTION 1: Hook émotionnel - NOUVEAU */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {isFrench ? (
                <>
                  Votre retraite mérite mieux<br />
                  qu'un plan sur le coin d'une table
                </>
              ) : 'Your retirement deserves better than a plan on a napkin'}
            </h1>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto mb-8">
              {isFrench ? (
                <>
                  Préparez-vous efficacement avec nos outils professionnels.<br />
                  Gagnez du temps et maximisez la valeur de vos décisions.
                </>
              ) : 'Prepare effectively with our professional tools. Save time and maximize the value of your decisions.'}
            </p>
            <div className="space-y-4 mb-8">
              <div className="inline-block bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-lg">
                {isFrench 
                  ? '💰 Évitez des erreurs de 10 000 $+ avec nos outils professionnels'
                  : '💰 Avoid $10,000+ mistakes with our professional tools'
                }
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg max-w-4xl mx-auto">
                <p className="text-yellow-800 font-medium">
                  {isFrench ? (
                    <>
                      ⚠️ Une mauvaise décision de retraite peut coûter des dizaines de milliers de dollars.<br />
                      Nos outils vous aident à prendre les bonnes décisions dès le départ.
                    </>
                  ) : '⚠️ One bad retirement decision can cost tens of thousands of dollars. Our tools help you make the right decisions from the start.'}
                </p>
              </div>
            </div>
          </div>

          {/* CTA principale — Assistant guidé */}
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => navigate('/wizard/profil')}
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg"
                aria-label={isFrench ? "Commencer l'assistant guidé" : "Start guided wizard"}
              >
                {isFrench ? "🎯 Commencer l'assistant guidé" : '🎯 Start the guided wizard'}
              </Button>
              <Button
                onClick={() => document.getElementById('plans-compare')?.scrollIntoView({ behavior: 'smooth' })}
                variant="outline"
                className="border-2 border-blue-700 text-blue-800 hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl"
                aria-label={isFrench ? 'Voir les fonctionnalités' : 'See features'}
              >
                {isFrench ? 'Voir les fonctionnalités' : 'See features'}
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              {isFrench ? 'Sans inscription • Données 100 % privées' : 'No signup • 100% private data'}
            </div>

            {/* Badges de réassurance */}
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-4xl">
              <div className="flex items-center justify-center gap-2 bg-white/70 border border-gray-200 rounded-lg px-4 py-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span className="text-sm text-gray-800">{isFrench ? 'Remboursé 14 jours' : '14‑day money‑back'}</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/70 border border-gray-200 rounded-lg px-4 py-2">
                <Shield className="w-4 h-4 text-blue-700" aria-hidden="true" />
                <span className="text-sm text-gray-800">{isFrench ? 'Données 100 % locales' : '100% local data'}</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/70 border border-gray-200 rounded-lg px-4 py-2">
                <Key className="w-4 h-4 text-purple-700" aria-hidden="true" />
                <span className="text-sm text-gray-800">{isFrench ? 'Chiffrement AES‑256' : 'AES‑256 encryption'}</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Service Gratuit - VERSION OPTIMISÉE (60% plus court) */}
          <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl mb-16 border-0 overflow-hidden relative hidden">
            <CardContent className="p-8 relative z-10">
              <div className="text-center mb-8">
                <div className="inline-block bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold mb-4">
                  🎁 {isFrench ? 'SERVICE GRATUIT' : 'FREE SERVICE'}
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  {isFrench ? 'Trousse de protection familiale' : 'Family Protection Kit'}
                </h2>
                <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
                  {isFrench 
                    ? 'Complétez l\'information, imprimez et partagez avec les membres de votre famille ou votre personne de confiance.'
                    : 'Complete the information, print and share with family members or your trusted person.'
                  }
                </p>
              </div>

              {/* 4 icônes simplifiées */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <Phone className="w-12 h-12 text-white mx-auto mb-2" />
                  <h3 className="font-semibold">{isFrench ? 'Contacts d\'urgence' : 'Emergency contacts'}</h3>
                </div>
                <div className="text-center">
                  <Heart className="w-12 h-12 text-white mx-auto mb-2" />
                  <h3 className="font-semibold">{isFrench ? 'Infos médicales' : 'Medical info'}</h3>
                </div>
                <div className="text-center">
                  <FileText className="w-12 h-12 text-white mx-auto mb-2" />
                  <h3 className="font-semibold">{isFrench ? 'Documents légaux' : 'Legal documents'}</h3>
                </div>
                <div className="text-center">
                  <Users className="w-12 h-12 text-white mx-auto mb-2" />
                  <h3 className="font-semibold">{isFrench ? 'Responsabilités' : 'Responsibilities'}</h3>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => handleNavigation('/planification-urgence')}
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-gray-100 font-bold px-12 py-4 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {isFrench ? '🎯 Créer ma trousse GRATUITE' : '🎯 Create my FREE Kit'}
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
                <p className="text-emerald-200 text-sm mt-4">
                  {isFrench ? '✨ Aucune inscription requise • Données 100 % privées' : '✨ No registration required • 100% private data'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: Ce qui nous rend différents - FUSIONNÉE ET OPTIMISÉE */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 shadow-xl mb-16 hidden">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-blue-900 mb-4">
                {isFrench ? 'Ce qui nous rend différents' : 'What makes us different'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {isFrench ? 'Seule solution gratuite' : 'Only free solution'}
                  </h3>
                  <p className="text-gray-700">
                    {isFrench 
                      ? 'Module d\'urgence professionnel offert gratuitement - une première au Québec'
                      : 'Professional emergency module offered for free - a first in Quebec'
                    }
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {isFrench ? 'Assistant IA exclusif' : 'Exclusive AI Assistant'}
                  </h3>
                  <p className="text-gray-700">
                    {isFrench 
                      ? 'Le premier assistant qui évite les catastrophes financières avant qu\'elles arrivent'
                      : 'The first assistant that prevents financial disasters before they happen'
                    }
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {isFrench ? 'Sécurité maximale' : 'Maximum security'}
                  </h3>
                  <p className="text-gray-700">
                    {isFrench 
                      ? 'Vos données restent sur votre appareil. Aucune transmission réseau.'
                      : 'Your data stays on your device. No network transmission.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>


{/* SECTION: Visuel Calculateurs — placé avant la trousse */}
<Card className="hidden bg-white border-2 border-gray-200 shadow-xl mb-16">
            <CardContent className="p-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {isFrench ? 'Calculateurs de base (5 outils) — réponses rapides' : 'Basic calculators (5 tools) — quick answers'}
              </h2>
              <p className="text-gray-700 mb-6">
                {isFrench
                  ? 'Des petits outils simples pour obtenir vite une estimation.'
                  : 'Small simple tools to get a quick estimate.'}
              </p>
              <img
                src="/calculateurs.png"
                alt={isFrench ? 'Aperçu des calculateurs de base' : 'Preview of basic calculators'}
                className="mx-auto rounded-xl shadow-lg max-w-full h-auto"
                loading="lazy"
              />
            </CardContent>
          </Card>

          {/* SECTION: Trousse familiale — placé avant les 3 forfaits */}
          <Card className="bg-white border-2 border-gray-200 shadow-xl mb-16">
            <CardContent className="p-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {isFrench ? 'Trousse de protection familiale — infos essentielles prêtes' : 'Family Protection Kit — essentials ready'}
              </h2>
              <p className="text-gray-700 mb-2">
                {isFrench
                  ? 'Rassemblez les infos importantes pour votre famille en cas d’urgence.'
                  : 'Gather important info for your family in case of emergency.'}
              </p>
              <div className="text-sm text-gray-700 mb-6">
                {isFrench
                  ? 'Inclut 8 sections: Personnes, Documents, Finances, Testament, Santé, Assurances, Accès, Vérification.'
                  : 'Includes 8 sections: People, Documents, Finances, Will, Health, Insurance, Access, Verification.'}
              </div>
              <img
                src="/familial.png"
                alt={isFrench ? 'Aperçu de la trousse de protection familiale' : 'Preview of the Family Protection Kit'}
                className="mx-auto rounded-xl shadow-lg max-w-full h-auto"
                loading="lazy"
              />
            </CardContent>
          </Card>

          {/* SECTION: Bibliothèque d'articles — compteur dynamique + CTA */}
          <Card className="bg-white border-2 border-gray-200 shadow-xl mb-16">
            <CardContent className="p-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {isFrench ? `Bibliothèque d’articles — ${totalBlogCount}+ articles` : `Articles Library — ${totalBlogCount}+ articles`}
              </h2>
              <p className="text-gray-700 mb-6">
                {isFrench
                  ? 'Accédez gratuitement à notre bibliothèque pour bien vous préparer à la retraite.'
                  : 'Free access to our library to get ready for retirement.'}
              </p>
              <img
                src="/articles.png"
                alt={isFrench ? 'Aperçu des articles de blog' : 'Preview of blog articles'}
                className="mx-auto rounded-xl shadow-lg max-w-full h-auto"
                loading="lazy"
              />
              <div className="mt-6">
                <Button
                  onClick={() => navigate(isFrench ? '/blog' : '/en/blog')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl"
                >
                  {isFrench ? '📚 Bibliothèque complète' : '📚 Full Library'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 4: Comparaison des plans - VERSION SIMPLIFIÉE (70% plus courte) */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-16 rounded-2xl mb-16">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">
                  {isFrench ? 'Choisissez votre niveau de protection' : 'Choose your level of protection'}
                </h2>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                  {isFrench 
                    ? 'De la protection gratuite à la planification complète avec IA'
                    : 'From free protection to complete AI-powered planning'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* PLAN GRATUIT - Simplifié */}
                <Card className="bg-white border-2 border-emerald-200 shadow-xl">
                  <CardHeader className="text-center pt-6">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-emerald-900">
                      {isFrench ? 'Gratuit' : 'Free'}
                    </CardTitle>
                    <div className="text-4xl font-bold text-emerald-600 mb-2">0 $</div>
                  </CardHeader>
                  <CardContent className="px-6 pb-8">
                    <div className="space-y-2 mb-6">
                      <div className="bg-emerald-50 p-3 rounded-lg mb-3">
                        <div className="text-emerald-800 font-bold text-sm mb-1">
                          {isFrench ? '🎁 VALEUR : 500 $ GRATUIT' : '🎁 VALUE: $500+ FREE'}
                        </div>
                        <div className="text-emerald-700 text-xs">
                          {isFrench ? 'Seule plateforme au Québec à offrir cela gratuitement' : 'Only platform in Quebec offering this for free'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs">{isFrench ? 'Module d\'urgence professionnel (8 sections)' : 'Professional emergency module (8 sections)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs">{isFrench ? 'Planification budget et dépenses' : 'Budget and expense planning'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs">{isFrench ? 'Calculateurs de base (5 outils)' : 'Basic calculators (5 tools)'}</span>
                      </div>
                      <div className="pl-6 text-[11px] text-gray-600">
                        <ul className="list-disc list-inside">
                          <li>{isFrench ? 'Calculatrice de rendement simple' : 'Simple return calculator'}</li>
                          <li>{isFrench ? "Comparateur d’options d’achat" : 'Purchase options comparator'}</li>
                          <li>{isFrench ? 'Estimateur de budget mensuel (lite)' : 'Monthly budget estimator (lite)'}</li>
                          <li>{isFrench ? 'Aperçu RRQ/CPP — montants et impact' : 'RRQ/CPP preview — amounts and impact'}</li>
                          <li>{isFrench ? 'Conseils essentiels (aperçu)' : 'Essential tips (preview)'}</li>
                        </ul>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs">{isFrench ? 'Gestion revenus et prestations RRQ/CPP' : 'Income and RRQ/CPP benefits management'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs">{isFrench ? 'Sécurité bancaire (chiffrement AES-256)' : 'Banking security (AES-256 encryption)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs">{isFrench ? '5 simulations/mois • Données 100 % privées' : '5 simulations/month • 100% private data'}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowOnboardingWizard(true)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3"
                    >
                      {isFrench ? '🎯 Commencer GRATUITEMENT' : '🎯 Start FREE'}
                    </Button>
                  </CardContent>
                </Card>

                {/* PLAN PROFESSIONNEL - Simplifié */}
                <Card className="bg-white border-4 border-blue-400 shadow-2xl relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      {isFrench ? '⭐ RECOMMANDÉ' : '⭐ RECOMMENDED'}
                    </div>
                  </div>
                  <CardHeader className="text-center pt-8">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-blue-900">
                      {isFrench ? 'Professionnel' : 'Professional'}
                    </CardTitle>
                    <div className="text-4xl font-bold text-blue-600 mb-1">297 $</div>
                    <div className="text-sm text-blue-600">{isFrench ? '/an' : '/year'}</div>
                  </CardHeader>
                  <CardContent className="px-6 pb-8">
                    <div className="space-y-2 mb-6">
                      <div className="bg-blue-50 p-3 rounded-lg mb-3">
                        <div className="text-blue-800 font-bold text-sm mb-1">
                          {isFrench ? '💎 VALEUR : 5 000 $ pour 297 $' : '💎 VALUE: $5000+ for $297'}
                        </div>
                        <div className="text-blue-700 text-xs">
                          {isFrench ? 'Économie de 94 %' : 'Save 94%'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium">{isFrench ? 'Tout du plan Gratuit + fonctionnalités avancées (bornées)' : 'Everything from Free + advanced features (capped)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs font-semibold">{isFrench ? 'Assistant IA Personnel (prévention catastrophes)' : 'Personal AI Assistant (disaster prevention)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-xs">{isFrench ? 'Calculateurs avancés (IRR, TWR, Monte Carlo – aperçu)' : 'Advanced calculators (IRR, TWR, Monte Carlo – preview)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-xs">{isFrench ? 'Modules RREGOP + SRG complets' : 'Complete RREGOP + SRG modules'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-xs">{isFrench ? 'Optimisation fiscale (de base)' : 'Tax optimization (basic)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-xs">{isFrench ? 'PDF résumé (filigrane) • 50 simulations/mois' : 'PDF summary (watermark) • 50 simulations/month'}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleUpgradeClick('professional')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
                    >
                      {isFrench ? 'Choisir Professionnel' : 'Choose Professional'}
                    </Button>
                  </CardContent>
                </Card>

                {/* PLAN EXPERT - Simplifié */}
                <Card className="bg-white border-2 border-purple-300 shadow-xl">
                  <CardHeader className="text-center pt-6">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-purple-900">
                      {isFrench ? 'Expert' : 'Expert'}
                    </CardTitle>
                    <div className="text-4xl font-bold text-purple-600 mb-1">597 $</div>
                    <div className="text-sm text-purple-600">{isFrench ? '/an' : '/year'}</div>
                  </CardHeader>
                  <CardContent className="px-6 pb-8">
                    <div className="space-y-2 mb-6">
                      <div className="bg-purple-50 p-3 rounded-lg mb-3">
                        <div className="text-purple-800 font-bold text-sm mb-1">
                          {isFrench ? '👑 VALEUR : 10 000 $ pour 597 $' : '👑 VALUE: $10,000+ for $597'}
                        </div>
                        <div className="text-purple-700 text-xs">
                          {isFrench ? 'Niveau consultant • Économie de 94 % • Évite erreurs coûteuses' : 'Consultant level • 94% savings • Prevents costly mistakes'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-medium">{isFrench ? 'Suite complète : 75+ fonctionnalités' : 'Complete suite: 75+ features'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-pink-500" />
                        <span className="text-xs font-semibold">{isFrench ? 'Planification successorale complète' : 'Complete estate planning'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-500" />
                        <span className="text-xs">{isFrench ? 'Monte Carlo 2000 itérations • IA prédictive' : 'Monte Carlo 2000 iterations • Predictive AI'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-500" />
                        <span className="text-xs">{isFrench ? 'Optimisation immobilière avancée' : 'Advanced real estate optimization'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-500" />
                        <span className="text-xs">{isFrench ? 'Rapports niveau consultant • Export PDF + CSV' : 'Consultant-level reports • PDF + CSV export'}</span>
                      </div>

                    </div>
                    <Button
                      onClick={() => handleUpgradeClick('expert')}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3"
                    >
                      {isFrench ? 'Choisir Expert' : 'Choose Expert'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => {
                    setShowComparison((v) => !v);
                    setTimeout(() => document.getElementById('plans-compare')?.scrollIntoView({ behavior: 'smooth' }), 60);
                  }}
                  className="bg-white text-blue-800 hover:bg-gray-100 font-bold px-8 py-3 rounded-xl shadow-md"
                >
                  {isFrench ? (showComparison ? 'Masquer la comparaison' : 'Comparer les plans') : (showComparison ? 'Hide comparison' : 'Compare plans')}
                </Button>
              </div>

              <div className="text-center mt-8">
                <p className="text-blue-200 text-sm">
                  {isFrench ? '✨ Garantie 14 jours remboursé sur tous les plans payants' : '✨ 14-day money-back guarantee on all paid plans'}
                </p>
              </div>
            </div>
          </div>

          <ComparisonTeaser className="mb-16" />

          {/* SECTION 5: Tableau de comparaison détaillée */}
          {showComparison && (
            <Card id="plans-compare" className="bg-white border-2 border-gray-200 shadow-xl mb-16">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  {isFrench ? 'Comparaison détaillée des fonctionnalités' : 'Detailed plan comparison'}
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 text-gray-700 border-b border-gray-200 w-2/3">{isFrench ? 'Fonctionnalité' : 'Feature'}</th>
                      <th className="text-center p-3 text-gray-700 border-b border-gray-200">Free</th>
                      <th className="text-center p-3 text-gray-700 border-b border-gray-200">{isFrench ? 'Pro' : 'Pro'}</th>
                      <th className="text-center p-3 text-gray-700 border-b border-gray-200">{isFrench ? 'Expert' : 'Expert'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Groupe: Inclus Gratuit (A→Z) */}
                    <tr><td colSpan={4} className="bg-emerald-50 text-emerald-900 font-semibold p-2">{isFrench ? 'Plan Gratuit' : 'Free plan'}</td></tr>
                    {freeList.map((f) => (
                      <tr key={f.key} className="hover:bg-gray-50">
                        <td className="p-3 border-b border-gray-100 text-gray-900">
                          <div className="font-medium">{labelOf(f)}</div>
                          {(isFrench ? f.descFr : f.descEn) && (
                            <div className="text-xs text-gray-600 mt-1">
                              {isFrench ? f.descFr : f.descEn}
                            </div>
                          )}
                        </td>
                        <td className="p-3 border-b border-gray-100 text-center">{included(f.tier, 'free') ? '✔' : '—'}</td>
                        <td className="p-3 border-b border-gray-100 text-center">{included(f.tier, 'pro') ? '✔' : '—'}</td>
                        <td className="p-3 border-b border-gray-100 text-center">{included(f.tier, 'expert') ? '✔' : '—'}</td>
                      </tr>
                    ))}
                    {/* Groupe: Inclus Pro (A→Z) */}
                    <tr><td colSpan={4} className="bg-blue-50 text-blue-900 font-semibold p-2">{isFrench ? 'Plan Professionnel' : 'Professional plan'}</td></tr>
                    {proOnlyList.map((f) => (
                      <tr key={f.key} className="hover:bg-gray-50">
                        <td className="p-3 border-b border-gray-100 text-gray-900">
                          <div className="font-medium">{labelOf(f)}</div>
                          {(isFrench ? f.descFr : f.descEn) && (
                            <div className="text-xs text-gray-600 mt-1">
                              {isFrench ? f.descFr : f.descEn}
                            </div>
                          )}
                        </td>
                        <td className="p-3 border-b border-gray-100 text-center">—</td>
                        <td className="p-3 border-b border-gray-100 text-center">✔</td>
                        <td className="p-3 border-b border-gray-100 text-center">✔</td>
                      </tr>
                    ))}
                    {/* Groupe: Inclus Expert (A→Z) */}
                    <tr><td colSpan={4} className="bg-purple-50 text-purple-900 font-semibold p-2">{isFrench ? 'Plan Expert' : 'Expert plan'}</td></tr>
                    {expertOnlyList.map((f) => (
                      <tr key={f.key} className="hover:bg-gray-50">
                        <td className="p-3 border-b border-gray-100 text-gray-900">
                          <div className="font-medium">{labelOf(f)}</div>
                          {(isFrench ? f.descFr : f.descEn) && (
                            <div className="text-xs text-gray-600 mt-1">
                              {isFrench ? f.descFr : f.descEn}
                            </div>
                          )}
                        </td>
                        <td className="p-3 border-b border-gray-100 text-center">—</td>
                        <td className="p-3 border-b border-gray-100 text-center">—</td>
                        <td className="p-3 border-b border-gray-100 text-center">✔</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-center mt-6">
                  <Button
                    onClick={() => setShowComparison(false)}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold px-6 py-2 rounded-lg"
                  >
                    {isFrench ? 'Fermer la comparaison' : 'Close comparison'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SECTION: Ce qui nous rend différents — déplacé après comparaison */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 shadow-xl mb-16">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-blue-900 mb-4">
                {isFrench ? 'Ce qui nous rend différents' : 'What makes us different'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {isFrench ? 'Seule solution gratuite' : 'Only free solution'}
                  </h3>
                  <p className="text-gray-700">
                    {isFrench
                      ? 'Module d\'urgence professionnel offert gratuitement - une première au Québec'
                      : 'Professional emergency module offered for free - a first in Quebec'
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {isFrench ? 'Assistant IA exclusif' : 'Exclusive AI Assistant'}
                  </h3>
                  <p className="text-gray-700">
                    {isFrench
                      ? 'Le premier assistant qui évite les catastrophes financières avant qu\'elles arrivent'
                      : 'The first assistant that prevents financial disasters before they happen'
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {isFrench ? 'Sécurité maximale' : 'Maximum security'}
                  </h3>
                  <p className="text-gray-700">
                    {isFrench
                      ? 'Vos données restent sur votre appareil. Aucune transmission réseau.'
                      : 'Your data stays on your device. No network transmission.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>



          {/* SECTION: Disclaimers visibles */}
          <Card className="bg-white border-2 border-amber-200 shadow-xl mb-16">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-amber-800">
                {isFrench ? 'Disclaimers importants' : 'Important disclaimers'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-amber-900">
                <li>• {isFrench ? "Outil éducatif seulement — aucun conseil financier, fiscal, juridique ou d'investissement personnalisé." : 'Educational tool only — no personalized financial, tax, legal, or investment advice.'}</li>
                <li>• {isFrench ? "Aucune affiliation avec une institution financière. Aucun permis de l'AMF." : 'No affiliation with any financial institution. No AMF licensing.'}</li>
                <li>• {isFrench ? 'Données 100 % locales — restent sur votre appareil (chiffrement AES‑256).' : 'Data stays 100% local on your device (AES‑256 encryption).'} </li>
                <li>• {isFrench ? 'Support auto-assisté (FAQ et bulles d’aide). Pas de support téléphonique.' : 'Self‑serve support (FAQ and help tips). No phone support.'}</li>
                <li>• {isFrench ? "Plans annuels seulement. Promotions saisonnières possibles (-25 % à -40 %)." : 'Annual plans only. Seasonal promotions may apply (-25% to -40%).'}</li>
              </ul>
            </CardContent>
          </Card>

          {/* SECTION: FAQ / CTA final */}
          <Card className="bg-white border-2 border-gray-200 shadow-xl mb-20">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold text-gray-900">
                {isFrench ? 'Questions fréquentes' : 'Frequently asked questions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="max-w-4xl mx-auto">
              <div className="space-y-4 text-gray-800">
                <details className="border rounded-lg p-3">
                  <summary className="font-semibold cursor-pointer">{isFrench ? 'Dois‑je créer un compte?' : 'Do I need an account?'}</summary>
                  <p className="mt-2 text-sm">{isFrench ? 'Non. Vous pouvez commencer sans inscription. Vos données restent sur votre appareil.' : 'No. You can start without signing up. Your data stays on your device.'}</p>
                </details>
                <details className="border rounded-lg p-3">
                  <summary className="font-semibold cursor-pointer">{isFrench ? 'Mes données sont‑elles sécurisées?' : 'Are my data secure?'}</summary>
                  <p className="mt-2 text-sm">{isFrench ? 'Oui, elles sont chiffrées localement (AES‑256) et ne quittent pas votre appareil.' : 'Yes, encrypted locally (AES‑256) and never leave your device.'}</p>
                </details>
                <details className="border rounded-lg p-3">
                  <summary className="font-semibold cursor-pointer">{isFrench ? 'Puis‑je obtenir un remboursement?' : 'Can I get a refund?'}</summary>
                  <p className="mt-2 text-sm">{isFrench ? 'Oui, garantie de remboursement 14 jours sur les plans payants.' : 'Yes, 14‑day money‑back guarantee on paid plans.'}</p>
                </details>
                {/* FAQ seniors supplémentaires */}
                <details className="border rounded-lg p-3">
                  <summary className="font-semibold cursor-pointer">
                    {isFrench ? 'Offrez-vous du support téléphonique?' : 'Do you offer phone support?'}
                  </summary>
                  <p className="mt-2 text-sm">
                    {isFrench
                      ? "Non. Pour éviter les délais et garder le prix bas, nous offrons un support auto‑assisté (FAQ et bulles d’aide). Vous pouvez nous écrire par courriel en cas de bug."
                      : 'No. To keep costs low and avoid delays, we provide self‑serve support (FAQ and help tips). You can email us for bugs.'}
                  </p>
                </details>

                <details className="border rounded-lg p-3">
                  <summary className="font-semibold cursor-pointer">
                    {isFrench ? 'Comment sauvegarder mes données (clé USB)?' : 'How do I save my data (USB key)?'}
                  </summary>
                  <p className="mt-2 text-sm">
                    {isFrench
                      ? "Vos données restent sur votre appareil. Utilisez la fonction de sauvegarde locale pour enregistrer un fichier sur votre clé USB ou votre disque. Aucune connexion internet requise."
                      : 'Your data stays on your device. Use the local backup feature to save a file to your USB key or drive. No internet required.'}
                  </p>
                </details>

                <details className="border rounded-lg p-3">
                  <summary className="font-semibold cursor-pointer">
                    {isFrench ? 'Donnez-vous des conseils personnalisés?' : 'Do you provide personalized advice?'}
                  </summary>
                  <p className="mt-2 text-sm">
                    {isFrench
                      ? "Non. L’outil est éducatif et ne remplace pas un planificateur financier. Nous n’offrons pas de conseils financiers, fiscaux, juridiques ou d’investissement personnalisés."
                      : 'No. The tool is educational and does not replace a financial planner. We do not provide personalized financial, tax, legal, or investment advice.'}
                  </p>
                </details>

                <details className="border rounded-lg p-3">
                  <summary className="font-semibold cursor-pointer">
                    {isFrench ? 'Avez-vous des promotions?' : 'Do you have promotions?'}
                  </summary>
                  <p className="mt-2 text-sm">
                    {isFrench
                      ? "Oui, à certaines périodes (Black Friday, Fêtes, été). Les rabais varient (–25 % à –40 %)."
                      : 'Yes, during certain periods (Black Friday, Holidays, summer). Discounts vary (–25% to –40%).'}
                  </p>
                </details>
              </div>
              <div className="text-center mt-8">
                <Button
                  onClick={() => navigate('/wizard/profil')}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg"
                  aria-label={isFrench ? 'Assistant de planification Retraite' : 'Retirement planning assistant'}
                >
                  {isFrench ? '🎯 Assistant de planification Retraite' : '🎯 Retirement Planning Assistant'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
 
      {/* Modals */}
      <AdvancedUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        requiredPlan={targetPlan}
        featureName="plan_upgrade"
        currentPlan="free"
      />

      <OnboardingWizard
        isOpen={showOnboardingWizard}
        onClose={() => setShowOnboardingWizard(false)}
        onComplete={handleOnboardingComplete}
      />

    </div>
  );
};

export default Accueil;
