import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Plus, Calculator, Shield, Flag, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/features/retirement/utils/formatters';
import RRQManager from './RRQManager';

interface BenefitsTableProps {
  personNumber: 1 | 2;
  personName: string;
  userData: any;
  onDataChange: (data: any) => void;
  isFrench: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const BenefitsTable: React.FC<BenefitsTableProps> = ({
  personNumber,
  personName,
  userData,
  onDataChange,
  isFrench,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  // Calculer les totaux des prestations
  const getBenefitsTotals = () => {
    const totals = {
      rrq: 0,
      securiteVieillesse: 0,
      rentesPrivees: 0,
      total: 0
    };

    // RRQ automatique depuis userData
    if (userData?.retirement) {
      const currentDate = new Date();
      const monthsElapsed = currentDate.getMonth() + 1;
      const monthsCompleted = Math.max(0, monthsElapsed - 1); // Exclure le mois courant

      const rrqAmount = personNumber === 1 
        ? userData.retirement.rrqMontantActuel1 || 0
        : userData.retirement.rrqMontantActuel2 || 0;
      
      totals.rrq = rrqAmount * monthsCompleted;

      // SV automatique depuis userData
      const svBiannual = personNumber === 1 
        ? userData.retirement.svBiannual1 
        : userData.retirement.svBiannual2;
      
      if (svBiannual) {
        const svAmount = (svBiannual.periode1?.montant || 0) + (svBiannual.periode2?.montant || 0);
        totals.securiteVieillesse = svAmount * monthsCompleted;
      }
    }

    totals.total = totals.rrq + totals.securiteVieillesse + totals.rentesPrivees;
    return totals;
  };

  const totals = getBenefitsTotals();

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-4 border-blue-200 shadow-xl">
      <CardHeader className="border-b-4 border-blue-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-blue-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {personNumber}
            </div>
            {isFrench ? 'Prestations' : 'Benefits'} - {personName}
          </CardTitle>
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="text-blue-600 hover:text-blue-800"
            >
              {isCollapsed ? <ChevronDown className="w-6 h-6" /> : <ChevronUp className="w-6 h-6" />}
            </Button>
          )}
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="p-6 space-y-6">
          {/* Section RRQ - Nouveau système par périodes */}
          <RRQManager
            personNumber={personNumber}
            userData={userData}
            onDataChange={onDataChange}
            isFrench={isFrench}
          />

          {/* Section Sécurité de la vieillesse */}
          <div className="bg-white p-6 rounded-lg border-2 border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              {isFrench ? 'Sécurité de la vieillesse (SV)' : 'Old Age Security (OAS)'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {isFrench ? 'Montant mensuel' : 'Monthly Amount'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={(() => {
                    const svBiannual = personNumber === 1 
                      ? userData?.retirement?.svBiannual1 
                      : userData?.retirement?.svBiannual2;
                    if (svBiannual) {
                      const total = (svBiannual.periode1?.montant || 0) + (svBiannual.periode2?.montant || 0);
                      // Ne pas afficher 0, laisser le champ vide
                      return total > 0 ? total : '';
                    }
                    return '';
                  })()}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                    const field = personNumber === 1 ? 'svBiannual1' : 'svBiannual2';
                    const svBiannual = personNumber === 1 
                      ? userData?.retirement?.svBiannual1 || { periode1: { montant: 0 }, periode2: { montant: 0 } }
                      : userData?.retirement?.svBiannual2 || { periode1: { montant: 0 }, periode2: { montant: 0 } };
                    
                    // Diviser le montant mensuel entre les deux périodes
                    const halfAmount = value / 2;
                    const updatedSvBiannual = {
                      ...svBiannual,
                      periode1: { ...svBiannual.periode1, montant: halfAmount },
                      periode2: { ...svBiannual.periode2, montant: halfAmount }
                    };
                    
                    onDataChange({ [field]: updatedSvBiannual });
                  }}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder={isFrench ? "Ex: 707.68" : "Ex: 707.68"}
                />
                <p className="text-sm text-gray-600 mt-1">
                  {isFrench 
                    ? 'Entrez le montant mensuel de votre Sécurité de la vieillesse'
                    : 'Enter your Old Age Security monthly amount'
                  }
                </p>
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {isFrench ? 'Montant à ce jour' : 'Amount to Date'}
                </label>
                <div className="p-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-lg font-bold text-purple-600">
                  {formatCurrency(totals.securiteVieillesse)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {isFrench 
                    ? 'Calculé automatiquement basé sur le montant mensuel'
                    : 'Automatically calculated based on monthly amount'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Section Rentes privées */}
          <div className="bg-white p-6 rounded-lg border-2 border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              {isFrench ? 'Rentes privées' : 'Private Pensions'}
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-orange-400 text-orange-600 hover:bg-orange-50"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {isFrench ? 'Ajouter une rente privée' : 'Add Private Pension'}
                </Button>
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {isFrench ? 'Total à ce jour' : 'Total to Date'}
                </label>
                <div className="p-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-lg font-bold text-orange-600">
                  {formatCurrency(totals.rentesPrivees)}
                </div>
              </div>
            </div>
          </div>

          {/* Résumé des prestations */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-4 border-green-200">
            <CardContent className="p-6">
              <h4 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-3">
                <Calculator className="w-6 h-6" />
                {isFrench ? 'Résumé des prestations' : 'Benefits Summary'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(totals.rrq)}
                  </div>
                  <div className="text-lg text-gray-700">
                    {isFrench ? 'RRQ à ce jour' : 'QPP to Date'}
                  </div>
                </div>
                
                <div>
                  <div className="text-3xl font-bold text-purple-600">
                    {formatCurrency(totals.securiteVieillesse)}
                  </div>
                  <div className="text-lg text-gray-700">
                    {isFrench ? 'SV à ce jour' : 'OAS to Date'}
                  </div>
                </div>
                
                <div>
                  <div className="text-3xl font-bold text-orange-600">
                    {formatCurrency(totals.rentesPrivees)}
                  </div>
                  <div className="text-lg text-gray-700">
                    {isFrench ? 'Rentes à ce jour' : 'Pensions to Date'}
                  </div>
                </div>
                
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(totals.total)}
                  </div>
                  <div className="text-lg text-gray-700">
                    {isFrench ? 'Total prestations' : 'Total Benefits'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      )}
    </Card>
  );
};

export default BenefitsTable;
