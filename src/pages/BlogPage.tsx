import React from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Lightbulb, 
  BarChart3, 
  TrendingUp,
  ArrowRight,
  Clock,
  User,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlogPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';

  const blogCategories = [
    {
      id: 'guides',
      title: isFrench ? 'Guides Pratiques' : 'Practical Guides',
      description: isFrench 
        ? 'Des guides détaillés pour optimiser votre planification financière'
        : 'Detailed guides to optimize your financial planning',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      articles: [
        {
          title: isFrench ? 'Comment optimiser la transmission de votre CÉLI' : 'How to optimize your TFSA transmission',
          excerpt: isFrench 
            ? 'Découvrez les stratégies d\'experts pour maximiser la transmission de votre CÉLI à vos héritiers.'
            : 'Discover expert strategies to maximize your TFSA transmission to your heirs.',
          readTime: '8 min',
          path: '/blog/guides/optimiser-transmission-celi'
        },
        {
          title: isFrench ? 'Maîtriser les stratégies fiscales pour la retraite' : 'Master tax strategies for retirement',
          excerpt: isFrench 
            ? 'Guide complet sur l\'optimisation fiscale, le fractionnement du revenu et les crédits disponibles.'
            : 'Complete guide on tax optimization, income splitting and available credits.',
          readTime: '12 min',
          path: '/blog/guides/strategies-fiscales-retraite'
        }
      ]
    },
    {
      id: 'expert-tips',
      title: isFrench ? 'Conseils d\'Experts' : 'Expert Tips',
      description: isFrench 
        ? 'Les meilleures pratiques et conseils de professionnels de la finance'
        : 'Best practices and advice from finance professionals',
      icon: Lightbulb,
      color: 'from-amber-500 to-orange-500',
      articles: [
        {
          title: isFrench ? '10 Conseils Essentiels pour une Retraite Réussie' : '10 Essential Tips for a Successful Retirement',
          excerpt: isFrench 
            ? 'Les conseils cruciaux que tout futur retraité devrait connaître pour éviter les erreurs coûteuses.'
            : 'Crucial advice every future retiree should know to avoid costly mistakes.',
          readTime: '10 min',
          path: '/blog/conseils-experts/10-conseils-retraite-reussie'
        },
        {
          title: isFrench ? 'Éviter les Biais Comportementaux en Investissement' : 'Avoiding Behavioral Biases in Investment',
          excerpt: isFrench 
            ? 'Comment reconnaître et éviter les pièges psychologiques qui nuisent à vos décisions financières.'
            : 'How to recognize and avoid psychological traps that harm your financial decisions.',
          readTime: '7 min',
          path: '/blog/conseils-experts/eviter-biais-comportementaux'
        }
      ]
    },
    {
      id: 'case-studies',
      title: isFrench ? 'Études de Cas' : 'Case Studies',
      description: isFrench 
        ? 'Analyses détaillées de situations réelles et leurs solutions'
        : 'Detailed analyses of real situations and their solutions',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-600',
      articles: [
        {
          title: isFrench ? 'Étude de Cas : Retraite Anticipée à 55 ans' : 'Case Study: Early Retirement at 55',
          excerpt: isFrench 
            ? 'Analyse complète d\'une stratégie de retraite anticipée avec optimisation REER/CÉLI.'
            : 'Complete analysis of an early retirement strategy with RRSP/TFSA optimization.',
          readTime: '15 min',
          path: '/blog/etudes-cas/retraite-anticipee-55-ans'
        },
        {
          title: isFrench ? 'Optimisation Successorale : Famille de 4 Enfants' : 'Estate Optimization: Family of 4 Children',
          excerpt: isFrench 
            ? 'Comment structurer efficacement la transmission d\'un patrimoine de 2M$ à 4 héritiers.'
            : 'How to efficiently structure the transmission of a $2M estate to 4 heirs.',
          readTime: '12 min',
          path: '/blog/etudes-cas/optimisation-successorale-4-enfants'
        }
      ]
    },
    {
      id: 'tax-news',
      title: isFrench ? 'Actualités Fiscales' : 'Tax News',
      description: isFrench 
        ? 'Les dernières nouvelles fiscales et leurs impacts sur votre retraite'
        : 'Latest tax news and their impact on your retirement',
      icon: TrendingUp,
      color: 'from-purple-500 to-indigo-600',
      articles: [
        {
          title: isFrench ? 'Budget 2024 : Nouveautés pour les Retraités' : 'Budget 2024: News for Retirees',
          excerpt: isFrench 
            ? 'Analyse des changements fiscaux du budget 2024 et leur impact sur votre planification.'
            : 'Analysis of tax changes in the 2024 budget and their impact on your planning.',
          readTime: '6 min',
          path: '/blog/actualites-fiscales/budget-2024-retraites'
        },
        {
          title: isFrench ? 'Nouvelles Règles FERR 2024' : 'New RRIF Rules 2024',
          excerpt: isFrench 
            ? 'Comprendre les modifications aux règles de retrait minimum des FERR.'
            : 'Understanding changes to RRIF minimum withdrawal rules.',
          readTime: '8 min',
          path: '/blog/actualites-fiscales/nouvelles-regles-ferr-2024'
        }
      ]
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/blog/${categoryId}`);
  };

  const handleArticleClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {isFrench ? 'Blog MonPlanRetraite.ca' : 'MonPlanRetraite.ca Blog'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isFrench 
                ? 'Découvrez nos guides, conseils d\'experts et analyses pour optimiser votre planification de retraite'
                : 'Discover our guides, expert advice and analyses to optimize your retirement planning'
              }
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {blogCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className={`h-2 bg-gradient-to-r ${category.color}`}></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} text-white`}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {category.title}
                    </CardTitle>
                  </div>
                  <p className="text-gray-600">
                    {category.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 mb-6">
                    {category.articles.map((article, index) => (
                      <div 
                        key={index}
                        className="border-l-4 border-gray-200 pl-4 hover:border-blue-400 transition-colors cursor-pointer"
                        onClick={() => handleArticleClick(article.path)}
                      >
                        <h4 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{isFrench ? 'Équipe MPR' : 'MPR Team'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full bg-gradient-to-r ${category.color} hover:opacity-90 text-white font-semibold`}
                  >
                    {isFrench ? 'Voir tous les articles' : 'View all articles'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Featured Articles Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {isFrench ? 'Articles Populaires' : 'Popular Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: isFrench ? 'Guide Complet : Optimisation REER vs CÉLI' : 'Complete Guide: RRSP vs TFSA Optimization',
                  category: isFrench ? 'Guides Pratiques' : 'Practical Guides',
                  readTime: '15 min',
                  path: '/blog/guides/reer-vs-celi-optimization'
                },
                {
                  title: isFrench ? '5 Erreurs Coûteuses à Éviter en Retraite' : '5 Costly Mistakes to Avoid in Retirement',
                  category: isFrench ? 'Conseils d\'Experts' : 'Expert Tips',
                  readTime: '8 min',
                  path: '/blog/conseils-experts/5-erreurs-couteuses-retraite'
                },
                {
                  title: isFrench ? 'Impact de l\'Inflation sur Votre Retraite' : 'Impact of Inflation on Your Retirement',
                  category: isFrench ? 'Actualités Fiscales' : 'Tax News',
                  readTime: '10 min',
                  path: '/blog/actualites-fiscales/impact-inflation-retraite'
                }
              ].map((article, index) => (
                <div 
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleArticleClick(article.path)}
                >
                  <div className="text-xs text-blue-600 font-semibold mb-2">
                    {article.category}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{isFrench ? 'Récent' : 'Recent'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                {isFrench ? 'Restez Informé' : 'Stay Informed'}
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                {isFrench 
                  ? 'Recevez nos derniers articles et conseils directement dans votre boîte de réception'
                  : 'Receive our latest articles and advice directly in your inbox'
                }
              </p>
              <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3">
                {isFrench ? 'S\'abonner à la Newsletter' : 'Subscribe to Newsletter'}
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default BlogPage;
