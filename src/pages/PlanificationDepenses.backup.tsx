import React, { useState, useEffect } from 'react';
import { ExpenseScenarioPlanner } from '../features/retirement/components/ExpenseScenarioPlanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  Lightbulb,
  BookOpen,
  DollarSign
} from 'lucide-react';

export const PlanificationDepenses: React.FC = () => {
  const [currentBalance, setCurrentBalance] = useState(5000);
  const [monthlyIncome, setMonthlyIncome] = useState(4500);
  const [monthlyExpenses, setMonthlyExpenses] = useState(3200);

  // Load financial data from localStorage or other sources
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('retirement_data');
      if (savedData) {
        const data = JSON.parse(savedData);
        // Extract relevant financial information
        if (data.person1?.monthlyIncome || data.person2?.monthlyIncome) {
          const totalIncome = (data.person1?.monthlyIncome || 0) + (data.person2?.monthlyIncome || 0);
          setMonthlyIncome(totalIncome);
        }
        if (data.person1?.monthlyExpenses || data.person2?.monthlyExpenses) {
          const totalExpenses = (data.person1?.monthlyExpenses || 0) + (data.person2?.monthlyExpenses || 0);
          setMonthlyExpenses(totalExpenses);
        }
        if (data.currentSavings) {
          setCurrentBalance(data.currentSavings);
        }
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-mpr-interactive-lt to-mpr-interactive-lt">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-mpr-interactive p-3 rounded-full">
              <Calculator className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Planification de dépenses intelligente
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analysez l'impact de vos futurs achats sur votre situation financière et 
            trouvez le meilleur moment pour effectuer vos dépenses importantes.
          </p>
        </div>

        {/* Educational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Target className="h-5 w-5 text-mpr-interactive mr-2" />
                <CardTitle className="text-lg">Comparaison d'options</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comparez différentes options d'achat (neuf, usagé, financement) 
                pour prendre la meilleure décision financière.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                <CardTitle className="text-lg">Optimisation du timing</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Découvrez le moment optimal pour effectuer vos achats 
                afin d'éviter les découverts bancaires.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Lightbulb className="h-5 w-5 text-purple-600 mr-2" />
                <CardTitle className="text-lg">Recommandations personnalisées</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Recevez des conseils adaptés à votre situation financière 
                pour chaque scénario de dépense.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Examples Section */}
        <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-amber-600 mr-2" />
              <CardTitle className="text-xl text-amber-800">Exemples de scénarios</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-amber-800 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Remplacement d'électroménager
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>• Modèle haut de gamme</span>
                    <Badge variant="outline">2 000$</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>• Modèle bas de gamme</span>
                    <Badge variant="outline">800$</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>• Appareil usagé</span>
                    <Badge variant="outline">400$</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-amber-800 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Planification de vacances
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>• Croisière de luxe</span>
                    <Badge variant="outline">8 000$</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>• Voyage au Mexique</span>
                    <Badge variant="outline">4 000$</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>• Voyage à Cuba</span>
                    <Badge variant="outline">2 000$</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <Alert className="bg-amber-50 border-amber-200">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription className="text-amber-800">
                <strong>Conseil:</strong> Utilisez les modèles prédéfinis pour commencer rapidement, 
                ou créez vos propres scénarios personnalisés selon vos besoins spécifiques.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Main Planning Component */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ExpenseScenarioPlanner
            currentBalance={currentBalance}
            monthlyIncome={monthlyIncome}
            monthlyExpenses={monthlyExpenses}
            onStateChange={(state) => {
              // Handle state changes if needed
              console.log('Expense scenario state updated:', state);
            }}
          />
        </div>

        {/* Footer Information */}
        <div className="mt-8 text-center">
          <Card className="bg-mpr-interactive-lt border-mpr-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-3">
                <Calculator className="h-5 w-5 text-mpr-interactive mr-2" />
                <h3 className="text-lg font-semibold text-mpr-navy">
                  Planification financière intelligente
                </h3>
              </div>
              <p className="text-mpr-navy text-sm max-w-2xl mx-auto">
                Cet outil vous aide à prendre des décisions financières éclairées en analysant 
                l'impact de vos dépenses sur votre flux de trésorerie. Toutes les données sont 
                sauvegardées localement sur votre appareil pour votre confidentialité.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlanificationDepenses;
