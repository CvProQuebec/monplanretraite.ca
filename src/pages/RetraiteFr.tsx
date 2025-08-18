// src/pages/RetraiteFr.tsx
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Shield, TrendingUp, Crown, Zap, FileText, Users, Calculator, Target, Check, ArrowRight, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import { PromoCodeInput } from '../components/ui/promo-code-input';
import { usePromoCode } from '../hooks/usePromoCode';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/header';

const RetraiteFr: React.FC = () => {
  const { user, signInWithGoogle, signOut } = useAuth();
  const { toast } = useToast();
  const { promoCode, setPromoCode, appliedCode, applyPromoCode, clearPromoCode } = usePromoCode();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre planificateur de retraite !",
        variant: "default"
      });
      // Rediriger vers le module complet après connexion
      navigate('/retraite-module');
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

  const handleAccessModule = () => {
    if (user) {
      navigate('/fr/retraite-module');
    } else {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour accéder au module complet",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erreur de déconnexion",
        description: "Impossible de se déconnecter. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header seulement, sans footer */}
      <Header isEnglish={false} />
      <div className="pt-24">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          
          {/* Indicateur de connexion en haut de la page */}
          {user && (
            <div className="flex justify-end mb-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">
                    Connecté en tant que:
                  </span>
                  <span className="font-medium text-green-800">
                    {user.displayName || user.email}
                  </span>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnecter
                </Button>
              </div>
            </div>
          )}
          
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

          {/* Section Connexion Google */}
          <Card className="mb-16 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                Commencez votre planification
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
                Connectez-vous avec votre compte Google pour accéder à tous les outils de planification de retraite
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!user ? (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <Button
                      onClick={handleGoogleSignIn}
                      className="bg-white text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-medium border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-6 h-6 mr-3" />
                      Se connecter avec Google
                    </Button>
                  </div>
                  
                  {/* Code promo optionnel */}
                  <div className="mt-6">
                    <div className="text-center">
                      <p className="text-gray-600 mb-3">Avez-vous un code promo ?</p>
                      <div className="flex justify-center gap-2 max-w-md mx-auto">
                        <PromoCodeInput
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Code promo (optionnel)"
                          className="flex-1"
                        />
                        <Button
                          onClick={handlePromoCodeSubmit}
                          variant="outline"
                          size="sm"
                          disabled={!promoCode.trim()}
                        >
                          Appliquer
                        </Button>
                      </div>
                      {appliedCode && (
                        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-700 text-sm">
                            Code promo appliqué : {appliedCode}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearPromoCode}
                              className="ml-2 text-green-600 hover:text-green-800"
                            >
                              Supprimer
                            </Button>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-3 text-green-600">
                    <Check className="w-8 h-8" />
                    <span className="text-xl font-medium">Vous êtes connecté !</span>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => navigate('/fr/retraite-module-phase1')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      🚀 Accéder au module complet
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tableau des fonctionnalités par plan */}
          <Card className="mb-16 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                Comparaison des plans
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
                Découvrez ce qui est inclus dans chaque plan et choisissez celui qui correspond à vos besoins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-4 px-6 text-left font-bold text-gray-900 text-lg">Fonctionnalité</th>
                      <th className="py-4 px-6 text-center font-bold text-gray-900 text-lg">
                        <div className="flex flex-col items-center">
                          <span>Gratuit</span>
                          <Badge variant="secondary" className="mt-1">Gratuit</Badge>
                        </div>
                      </th>
                      <th className="py-4 px-6 text-center font-bold text-gray-900 text-lg">
                        <div className="flex flex-col items-center">
                          <span>Professionnel</span>
                          <Badge variant="default" className="mt-1 bg-blue-600">$29/mois</Badge>
                        </div>
                      </th>
                      <th className="py-4 px-6 text-center font-bold text-gray-900 text-lg">
                        <div className="flex flex-col items-center">
                          <span>Ultime</span>
                          <Badge variant="default" className="mt-1 bg-purple-600">$99/mois</Badge>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Planification de base</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Gestion du profil personnel</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Calculs de retraite de base</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Gestion de l'épargne</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Module d'urgence</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Gestion des sessions</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Analyse du flux de trésorerie (Cashflow)</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Calculs CPP et RRQ</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Optimisation fiscale</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Simulateur Monte Carlo</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Génération de rapports</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Planification successorale avancée</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Collaboration et partage</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Simulations financières avancées</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
              <CardContent className="py-12">
                <h2 className="text-3xl font-bold mb-4">Prêt à planifier votre retraite ?</h2>
                <p className="text-xl mb-8 opacity-90">
                  Commencez dès aujourd'hui avec notre plateforme complète de planification financière
                </p>
                {!user ? (
                  <Button
                    onClick={handleGoogleSignIn}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
                  >
                    <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-6 h-6 mr-3" />
                    Commencer maintenant
                  </Button>
                ) : (
                  <Button
                    onClick={handleAccessModule}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
                  >
                    Accéder au module complet
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetraiteFr;