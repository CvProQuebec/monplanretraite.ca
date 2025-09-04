import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserData } from '@/types';

interface UnifiedIncomeDebugProps {
  userData: UserData;
  isFrench: boolean;
}

const UnifiedIncomeDebug: React.FC<UnifiedIncomeDebugProps> = ({ userData, isFrench }) => {
  const personal = userData.personal || {};
  const unifiedIncome1 = (personal as any)?.unifiedIncome1 || [];
  const unifiedIncome2 = (personal as any)?.unifiedIncome2 || [];
  
  return (
    <Card className="bg-purple-50 border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="text-purple-800">
          🔍 Debug - Données unifiedIncome
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personne 1 */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold text-blue-800 mb-2">Personne 1 - unifiedIncome1</h4>
            <div className="text-sm">
              <div><strong>Nombre d'entrées:</strong> {unifiedIncome1.length}</div>
              {unifiedIncome1.length > 0 ? (
                <div className="mt-2 space-y-1">
                  {unifiedIncome1.map((entry: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                      <div><strong>Type:</strong> {entry.type}</div>
                      <div><strong>Actif:</strong> {entry.isActive ? 'Oui' : 'Non'}</div>
                      {entry.salaryNetAmount && (
                        <div><strong>Montant salaire:</strong> ${entry.salaryNetAmount}</div>
                      )}
                      {entry.annualAmount && (
                        <div><strong>Montant annuel:</strong> ${entry.annualAmount}</div>
                      )}
                      {entry.monthlyAmount && (
                        <div><strong>Montant mensuel:</strong> ${entry.monthlyAmount}</div>
                      )}
                      {entry.weeklyNet && (
                        <div><strong>Montant hebdomadaire:</strong> ${entry.weeklyNet}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">Aucune donnée unifiedIncome1</div>
              )}
            </div>
          </div>
          
          {/* Personne 2 */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold text-green-800 mb-2">Personne 2 - unifiedIncome2</h4>
            <div className="text-sm">
              <div><strong>Nombre d'entrées:</strong> {unifiedIncome2.length}</div>
              {unifiedIncome2.length > 0 ? (
                <div className="mt-2 space-y-1">
                  {unifiedIncome2.map((entry: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                      <div><strong>Type:</strong> {entry.type}</div>
                      <div><strong>Actif:</strong> {entry.isActive ? 'Oui' : 'Non'}</div>
                      {entry.salaryNetAmount && (
                        <div><strong>Montant salaire:</strong> ${entry.salaryNetAmount}</div>
                      )}
                      {entry.annualAmount && (
                        <div><strong>Montant annuel:</strong> ${entry.annualAmount}</div>
                      )}
                      {entry.monthlyAmount && (
                        <div><strong>Montant mensuel:</strong> ${entry.monthlyAmount}</div>
                      )}
                      {entry.weeklyNet && (
                        <div><strong>Montant hebdomadaire:</strong> ${entry.weeklyNet}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">Aucune donnée unifiedIncome2</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Données brutes complètes */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Données Brutes Complètes</h4>
          <div className="text-xs text-gray-600 overflow-auto max-h-40">
            <pre>{JSON.stringify({
              unifiedIncome1: unifiedIncome1,
              unifiedIncome2: unifiedIncome2
            }, null, 2)}</pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedIncomeDebug;
