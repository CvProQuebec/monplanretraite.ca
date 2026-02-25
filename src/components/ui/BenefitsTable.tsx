import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Plus, Calculator, Shield, Flag, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/features/retirement/utils/formatters';
import RRQManager from './RRQManager';
import SVBiannualManager from './SVBiannualManager';
import PrivatePensionManager from './PrivatePensionManager';
import AdvancedEIManager from './AdvancedEIManager';
import { AdvancedIncomeCalculator, EmploymentPeriod } from '@/services/AdvancedIncomeCalculator';

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

  // Migration légère: si les données AE existent encore sous personal.*, les copier vers retirement.*
  useEffect(() => {
    try {
      const field = personNumber === 1 ? 'advancedEI1' : 'advancedEI2';
      const hasNew = Boolean(userData?.retirement?.[field]);
      const legacy = personNumber === 1 ? userData?.personal?.advancedEI1 : userData?.personal?.advancedEI2;

      if (!hasNew && legacy && (legacy.eiStartDate || legacy.eiWeeklyGross)) {
        onDataChange({ [field]: legacy });
      }
    } catch {
      // Pas critique: fallback lecture dans getEITotalToDate couvre l'usage
    }
  }, [personNumber, userData?.retirement, userData?.personal, onDataChange]);

  // Calcul AE à ce jour (back-compat: lecture depuis retirement.* ou personal.*)
  const getEITotalToDate = () => {
    try {
      const personIdx = personNumber === 1 ? 1 : 2;
      const birthDate = personNumber === 1 ? userData?.personal?.naissance1 : userData?.personal?.naissance2;
      // Lire d'abord la nouvelle localisation (retirement), sinon retomber sur l'ancienne (personal)
      const eiData = personNumber === 1
        ? (userData?.retirement?.advancedEI1 || userData?.personal?.advancedEI1)
        : (userData?.retirement?.advancedEI2 || userData?.personal?.advancedEI2);

      if (!birthDate || !eiData || !eiData.eiStartDate) {
        return 0;
      }

      const currentDate = new Date().toISOString().split('T')[0];

      const periods: EmploymentPeriod[] = [
        {
          id: `ei-${personIdx}`,
          type: 'ei',
          startDate: eiData.eiStartDate,
          endDate: currentDate,
          grossAmount: eiData.eiWeeklyGross || 0,
          deductions: {
            federalTax: eiData.eiFederalTax || 0,
            provincialTax: eiData.eiProvincialTax || 0
          },
          details: {
            weeklyRate: eiData.eiWeeklyGross || 0,
            maxWeeks: eiData.eiMaxWeeks || 35,
            weeksUsed: eiData.eiWeeksUsed || 0
          }
        }
      ];

      const result = AdvancedIncomeCalculator.calculateEIDetails(periods, birthDate, currentDate);
      const maxWeeks = periods[0].details?.maxWeeks || 35;
      const weeksCount = Math.min(result.totalWeeksUsed, maxWeeks);
      const toDate = weeksCount * (result.netWeeklyAmount || 0);
      return isFinite(toDate) && !isNaN(toDate) ? toDate : 0;
    } catch {
      return 0;
    }
  };

  // Calculer les totaux des prestations
  const getBenefitsTotals = () => {
    const totals = {
      rrq: 0,
      securiteVieillesse: 0,
      rentesPrivees: 0,
      assuranceEmploi: 0,
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

      // Rentes privées automatiques depuis userData
      const privatePensions = personNumber === 1 
        ? userData.retirement.privatePensions1 || []
        : userData.retirement.privatePensions2 || [];
      
      if (privatePensions.length > 0) {
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        
        totals.rentesPrivees = privatePensions.reduce((total, pension) => {
          if (!pension.isActive) return total;
          
          const startDate = new Date(pension.startDate);
          const startMonth = startDate.getMonth() + 1;
          const startYear = startDate.getFullYear();
          
          // Calculer le nombre de mois depuis le début
          const monthsElapsed = (currentYear - startYear) * 12 + (currentMonth - startMonth);
          const monthsCompleted = Math.max(0, monthsElapsed);
          
          // Calculer le montant selon la fréquence
          let monthlyAmount = pension.monthlyAmount;
          if (pension.frequency === 'quarterly') {
            monthlyAmount = pension.monthlyAmount / 3;
          } else if (pension.frequency === 'annually') {
            monthlyAmount = pension.monthlyAmount / 12;
          }
          
          return total + (monthlyAmount * monthsCompleted);
        }, 0);
      }
    }

    totals.assuranceEmploi = getEITotalToDate();
    totals.total = totals.rrq + totals.securiteVieillesse + totals.rentesPrivees + totals.assuranceEmploi;
    return totals;
  };

  const totals = getBenefitsTotals();

  return (
    <Card className="bg-gradient-to-r from-mpr-interactive-lt to-mpr-interactive-lt border-4 border-mpr-border shadow-xl">
      <CardHeader className="border-b-4 border-mpr-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-mpr-navy flex items-center gap-3">
            <div className="w-10 h-10 bg-mpr-interactive rounded-full flex items-center justify-center text-white font-bold text-xl">
              {personNumber}
            </div>
            {isFrench ? 'Prestations' : 'Benefits'} - {personName}
          </CardTitle>
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="text-mpr-interactive hover:text-mpr-navy"
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
            personName={personName}
            userData={userData}
            onDataChange={onDataChange}
            isFrench={isFrench}
          />

          {/* Section Sécurité de la vieillesse */}
          <SVBiannualManager
            personNumber={personNumber}
            personName={personName}
            data={personNumber === 1 
              ? userData?.retirement?.svBiannual1 
              : userData?.retirement?.svBiannual2}
            onDataChange={(data) => {
              const field = personNumber === 1 ? 'svBiannual1' : 'svBiannual2';
              onDataChange({ [field]: data });
            }}
            isFrench={isFrench}
          />

          {/* Section Assurance emploi */}
          <div className="bg-white p-6 rounded-lg border-2 border-mpr-border">
            <h3 className="text-xl font-bold text-mpr-navy mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              {isFrench ? 'Assurance emploi (AE)' : 'Employment Insurance (EI)'}
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <AdvancedEIManager
                personNumber={personNumber}
                personName={personName}
                birthDate={(personNumber === 1 ? userData?.personal?.naissance1 : userData?.personal?.naissance2) || ''}
                onDataChange={(data) => {
                  const field = personNumber === 1 ? 'advancedEI1' : 'advancedEI2';
                  // Écrire sous retirement.* (nouvelle localisation)
                  onDataChange({ [field]: data });
                }}
                isFrench={isFrench}
              />

              <div className="senior-field-inline">
                <label className="senior-form-label">
                  {isFrench ? 'Montant à ce jour' : 'Amount to Date'}
                </label>
                <div className="p-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-lg font-bold text-mpr-interactive">
                  {formatCurrency(totals.assuranceEmploi)}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                  {isFrench
                    ? 'Calculé automatiquement à partir de la date de début et du taux hebdomadaire'
                    : 'Automatically calculated from start date and weekly rate'
                  }
                </p>
              </div>
            </div>

          {/* Section Rentes privées */}
          <PrivatePensionManager
            personNumber={personNumber}
            personName={personName}
            userData={userData}
            onDataChange={onDataChange}
            isFrench={isFrench}
          />

        </CardContent>
      )}
    </Card>
  );
};

export default BenefitsTable;
