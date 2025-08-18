import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { translations } from '@/features/retirement/translations/index';
import { 
  Shield, 
  Calculator, 
  TrendingUp, 
  FileText, 
  Heart, 
  Mail, 
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';

const Footer: React.FC = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];
  const isEnglish = language === 'en';

  return (
    <footer className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-500/10 blur-[100px]"></div>
      <div className="absolute bottom-40 right-10 w-80 h-80 rounded-full bg-purple-500/10 blur-[120px]"></div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Colonne 1 : À propos */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="/logo-monplanretraite.png" 
                alt="MonPlanRetraite.ca Logo" 
                className="h-8 w-auto"
              />
              <h3 className="text-xl font-bold">MonPlanRetraite.ca</h3>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              {isEnglish 
                ? 'Professional retirement planning tools for Canadians. Plan your financial future with confidence and precision.'
                : 'Outils professionnels de planification de retraite pour les Canadiens. Planifiez votre avenir financier avec confiance et précision.'
              }
            </p>
            <div className="flex items-center gap-2 text-blue-200 text-sm">
              <Heart className="w-4 h-4 text-red-400" />
              <span>
                {isEnglish 
                  ? 'Made with love in Quebec'
                  : 'Fait avec amour au Québec'
                }
              </span>
            </div>
          </div>

          {/* Colonne 2 : Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-200">
              {isEnglish ? 'Our services' : 'Nos services'}
            </h4>
            <ul className="space-y-2 text-sm text-blue-100">
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <Calculator className="w-4 h-4" />
                <span>{isEnglish ? 'Retirement planning' : 'Planification retraite'}</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <TrendingUp className="w-4 h-4" />
                <span>{isEnglish ? 'Cashflow analysis' : 'Analyse cashflow'}</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <FileText className="w-4 h-4" />
                <span>{isEnglish ? 'CPP/RRQ optimization' : 'Optimisation CPP/RRQ'}</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <Shield className="w-4 h-4" />
                <span>{isEnglish ? 'Tax optimization' : 'Optimisation fiscale'}</span>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Ressources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-200">
              {isEnglish ? 'Resources' : 'Ressources'}
            </h4>
            <ul className="space-y-2 text-sm text-blue-100">
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <FileText className="w-4 h-4" />
                <span>{isEnglish ? 'Planning guides' : 'Guides de planification'}</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <Calculator className="w-4 h-4" />
                <span>{isEnglish ? 'Financial calculators' : 'Calculateurs financiers'}</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <TrendingUp className="w-4 h-4" />
                <span>{isEnglish ? 'Market insights' : 'Aperçus du marché'}</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <Shield className="w-4 h-4" />
                <span>{isEnglish ? 'Security tips' : 'Conseils de sécurité'}</span>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-200">
              {isEnglish ? 'Contact us' : 'Contactez-nous'}
            </h4>
            <div className="space-y-3 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-300" />
                <span>info@monplanretraite.ca</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-300" />
                <span>+1 (514) 555-0123</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-300" />
                <span>
                  {isEnglish 
                    ? 'Montreal, Quebec, Canada'
                    : 'Montréal, Québec, Canada'
                  }
                </span>
              </div>
            </div>
            
            {/* Liens sociaux */}
            <div className="pt-2">
              <h5 className="text-sm font-medium text-blue-200 mb-2">
                {isEnglish ? 'Follow us' : 'Suivez-nous'}
              </h5>
              <div className="flex gap-3">
                <a 
                  href="#" 
                  className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  aria-label={isEnglish ? 'LinkedIn' : 'LinkedIn'}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  aria-label={isEnglish ? 'Twitter' : 'Twitter'}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  aria-label={isEnglish ? 'Facebook' : 'Facebook'}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-blue-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-blue-300">
              <p>
                {isEnglish 
                  ? '© 2024 MonPlanRetraite.ca. All rights reserved.'
                  : '© 2024 MonPlanRetraite.ca. Tous droits réservés.'
                }
              </p>
            </div>
            
            <div className="flex gap-6 text-sm text-blue-300">
              <a href="#" className="hover:text-white transition-colors">
                {isEnglish ? 'Privacy policy' : 'Politique de confidentialité'}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {isEnglish ? 'Terms of service' : 'Conditions d\'utilisation'}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {isEnglish ? 'Cookie policy' : 'Politique des cookies'}
              </a>
            </div>
          </div>
        </div>

        {/* Avertissement légal */}
        <div className="mt-8 p-4 bg-blue-800/50 rounded-lg border border-blue-700">
          <div className="text-center text-sm text-blue-200">
            <p className="mb-2">
              <strong>
                {isEnglish 
                  ? '⚠️ This financial planning platform is an educational and informational tool that does not replace consultation with a qualified professional.'
                  : '⚠️ Cette plateforme de planification financière est un outil éducatif et informatif qui ne remplace en aucun cas une consultation avec un professionnel qualifié.'
                }
              </strong>
            </p>
            <p>
              {isEnglish 
                ? 'Always consult a certified financial planner for important decisions.'
                : 'Consultez toujours un planificateur financier agréé pour vos décisions importantes.'
              }
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
