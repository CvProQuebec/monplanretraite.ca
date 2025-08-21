import React, { useState } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Trophy, 
  Star, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Download,
  Share2,
  Heart,
  Shield,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SeniorsNavigationHeader from '@/components/layout/header/SeniorsNavigationHeader';

const MesResultats: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';

  // Données simulées pour la démonstration
  const [userData] = useState({
    nom: 'Marie',
    age: 58,
    epargneActuelle: 45000,
    revenusMensuels: 3200,
    depensesMensuelles: 2800,
    objectifRetraite: 65,
    planActuel: 'free' as 'free' | 'professional' | 'ultimate'
  });

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getProgressPercentage = () => {
    // Calcul basé sur l'âge et l'épargne
    const ageProgress = ((userData.age - 25) / (userData.objectifRetraite - 25)) * 100;
    const epargneProgress = Math.min((userData.epargneActuelle / 100000) * 100, 100);
    return Math.round((ageProgress + epargneProgress) / 2);
  };

  const getRetirementScore = () => {
    const progress = getProgressPercentage();
    if (progress >= 80) return { score: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (progress >= 60) return { score: 'Bon', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (progress >= 40) return { score: 'En développement', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { score: 'Débutant', color: 'text-orange-600', bg: 'bg-orange-100' };
  };

  const getNextSteps = () => {
    const progress = getProgressPercentage();
    if (progress < 40) {
      return isFrench 
        ? ['Commencer à épargner régulièrement', 'Établir un budget mensuel', 'Consulter un conseiller financier']
        : ['Start saving regularly', 'Establish a monthly budget', 'Consult a financial advisor'];
    } else if (progress < 60) {
      return isFrench
        ? ['Augmenter vos cotisations REER', 'Diversifier vos investissements', 'Planifier vos dépenses de retraite']
        : ['Increase your RRSP contributions', 'Diversify your investments', 'Plan your retirement expenses'];
    } else if (progress < 80) {
      return isFrench
        ? ['Optimiser votre stratégie de retraite', 'Considérer un plan Professionnel', 'Planifier la succession']
        : ['Optimize your retirement strategy', 'Consider a Professional plan', 'Plan for succession'];
    } else {
      return isFrench
        ? ['Maintenir votre excellent niveau', 'Considérer un plan Ultimate', 'Partager votre expérience']
        : ['Maintain your excellent level', 'Consider an Ultimate plan', 'Share your experience'];
    }
  };

  const progress = getProgressPercentage();
  const score = getRetirementScore();
  const nextSteps = getNextSteps();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Navigation seniors intégrée */}
      <SeniorsNavigationHeader />
      
      <div className="container mx-auto px-6 py-12">
        {/* En-tête de félicitations */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Trophy className="w-16 h-16 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-900">
              {isFrench ? 'Mes résultats' : 'My results'}
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {isFrench 
              ? 'Félicitations pour chaque étape accomplie ! Votre plan de retraite prend forme et reflète votre situation unique.'
              : 'Congratulations for every step accomplished! Your retirement plan is taking shape and reflects your unique situation.'
            }
          </p>
        </div>

        {/* Score de retraite */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-yellow-200 shadow-lg mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800 mb-2">
              {isFrench ? 'Votre score de retraite' : 'Your retirement score'}
            </CardTitle>
            <div className="flex items-center justify-center gap-4">
              <Badge className={`text-lg px-6 py-2 ${score.bg} ${score.color} border-2`}>
                {score.score}
              </Badge>
              <div className="text-4xl font-bold text-gray-800">
                {progress} %
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-3 mb-4" />
            <p className="text-center text-gray-600">
              {isFrench 
                ? `Vous êtes sur la bonne voie ! Votre progression de ${progress} % montre votre engagement envers votre avenir financier.`
                : `You're on the right track! Your ${progress} % progress shows your commitment to your financial future.`
              }
            </p>
          </CardContent>
        </Card>

        {/* Résumé de la situation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Informations personnelles */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-800">
                <Heart className="w-6 h-6" />
                {isFrench ? 'Votre situation actuelle' : 'Your current situation'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{isFrench ? 'Nom' : 'Name'}</span>
                <span className="font-semibold">{userData.nom}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{isFrench ? 'Âge' : 'Age'}</span>
                <span className="font-semibold">{userData.age} {isFrench ? 'ans' : 'years'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{isFrench ? 'Plan actuel' : 'Current plan'}</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {isFrench ? 'Gratuit' : 'Free'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{isFrench ? 'Objectif retraite' : 'Retirement goal'}</span>
                <span className="font-semibold">{userData.objectifRetraite} {isFrench ? 'ans' : 'years'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Résumé financier */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-800">
                <DollarSign className="w-6 h-6" />
                {isFrench ? 'Résumé financier' : 'Financial summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{isFrench ? 'Épargne actuelle' : 'Current savings'}</span>
                <span className="font-semibold text-green-600">
                  {userData.epargneActuelle.toLocaleString()} $
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{isFrench ? 'Revenus mensuels' : 'Monthly income'}</span>
                <span className="font-semibold text-blue-600">
                  {userData.revenusMensuels.toLocaleString()} $
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{isFrench ? 'Dépenses mensuelles' : 'Monthly expenses'}</span>
                <span className="font-semibold text-red-600">
                  {userData.depensesMensuelles.toLocaleString()} $
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{isFrench ? 'Épargne mensuelle' : 'Monthly savings'}</span>
                <span className="font-semibold text-green-600">
                  {(userData.revenusMensuels - userData.depensesMensuelles).toLocaleString()} $
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prochaines étapes */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-purple-800">
              <Target className="w-6 h-6" />
              {isFrench ? 'Prochaines étapes recommandées' : 'Recommended next steps'}
            </CardTitle>
            <p className="text-gray-600">
              {isFrench 
                ? 'Ces actions vous aideront à améliorer votre score de retraite et à atteindre vos objectifs.'
                : 'These actions will help you improve your retirement score and reach your goals.'
              }
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nextSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-700 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Plan de retraite personnalisé */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-blue-800">
              <Star className="w-6 h-6" />
              {isFrench ? 'Votre plan de retraite personnalisé' : 'Your personalized retirement plan'}
            </CardTitle>
            <p className="text-gray-600">
              {isFrench 
                ? 'Basé sur votre situation unique, voici ce que nous recommandons pour optimiser votre retraite.'
                : 'Based on your unique situation, here\'s what we recommend to optimize your retirement.'
              }
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">
                  {isFrench ? 'Timing optimal' : 'Optimal timing'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isFrench 
                    ? `Retraite recommandée : ${userData.objectifRetraite} ans`
                    : `Recommended retirement: ${userData.objectifRetraite} years`
                  }
                </p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">
                  {isFrench ? 'Stratégie d\'épargne' : 'Savings strategy'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isFrench 
                    ? `${(userData.revenusMensuels - userData.depensesMensuelles).toLocaleString()} $/mois`
                    : `${(userData.revenusMensuels - userData.depensesMensuelles).toLocaleString()} $/month`
                  }
                </p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                <Shield className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">
                  {isFrench ? 'Niveau de risque' : 'Risk level'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isFrench ? 'Modéré' : 'Moderate'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions et navigation */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
          <CardContent className="py-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {isFrench ? 'Que souhaitez-vous faire maintenant ?' : 'What would you like to do now?'}
              </h2>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              {isFrench 
                ? 'Votre plan de retraite est en cours de construction. Chaque action vous rapproche de vos objectifs !'
                : 'Your retirement plan is under construction. Every action brings you closer to your goals!'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => handleNavigation('/ma-retraite')}
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                {isFrench ? 'Modifier ma retraite' : 'Modify my retirement'}
              </Button>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={() => handleNavigation('/')}
              >
                {isFrench ? 'Retour à l\'accueil' : 'Back to home'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MesResultats;
