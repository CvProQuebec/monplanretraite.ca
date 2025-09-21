import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu';

import {
  Home,
  LineChart,
  DollarSign,
  Receipt,
  BarChart3,
  Building2,
  Landmark,
  Wrench,
  BookOpen,
  FileText,
  Database
} from 'lucide-react';

interface MainTopNavProps {
  isEnglish?: boolean;
}

const linkClasses =
  'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors';

export const MainTopNav: React.FC<MainTopNavProps> = ({ isEnglish = false }) => {
  const reportsPath = isEnglish ? '/en/retirement-reports' : '/fr/rapports-retraite';
  const homePath = isEnglish ? '/home' : '/accueil';
  const savePath = isEnglish ? '/en/save-load' : '/fr/sauvegarder-charger';
  const blogPath = isEnglish ? '/en/blog' : '/blog';

  return (
    <nav className="w-full">
      <div className="flex items-center gap-1 overflow-x-auto py-1">
        {/* Accueil */}
        <Link to={homePath} className={linkClasses} aria-label={isEnglish ? 'Home' : 'Accueil'}>
          <Home className="w-4 h-4" />
          <span>{isEnglish ? 'Home' : 'Accueil'}</span>
        </Link>

        {/* Ma Retraite */}
        <Link to="/ma-retraite" className={linkClasses} aria-label={isEnglish ? 'My Retirement' : 'Ma Retraite'}>
          <LineChart className="w-4 h-4" />
          <span>{isEnglish ? 'My Retirement' : 'Ma Retraite'}</span>
        </Link>

        {/* Revenus */}
        <Link to="/mes-revenus" className={linkClasses} aria-label={isEnglish ? 'Income' : 'Revenus'}>
          <DollarSign className="w-4 h-4" />
          <span>{isEnglish ? 'Income' : 'Revenus'}</span>
        </Link>

        {/* Dépenses */}
        <Link to="/depenses" className={linkClasses} aria-label={isEnglish ? 'Expenses' : 'Dépenses'}>
          <Receipt className="w-4 h-4" />
          <span>{isEnglish ? 'Expenses' : 'Dépenses'}</span>
        </Link>

        {/* Budget */}
        <Link to="/budget" className={linkClasses} aria-label="Budget">
          <BarChart3 className="w-4 h-4" />
          <span>Budget</span>
        </Link>

        {/* Immobilier */}
        <Link to="/immobilier" className={linkClasses} aria-label={isEnglish ? 'Real Estate' : 'Immobilier'}>
          <Building2 className="w-4 h-4" />
          <span>{isEnglish ? 'Real Estate' : 'Immobilier'}</span>
        </Link>

        {/* Gouvernement (Dropdown) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50">
              <Landmark className="w-4 h-4 mr-2" />
              {isEnglish ? 'Government' : 'Gouvernement'} ▾
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link to="/rrq-cpp-analysis" aria-label="RRQ/CPP">
                RRQ/CPP
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/module-srg" aria-label="SRG">
                SRG
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/module-rregop" aria-label="RREGOP">
                RREGOP
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Outils (Dropdown) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50">
              <Wrench className="w-4 h-4 mr-2" />
              {isEnglish ? 'Tools' : 'Outils'} ▾
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link to="/hypotheses" aria-label={isEnglish ? 'Assumptions' : 'Hypothèses'}>
                {isEnglish ? 'Assumptions' : 'Hypothèses'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/simulateur-monte-carlo" aria-label="Monte Carlo">
                {isEnglish ? 'Monte Carlo Simulator' : 'Simulateur Monte Carlo'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/analyse-sensibilite" aria-label={isEnglish ? 'Sensitivity Analysis' : 'Analyse de Sensibilité'}>
                {isEnglish ? 'Sensitivity Analysis' : 'Analyse de Sensibilité'}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Blog */}
        <Link to={blogPath} className={linkClasses} aria-label="Blog">
          <BookOpen className="w-4 h-4" />
          <span>Blog</span>
        </Link>

        {/* Rapports */}
        <Link to={reportsPath} className={linkClasses} aria-label={isEnglish ? 'Reports' : 'Rapports'}>
          <FileText className="w-4 h-4" />
          <span>{isEnglish ? 'Reports' : 'Rapports'}</span>
        </Link>

        {/* Sauvegarder/Charger */}
        <Link to={savePath} className={linkClasses} aria-label={isEnglish ? 'Save/Load' : 'Sauvegarder/Charger'}>
          <Database className="w-4 h-4" />
          <span>{isEnglish ? 'Save/Load' : 'Sauvegarder/Charger'}</span>
        </Link>
      </div>
    </nav>
  );
};

export default MainTopNav;
