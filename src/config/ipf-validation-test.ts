/**
 * Test de validation des constantes IPF 2025
 * Vérifie que toutes les valeurs sont conformes aux normes officielles
 */

import { FINANCIAL_ASSUMPTIONS, FINANCIAL_UTILS, VALIDATION } from './financial-assumptions';

export function validateIPF2025Compliance(): {
  isCompliant: boolean;
  results: Array<{ test: string; expected: number; actual: number; status: 'PASS' | 'FAIL' }>;
  summary: string;
} {
  const results = [];
  
  // Tests des valeurs IPF 2025 officielles
  const tests = [
    { name: 'Inflation', expected: 0.021, actual: FINANCIAL_ASSUMPTIONS.INFLATION },
    { name: 'Court terme', expected: 0.024, actual: FINANCIAL_ASSUMPTIONS.COURT_TERME },
    { name: 'Revenu fixe', expected: 0.034, actual: FINANCIAL_ASSUMPTIONS.REVENU_FIXE },
    { name: 'Actions canadiennes', expected: 0.066, actual: FINANCIAL_ASSUMPTIONS.ACTIONS_CANADIENNES },
    { name: 'Actions américaines', expected: 0.066, actual: FINANCIAL_ASSUMPTIONS.ACTIONS_AMERICAINES },
    { name: 'Actions internationales', expected: 0.069, actual: FINANCIAL_ASSUMPTIONS.ACTIONS_INTERNATIONALES },
    { name: 'Actions marchés émergents', expected: 0.080, actual: FINANCIAL_ASSUMPTIONS.ACTIONS_EMERGENTS },
    { name: 'Taux d\'emprunt', expected: 0.044, actual: FINANCIAL_ASSUMPTIONS.TAUX_EMPRUNT },
    { name: 'Croissance salaire', expected: 0.031, actual: FINANCIAL_ASSUMPTIONS.CROISSANCE_SALAIRE }
  ];
  
  for (const test of tests) {
    const tolerance = 0.0001; // Tolérance de 0.01%
    const isMatch = Math.abs(test.expected - test.actual) < tolerance;
    
    results.push({
      test: test.name,
      expected: test.expected,
      actual: test.actual,
      status: isMatch ? 'PASS' : 'FAIL'
    });
  }
  
  // Test de la conversion Monte Carlo
  const geometricRate = 0.066; // Actions canadiennes
  const volatility = 0.16;
  const arithmeticRate = FINANCIAL_UTILS.convertGeometricToArithmetic(geometricRate, volatility, true);
  const expectedArithmetic = geometricRate + (volatility * volatility / 2) + 0.005; // Formule IPF
  
  results.push({
    test: 'Conversion géométrique->arithmétique',
    expected: expectedArithmetic,
    actual: arithmeticRate,
    status: Math.abs(expectedArithmetic - arithmeticRate) < 0.0001 ? 'PASS' : 'FAIL'
  });
  
  // Validation générale
  const validation = VALIDATION.validateAssumptions();
  results.push({
    test: 'Validation générale des hypothèses',
    expected: 1, // True
    actual: validation.isValid ? 1 : 0,
    status: validation.isValid ? 'PASS' : 'FAIL'
  });
  
  const passedTests = results.filter(r => r.status === 'PASS').length;
  const totalTests = results.length;
  const isCompliant = passedTests === totalTests;
  
  const summary = `✅ Tests IPF 2025: ${passedTests}/${totalTests} réussis (${((passedTests/totalTests)*100).toFixed(1)}%)`;
  
  return {
    isCompliant,
    results,
    summary
  };
}

// Test automatique au chargement du module
if (typeof window !== 'undefined') {
  console.log('🔍 Validation IPF 2025 en cours...');
  const validation = validateIPF2025Compliance();
  
  if (validation.isCompliant) {
    console.log('✅ CONFORMITÉ IPF 2025 VALIDÉE');
    console.log(validation.summary);
  } else {
    console.warn('⚠️ PROBLÈMES DE CONFORMITÉ DÉTECTÉS');
    console.table(validation.results.filter(r => r.status === 'FAIL'));
  }
}

export default validateIPF2025Compliance;
