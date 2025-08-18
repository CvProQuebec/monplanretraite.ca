import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Shield, TrendingUp, Crown, Zap, FileText, Users, Calculator, Target } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import { PromoCodeInput } from '../components/ui/promo-code-input';
import { usePromoCode } from '../hooks/usePromoCode';

const RetraiteEntreeFr: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const { promoCode, setPromoCode, appliedCode, applyPromoCode, clearPromoCode } = usePromoCode();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre planificateur de retraite !",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter avec Google. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const handlePromoCodeSubmit = async () => {
    if (!promoCode.trim()) return;
    
    try {
      const result = await applyPromoCode(promoCode);
      if (result.success) {
        toast({
          title: "Code promo appliqué !",
          description: result.message,
          variant: "default"
        });
      } else {
        toast({
          title: "Code promo invalide",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de valider le code promo",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        
                 {/* Header et Introduction */}
         <div className="text-center mb-16">
           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-4">
             <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
               <TrendingUp className="w-6 h-6 text-white" />
             </div>
             Planificateur de retraite
           </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Planifiez votre retraite avec des outils professionnels et des analyses avancées
          </p>
        </div>

        {/* Description du produit */}
        <Card className="mb-16 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-8">
                      <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
            Planification financière complète
          </CardTitle>
                     <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
             Notre plateforme unique vous permet de gérer l'ensemble de votre planification<br />
             financière, budgétaire et fiscale pour une retraite sereine et optimisée.
           </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-blue-600" />
                </div>
                                 <h3 className="font-semibold text-gray-900 mb-2">Gestion du flux de trésorerie (cashflow)</h3>
                <p className="text-sm text-gray-600">
                  Analysez et optimisez vos flux de dépenses pour maximiser vos économies
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Stratégies de décaissement</h3>
                <p className="text-sm text-gray-600">
                  Déterminez le meilleur moment pour retirer de vos investissements
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Planification des dépenses</h3>
                <p className="text-sm text-gray-600">
                  Évaluez l'impact des gros achats sur vos revenus futurs
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Optimisation fiscale</h3>
                <p className="text-sm text-gray-600">
                  Minimisez vos impôts avec des stratégies de retrait intelligentes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans et Prix */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nos plans annuels</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Plan Gratuit */}
            <Card className="relative bg-white border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Gratuit</CardTitle>
                <Badge variant="secondary" className="w-fit mx-auto">Essai</Badge>
                <CardDescription className="text-gray-600">
                  Commencez votre planification de retraite
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-4">0 $</div>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• Gestion du cashflow basique</li>
                  <li>• 1 projet de dépenses</li>
                  <li>• Planification de base</li>
                  <li>• Sauvegarde locale</li>
                </ul>
                <Button 
                  onClick={handleGoogleSignIn}
                  className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                >
                  Commencer Gratuitement
                </Button>
              </CardContent>
            </Card>

            {/* Plan Professionnel */}
            <Card className="relative bg-white border-2 border-blue-500 shadow-lg transform scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4 py-1">Recommandé</Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Professionnel</CardTitle>
                <CardDescription className="text-gray-600">
                  Pour une planification avancée
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">119,99 $</div>
                <div className="text-sm text-gray-500 mb-4">par an</div>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• Gestion du cashflow avancée</li>
                  <li>• Stratégies de décaissement</li>
                  <li>• 100 simulations Monte Carlo</li>
                  <li>• Projets de dépenses multiples</li>
                  <li>• Optimisation fiscale basique</li>
                </ul>
                <Button 
                  onClick={handleGoogleSignIn}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Choisir Professionnel
                </Button>
              </CardContent>
            </Card>

            {/* Plan Ultime */}
            <Card className="relative bg-white border-2 border-purple-500 hover:border-purple-600 transition-all duration-300 hover:shadow-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white px-4 py-1">Premium</Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Ultime</CardTitle>
                <CardDescription className="text-gray-600">
                  Solution complète avec IA
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">239,99 $</div>
                <div className="text-sm text-gray-500 mb-4">par an</div>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• Gestion du cashflow experte</li>
                  <li>• Stratégies de décaissement IA</li>
                  <li>• Simulations Monte Carlo illimitées</li>
                  <li>• Optimisation fiscale avancée</li>
                  <li>• Conseils IA personnalisés</li>
                </ul>
                <Button 
                  onClick={handleGoogleSignIn}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Choisir Ultime
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

                 {/* Avertissement légal */}
         <Card className="bg-amber-50 border-amber-200 mb-8">
           <CardHeader className="pb-3">
             <div className="flex items-center gap-2">
               <AlertTriangle className="h-5 w-5 text-amber-600" />
               <CardTitle className="text-lg text-amber-800">Avertissement important</CardTitle>
             </div>
           </CardHeader>
           <CardContent>
             <div className="text-sm text-amber-700 space-y-2">
               <p>
                 <strong>⚠️ Cette plateforme de planification financière est un outil éducatif et informatif 
                 qui ne remplace en aucun cas une consultation avec un professionnel qualifié.</strong>
               </p>
               <p>
                 <strong>VOS RESPONSABILITÉS :</strong>
               </p>
               <ul className="list-disc list-inside ml-4 space-y-1">
                 <li>Consultez un planificateur financier agréé pour vos décisions importantes</li>
                 <li>Vérifiez la validité fiscale de vos stratégies avec un fiscaliste</li>
                 <li>Obtenez des conseils juridiques pour la planification successorale</li>
               </ul>
               <p>
                 <strong>AVANTAGES DE NOTRE SOLUTION :</strong>
               </p>
               <ul className="list-disc list-inside ml-4 space-y-1">
                 <li>Économisez du temps en préparant votre dossier à l'avance</li>
                 <li>Réduisez le nombre de rencontres avec vos professionnels</li>
                 <li>Prenez le contrôle de vos finances avec des outils professionnels</li>
                 <li>Optimisez vos consultations grâce à une meilleure compréhension</li>
               </ul>
             </div>
           </CardContent>
         </Card>

         {/* Section Connexion */}
         {!user ? (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-900">
                Commencer maintenant
              </CardTitle>
              <CardDescription className="text-blue-700">
                Connectez-vous avec Google pour accéder à votre planification de retraite
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={handleGoogleSignIn}
                className="bg-white text-blue-700 border-blue-300 hover:bg-blue-50 px-8 py-4 text-lg font-medium mb-4"
                size="lg"
              >
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-3" />
                Continuer avec Google
              </Button>
              <div className="text-sm text-blue-600">
                Connexion sécurisée et privée
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Section Code Promo pour utilisateurs connectés sans plan */
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Crown className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-900">
                Bienvenue {user.displayName || user.email} !
              </CardTitle>
              <CardDescription className="text-green-700">
                Avez-vous un code promo ? Débloquez des fonctionnalités supplémentaires !
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <PromoCodeInput
                value={promoCode}
                onChange={setPromoCode}
                onSubmit={handlePromoCodeSubmit}
                onClear={clearPromoCode}
                appliedCode={appliedCode}
                placeholder="Entrez votre code promo..."
                className="max-w-md mx-auto"
              />
              <div className="mt-4 text-sm text-green-600">
                Codes populaires : TESTER100, Calvin2025
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RetraiteEntreeFr;
