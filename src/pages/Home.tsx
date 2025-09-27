import React, { useMemo, useState } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OnboardingWizard from '@/components/ui/OnboardingWizard';
import {
  CheckCircle,
  Sparkles,
  Shield,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  Calendar,
  Target,
  Users,
  Phone,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdvancedUpgradeModal from '@/components/ui/advanced-upgrade-modal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getAllPosts } from '@/pages/blog/utils/content';
import PlansSection from '@/components/home/PlansSection';

const Home: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [targetPlan, setTargetPlan] = useState<'professional' | 'expert'>('professional');
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);

  const totalBlogCount = useMemo(
    () => getAllPosts().filter((post) => post.status === 'published').length,
    []
  );

  const articlesHeading = isFrench
    ? "Biblioth\u00E8que d'articles \u2014 44+ articles"
    : `Articles library \u2014 ${totalBlogCount}+ pieces`;

  const assistantSteps = useMemo(
    () =>
      (isFrench
        ? [
            {
              icon: Calendar,
              title: 'R\u00E9pondez \u00E0 12 questions cl\u00E9s',
              description: 'Budget, revenus, prestations et objectifs \u00E0 long terme.',
            },
            {
              icon: Target,
              title: 'Recevez un plan structur\u00E9',
              description: 'Priorit\u00E9s par \u00E9tape et recommandations adapt\u00E9es.',
            },
            {
              icon: Sparkles,
              title: 'Activez les bons outils',
              description: 'Liens directs vers calculatrices, simulations et rapports.',
            },
          ]
        : [
            {
              icon: Calendar,
              title: 'Answer 12 essential questions',
              description: 'Income, benefits, goals and budget captured.',
            },
            {
              icon: Target,
              title: 'Get a structured plan',
              description: 'Step-by-step priorities and tailored suggestions.',
            },
            {
              icon: Sparkles,
              title: 'Launch the right tools',
              description: 'Direct links to calculators, simulations and reports.',
            },
          ]),
    [isFrench]
  );

  const disclaimers = useMemo(
    () =>
      (isFrench
        ? [
            "Outil \u00E9ducatif seulement : aucun conseil financier, fiscal ou juridique personnalis\u00E9.",
            "Donn\u00E9es 100 % locales : elles restent sur votre appareil (chiffrement AES-256).",
            'Plans annuels uniquement',
          ]
        : [
            'Educational tool only: no personalised financial, tax, or legal advice.',
            'Data 100% local: everything stays on your device (AES-256 encryption).',
            'Annual plans only: seasonal promotions may apply (12% to 40%).',
          ]),
    [isFrench]
  );

  const faqItems = useMemo(
    () =>
      (isFrench
        ? [
            { question: 'Dois-je créer un compte?', answer: 'Non. Vous commencez sans inscription et pouvez enregistrer vos scénarios localement.' },
            { question: 'Mes données sont-elles sécurisées?', answer: 'Oui. Elles sont chiffrées localement (AES-256-GCM) et ne quittent jamais votre appareil.' },
            { question: 'Puis-je obtenir un remboursement?', answer: 'Oui. 14 jours pour un remboursement complet sur les plans payants.' },
            { question: 'Offrez-vous du support téléphonique?', answer: 'Non. Guides interactifs, FAQ et assistant local sont fournis.' },
            { question: 'Comment sauvegarder mes données (clé USB)?', answer: "Export chiffré .mpru puis copie sur clé USB sécurisée; import lors de la prochaine session." },
            { question: 'Donnez-vous des conseils personnalisés?', answer: 'Non. L\u2019outil aide à analyser vos choix; pour des conseils, consultez un professionnel.' },
          ]
        : [
            { question: 'Do I need to create an account?', answer: 'No. Start without signup and save scenarios locally.' },
            { question: 'Are my data secure?', answer: 'Yes. Local AES-256-GCM encryption; nothing leaves your device.' },
            { question: 'Can I get a refund?', answer: 'Yes. 14-day full refund window on paid plans.' },
            { question: 'Do you offer phone support?', answer: 'No. We provide interactive guides, FAQ and a local assistant.' },
            { question: 'How do I back up my data (USB key)?', answer: 'Use the encrypted .mpru export and import it next session.' },
            { question: 'Do you provide personalised advice?', answer: 'No. Personalised advice comes from an independent professional.' },
          ]),
    [isFrench]
  );

  const handleUpgradeClick = (plan: 'professional' | 'expert') => {
    setTargetPlan(plan);
    setIsUpgradeModalOpen(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboardingWizard(false);
    navigate(isFrench ? '/ma-retraite' : '/my-retirement');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {isFrench ? (
                <>
                  Votre retraite mérite mieux
                  <br />
                  qu'un plan sur le coin d'une table
                </>
              ) : (
                <>Your retirement deserves better than a plan on a napkin</>
              )}
            </h1>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto mb-8">
              {isFrench
                ? 'Une méthode structurée pour clarifier, décider et maximiser votre richesse.'
                : 'A structured method to clarify, decide, and maximize your wealth.'}
            </p>
          </div>

          {/* Emergency kit */}
          <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl mb-16 border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4">{isFrench ? 'Trousse de protection familiale' : 'Family Protection Kit'}</h2>
                <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
                  {isFrench ? 'Le premier pas essentiel avant de rencontrer un professionnel.' : 'The essential first step before meeting a professional.'}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center"><Phone className="w-12 h-12 text-white mx-auto mb-2" /><h3 className="font-semibold">{isFrench ? "Contacts d'\u2019urgence" : 'Emergency contacts'}</h3></div>
                <div className="text-center"><FileText className="w-12 h-12 text-white mx-auto mb-2" /><h3 className="font-semibold">{isFrench ? 'Documents l\u00E9gaux' : 'Legal documents'}</h3></div>
                <div className="text-center"><Users className="w-12 h-12 text-white mx-auto mb-2" /><h3 className="font-semibold">{isFrench ? 'Responsabilit\u00E9s' : 'Responsibilities'}</h3></div>
                <div className="text-center"><Shield className="w-12 h-12 text-white mx-auto mb-2" /><h3 className="font-semibold">{isFrench ? 'S\u00E9curit\u00E9' : 'Security'}</h3></div>
              </div>
              <div className="text-center">
                <Button onClick={() => navigate(isFrench ? '/planification-urgence' : '/emergency-planning')} size="lg" className="bg-white text-emerald-700 hover:bg-gray-100 font-bold px-10 py-4 rounded-xl">
                  {isFrench ? 'Cr\u00E9er ma trousse GRATUITE' : 'Create my FREE Kit'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>


          <PlansSection
            onStartFree={() => setShowOnboardingWizard(true)}
            onSelectPlan={handleUpgradeClick}
          />

          {/* Assistant - Repositionné et amélioré pour seniors */}
          <Card className="bg-white border-2 border-emerald-200 shadow-xl mb-16">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-emerald-900 mb-4">
                  {isFrench ? 'Assistant de planification de retraite' : 'Retirement planning assistant'}
                </h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-6">
                  {isFrench
                    ? 'Votre guide personnel pour une retraite sereine. Simple, rapide et sécurisé.'
                    : 'Your personal guide to a peaceful retirement. Simple, fast and secure.'}
                </p>
                <div className="inline-block bg-emerald-100 text-emerald-800 px-6 py-3 rounded-xl font-semibold text-lg mb-8">
                  {isFrench ? '✨ Gratuit • 3 étapes simples • 12 minutes' : '✨ Free • 3 simple steps • 12 minutes'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {assistantSteps.map(({ icon: Icon, title, description }, index) => (
                  <div key={title} className="text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">{index + 1}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
                    <p className="text-lg text-gray-700 leading-relaxed">{description}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => setShowOnboardingWizard(true)} 
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-12 py-6 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {isFrench ? '🎯 Commencer maintenant' : '🎯 Start now'}
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
                <p className="text-gray-600 text-lg mt-4">
                  {isFrench ? 'Aucune inscription requise • Données 100 % privées' : 'No registration required • 100% private data'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Articles library - Repositionnée */}
          <Card className="bg-white border-2 border-gray-200 shadow-xl mb-16">
            <CardContent className="p-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{articlesHeading}</h2>
              <p className="text-gray-700 mb-6">
                {isFrench
                  ? 'Accédez gratuitement à notre bibliothèque pour bien vous préparer à la retraite.'
                  : 'Free access to our library to get ready for retirement.'}
              </p>
              <div className="mt-4">
                <Button onClick={() => navigate(isFrench ? '/blog' : '/en/blog')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl">
                  {isFrench ? 'Voir la bibliothèque complète' : 'Browse the full library'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Differences */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 shadow-xl mb-16">
            <CardHeader className="text-center pb-6"><CardTitle className="text-3xl font-bold text-blue-900">{isFrench ? 'Ce qui nous rend différents' : 'What makes us different'}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{isFrench ? 'Seule solution gratuite' : 'Only free solution'}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {isFrench 
                      ? "Module d'urgence professionnel offert gratuitement - une première au Québec"
                      : 'Professional emergency module offered for free - a first in Quebec'
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{isFrench ? 'Assistant IA exclusif' : 'Exclusive AI assistant'}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {isFrench 
                      ? "Le premier assistant qui évite les catastrophes financières avant qu'elles arrivent"
                      : 'The first assistant that prevents financial disasters before they happen'
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{isFrench ? 'Sécurité maximale' : 'Maximum security'}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {isFrench 
                      ? "Vos données restent sur votre appareil. Aucune transmission réseau."
                      : 'Your data stays on your device. No network transmission.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Avertissements */}
          <Card className="bg-amber-50 border border-amber-200 shadow-sm mb-12">
            <CardContent className="p-6 md:p-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <AlertTriangle className="h-10 w-10 text-amber-500" />
                  <h2 className="text-3xl font-bold text-amber-900">
                    {isFrench ? 'Avertissements importants' : 'Important disclaimers'}
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {disclaimers.map((item) => (
                  <div key={item} className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                    <AlertCircle className="h-8 w-8 text-amber-500 mb-3" />
                    <span className="text-lg text-amber-900 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="bg-white border-2 border-gray-200 shadow-xl mb-16">
            <CardHeader className="text-center pb-6"><CardTitle className="text-3xl font-bold text-gray-900">{isFrench ? 'Questions fréquentes' : 'Frequently asked questions'}</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="divide-y divide-gray-100">
                {faqItems.map((item, index) => (
                  <AccordionItem key={item.question} value={`faq-${index}`}>
                    <AccordionTrigger className="px-8 py-6 text-left text-xl font-bold text-gray-900 hover:text-blue-700 leading-relaxed">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-8 pb-6 pt-2 text-lg text-gray-700 leading-relaxed">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
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

export default Home;
