import React from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Lightbulb,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OptimiserTransmissionCeli: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';

  return (
    <div className="min-h-screen bg-gradient-to-br from-mpr-interactive-lt via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Back Button */}
          <Button 
            onClick={() => navigate('/blog')}
            variant="ghost" 
            className="mb-6 text-mpr-interactive hover:text-mpr-navy"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isFrench ? 'Retour au Blog' : 'Back to Blog'}
          </Button>

          {/* Article Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-mpr-interactive-lt text-mpr-navy px-3 py-1 rounded-full text-sm font-semibold mb-4">
                📚 {isFrench ? 'Guide pratique' : 'Practical Guide'}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {isFrench 
                  ? 'Comment Optimiser la Transmission de Votre CÉLI'
                  : 'How to Optimize Your TFSA Transmission'
                }
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {isFrench 
                  ? 'Découvrez les stratégies d\'experts pour maximiser la transmission de votre CÉLI à vos héritiers tout en évitant les pièges fiscaux.'
                  : 'Discover expert strategies to maximize your TFSA transmission to your heirs while avoiding tax traps.'
                }
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{isFrench ? '8 min de lecture' : '8 min read'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{isFrench ? 'Équipe MPR' : 'MPR Team'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{isFrench ? 'Mis à jour récemment' : 'Recently updated'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            
            {/* Introduction */}
            <div className="mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                {isFrench 
                  ? 'Le Compte d\'épargne libre d\'impôt (CÉLI) est l\'un des véhicules d\'épargne les plus avantageux au Canada. Mais saviez-vous que sa transmission peut être optimisée pour maximiser les avantages fiscaux de vos héritiers ?'
                  : 'The Tax-Free Savings Account (TFSA) is one of the most advantageous savings vehicles in Canada. But did you know that its transmission can be optimized to maximize the tax benefits for your heirs?'
                }
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-semibold mb-1">
                      {isFrench ? 'Point important' : 'Important Point'}
                    </p>
                    <p className="text-yellow-700 text-sm">
                      {isFrench 
                        ? 'Une mauvaise planification de la transmission de votre CÉLI peut faire perdre des milliers de dollars d\'avantages fiscaux à vos héritiers.'
                        : 'Poor planning of your TFSA transmission can cost your heirs thousands of dollars in tax benefits.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 1: Les Bases */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-mpr-interactive-lt rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-mpr-interactive" />
                </div>
                {isFrench ? 'Les bases de la transmission CÉLI' : 'TFSA Transmission Basics'}
              </h2>
              <p className="text-gray-700 mb-4">
                {isFrench 
                  ? 'Contrairement aux idées reçues, le CÉLI ne se transmet pas automatiquement en franchise d\'impôt. Voici ce que vous devez savoir :'
                  : 'Contrary to popular belief, the TFSA is not automatically transmitted tax-free. Here\'s what you need to know:'
                }
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      {isFrench ? 'Bénéficiaire successeur' : 'Successor Holder'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 text-sm">
                      {isFrench 
                        ? 'Votre conjoint peut devenir le nouveau titulaire du CÉLI sans impact fiscal, préservant tous les avantages.'
                        : 'Your spouse can become the new TFSA holder without tax impact, preserving all benefits.'
                      }
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      {isFrench ? 'Autres héritiers' : 'Other Heirs'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-700 text-sm">
                      {isFrench 
                        ? 'Les enfants ou autres héritiers reçoivent la valeur en espèces, mais perdent l\'espace de cotisation CÉLI.'
                        : 'Children or other heirs receive the cash value but lose the TFSA contribution room.'
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Section 2: Stratégies d'Optimisation */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                {isFrench ? 'Stratégies d\'optimisation' : 'Optimization Strategies'}
              </h2>
              
              <div className="space-y-6">
                {/* Stratégie 1 */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-mpr-navy">
                      1. {isFrench ? 'Nommer un titulaire successeur' : 'Name a Successor Holder'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3">
                      {isFrench 
                        ? 'La stratégie la plus efficace consiste à désigner votre conjoint comme titulaire successeur plutôt que simple bénéficiaire.'
                        : 'The most effective strategy is to designate your spouse as successor holder rather than just beneficiary.'
                      }
                    </p>
                    <div className="bg-mpr-interactive-lt p-4 rounded-lg">
                      <h4 className="font-semibold text-mpr-navy mb-2">
                        {isFrench ? 'Avantages :' : 'Benefits:'}
                      </h4>
                      <ul className="space-y-1 text-mpr-navy text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {isFrench ? 'Aucun impact fiscal immédiat' : 'No immediate tax impact'}
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {isFrench ? 'Préservation de l\'espace de cotisation' : 'Preservation of contribution room'}
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {isFrench ? 'Croissance continue à l\'abri de l\'impôt' : 'Continued tax-free growth'}
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Stratégie 2 */}
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-900">
                      2. {isFrench ? 'Éviter les erreurs de désignation' : 'Avoid Designation Errors'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3">
                      {isFrench 
                        ? 'Les erreurs de désignation sont coûteuses. Voici les pièges à éviter absolument :'
                        : 'Designation errors are costly. Here are the traps to absolutely avoid:'
                      }
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          {isFrench ? 'À Éviter' : 'To Avoid'}
                        </h4>
                        <ul className="space-y-1 text-red-800 text-sm">
                          <li>• {isFrench ? 'Désigner les enfants comme bénéficiaires directs' : 'Designating children as direct beneficiaries'}</li>
                          <li>• {isFrench ? 'Oublier de mettre à jour après divorce' : 'Forgetting to update after divorce'}</li>
                          <li>• {isFrench ? 'Ne pas coordonner avec le testament' : 'Not coordinating with the will'}</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          {isFrench ? 'Recommandé' : 'Recommended'}
                        </h4>
                        <ul className="space-y-1 text-green-800 text-sm">
                          <li>• {isFrench ? 'Conjoint comme titulaire successeur' : 'Spouse as successor holder'}</li>
                          <li>• {isFrench ? 'Révision annuelle des désignations' : 'Annual review of designations'}</li>
                          <li>• {isFrench ? 'Coordination avec planification globale' : 'Coordination with overall planning'}</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stratégie 3 */}
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-purple-900">
                      3. {isFrench ? 'Maximiser la transmission Tax-Free' : 'Maximize Tax-Free Transmission'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3">
                      {isFrench 
                        ? 'Pour les héritiers autres que le conjoint, voici comment optimiser la transmission :'
                        : 'For heirs other than spouse, here\'s how to optimize transmission:'
                      }
                    </p>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-3">
                        {isFrench ? 'Stratégie en 3 étapes :' : '3-Step Strategy:'}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                          <div>
                            <p className="font-semibold text-purple-900">
                              {isFrench ? 'Paiement exempt' : 'Exempt Payment'}
                            </p>
                            <p className="text-purple-800 text-sm">
                              {isFrench 
                                ? 'La valeur au décès est transmise en franchise d\'impôt'
                                : 'The value at death is transmitted tax-free'
                              }
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                          <div>
                            <p className="font-semibold text-purple-900">
                              {isFrench ? 'Cotisation immédiate' : 'Immediate Contribution'}
                            </p>
                            <p className="text-purple-800 text-sm">
                              {isFrench 
                                ? 'L\'héritier cotise immédiatement dans son propre CÉLI'
                                : 'The heir immediately contributes to their own TFSA'
                              }
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                          <div>
                            <p className="font-semibold text-purple-900">
                              {isFrench ? 'Préservation partielle' : 'Partial Preservation'}
                            </p>
                            <p className="text-purple-800 text-sm">
                              {isFrench 
                                ? 'Une partie des avantages fiscaux est préservée'
                                : 'Part of the tax benefits is preserved'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Section 3: Cas Pratique */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                {isFrench ? 'Exemple concret' : 'Concrete Example'}
              </h2>
              
              <Card className="bg-gradient-to-r from-green-50 to-mpr-interactive-lt border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="text-xl text-green-900">
                    {isFrench ? 'Famille Tremblay : Optimisation réussie' : 'Tremblay Family: Successful Optimization'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {isFrench ? 'Situation :' : 'Situation:'}
                      </h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• {isFrench ? 'CÉLI de 95 000 $' : 'TFSA of $95,000'}</li>
                        <li>• {isFrench ? 'Conjoint survivant' : 'Surviving spouse'}</li>
                        <li>• {isFrench ? '2 enfants adultes' : '2 adult children'}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {isFrench ? 'Stratégie Appliquée :' : 'Applied Strategy:'}
                      </h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• {isFrench ? 'Conjoint = titulaire successeur' : 'Spouse = successor holder'}</li>
                        <li>• {isFrench ? 'Enfants = bénéficiaires secondaires' : 'Children = secondary beneficiaries'}</li>
                        <li>• {isFrench ? 'Révision annuelle' : 'Annual review'}</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-green-300">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {isFrench ? 'Résultat :' : 'Result:'}
                    </h4>
                    <p className="text-green-800 font-semibold">
                      {isFrench 
                        ? '✅ 95 000 $ transmis en franchise d\'impôt + préservation de l\'espace de cotisation'
                        : '✅ $95,000 transmitted tax-free + preservation of contribution room'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Points Clés à Retenir */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                </div>
                {isFrench ? 'Points clés à retenir' : 'Key Takeaways'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: isFrench ? 'Nommez un titulaire successeur' : 'Name a successor holder',
                    desc: isFrench ? 'Évitez les erreurs coûteuses de désignation' : 'Avoid costly designation errors'
                  },
                  {
                    title: isFrench ? 'Évitez les erreurs coûteuses' : 'Avoid costly mistakes',
                    desc: isFrench ? 'Protégez contre les frais d\'homologation' : 'Protect against probate fees'
                  },
                  {
                    title: isFrench ? 'Maximisez la transmission tax-free' : 'Maximize tax-free transmission',
                    desc: isFrench ? 'Préservez les avantages fiscaux' : 'Preserve tax benefits'
                  },
                  {
                    title: isFrench ? 'Protégez contre l\'homologation' : 'Protect against probate',
                    desc: isFrench ? 'Coordonnez avec votre planification globale' : 'Coordinate with your overall planning'
                  }
                ].map((point, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500 bg-mpr-interactive-lt">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-mpr-navy mb-1">{point.title}</h4>
                      <p className="text-mpr-navy text-sm">{point.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-mpr-interactive to-mpr-navy-mid rounded-2xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">
                {isFrench ? 'Prêt à optimiser votre CÉLI ?' : 'Ready to Optimize Your TFSA?'}
              </h3>
              <p className="text-mpr-interactive-lt mb-6 max-w-2xl mx-auto">
                {isFrench 
                  ? 'Utilisez nos outils professionnels pour planifier efficacement la transmission de votre CÉLI'
                  : 'Use our professional tools to efficiently plan your TFSA transmission'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/planification-successorale')}
                  className="bg-white text-mpr-interactive hover:bg-gray-100 font-semibold px-8 py-3"
                >
                  {isFrench ? 'Planification successorale' : 'Estate Planning'}
                </Button>
                <Button 
                  onClick={() => navigate('/blog')}
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-mpr-interactive font-semibold px-8 py-3"
                >
                  {isFrench ? 'Plus d\'articles' : 'More Articles'}
                </Button>
              </div>
            </div>

          </div>

          {/* Related Articles */}
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                {isFrench ? 'Articles connexes' : 'Related Articles'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: isFrench ? 'Stratégies fiscales pour la retraite' : 'Tax Strategies for Retirement',
                    category: isFrench ? 'Guide pratique' : 'Practical Guide',
                    path: '/blog/guides/strategies-fiscales-retraite'
                  },
                  {
                    title: isFrench ? '10 Conseils pour une retraite réussie' : '10 Tips for Successful Retirement',
                    category: isFrench ? 'Conseils d\'experts' : 'Expert Tips',
                    path: '/blog/conseils-experts/10-conseils-retraite-reussie'
                  }
                ].map((article, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(article.path)}
                  >
                    <div className="text-xs text-mpr-interactive font-semibold mb-1">
                      {article.category}
                    </div>
                    <h4 className="font-semibold text-gray-900 hover:text-mpr-interactive transition-colors">
                      {article.title}
                    </h4>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default OptimiserTransmissionCeli;
