import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  HelpCircle, 
  DollarSign, 
  Building, 
  Shield, 
  TrendingUp, 
  Home, 
  Laptop, 
  Info,
  X
} from 'lucide-react';

interface SeniorsFinancialHelpProps {
  isFrench: boolean;
}

const SeniorsFinancialHelp: React.FC<SeniorsFinancialHelpProps> = ({ isFrench }) => {
  const [showHelp, setShowHelp] = useState(false);

  const financialTerms = [
    {
      icon: <DollarSign className="w-8 h-8 text-mpr-interactive" />,
      term: isFrench ? 'Salaire' : 'Salary',
      definition: isFrench 
        ? 'Le montant d\'argent que vous recevez chaque année de votre emploi principal'
        : 'The amount of money you receive each year from your main job',
      example: isFrench ? 'Exemple: 50 000 $ par année' : 'Example: $50,000 per year'
    },
    {
      icon: <Building className="w-8 h-8 text-purple-600" />,
      term: isFrench ? 'Pensions/Rentes' : 'Pensions/Annuities',
      definition: isFrench 
        ? 'L\'argent que vous recevez chaque mois de vos régimes de retraite'
        : 'Money you receive each month from your retirement plans',
      example: isFrench ? 'Exemple: 1 500 $ par mois' : 'Example: $1,500 per month'
    },
    {
      icon: <Shield className="w-8 h-8 text-orange-600" />,
      term: isFrench ? 'Assurance emploi' : 'Employment Insurance',
      definition: isFrench 
        ? 'L\'aide financière temporaire si vous perdez votre emploi'
        : 'Temporary financial help if you lose your job',
      example: isFrench ? 'Exemple: 500 $ par semaine' : 'Example: $500 per week'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      term: isFrench ? 'Dividendes' : 'Dividends',
      definition: isFrench 
        ? 'L\'argent que vous recevez de vos investissements en actions'
        : 'Money you receive from your stock investments',
      example: isFrench ? 'Exemple: 2 000 $ par année' : 'Example: $2,000 per year'
    },
    {
      icon: <Home className="w-8 h-8 text-yellow-600" />,
      term: isFrench ? 'Revenus de location' : 'Rental Income',
      definition: isFrench 
        ? 'L\'argent que vous recevez en louant une propriété'
        : 'Money you receive from renting out a property',
      example: isFrench ? 'Exemple: 1 200 $ par mois' : 'Example: $1,200 per month'
    },
    {
      icon: <Laptop className="w-8 h-8 text-mpr-interactive" />,
      term: isFrench ? 'Travail autonome' : 'Self-Employment',
      definition: isFrench 
        ? 'L\'argent que vous gagnez en travaillant pour vous-même'
        : 'Money you earn working for yourself',
      example: isFrench ? 'Exemple: 30 000 $ par année' : 'Example: $30,000 per year'
    }
  ];

  if (!showHelp) {
    return (
      <div className="text-center mb-8">
        <Button
          onClick={() => setShowHelp(true)}
          variant="outline"
          size="lg"
          className="bg-mpr-interactive-lt border-2 border-mpr-border text-mpr-navy hover:bg-mpr-interactive-lt text-xl px-8 py-4 h-16"
        >
          <HelpCircle className="w-6 h-6 mr-3" />
          {isFrench ? 'Aide : Que signifient ces termes ?' : 'Help: What do these terms mean?'}
        </Button>
      </div>
    );
  }

  return (
    <Card className="bg-mpr-interactive-lt border-4 border-mpr-border shadow-xl mb-8">
      <CardHeader className="bg-mpr-interactive-lt border-b-4 border-mpr-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl font-bold text-mpr-navy flex items-center gap-3">
            <Info className="w-8 h-8 text-mpr-interactive" />
            {isFrench ? 'Guide des termes financiers' : 'Financial Terms Guide'}
          </CardTitle>
          <Button
            onClick={() => setShowHelp(false)}
            variant="outline"
            size="lg"
            className="bg-white border-2 border-mpr-border text-mpr-navy hover:bg-mpr-interactive-lt h-12 w-12 p-0"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        <Alert className="border-mpr-border bg-mpr-interactive-lt mb-6">
          <Info className="h-6 w-6 text-mpr-interactive" />
          <AlertDescription className="text-lg text-mpr-navy">
            <strong>{isFrench ? 'Pourquoi c\'est important :' : 'Why this matters:'}</strong>
            <br />
            {isFrench 
              ? 'Comprendre vos différents types de revenus vous aide à mieux planifier votre retraite et à faire de meilleurs choix financiers.'
              : 'Understanding your different income types helps you better plan for retirement and make better financial choices.'
            }
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {financialTerms.map((term, index) => (
            <Card key={index} className="bg-white border-2 border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {term.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-800 mb-3">
                      {term.term}
                    </h4>
                    <p className="text-lg text-gray-700 mb-3 leading-relaxed">
                      {term.definition}
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      {term.example}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={() => setShowHelp(false)}
            size="lg"
            className="bg-mpr-interactive hover:bg-mpr-interactive-dk text-white text-xl px-8 py-4 h-16"
          >
            {isFrench ? 'J\'ai compris, fermer l\'aide' : 'I understand, close help'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeniorsFinancialHelp;
