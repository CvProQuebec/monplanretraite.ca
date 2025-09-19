import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Plus, TrendingUp, DollarSign, Percent, BarChart3, Calculator } from 'lucide-react';
import { formatCurrency } from '@/features/retirement/utils/formatters';
import MoneyInput from '@/components/ui/MoneyInput';
import DateInput from '@/components/ui/DateInput';

interface InvestmentsTableProps {
  personNumber: 1 | 2;
  personName: string;
  userData: any;
  onDataChange: (data: any) => void;
  isFrench: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const InvestmentsTable: React.FC<InvestmentsTableProps> = ({
  personNumber,
  personName,
  userData,
  onDataChange,
  isFrench,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  // Calculer les totaux des investissements
  const getInvestmentsTotals = () => {
    const totals = {
      reer: 0,
      celi: 0,
      cri: 0,
      crypto: 0,
      total: 0
    };

    // REER
    totals.reer = personNumber === 1 
      ? userData?.personal?.soldeREER1 || 0
      : userData?.personal?.soldeREER2 || 0;

    // CELI
    totals.celi = personNumber === 1 
      ? userData?.personal?.soldeCELI1 || 0
      : userData?.personal?.soldeCELI2 || 0;

    // CRI
    totals.cri = personNumber === 1 
      ? userData?.personal?.soldeCRI1 || 0
      : userData?.personal?.soldeCRI2 || 0;

    // Crypto
    totals.crypto = personNumber === 1 
      ? userData?.personal?.soldeCrypto1 || 0
      : userData?.personal?.soldeCrypto2 || 0;

    totals.total = totals.reer + totals.celi + totals.cri + totals.crypto;
    return totals;
  };

  const totals = getInvestmentsTotals();

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-4 border-orange-200 shadow-xl">
      <CardHeader className="border-b-4 border-orange-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-orange-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {personNumber}
            </div>
            {isFrench ? 'Investissements' : 'Investments'} - {personName}
          </CardTitle>
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="text-orange-600 hover:text-orange-800"
            >
              {isCollapsed ? <ChevronDown className="w-6 h-6" /> : <ChevronUp className="w-6 h-6" />}
            </Button>
          )}
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="p-4 space-y-4 investments-compact">
          {/* REER */}
          <div className="bg-white p-3 rounded-lg border-2 border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {isFrench ? 'REER (Régime enregistré d\'épargne-retraite)' : 'RRSP (Registered Retirement Savings Plan)'}
            </h3>
            <div className="mpr-form-row cols-2">
              <div className="senior-field-inline">
                <label className="senior-form-label">
                  {isFrench ? 'Solde REER' : 'RRSP Balance'}
                </label>
                <MoneyInput
                  value={totals.reer}
                  onChange={(value) => {
                    const field = personNumber === 1 ? 'soldeREER1' : 'soldeREER2';
                    onDataChange({ [field]: value });
                  }}
                  className="p-2 border-2 border-gray-300 rounded-lg text-[1.05rem] font-semibold w-40"
                  placeholder={isFrench ? 'Ex: 150 000' : 'Ex: 150,000'}
                  allowDecimals={true}
                />
              </div>
              <div className="senior-field-inline">
                <label className="senior-form-label">
                  {isFrench ? 'Date du solde' : 'Balance Date'}
                </label>
                <DateInput
                  value={personNumber === 1 
                    ? userData?.personal?.dateREER1 || ''
                    : userData?.personal?.dateREER2 || ''
                  }
                  onChange={(value) => {
                    const field = personNumber === 1 ? 'dateREER1' : 'dateREER2';
                    onDataChange({ [field]: value });
                  }}
                  className="p-2 border-2 border-gray-300 rounded-lg text-[1.05rem] font-semibold w-40"
                  placeholder={isFrench ? 'AAAA-MM-JJ' : 'YYYY-MM-DD'}
                />
              </div>
            </div>
          </div>

          {/* CELI */}
          <div className="bg-white p-3 rounded-lg border-2 border-green-200">
            <h3 className="text-lg font-bold text-green-800 mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {isFrench ? 'CELI (Compte d\'épargne libre d\'impôt)' : 'TFSA (Tax-Free Savings Account)'}
            </h3>
            <div className="mpr-form-row cols-2">
              <div className="senior-field-inline">
                <label className="senior-form-label">
                  {isFrench ? 'Solde CELI' : 'TFSA Balance'}
                </label>
                <MoneyInput
                  value={totals.celi}
                  onChange={(value) => {
                    const field = personNumber === 1 ? 'soldeCELI1' : 'soldeCELI2';
                    onDataChange({ [field]: value });
                  }}
                  className="p-2 border-2 border-gray-300 rounded-lg text-[1.05rem] font-semibold w-40"
                  placeholder={isFrench ? 'Ex: 75 000' : 'Ex: 75,000'}
                  allowDecimals={true}
                />
              </div>
              <div className="senior-field-inline">
                <label className="senior-form-label">
                  {isFrench ? 'Date du solde' : 'Balance Date'}
                </label>
                <DateInput
                  value={personNumber === 1 
                    ? userData?.personal?.dateCELI1 || ''
                    : userData?.personal?.dateCELI2 || ''
                  }
                  onChange={(value) => {
                    const field = personNumber === 1 ? 'dateCELI1' : 'dateCELI2';
                    onDataChange({ [field]: value });
                  }}
                  className="p-2 border-2 border-gray-300 rounded-lg text-[1.05rem] font-semibold w-40"
                  placeholder={isFrench ? 'AAAA-MM-JJ' : 'YYYY-MM-DD'}
                />
              </div>
            </div>
          </div>

          {/* CRI */}
          <div className="bg-white p-3 rounded-lg border-2 border-yellow-200">
            <h3 className="text-lg font-bold text-yellow-800 mb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              {isFrench ? 'CRI (Compte de retraite immobilisé)' : 'LIRA (Locked-in Retirement Account)'}
            </h3>
            <div className="mpr-form-row cols-2">
              <div className="senior-field-inline">
                <label className="senior-form-label">
                  {isFrench ? 'Solde CRI' : 'LIRA Balance'}
                </label>
                <MoneyInput
                  value={totals.cri}
                  onChange={(value) => {
                    const field = personNumber === 1 ? 'soldeCRI1' : 'soldeCRI2';
                    onDataChange({ [field]: value });
                  }}
                  className="p-2 border-2 border-gray-300 rounded-lg text-[1.05rem] font-semibold w-40"
                  placeholder={isFrench ? 'Ex: 200 000' : 'Ex: 200,000'}
                  allowDecimals={true}
                />
              </div>
              <div className="senior-field-inline">
                <label className="senior-form-label">
                  {isFrench ? 'Date du solde' : 'Balance Date'}
                </label>
                <DateInput
                  value={personNumber === 1 
                    ? userData?.personal?.dateCRI1 || ''
                    : userData?.personal?.dateCRI2 || ''
                  }
                  onChange={(value) => {
                    const field = personNumber === 1 ? 'dateCRI1' : 'dateCRI2';
                    onDataChange({ [field]: value });
                  }}
                  className="p-2 border-2 border-gray-300 rounded-lg text-[1.05rem] font-semibold w-40"
                  placeholder={isFrench ? 'AAAA-MM-JJ' : 'YYYY-MM-DD'}
                />
              </div>
            </div>
          </div>

          {/* Crypto-monnaie */}
          <div className="bg-white p-3 rounded-lg border-2 border-purple-200">
            <h3 className="text-lg font-bold text-purple-800 mb-2 flex items-center gap-2">
              <span className="text-xl">₿</span>
              {isFrench ? 'Crypto-monnaie' : 'Cryptocurrency'}
            </h3>
            <div className="mpr-form-row cols-2">
              <div className="senior-field-inline">
                <label className="senior-form-label">
                  {isFrench ? 'Valeur totale crypto' : 'Total Crypto Value'}
                </label>
                <MoneyInput
                  value={totals.crypto}
                  onChange={(value) => {
                    const field = personNumber === 1 ? 'soldeCrypto1' : 'soldeCrypto2';
                    onDataChange({ [field]: value });
                  }}
                  className="p-2 border-2 border-gray-300 rounded-lg text-[1.05rem] font-semibold w-40"
                  placeholder={isFrench ? 'Ex: 25 000' : 'Ex: 25,000'}
                  allowDecimals={true}
                />
              </div>
              <div className="senior-field-inline">
                <label className="senior-form-label">
                  {isFrench ? 'Date d\'évaluation' : 'Valuation Date'}
                </label>
                <DateInput
                  value={personNumber === 1 
                    ? userData?.personal?.dateCrypto1 || ''
                    : userData?.personal?.dateCrypto2 || ''
                  }
                  onChange={(value) => {
                    const field = personNumber === 1 ? 'dateCrypto1' : 'dateCrypto2';
                    onDataChange({ [field]: value });
                  }}
                  className="p-2 border-2 border-gray-300 rounded-lg text-[1.05rem] font-semibold w-40"
                  placeholder={isFrench ? 'AAAA-MM-JJ' : 'YYYY-MM-DD'}
                />
              </div>
            </div>
          </div>

          {/* Résumé des investissements */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-4 border-green-200">
            <CardContent className="p-6">
              <h4 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-3">
                <Calculator className="w-6 h-6" />
                {isFrench ? 'Résumé des investissements' : 'Investments Summary'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(totals.reer)}
                  </div>
                  <div className="text-lg text-gray-700">
                    {isFrench ? 'REER' : 'RRSP'}
                  </div>
                </div>
                
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(totals.celi)}
                  </div>
                  <div className="text-lg text-gray-700">
                    {isFrench ? 'CELI' : 'TFSA'}
                  </div>
                </div>
                
                <div>
                  <div className="text-3xl font-bold text-yellow-600">
                    {formatCurrency(totals.cri)}
                  </div>
                  <div className="text-lg text-gray-700">
                    {isFrench ? 'CRI' : 'LIRA'}
                  </div>
                </div>
                
                <div>
                  <div className="text-3xl font-bold text-purple-600">
                    {formatCurrency(totals.crypto)}
                  </div>
                  <div className="text-lg text-gray-700">
                    {isFrench ? 'Crypto' : 'Crypto'}
                  </div>
                </div>
                
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(totals.total)}
                  </div>
                  <div className="text-lg text-gray-700">
                    {isFrench ? 'Total' : 'Total'}
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

export default InvestmentsTable;
