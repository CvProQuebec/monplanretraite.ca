// src/pages/RetraiteFr.tsx
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
import { translations } from '../features/retirement/translations';
import { RetirementNavigation } from '../features/retirement';

const RetraiteFr: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Navigation Phase 1 Intégrée */}
      <RetirementNavigation />
      
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Planificateur de retraite
        </h1>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
          Planifiez votre retraite avec des outils professionnels et des analyses avancées
        </p>
      </div>

      {/* Section Planification financière complète */}
      <div className="bg-white rounded-3xl mx-6 mb-12 shadow-2xl">
        <div className="container mx-auto px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Planification financière complète
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Notre plateforme unique vous permet de gérer l'ensemble de votre planification financière, budgétaire et fiscale pour une retraite sereine et optimisée.
            </p>
          </div>

          {/* Grille des 4 services principaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Gestion du flux de trésorerie */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-800">
                  Gestion du flux de trésorerie (cashflow)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Analysez et optimisez vos flux de trésorerie pour maximiser vos économies et assurer une stabilité financière tout au long de votre retraite.
                </p>
              </CardContent>
            </Card>

            {/* Stratégies de décaissement */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-green-200">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-800">
                  Stratégies de décaissement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Développez des stratégies optimales de décaissement pour vos investissements et maximisez la durée de vie de votre épargne-retraite.
                </p>
              </CardContent>
            </Card>

            {/* Planification des dépenses */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <PieChart className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-800">
                  Planification des dépenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Évaluez l'impact des gros dépenses sur vos objectifs de retraite et planifiez vos achats importants en toute sérénité.
                </p>
              </CardContent>
            </Card>

            {/* Optimisation fiscale */}
            <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-indigo-200">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-indigo-600" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-800">
                  Optimisation fiscale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Maximisez votre épargne avec des stratégies de placement fiscalement avantageuses et réduisez votre fardeau fiscal à la retraite.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Avantages supplémentaires */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Pourquoi choisir notre solution ?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Objectifs personnalisés</h4>
                  <p className="text-sm text-gray-600">Définissez vos objectifs de retraite selon votre style de vie souhaité</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Outils professionnels</h4>
                  <p className="text-sm text-gray-600">Accédez aux mêmes outils que les conseillers financiers professionnels</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Sécurité garantie</h4>
                  <p className="text-sm text-gray-600">Vos données sont protégées avec un chiffrement de niveau bancaire</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Santé et bien-être</h4>
                  <p className="text-sm text-gray-600">Planifiez vos dépenses de santé et maintenez votre qualité de vie</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Plane className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Projets de retraite</h4>
                  <p className="text-sm text-gray-600">Voyages, loisirs, projets personnels - planifiez tout ce qui vous tient à cœur</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Home className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Patrimoine familial</h4>
                  <p className="text-sm text-gray-600">Optimisez la transmission de votre patrimoine à vos proches</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Comparaison des plans - Version améliorée */}
      <div className="bg-white rounded-3xl mx-6 mb-12 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-8">
          <h2 className="text-3xl font-bold mb-4">Comparaison des plans</h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Découvrez ce qui est inclus dans chaque plan et choisissez celui qui correspond à vos besoins
          </p>
        </div>

        <div className="p-8">
          {/* Version desktop - Tableau comparatif */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-800">Fonctionnalité</th>
                    <th className="text-center py-4 px-6">
                      <div className="flex flex-col items-center">
                        <Badge variant="secondary" className="mb-2">Gratuit</Badge>
                        <div className="text-2xl font-bold text-gray-800">0 $</div>
                      </div>
                    </th>
                    <th className="text-center py-4 px-6 bg-blue-50 rounded-t-lg relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-600 text-white">Recommandé</Badge>
                      </div>
                      <div className="flex flex-col items-center mt-2">
                        <Badge className="mb-2 bg-blue-600">Professionnel</Badge>
                        <div className="text-2xl font-bold text-blue-800">119,99 $</div>
                        <div className="text-sm text-gray-600">/an</div>
                      </div>
                    </th>
                    <th className="text-center py-4 px-6">
                      <div className="flex flex-col items-center">
                        <Badge className="mb-2 bg-purple-600">Ultimate</Badge>
                        <div className="text-2xl font-bold text-purple-800">239,99 $</div>
                        <div className="text-sm text-gray-600">/an</div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Planification de base', free: true, pro: true, ultimate: true },
                    { feature: 'Gestion du profil personnel', free: true, pro: true, ultimate: true },
                    { feature: 'Calculs de retraite de base', free: true, pro: true, ultimate: true },
                    { feature: 'Gestion de l\'épargne', free: true, pro: true, ultimate: true },
                    { feature: 'Gestion du cashflow', free: true, pro: true, ultimate: true },
                    { feature: 'Projets de dépenses', free: true, pro: true, ultimate: true },
                    { feature: 'Stratégies de décaissement', free: false, pro: true, ultimate: true },
                    { feature: 'Simulations Monte Carlo', free: false, pro: true, ultimate: true },
                    { feature: 'Optimisation fiscale', free: false, pro: true, ultimate: true },
                    { feature: 'Conseils personnalisés par IA', free: false, pro: false, ultimate: true },
                    { feature: 'Rapports détaillés', free: false, pro: false, ultimate: true },
                    { feature: 'Export PDF', free: false, pro: false, ultimate: true },
                    { feature: 'Support prioritaire', free: false, pro: false, ultimate: true }
                  ].map((row, index) => (
                    <tr key={index} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                      <td className="py-4 px-6 font-medium text-gray-800">{row.feature}</td>
                      <td className="py-4 px-6 text-center">
                        {row.free ? (
                          <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-400 mx-auto" />
                        )}
                      </td>
                      <td className={`py-4 px-6 text-center ${index % 2 === 0 ? 'bg-blue-50/50' : 'bg-blue-50/30'}`}>
                        {row.pro ? (
                          <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-400 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {row.ultimate ? (
                          <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-400 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Boutons d'action */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/fr/retraite-module-phase1')}
                  className="w-full"
                >
                  Commencer gratuitement
                </Button>
              </div>
              <div className="text-center">
                <Button 
                  size="lg" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate('/fr/retraite-module')}
                >
                  Choisir Professionnel
                </Button>
              </div>
              <div className="text-center">
                <Button 
                  size="lg" 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => navigate('/fr/retraite-module')}
                >
                  Choisir Ultimate
                </Button>
              </div>
            </div>
          </div>

          {/* Version mobile/tablette - Cards empilées */}
          <div className="lg:hidden space-y-6">
            {/* Plan Gratuit */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center bg-gray-50">
                <Badge variant="secondary" className="w-fit mx-auto mb-2">Gratuit</Badge>
                <CardTitle className="text-2xl">0 $</CardTitle>
                <CardDescription>Commencez votre planification retraite</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Planification de base</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Gestion du profil personnel</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Calculs de retraite de base</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Gestion de l'épargne</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Gestion du cashflow</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Projets de dépenses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-gray-400">Stratégies de décaissement</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-gray-400">Simulations Monte Carlo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-gray-400">Optimisation fiscale</span>
                  </div>
                </div>
                <Button className="w-full mt-6" onClick={() => navigate('/fr/retraite-module-phase1')}>
                  Commencer gratuitement
                </Button>
              </CardContent>
            </Card>

            {/* Plan Professionnel */}
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">Recommandé</Badge>
              </div>
              <CardHeader className="text-center bg-blue-50">
                <Badge variant="default" className="w-fit mx-auto mb-2 bg-blue-600">Professionnel</Badge>
                <CardTitle className="text-2xl">119,99 $ <span className="text-sm font-normal text-gray-600">/an</span></CardTitle>
                <CardDescription>Pour une planification avancée</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Gestion avancée du cashflow</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Stratégies de décaissement</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">100 simulations Monte Carlo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Projets de dépenses multiples</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Optimisation fiscale de base</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-gray-400">Conseils personnalisés par IA</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-gray-400">Rapports détaillés</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-gray-400">Export PDF</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-gray-400">Support prioritaire</span>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/fr/retraite-module')}>
                  Choisir Professionnel
                </Button>
              </CardContent>
            </Card>

            {/* Plan Ultimate */}
            <Card className="relative border-2 border-purple-500 shadow-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white">Solution complète avec IA</Badge>
              </div>
              <CardHeader className="text-center bg-purple-50">
                <CardTitle className="text-3xl font-bold mb-2 text-purple-800">239,99 $</CardTitle>
                <CardDescription>Premium</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Gestion experte du cashflow</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Stratégies de décaissement avec IA</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Simulations Monte Carlo illimitées</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Optimisation fiscale avancée</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Conseils personnalisés par IA</span>
                </div>
                <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700" onClick={() => navigate('/fr/retraite-module')}>
                  Choisir Ultimate
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Section Avertissement important */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-2xl mx-6 mb-12 shadow-lg">
        <div className="container mx-auto px-8 py-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-yellow-800 mb-4">Avertissement important</h3>
              <p className="text-yellow-700 mb-6">
                Cette plateforme de planification financière est un outil éducatif et informatif qui ne remplace en aucun cas une consultation avec un professionnel qualifié.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-3">VOS RESPONSABILITÉS :</h4>
                  <ul className="space-y-2 text-sm text-yellow-700">
                    <li>• Consultez un planificateur financier autorisé pour les décisions importantes</li>
                    <li>• Vérifiez la validité fiscale de vos stratégies avec un comptable qualifié</li>
                    <li>• Obtenez des conseils juridiques pour la planification successorale</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-3">AVANTAGES DE NOTRE SOLUTION :</h4>
                  <ul className="space-y-2 text-sm text-yellow-700">
                    <li>• Gagnez du temps en préparant vos données à l'avance</li>
                    <li>• Réduisez le nombre de rencontres avec vos conseillers</li>
                    <li>• Améliorez le contrôle de vos finances avec des outils professionnels</li>
                    <li>• Optimisez vos consultations à une meilleure compréhension</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section finale - Call to action */}
      <div className="text-center pb-16">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl mx-6 p-12 text-white shadow-2xl">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-green-600">M</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Bienvenue Gerald Dore !</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Avec notre code promo : Débloquez des fonctionnalités supplémentaires !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <input 
              type="text" 
              placeholder="Entrez votre code promo"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 border-0 focus:ring-2 focus:ring-white"
            />
            <Button 
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8"
            >
              Appliquer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetraiteFr;
