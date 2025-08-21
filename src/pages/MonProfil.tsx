import React, { useState } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Heart, 
  Home, 
  Calendar,
  Users,
  Shield,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SeniorsNavigationHeader from '@/components/layout/header/SeniorsNavigationHeader';

const MonProfil: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';

  const [formData, setFormData] = useState({
    nom: '',
    age: '',
    situationFamiliale: '',
    sante: '',
    residence: '',
    objectifRetraite: '',
    epargneActuelle: '',
    revenusMensuels: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getProgressPercentage = () => {
    const filledFields = Object.values(formData).filter(value => value.trim() !== '').length;
    return Math.round((filledFields / Object.keys(formData).length) * 100);
  };

  const progress = getProgressPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Navigation seniors intégrée */}
      <SeniorsNavigationHeader />
      
      <div className="container mx-auto px-6 py-12">
        {/* En-tête bienveillant */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <User className="w-12 h-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              {isFrench ? 'Mon profil' : 'My profile'}
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {isFrench 
              ? 'Votre situation est unique, comme vous. Nous travaillons avec vos moyens réels, pas avec des rêves inaccessibles.'
              : 'Your situation is unique, just like you. We work with your real means, not with inaccessible dreams.'
            }
          </p>
        </div>

        {/* Barre de progression encourageante */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200 shadow-lg mb-8">
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-yellow-500" />
                <span className="text-lg font-semibold text-gray-800">
                  {isFrench ? 'Votre progression' : 'Your progress'}
                </span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {progress} %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {isFrench 
                ? `Excellent travail ! Vous avez complété ${progress} % de votre profil.`
                : `Great work! You have completed ${progress} % of your profile.`
              }
            </p>
          </CardContent>
        </Card>

        {/* Formulaire bienveillant */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations personnelles */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-800">
                <Heart className="w-6 h-6" />
                {isFrench ? 'Informations personnelles' : 'Personal information'}
              </CardTitle>
              <p className="text-gray-600">
                {isFrench 
                  ? 'Chaque détail compte pour personnaliser votre plan'
                  : 'Every detail counts to personalize your plan'
                }
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nom" className="text-gray-700">
                  {isFrench ? 'Nom complet' : 'Full name'}
                </Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder={isFrench ? 'Votre nom' : 'Your name'}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="age" className="text-gray-700">
                  {isFrench ? 'Âge' : 'Age'}
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder={isFrench ? 'Votre âge' : 'Your age'}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="situationFamiliale" className="text-gray-700">
                  {isFrench ? 'Situation familiale' : 'Family situation'}
                </Label>
                <Textarea
                  id="situationFamiliale"
                  value={formData.situationFamiliale}
                  onChange={(e) => handleInputChange('situationFamiliale', e.target.value)}
                  placeholder={isFrench ? 'Célibataire, marié(e), enfants...' : 'Single, married, children...'}
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="sante" className="text-gray-700">
                  {isFrench ? 'État de santé' : 'Health status'}
                </Label>
                <Textarea
                  id="sante"
                  value={formData.sante}
                  onChange={(e) => handleInputChange('sante', e.target.value)}
                  placeholder={isFrench ? 'Bon, excellent, quelques problèmes...' : 'Good, excellent, some issues...'}
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="residence" className="text-gray-700">
                  {isFrench ? 'Lieu de résidence' : 'Residence'}
                </Label>
                <Input
                  id="residence"
                  value={formData.residence}
                  onChange={(e) => handleInputChange('residence', e.target.value)}
                  placeholder={isFrench ? 'Ville, province' : 'City, province'}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Situation financière */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-800">
                <Shield className="w-6 h-6" />
                {isFrench ? 'Situation financière' : 'Financial situation'}
              </CardTitle>
              <p className="text-gray-600">
                {isFrench 
                  ? 'Soyez honnête, nous ne jugeons pas. Chaque situation mérite respect.'
                  : 'Be honest, we don\'t judge. Every situation deserves respect.'
                }
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="objectifRetraite" className="text-gray-700">
                  {isFrench ? 'Objectif de retraite' : 'Retirement goal'}
                </Label>
                <Textarea
                  id="objectifRetraite"
                  value={formData.objectifRetraite}
                  onChange={(e) => handleInputChange('objectifRetraite', e.target.value)}
                  placeholder={isFrench ? 'Vivre confortablement, voyager, rester près de la famille...' : 'Live comfortably, travel, stay close to family...'}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="epargneActuelle" className="text-gray-700">
                  {isFrench ? 'Épargne actuelle' : 'Current savings'}
                </Label>
                <Input
                  id="epargneActuelle"
                  value={formData.epargneActuelle}
                  onChange={(e) => handleInputChange('epargneActuelle', e.target.value)}
                  placeholder={isFrench ? 'Montant en dollars' : 'Amount in dollars'}
                  className="mt-1"
                />
                <p className="text-sm text-green-600 mt-1">
                  {isFrench 
                    ? 'Chaque dollar compte ! Votre épargne actuelle est un excellent début.'
                    : 'Every dollar counts! Your current savings are an excellent start.'
                  }
                </p>
              </div>

              <div>
                <Label htmlFor="revenusMensuels" className="text-gray-700">
                  {isFrench ? 'Revenus mensuels' : 'Monthly income'}
                </Label>
                <Input
                  id="revenusMensuels"
                  value={formData.revenusMensuels}
                  onChange={(e) => handleInputChange('revenusMensuels', e.target.value)}
                  placeholder={isFrench ? 'Salaire, pensions, autres revenus' : 'Salary, pensions, other income'}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message d'encouragement */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 mt-8">
          <CardContent className="py-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {isFrench ? 'Félicitations pour chaque étape !' : 'Congratulations for every step!'}
              </h2>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              {isFrench 
                ? 'Vous construisez votre avenir financier avec courage et détermination. Chaque information que vous partagez nous aide à mieux vous accompagner.'
                : 'You are building your financial future with courage and determination. Every piece of information you share helps us better support you.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => handleNavigation('/')}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                {isFrench ? 'Retour à l\'accueil' : 'Back to home'}
              </Button>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                onClick={() => handleNavigation('/ma-retraite')}
              >
                {isFrench ? 'Continuer vers ma retraite' : 'Continue to my retirement'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonProfil;
