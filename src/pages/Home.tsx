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
  BookOpen,
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
            { question: 'La trousse remplace-t-elle un testament ou un mandat de protection ?', answer: 'Non. La trousse est un outil d\'organisation personnelle. Elle ne remplace aucun document légal officiel. MonPlanRetraite.ca recommande fortement de consulter un notaire pour votre testament et votre mandat de protection.' },
            { question: 'Puis-je acheter seulement le Formulaire A maintenant et compléter la trousse plus tard ?', answer: 'Absolument. Plusieurs personnes commencent par le Formulaire A — le plus urgent — et reviennent compléter la trousse dans les semaines suivantes. Si vous achetez la trousse complète dès maintenant, vous économisez 17 $.' },
          ]
        : [
            { question: 'Do I need to create an account?', answer: 'No. Start without signup and save scenarios locally.' },
            { question: 'Are my data secure?', answer: 'Yes. Local AES-256-GCM encryption; nothing leaves your device.' },
            { question: 'Can I get a refund?', answer: 'Yes. 14-day full refund window on paid plans.' },
            { question: 'Do you offer phone support?', answer: 'No. We provide interactive guides, FAQ and a local assistant.' },
            { question: 'How do I back up my data (USB key)?', answer: 'Use the encrypted .mpru export and import it next session.' },
            { question: 'Do you provide personalised advice?', answer: 'No. Personalised advice comes from an independent professional.' },
            { question: 'Does the kit replace a will or a protection mandate?', answer: 'No. The kit is a personal organization tool. It does not replace any official legal document. MonPlanRetraite.ca strongly recommends consulting a notary for your will and protection mandate.' },
            { question: 'Can I buy only Form A now and complete the kit later?', answer: 'Absolutely. Many people start with Form A — the most urgent — and come back to complete the kit in the following weeks. If you purchase the complete kit now, you save $17.' },
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
    <div className="min-h-screen bg-mpr-bg-section">
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
                ? 'Une méthode structurée pour clarifier, décider et maximiser votre richesse — en commençant par protéger ceux que vous aimez.'
                : 'A structured method to clarify, decide, and maximize your wealth — starting with protecting those you love.'}
            </p>
          </div>

          {/* Trousse de protection familiale et successorale */}
          <div className="mb-16">
            {/* Accroche émotionnelle */}
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 mb-8 text-center">
              <p className="text-2xl font-bold text-red-700">
                {isFrench
                  ? '🔴 Si quelque chose vous arrivait demain matin… votre famille saurait quoi faire ?'
                  : '🔴 If something happened to you tomorrow morning… would your family know what to do?'}
              </p>
            </div>

            {/* Introduction + Pourquoi c'est la première étape */}
            <Card className="shadow-xl mb-8">
              <CardContent className="p-8">
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                  {isFrench
                    ? "Avant de planifier votre retraite, il y a une étape que presque tout le monde reporte — et qui peut changer le cours des choses en quelques heures critiques. Rassembler les bonnes informations, au bon endroit, pour les bonnes personnes. C'est exactement ce que fait la Trousse de protection familiale et successorale de MonPlanRetraite.ca."
                    : 'Before planning your retirement, there is a step almost everyone postpones — one that can change everything in a few critical hours. Gathering the right information, in the right place, for the right people. That is exactly what the MonPlanRetraite.ca Family and Estate Protection Kit does.'}
                </p>
                <div className="bg-mpr-interactive-lt border-l-4 border-mpr-interactive p-6 rounded-r-xl">
                  <h3 className="text-xl font-bold text-mpr-navy mb-3">
                    {isFrench ? '💡 La planification de retraite commence ici.' : '💡 Retirement planning starts here.'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {isFrench
                      ? "Que vous ayez 42 ou 67 ans, un accident, une hospitalisation ou un décès peut survenir sans préavis. Sans un dossier complet et structuré, vos proches se retrouvent seuls face à des décisions urgentes — sans savoir où sont vos documents, qui appeler, quelles sont vos volontés. La Trousse de protection familiale et successorale vous guide pour tout documenter, section par section, à votre rythme."
                      : 'Whether you are 42 or 67, an accident, hospitalization or death can occur without warning. Without a complete, structured file, your loved ones are left alone facing urgent decisions — not knowing where your documents are, who to call, or what your wishes are. The Family and Estate Protection Kit guides you to document everything, section by section, at your own pace.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Les 3 formulaires */}
            <Card className="shadow-xl mb-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {isFrench ? 'Ce que contient la trousse complète :' : 'What the complete kit includes:'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4 p-5 bg-orange-50 rounded-xl border border-orange-200">
                    <AlertCircle className="w-10 h-10 text-orange-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        {isFrench ? "📋 Formulaire A — En cas d'urgence ou d'inaptitude" : "📋 Form A — In case of emergency or incapacity"}
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {isFrench
                          ? "Contacts d'urgence, informations médicales critiques, mandataire de protection, directives médicales anticipées, personnes à charge. Le document à remettre à votre personne de confiance dès aujourd'hui."
                          : 'Emergency contacts, critical medical information, protection agent, advance medical directives, dependants. The document to give your trusted person today.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <Users className="w-10 h-10 text-gray-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        {isFrench ? '⚰️ Formulaire B — Dossier de préparation funéraire' : '⚰️ Form B — Funeral preparation file'}
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {isFrench
                          ? "Vos volontés funéraires, structure familiale complète, arrangements prépayés, messages personnels à vos proches. Pour épargner à votre famille les décisions les plus difficiles."
                          : 'Your funeral wishes, complete family structure, prepaid arrangements, personal messages to your loved ones. To spare your family the most difficult decisions.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-5 bg-mpr-interactive-lt rounded-xl border border-mpr-border">
                    <FileText className="w-10 h-10 text-mpr-interactive flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        {isFrench ? '🗂️ Formulaire C — Dossier complet du liquidateur' : '🗂️ Form C — Complete liquidator file'}
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {isFrench
                          ? "Tous vos comptes, placements, assurances, propriétés, abonnements, programmes gouvernementaux (RRQ, RPC, RAMQ). Le dossier que votre liquidateur ne pourra pas se passer d'avoir."
                          : 'All your accounts, investments, insurance, properties, subscriptions, government programs (RRQ, CPP, RAMQ). The file your liquidator cannot do without.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-5 bg-emerald-50 rounded-xl border border-emerald-200">
                    <BookOpen className="w-10 h-10 text-emerald-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        {isFrench ? "📖 Guide d'introduction inclus" : '📖 Introduction guide included'}
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {isFrench
                          ? "Avis de confidentialité, meilleures pratiques de sécurité, registre de distribution des copies, calendrier de mise à jour annuelle."
                          : 'Privacy notice, security best practices, copy distribution register, annual update schedule.'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bloc de prix */}
            <Card className="shadow-xl mb-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {isFrench ? 'Choisissez votre niveau de protection' : 'Choose your level of protection'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="border-2 border-gray-200 rounded-2xl p-6 text-center">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {isFrench ? 'Formulaire A seulement' : 'Form A only'}
                    </h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      {isFrench ? "Formulaire A + Guide d'intro — 15 pages" : 'Form A + Intro Guide — 15 pages'}
                    </p>
                    <div className="text-5xl font-bold text-gray-900 mb-2">17 $</div>
                    <p className="text-gray-500 text-sm mb-6">
                      {isFrench ? 'Idéal pour un premier pas immédiat' : 'Ideal for an immediate first step'}
                    </p>
                    <Button
                      onClick={() => navigate(isFrench ? '/planification-urgence' : '/emergency-planning')}
                      variant="outline"
                      className="w-full font-bold border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white py-3"
                    >
                      {isFrench ? 'Obtenir le Formulaire A →' : 'Get Form A →'}
                    </Button>
                  </div>
                  <div className="border-2 border-emerald-500 rounded-2xl p-6 text-center relative bg-emerald-50">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                      {isFrench ? 'MEILLEURE VALEUR' : 'BEST VALUE'}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {isFrench ? 'Trousse complète' : 'Complete kit'}
                    </h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      {isFrench ? 'Formulaires A + B + C + Guide — 75+ pages' : 'Forms A + B + C + Guide — 75+ pages'}
                    </p>
                    <div className="text-5xl font-bold text-emerald-700 mb-2">57 $</div>
                    <p className="text-gray-500 text-sm mb-6">
                      {isFrench ? 'Protection familiale complète' : 'Complete family protection'}
                    </p>
                    <Button
                      onClick={() => navigate(isFrench ? '/planification-urgence' : '/emergency-planning')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3"
                    >
                      {isFrench ? 'Obtenir la trousse complète →' : 'Get the complete kit →'}
                    </Button>
                  </div>
                </div>
                <p className="text-center text-gray-500 text-sm">
                  {isFrench
                    ? '💬 Achat unique. Téléchargement immédiat. Aucun abonnement requis.'
                    : '💬 One-time purchase. Immediate download. No subscription required.'}
                </p>
              </CardContent>
            </Card>

            {/* Bloc de réassurance */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
              <ul className="space-y-3">
                {(isFrench ? [
                  '✅ Conçu spécifiquement pour le contexte québécois (RRQ, RAMQ, liquidateur testamentaire, mandat de protection)',
                  '✅ Formulaires remplissables — version numérique ou papier',
                  '✅ Protégé par filigrane personnalisé à votre nom',
                  '✅ © 2026 MonPlanRetraite.ca — Tous droits réservés',
                ] : [
                  '✅ Designed specifically for the Quebec context (RRQ, RAMQ, testamentary liquidator, protection mandate)',
                  '✅ Fillable forms — digital or paper version',
                  '✅ Protected by personalized watermark with your name',
                  '✅ © 2026 MonPlanRetraite.ca — All rights reserved',
                ]).map((item) => (
                  <li key={item} className="text-lg text-gray-700 leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>

            {/* Bloc de transition */}
            <Card className="bg-gradient-to-r from-mpr-navy to-mpr-interactive text-white shadow-xl border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-3">
                  {isFrench
                    ? "Vous avez complété votre dossier familial ? Vous venez de faire ce que 80 % des Canadiens n'ont jamais fait."
                    : "You completed your family file? You just did what 80% of Canadians have never done."}
                </h3>
                <p className="text-white/80 text-xl mb-4">
                  {isFrench
                    ? "L'étape suivante : planifiez votre retraite avec les bons outils."
                    : 'The next step: plan your retirement with the right tools.'}
                </p>
                <p className="text-white/80 mb-6">
                  {isFrench
                    ? 'MonPlanRetraite.ca est la seule plateforme au Québec qui vous permet de calculer, simuler et optimiser votre retraite — gratuitement pour commencer.'
                    : 'MonPlanRetraite.ca is the only platform in Quebec that lets you calculate, simulate and optimize your retirement — free to start.'}
                </p>
                <Button
                  onClick={() => navigate(isFrench ? '/ma-retraite' : '/my-retirement')}
                  className="bg-white text-blue-700 hover:bg-gray-100 font-bold px-8 py-3"
                >
                  {isFrench ? '👉 Découvrir les outils de planification →' : '👉 Discover the planning tools →'}
                </Button>
              </CardContent>
            </Card>
          </div>


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
                    ? 'Votre guide personnel pour une retraite sereine. Simple, rapide et sécurisé. — Commencez en 12 minutes, sans inscription.'
                    : 'Your personal guide to a peaceful retirement. Simple, fast and secure. — Get started in 12 minutes, no registration required.'}
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
                <Button onClick={() => navigate(isFrench ? '/blog' : '/en/blog')} className="bg-mpr-interactive hover:bg-mpr-interactive-dk text-white font-bold px-8 py-3 rounded-xl">
                  {isFrench ? 'Voir la bibliothèque complète' : 'Browse the full library'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Differences */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-mpr-border shadow-xl mb-16">
            <CardHeader className="text-center pb-6"><CardTitle className="text-3xl font-bold text-mpr-navy">{isFrench ? 'Ce qui nous rend différents' : 'What makes us different'}</CardTitle></CardHeader>
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
                  <div className="w-16 h-16 bg-mpr-interactive-lt rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-mpr-interactive" />
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
                    <AccordionTrigger className="px-8 py-6 text-left text-xl font-bold text-gray-900 hover:text-mpr-interactive leading-relaxed">
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
