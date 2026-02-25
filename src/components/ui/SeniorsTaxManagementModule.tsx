import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Building, School, RefreshCw, Info, Plus, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SeniorsFriendlyInput from '../forms/SeniorsFriendlyInput';
import SeniorsAmountDisplay from '../display/SeniorsAmountDisplay';

interface TaxPayment {
  id: string;
  date: string;
  amount: number;
  isPaid: boolean;
  description?: string;
}

interface MunicipalTaxData {
  totalAmount: number;
  municipality: string;
  year: number;
  payments: TaxPayment[];
  customDates: boolean;
}

interface SchoolTaxData {
  totalAmount: number;
  year: number;
  payments: TaxPayment[];
}

interface SeniorsTaxManagementModuleProps {
  municipalTaxData: MunicipalTaxData;
  schoolTaxData: SchoolTaxData;
  onMunicipalTaxUpdate: (data: MunicipalTaxData) => void;
  onSchoolTaxUpdate: (data: SchoolTaxData) => void;
  onSyncToHousing: (municipalAmount: number, schoolAmount: number) => void;
  language: 'fr' | 'en';
}

const SeniorsTaxManagementModule: React.FC<SeniorsTaxManagementModuleProps> = ({
  municipalTaxData,
  schoolTaxData,
  onMunicipalTaxUpdate,
  onSchoolTaxUpdate,
  onSyncToHousing,
  language
}) => {
  const isFrench = language === 'fr';
  
  const [municipalData, setMunicipalData] = useState<MunicipalTaxData>(municipalTaxData);
  const [schoolData, setSchoolData] = useState<SchoolTaxData>(schoolTaxData);

  // Initialiser avec des paiements vides
  useEffect(() => {
    if (municipalData.payments.length === 0) {
      const payments: TaxPayment[] = [{
        id: `municipal-1`,
        date: '',
        amount: 0,
        isPaid: false,
        description: 'Paiement 1'
      }];
      
      setMunicipalData(prev => ({ ...prev, payments }));
    }
  }, []);

  useEffect(() => {
    if (schoolData.payments.length === 0) {
      const payments: TaxPayment[] = [{
        id: `school-1`,
        date: '',
        amount: 0,
        isPaid: false,
        description: 'Paiement 1'
      }];
      
      setSchoolData(prev => ({ ...prev, payments }));
    }
  }, []);

  // Gestion des taxes municipales
  const handleMunicipalAmountChange = (amount: number) => {
    setMunicipalData(prev => ({ ...prev, totalAmount: amount }));
  };

  const handleMunicipalPaymentChange = (paymentId: string, field: 'date' | 'amount', value: string | number) => {
    const updatedPayments = municipalData.payments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, [field]: value }
        : payment
    );
    
    const updatedData = {
      ...municipalData,
      payments: updatedPayments
    };
    
    setMunicipalData(updatedData);
    onMunicipalTaxUpdate(updatedData);
  };

  const addMunicipalPayment = () => {
    const newPayment: TaxPayment = {
      id: `municipal-${Date.now()}`,
      date: '',
      amount: 0,
      isPaid: false,
      description: `Paiement ${municipalData.payments.length + 1}`
    };
    
    const updatedData = {
      ...municipalData,
      payments: [...municipalData.payments, newPayment],
      customDates: true
    };
    
    setMunicipalData(updatedData);
    onMunicipalTaxUpdate(updatedData);
  };

  const removeMunicipalPayment = (paymentId: string) => {
    const updatedPayments = municipalData.payments.filter(p => p.id !== paymentId);
    const updatedData = {
      ...municipalData,
      payments: updatedPayments
    };
    
    setMunicipalData(updatedData);
    onMunicipalTaxUpdate(updatedData);
  };

  // Gestion des taxes scolaires
  const handleSchoolAmountChange = (amount: number) => {
    setSchoolData(prev => ({ ...prev, totalAmount: amount }));
  };

  const handleSchoolPaymentChange = (paymentId: string, field: 'date' | 'amount', value: string | number) => {
    const updatedPayments = schoolData.payments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, [field]: value }
        : payment
    );
    
    const updatedData = {
      ...schoolData,
      payments: updatedPayments
    };
    
    setSchoolData(updatedData);
    onSchoolTaxUpdate(updatedData);
  };

  // Sauvegarder les données localement
  useEffect(() => {
    const taxData = {
      municipal: municipalData,
      school: schoolData,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('tax_management_data', JSON.stringify(taxData));
  }, [municipalData, schoolData]);

  // Charger les données sauvegardées
  useEffect(() => {
    const savedData = localStorage.getItem('tax_management_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.municipal) {
          setMunicipalData(parsed.municipal);
        }
        if (parsed.school) {
          setSchoolData(parsed.school);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données de taxes:', error);
      }
    }
  }, []);

  // Synchroniser avec la section Logement
  const handleSyncToHousing = () => {
    const municipalMonthly = municipalData.totalAmount / 12;
    const schoolMonthly = schoolData.totalAmount / 12;
    onSyncToHousing(municipalMonthly, schoolMonthly);
  };

  // Calculer l'équivalent mensuel
  const calculateMonthlyEquivalent = (totalAmount: number) => {
    return totalAmount / 12;
  };


  return (
    <div className="space-y-8">
      {/* Taxes Municipales */}
      <Card className="border-l-4 border-l-blue-500 seniors-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-mpr-navy text-2xl">
            <Building className="w-6 h-6" />
            {isFrench ? 'Taxes Municipales' : 'Municipal Taxes'}
            <Badge variant="outline" className="ml-auto text-lg px-3 py-1">
              <RefreshCw className="w-4 h-4 mr-1" />
              {isFrench ? 'Synchronisé' : 'Synced'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration générale */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SeniorsFriendlyInput
                label={isFrench ? 'Montant total annuel' : 'Total annual amount'}
                type="number"
                value={municipalData.totalAmount}
                onChange={(e) => handleMunicipalAmountChange(parseFloat(e.target.value) || 0)}
                placeholder="3600"
                helpText={isFrench ? 'Montant total des taxes municipales pour l\'année' : 'Total municipal taxes for the year'}
                className="h-16 text-lg"
              />
            </div>
            <div>
              <SeniorsFriendlyInput
                label={isFrench ? 'Année' : 'Year'}
                type="number"
                value={municipalData.year}
                onChange={(e) => setMunicipalData({...municipalData, year: parseInt(e.target.value) || 2025})}
                placeholder="2025"
                helpText={isFrench ? 'Année des taxes' : 'Tax year'}
                className="h-16 text-lg"
              />
            </div>
          </div>

          {/* Paiements détaillés */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg text-gray-700">
                {isFrench ? 'Dates et montants des paiements' : 'Payment dates and amounts'}
              </h4>
              <Button 
                onClick={addMunicipalPayment}
                className="bg-mpr-interactive hover:bg-mpr-interactive-dk text-white h-12 px-4"
              >
                <Plus className="w-5 h-5 mr-2" />
                {isFrench ? 'Ajouter un paiement' : 'Add payment'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {municipalData.payments.map((payment, index) => (
                <div key={payment.id} className={`p-4 rounded-lg border-2 ${
                  isDatePassed(payment.date) 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-mpr-interactive-lt border-mpr-border'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-semibold text-mpr-navy">
                      {isFrench ? `Paiement ${index + 1}` : `Payment ${index + 1}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant={payment.isPaid ? "default" : "secondary"} className="text-sm">
                        {payment.isPaid ? (isFrench ? 'Payé' : 'Paid') : (isFrench ? 'En attente' : 'Pending')}
                      </Badge>
                      {municipalData.customDates && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMunicipalPayment(payment.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <SeniorsFriendlyInput
                        label={isFrench ? 'Date de paiement (AAAA-MM-JJ)' : 'Payment date (YYYY-MM-DD)'}
                        type="text"
                        value={payment.date}
                        onChange={(e) => handleMunicipalPaymentChange(payment.id, 'date', e.target.value)}
                        placeholder="2025-03-15"
                        helpText={isFrench ? 'Format: AAAA-MM-JJ (ex: 2025-03-15)' : 'Format: YYYY-MM-DD (ex: 2025-03-15)'}
                        className="h-16 text-lg"
                      />
                    </div>
                    <div>
                      <SeniorsFriendlyInput
                        label={isFrench ? 'Montant' : 'Amount'}
                        type="number"
                        value={payment.amount}
                        onChange={(e) => handleMunicipalPaymentChange(payment.id, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        helpText={isFrench ? 'Montant à payer à cette date' : 'Amount to pay on this date'}
                        className="h-16 text-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Résumé */}
          <div className="bg-mpr-interactive-lt p-4 rounded-lg border-2 border-mpr-border">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg text-mpr-navy">
                {isFrench ? 'Équivalent mensuel' : 'Monthly equivalent'}
              </span>
              <SeniorsAmountDisplay 
                amount={calculateMonthlyEquivalent(municipalData.totalAmount)}
                className="text-2xl font-bold text-mpr-navy"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Taxes Scolaires */}
      <Card className="border-l-4 border-l-green-500 seniors-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-green-800 text-2xl">
            <School className="w-6 h-6" />
            {isFrench ? 'Taxes Scolaires' : 'School Taxes'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration générale */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SeniorsFriendlyInput
                label={isFrench ? 'Montant total annuel' : 'Total annual amount'}
                type="number"
                value={schoolData.totalAmount}
                onChange={(e) => handleSchoolAmountChange(parseFloat(e.target.value) || 0)}
                placeholder="800"
                helpText={isFrench ? 'Montant total des taxes scolaires pour l\'année' : 'Total school taxes for the year'}
                className="h-16 text-lg"
              />
            </div>
            <div>
              <SeniorsFriendlyInput
                label={isFrench ? 'Année' : 'Year'}
                type="number"
                value={schoolData.year}
                onChange={(e) => setSchoolData({...schoolData, year: parseInt(e.target.value) || 2025})}
                placeholder="2025"
                helpText={isFrench ? 'Année des taxes' : 'Tax year'}
                className="h-16 text-lg"
              />
            </div>
          </div>

          <Alert className="border-orange-200 bg-orange-50">
            <Info className="h-5 w-5 text-orange-600" />
            <AlertDescription className="text-orange-800 text-lg">
              {isFrench 
                ? '2 versements : Août et Novembre (dates modifiables ci-dessous)' 
                : '2 payments: August and November (dates adjustable below)'
              }
            </AlertDescription>
          </Alert>

          {/* Paiements détaillés */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-gray-700">
              {isFrench ? 'Dates et montants des paiements' : 'Payment dates and amounts'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schoolData.payments.map((payment, index) => (
                <div key={payment.id} className={`p-4 rounded-lg border-2 ${
                  isDatePassed(payment.date) 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-semibold text-green-800">
                      {isFrench ? `Paiement ${index + 1}` : `Payment ${index + 1}`}
                    </span>
                    <Badge variant={payment.isPaid ? "default" : "secondary"} className="text-sm">
                      {payment.isPaid ? (isFrench ? 'Payé' : 'Paid') : (isFrench ? 'En attente' : 'Pending')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <SeniorsFriendlyInput
                        label={isFrench ? 'Date de paiement (AAAA-MM-JJ)' : 'Payment date (YYYY-MM-DD)'}
                        type="text"
                        value={payment.date}
                        onChange={(e) => handleSchoolPaymentChange(payment.id, 'date', e.target.value)}
                        placeholder="2025-08-01"
                        helpText={isFrench ? 'Format: AAAA-MM-JJ (ex: 2025-08-01)' : 'Format: YYYY-MM-DD (ex: 2025-08-01)'}
                        className="h-16 text-lg"
                      />
                    </div>
                    <div>
                      <SeniorsFriendlyInput
                        label={isFrench ? 'Montant' : 'Amount'}
                        type="number"
                        value={payment.amount}
                        onChange={(e) => handleSchoolPaymentChange(payment.id, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        helpText={isFrench ? 'Montant à payer à cette date' : 'Amount to pay on this date'}
                        className="h-16 text-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Résumé */}
          <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg text-green-800">
                {isFrench ? 'Équivalent mensuel' : 'Monthly equivalent'}
              </span>
              <SeniorsAmountDisplay 
                amount={calculateMonthlyEquivalent(schoolData.totalAmount)}
                className="text-2xl font-bold text-green-900"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bouton de synchronisation */}
      <div className="flex justify-center">
        <Button 
          onClick={handleSyncToHousing}
          className="bg-mpr-interactive hover:bg-mpr-interactive-dk text-white h-16 px-8 text-lg"
        >
          <RefreshCw className="w-5 h-5 mr-3" />
          {isFrench ? 'Synchroniser avec Logement' : 'Sync with Housing'}
        </Button>
      </div>
    </div>
  );
};

export default SeniorsTaxManagementModule;
