import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Target, AlertTriangle, Info } from 'lucide-react';
import { UserData, Calculations } from '../types';

interface SensitivityAnalysisProps {
  userData: UserData;
  calculations: Calculations;
}

export const SensitivityAnalysis: React.FC<SensitivityAnalysisProps> = ({ userData, calculations }) => {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Target className="w-5 h-5" />
          Analyse de Sensibilité
        </CardTitle>
        <CardDescription className="text-green-600">
          Testez l'impact de changements sur vos paramètres clés
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Cette fonctionnalité sera bientôt disponible. Elle permettra d'analyser comment vos projections de retraite 
              changent en fonction de variations dans les paramètres clés comme l'inflation, les rendements d'investissement, 
              et l'âge de retraite.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-green-200">
              <div className="text-2xl font-bold text-green-600">±2%</div>
              <div className="text-sm text-gray-600">Variation inflation</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">±1 an</div>
              <div className="text-sm text-gray-600">Âge de retraite</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">±5%</div>
              <div className="text-sm text-gray-600">Rendement investissement</div>
            </div>
          </div>
          
          <div className="text-center py-6">
            <Badge variant="outline" className="text-green-600 border-green-300">
              Fonctionnalité en développement
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
