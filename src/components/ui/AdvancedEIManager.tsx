import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import DateInput from '@/components/ui/DateInput';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MoneyInput from '@/components/ui/MoneyInput';
import { 
  Calculator, 
  Calendar, 
  DollarSign, 
  Info, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  FileText
} from 'lucide-react';
import { 
  AdvancedIncomeCalculator, 
  EmploymentPeriod, 
  EICalculationResult,
  TransitionRecommendation 
} from '@/services/AdvancedIncomeCalculator';

interface AdvancedEIManagerProps {
  personNumber: 1 | 2;
  personName: string;
  birthDate: string;
  onDataChange: (data: any) => void;
  isFrench: boolean;
}

interface EIData {
  // Période d'emploi précédente
  employmentStartDate: string;
  employmentEndDate: string;
  employmentGrossIncome: number;
  
  // Détails assurance emploi
  eiStartDate: string;
  eiWeeklyGross: number;
  eiFederalTax: number;
  eiProvincialTax: number;
  eiMaxWeeks: number;
  eiWeeksUsed: number;
  
  // Revenus supplémentaires
  additionalWeeklyIncome: number;
  plannedVacationWeeks: number;
  
  // Calculs
  calculationResult?: EICalculationResult;
}

const AdvancedEIManager: React.FC<AdvancedEIManagerProps> = ({
  personNumber,
  personName,
  birthDate,
  onDataChange,
  isFrench
}) => {
  
  const [eiData, setEIData] = useState<EIData>({
    employmentStartDate: '',
    employmentEndDate: '',
    employmentGrossIncome: 0,
    eiStartDate: '',
    eiWeeklyGross: 0,
    eiFederalTax: 0,
    eiProvincialTax: 0,
    eiMaxWeeks: 35,
    eiWeeksUsed: 0,
    additionalWeeklyIncome: 0,
    plannedVacationWeeks: 0
  });
  
  const [showCalculations, setShowCalculations] = useState(false);
  
  // Calcul automatique quand les données changent
  useEffect(() => {
    if (eiData.employmentStartDate && eiData.eiStartDate && eiData.eiWeeklyGross > 0) {
      calculateEIDetails();
    }
  }, [eiData]);
  
  const calculateEIDetails = () => {
    const periods: EmploymentPeriod[] = [];
    
    // Période d'emploi
    if (eiData.employmentStartDate && eiData.employmentEndDate) {
      periods.push({
        id: 'employment',
        type: 'employment',
        startDate: eiData.employmentStartDate,
        endDate: eiData.employmentEndDate,
        grossAmount: eiData.employmentGrossIncome
      });
    }
    
    // Période d'assurance emploi
    if (eiData.eiStartDate) {
      const currentDate = new Date().toISOString().split('T')[0];
      periods.push({
        id: 'ei',
        type: 'ei',
        startDate: eiData.eiStartDate,
        endDate: currentDate,
        grossAmount: eiData.eiWeeklyGross,
        deductions: {
          federalTax: eiData.eiFederalTax,
          provincialTax: eiData.eiProvincialTax
        },
        details: {
          weeklyRate: eiData.eiWeeklyGross,
          maxWeeks: eiData.eiMaxWeeks,
          weeksUsed: eiData.eiWeeksUsed
        }
      });
    }
    
    if (periods.length > 0 && birthDate) {
      const result = AdvancedIncomeCalculator.calculateEIDetails(periods, birthDate);
      setEIData(prev => ({ ...prev, calculationResult: result }));
      onDataChange({ ...eiData, calculationResult: result });
    }
  };
  
  const handleInputChange = (field: keyof EIData, value: any) => {
    setEIData(prev => ({ ...prev, [field]: value }));
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-CA');
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-900/20 text-red-200';
      case 'medium': return 'border-yellow-400 bg-yellow-900/20 text-yellow-200';
      case 'low': return 'border-blue-400 bg-blue-900/20 text-blue-200';
      default: return 'border-gray-400 bg-gray-900/20 text-gray-200';
    }
  };
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Info className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };
  
  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader className="border-b border-gray-300">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Calculator className="w-8 h-8 text-gray-600" />
          {isFrench ? 'Assurance emploi Avancée' : 'Advanced Employment Insurance'} - {personName}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {isFrench 
            ? 'Gestion complète des périodes d\'emploi et transitions'
            : 'Complete management of employment periods and transitions'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4 ei-compact">
        
        {/* Section Assurance emploi */}
        <div className="space-y-2 p-3 bg-slate-800/10 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {isFrench ? 'Assurance emploi' : 'Employment Insurance'}
          </h3>
          
          <div className="space-y-2">
            {/* Ligne 1: Date de début AE + Montant hebdomadaire brut */}
            <div className="senior-form-row-double">
              <div className="senior-form-field">
                <label className="senior-form-label text-gray-200">
                  {isFrench ? 'Date de début AE' : 'EI Start Date'}
                </label>
                <DateInput
                  value={eiData.eiStartDate}
                  onChange={(value) => handleInputChange('eiStartDate', value)}
                  className="senior-form-input bg-slate-700 border-slate-600 text-white"
                  placeholder="2024-04-06"
                />
              </div>
              <div className="senior-form-field">
                <label className="senior-form-label text-gray-200">
                  {isFrench ? 'Montant hebdomadaire brut' : 'Weekly Gross Amount'}
                </label>
                <MoneyInput
                  value={eiData.eiWeeklyGross}
                  onChange={(value) => handleInputChange('eiWeeklyGross', value)}
                  className="senior-form-input bg-slate-700 border-slate-600 text-white"
                  placeholder="693"
                  allowDecimals={true}
                />
              </div>
            </div>

            {/* Ligne 2: Semaines max + utilisées + Impôt fédéral */}
            <div className="senior-form-row-triple">
              <div className="senior-form-field">
                <label className="senior-form-label text-gray-200">
                  {isFrench ? 'Semaines maximum' : 'Maximum Weeks'}
                </label>
                <Input
                  type="number"
                  value={eiData.eiMaxWeeks}
                  onChange={(e) => handleInputChange('eiMaxWeeks', Number(e.target.value))}
                  className="senior-form-input bg-slate-700 border-slate-600 text-white"
                  placeholder="35"
                  min="1"
                  max="50"
                />
              </div>
              <div className="senior-form-field">
                <label className="senior-form-label text-gray-200">
                  {isFrench ? 'Semaines utilisées' : 'Weeks Used'}
                </label>
                <Input
                  type="number"
                  value={eiData.eiWeeksUsed}
                  onChange={(e) => handleInputChange('eiWeeksUsed', Number(e.target.value))}
                  className="senior-form-input bg-slate-700 border-slate-600 text-white"
                  placeholder="20"
                  min="0"
                  max={eiData.eiMaxWeeks}
                />
              </div>
              <div className="senior-form-field">
                <label className="senior-form-label text-gray-200">
                  {isFrench ? 'Impôt fédéral (hebdo)' : 'Federal Tax (weekly)'}
                </label>
                <MoneyInput
                  value={eiData.eiFederalTax}
                  onChange={(value) => handleInputChange('eiFederalTax', value)}
                  className="senior-form-input bg-slate-700 border-slate-600 text-white"
                  placeholder="21"
                  allowDecimals={true}
                />
              </div>
            </div>

            {/* Ligne 2b: Impôt provincial seul */}
            <div className="senior-form-row-single">
              <div className="senior-form-field">
                <label className="senior-form-label text-gray-200">
                  {isFrench ? 'Impôt provincial (hebdo)' : 'Provincial Tax (weekly)'}
                </label>
                <MoneyInput
                  value={eiData.eiProvincialTax}
                  onChange={(value) => handleInputChange('eiProvincialTax', value)}
                  className="senior-form-input bg-slate-700 border-slate-600 text-white"
                  placeholder="37"
                  allowDecimals={true}
                />
              </div>
            </div>

            {/* Ligne 3: Description revenus supplémentaires */}
            <div className="text-xs text-gray-400">
              {isFrench ? 'Revenus supplémentaires, travail à temps partiel, freelance' : 'Additional income, part-time work, freelance'}
            </div>

            {/* Ligne 4: Revenu hebdo + Semaines de vacances prévues */}
            <div className="senior-form-row-double">
              <div className="senior-form-field">
                <label className="senior-form-label text-gray-200">
                  {isFrench ? 'Revenu hebdomadaire' : 'Weekly Income'}
                </label>
                <MoneyInput
                  value={eiData.additionalWeeklyIncome}
                  onChange={(value) => handleInputChange('additionalWeeklyIncome', value)}
                  className="senior-form-input bg-slate-700 border-slate-600 text-white"
                  placeholder="0"
                  allowDecimals={true}
                />
              </div>
              <div className="senior-form-field">
                <label className="senior-form-label text-gray-200">
                  {isFrench ? 'Semaines de vacances prévues' : 'Planned Vacation Weeks'}
                </label>
                <Input
                  type="number"
                  value={eiData.plannedVacationWeeks}
                  onChange={(e) => handleInputChange('plannedVacationWeeks', Number(e.target.value))}
                  className="senior-form-input bg-slate-700 border-slate-600 text-white"
                  placeholder="0"
                  min="0"
                  max="2"
                />
              </div>
            </div>
          </div>
        </div>
        
        
        {/* Bouton de calcul */}
        <div className="text-center">
          <Button
            onClick={() => {
              calculateEIDetails();
              setShowCalculations(true);
            }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-8"
          >
            <Calculator className="w-5 h-5 mr-2" />
            {isFrench ? 'Calculer les projections' : 'Calculate Projections'}
          </Button>
        </div>
        
        {/* Résultats des calculs */}
        {showCalculations && eiData.calculationResult && (
          <div className="space-y-6 mt-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6" />
              {isFrench ? 'Analyse détaillée' : 'Detailed Analysis'}
            </h3>
            
            {/* Résumé financier */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {eiData.calculationResult.weeksRemaining}
                  </div>
                  <div className="text-sm text-gray-300">
                    {isFrench ? 'Semaines restantes' : 'Weeks Remaining'}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {formatCurrency(eiData.calculationResult.netWeeklyAmount)}
                  </div>
                  <div className="text-sm text-gray-300">
                    {isFrench ? 'Net hebdomadaire' : 'Weekly Net'}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {formatDate(eiData.calculationResult.estimatedEndDate)}
                  </div>
                  <div className="text-sm text-gray-300">
                    {isFrench ? 'Fin estimée' : 'Estimated End'}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Impact des revenus supplémentaires */}
            {eiData.additionalWeeklyIncome > 0 && (
              <Alert className="border-yellow-400 bg-yellow-900/20 text-yellow-200">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>{isFrench ? 'Impact des revenus supplémentaires :' : 'Additional Income Impact:'}</strong>
                  <br />
                  {(() => {
                    const impact = AdvancedIncomeCalculator.calculateIncomeImpact(
                      eiData.eiWeeklyGross,
                      eiData.additionalWeeklyIncome
                    );
                    return (
                      <div className="mt-2">
                        <div>{impact.explanation}</div>
                        <div className="mt-1">
                          {isFrench ? 'AE net après déduction : ' : 'Net EI after deduction: '}
                          <strong>{formatCurrency(impact.netEI)}</strong>
                        </div>
                        {impact.canExtend && (
                          <div className="text-green-300 mt-1">
                            ✅ {isFrench ? 'Peut prolonger la période d\'AE' : 'Can extend EI period'}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </AlertDescription>
              </Alert>
            )}
            
            {/* Recommandations de transition */}
            {eiData.calculationResult.transitionRecommendations.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">
                  {isFrench ? 'Recommandations de transition' : 'Transition Recommendations'}
                </h4>
                
                {eiData.calculationResult.transitionRecommendations.map((rec, index) => (
                  <Alert key={index} className={getPriorityColor(rec.priority)}>
                    {getPriorityIcon(rec.priority)}
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="font-semibold text-lg">
                          {rec.type === 'rrq' && (isFrench ? '🏛️ Régime de Rentes du Québec' : '🏛️ Quebec Pension Plan')}
                          {rec.type === 'sv' && (isFrench ? '🛡️ Sécurité de la vieillesse' : '🛡️ Old Age Security')}
                          {rec.type === 'employment' && (isFrench ? '💼 Recherche d\'emploi' : '💼 Job Search')}
                          {rec.type === 'training' && (isFrench ? '🎓 Formation' : '🎓 Training')}
                        </div>
                        
                        <div><strong>{isFrench ? 'Timing :' : 'Timing:'}</strong> {rec.timing}</div>
                        <div><strong>{isFrench ? 'Raison :' : 'Reason:'}</strong> {rec.reason}</div>
                        
                        {rec.impact.monthlyIncome && (
                          <div>
                            <strong>{isFrench ? 'Impact financier :' : 'Financial Impact:'}</strong> {formatCurrency(rec.impact.monthlyIncome)}/mois
                          </div>
                        )}
                        
                        <div>
                          <strong>{isFrench ? 'Prochaines étapes :' : 'Next Steps:'}</strong>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            {rec.nextSteps.map((step, stepIndex) => (
                              <li key={stepIndex} className="text-sm">{step}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedEIManager;
