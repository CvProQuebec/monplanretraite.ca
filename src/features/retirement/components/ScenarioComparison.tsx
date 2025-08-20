// src/features/retirement/components/ScenarioComparison.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { UserData, Calculations } from '../types';

interface ScenarioComparisonProps {
  userData: UserData;
  calculations: Calculations;
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({ userData, calculations }) => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <TrendingUp className="w-5 h-5" />
          Comparaison de Scénarios
        </CardTitle>
        <CardDescription className="text-blue-600">
          Analysez l'impact de différents paramètres sur votre retraite
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Cette fonctionnalité sera bientôt disponible. Elle permettra de comparer différents scénarios de retraite 
              en modifiant les paramètres clés comme l'âge de retraite, le taux d'épargne et les rendements d'investissement.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">65 ans</div>
              <div className="text-sm text-gray-600">Âge de retraite standard</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-green-200">
              <div className="text-2xl font-bold text-green-600">70 ans</div>
              <div className="text-sm text-gray-600">Retraite différée</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">60 ans</div>
              <div className="text-sm text-gray-600">Retraite anticipée</div>
            </div>
          </div>
          
          <div className="text-center py-6">
            <Badge variant="outline" className="text-blue-600 border-blue-300">
              Fonctionnalité en développement
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};