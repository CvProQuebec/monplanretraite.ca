// src/components/ui/CalculationDebugger.tsx
// Composant pour déboguer les calculs de revenus

import React, { useState, useEffect } from 'react';
import { CalculationTestService } from '@/services/CalculationTestService';
import { PayrollTestService } from '@/services/PayrollTestService';
import { ModuleTestService } from '@/services/ModuleTestService';
import { CalculationDiagnosticService } from '@/services/CalculationDiagnosticService';

interface CalculationDebuggerProps {
  incomeEntries: any[];
  userData?: any;
  personNumber: 1 | 2;
}

export const CalculationDebugger: React.FC<CalculationDebuggerProps> = ({
  incomeEntries,
  userData,
  personNumber
}) => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebugger, setShowDebugger] = useState(false);

  useEffect(() => {
    if (showDebugger) {
      const info = calculateDebugInfo();
      setDebugInfo(info);
    }
  }, [showDebugger, incomeEntries, userData]);

  const calculateDebugInfo = () => {
    const info = {
      personNumber,
      currentDate: new Date().toISOString().split('T')[0],
      entries: incomeEntries.map(entry => ({
        id: entry.id,
        type: entry.type,
        description: entry.description,
        isActive: entry.isActive,
        // Données de salaire
        salaryNetAmount: entry.salaryNetAmount,
        salaryFrequency: entry.salaryFrequency,
        salaryStartDate: entry.salaryStartDate,
        salaryEndDate: entry.salaryEndDate,
        salaryRevisionDate: entry.salaryRevisionDate,
        salaryRevisionAmount: entry.salaryRevisionAmount,
        // Données d'assurance emploi
        weeklyNet: entry.weeklyNet,
        eiStartDate: entry.eiStartDate,
        eiEligibleWeeks: entry.eiEligibleWeeks,
        eiRevisionDate: entry.eiRevisionDate,
        eiRevisionAmount: entry.eiRevisionAmount,
        // Données de rentes
        monthlyAmount: entry.monthlyAmount,
        annualAmount: entry.annualAmount,
        // Calculs
        toDateAmount: entry.toDateAmount,
        projectedAnnual: entry.projectedAnnual
      })),
      userData: {
        rrqMontantActuel1: userData?.retirement?.rrqMontantActuel1,
        rrqMontantActuel2: userData?.retirement?.rrqMontantActuel2,
        svMontant1: userData?.retirement?.svMontant1,
        svMontant2: userData?.retirement?.svMontant2
      }
    };

    return info;
  };

  const runTests = () => {
    console.log(`🧪 Tests de calcul pour Personne ${personNumber}:`);
    CalculationTestService.testCalculations();
    
    incomeEntries.forEach((entry, index) => {
      console.log(`\n📊 Test entrée ${index + 1}:`);
      CalculationTestService.testWithSpecificData(entry);
    });
  };

  const runPayrollTests = () => {
    console.log(`📅 Tests de calendrier de paie:`);
    PayrollTestService.runAllTests();
    PayrollTestService.compareCalculationMethods();
  };

  const runModuleTests = async () => {
    console.log(`🔧 Tests de chargement des modules:`);
    const result = await ModuleTestService.testModuleLoading();
    if (result.success) {
      console.log('✅ Tous les modules se chargent correctement');
    } else {
      console.error('❌ Erreurs de chargement:', result.errors);
    }
  };

  const runDiagnostic = () => {
    console.log(`🔍 Diagnostic des calculs:`);
    CalculationDiagnosticService.diagnoseCalculations(userData, incomeEntries, personNumber);
    CalculationDiagnosticService.testWithSampleData();
  };

  const testWithRealData = () => {
    console.log(`🧪 Test avec données réelles:`);
    
    // Vérifier les données RRQ
    const rrqMontant = personNumber === 1 ? 
      userData?.retirement?.rrqMontantActuel1 : 
      userData?.retirement?.rrqMontantActuel2;
    
    console.log(`  - RRQ Montant Actuel: ${rrqMontant || 'N/A'}$`);
    
    // Vérifier les données SV
    const svBiannual = personNumber === 1 ? 
      userData?.retirement?.svBiannual1 : 
      userData?.retirement?.svBiannual2;
    
    console.log(`  - SV Biannual: ${svBiannual ? 'Présent' : 'N/A'}`);
    
    if (svBiannual) {
      console.log(`    * Période 1 (Jan-Juin): ${svBiannual.periode1?.montant || 'N/A'}$/mois`);
      console.log(`    * Période 2 (Juil-Déc): ${svBiannual.periode2?.montant || 'N/A'}$/mois`);
      
      // Calculer le montant à ce jour
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      
      let totalToDate = 0;
      const monthsJanJuin = Math.min(6, currentMonth);
      if (monthsJanJuin > 0) {
        totalToDate += monthsJanJuin * (svBiannual.periode1?.montant || 0);
      }
      
      if (currentMonth > 6) {
        const monthsJuilDec = Math.min(6, currentMonth - 6);
        totalToDate += monthsJuilDec * (svBiannual.periode2?.montant || 0);
      }
      
      console.log(`    * Calculé à ce jour: ${totalToDate.toFixed(2)}$`);
    }
  };

  const testSalaryCalculation = () => {
    console.log(`💰 Test du calcul de salaire:`);
    
    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
    // Dates exactes de paiement selon votre tableau
    const paymentDates = [
      new Date('2025-01-02'),
      new Date('2025-01-16'),
      new Date('2025-01-30'),
      new Date('2025-02-13'),
      new Date('2025-02-27'),
      new Date('2025-03-13'),
      new Date('2025-03-27'),
      new Date('2025-04-10')
    ];
    
    console.log(`  - Date actuelle: ${today.toISOString().split('T')[0]}`);
    console.log(`  - Dates de paiement:`);
    
    let paymentsCount = 0;
    let totalAmount = 0;
    const amountPerPayment = 2720.73;
    
    paymentDates.forEach((payDate, index) => {
      const isPaid = payDate <= today;
      if (isPaid) {
        paymentsCount++;
        totalAmount += amountPerPayment;
      }
      console.log(`    ${index + 1}. ${payDate.toISOString().split('T')[0]} - ${isPaid ? '✅ Payé' : '❌ Pas encore payé'}`);
    });
    
    console.log(`  - Paiements effectués: ${paymentsCount}/8`);
    console.log(`  - Montant total: ${totalAmount.toFixed(2)}$`);
    console.log(`  - Montant attendu: 21,765.85$ (si tous les paiements sont effectués)`);
  };

  if (!showDebugger) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowDebugger(true)}
          className="bg-mpr-interactive text-white px-4 py-2 rounded-lg shadow-lg hover:bg-mpr-interactive-dk transition-colors"
        >
          🐛 Debug Calculs
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              🐛 Debug Calculs - Personne {personNumber}
            </h2>
            <button
              onClick={() => setShowDebugger(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Informations générales</h3>
              <p><strong>Date actuelle:</strong> {debugInfo?.currentDate}</p>
              <p><strong>Nombre d'entrées:</strong> {debugInfo?.entries?.length || 0}</p>
            </div>

            <div className="bg-mpr-interactive-lt p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Données utilisateur (RRQ/SV)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>RRQ Personne 1:</strong> {debugInfo?.userData?.rrqMontantActuel1 || 'N/A'}$</p>
                  <p><strong>SV Personne 1:</strong> {debugInfo?.userData?.svMontant1 || 'N/A'}$</p>
                </div>
                <div>
                  <p><strong>RRQ Personne 2:</strong> {debugInfo?.userData?.rrqMontantActuel2 || 'N/A'}$</p>
                  <p><strong>SV Personne 2:</strong> {debugInfo?.userData?.svMontant2 || 'N/A'}$</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Entrées de revenus</h3>
              {debugInfo?.entries?.map((entry: any, index: number) => (
                <div key={entry.id} className="border border-gray-200 rounded p-3 mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p><strong>Type:</strong> {entry.type}</p>
                      <p><strong>Description:</strong> {entry.description || 'Sans nom'}</p>
                      <p><strong>Actif:</strong> {entry.isActive ? 'Oui' : 'Non'}</p>
                    </div>
                    <div className="text-right">
                      <p><strong>À ce jour:</strong> {entry.toDateAmount?.toFixed(2) || '0.00'}$</p>
                      <p><strong>Projeté annuel:</strong> {entry.projectedAnnual?.toFixed(2) || '0.00'}$</p>
                    </div>
                  </div>
                  
                  {entry.type === 'salaire' && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Montant: {entry.salaryNetAmount}$ {entry.salaryFrequency}</p>
                      <p>Période: {entry.salaryStartDate} à {entry.salaryEndDate || 'aujourd\'hui'}</p>
                      {entry.salaryRevisionDate && (
                        <p>Révision: {entry.salaryRevisionDate} → {entry.salaryRevisionAmount}$</p>
                      )}
                    </div>
                  )}
                  
                  {entry.type === 'assurance-emploi' && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Montant: {entry.weeklyNet}$/semaine</p>
                      <p>Période: {entry.eiStartDate} ({entry.eiEligibleWeeks} semaines)</p>
                      {entry.eiRevisionDate && (
                        <p>Révision: {entry.eiRevisionDate} → {entry.eiRevisionAmount}$</p>
                      )}
                    </div>
                  )}
                  
                  {entry.type === 'rentes' && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Montant: {entry.monthlyAmount}$/mois</p>
                      <p>Annuel: {entry.annualAmount}$/an</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={runTests}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                🧪 Tests de calcul
              </button>
              <button
                onClick={runPayrollTests}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                📅 Tests calendrier de paie
              </button>
              <button
                onClick={runModuleTests}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                🔧 Tests modules
              </button>
              <button
                onClick={runDiagnostic}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                🔍 Diagnostic
              </button>
              <button
                onClick={testWithRealData}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                🧪 Test données réelles
              </button>
              <button
                onClick={testSalaryCalculation}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                💰 Test salaire
              </button>
              <button
                onClick={() => {
                  console.log('📊 Debug Info:', debugInfo);
                }}
                className="bg-mpr-interactive text-white px-4 py-2 rounded-lg hover:bg-mpr-interactive-dk transition-colors"
              >
                📋 Log dans la console
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
