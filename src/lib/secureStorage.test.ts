// Test simple pour vérifier le fonctionnement du SecureStorage
// À exécuter dans la console du navigateur

import { secureStorage, StorageMigration } from './secureStorage';
import { StorageMigration as MigrationUtil } from './storageMigration';

export const testSecureStorage = () => {
  console.log('🧪 Test du SecureStorage...');
  
  try {
    // Test 1: Stockage et récupération
    const testData = { 
      apiKey: 'test-key-123', 
      userId: 456, 
      timestamp: Date.now() 
    };
    
    secureStorage.setItem('test-config', testData);
    const retrieved = secureStorage.getItem('test-config');
    
    console.log('✅ Test 1 - Stockage/Récupération:', 
      JSON.stringify(retrieved) === JSON.stringify(testData) ? 'SUCCÈS' : 'ÉCHEC'
    );
    
    // Test 2: Vérification de l'existence
    const hasItem = secureStorage.hasItem('test-config');
    console.log('✅ Test 2 - Vérification existence:', hasItem ? 'SUCCÈS' : 'ÉCHEC');
    
    // Test 3: Suppression
    secureStorage.removeItem('test-config');
    const afterDelete = secureStorage.getItem('test-config');
    console.log('✅ Test 3 - Suppression:', afterDelete === null ? 'SUCCÈS' : 'ÉCHEC');
    
    // Test 4: Audit de sécurité
    const audit = MigrationUtil.auditSecurity();
    console.log('✅ Test 4 - Audit de sécurité:', {
      total: audit.total,
      secure: audit.secure.length,
      unsecure: audit.unsecure.length
    });
    
    // Test 5: Migration
    localStorage.setItem('test-unsecure', JSON.stringify({ test: 'data' }));
    const migrated = secureStorage.migrateUnsecureData('test-unsecure');
    console.log('✅ Test 5 - Migration:', migrated ? 'SUCCÈS' : 'ÉCHEC');
    
    // Nettoyage
    secureStorage.removeItem('test-unsecure');
    localStorage.removeItem('test-unsecure');
    
    console.log('🎉 Tous les tests sont passés avec succès!');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    return false;
  }
};

// Test de performance
export const testPerformance = () => {
  console.log('⚡ Test de performance...');
  
  const iterations = 100;
  const testData = { 
    large: 'x'.repeat(1000),
    timestamp: Date.now()
  };
  
  const start = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    secureStorage.setItem(`perf-test-${i}`, testData);
    secureStorage.getItem(`perf-test-${i}`);
  }
  
  const end = performance.now();
  const duration = end - start;
  const avgTime = duration / iterations;
  
  console.log(`✅ Performance: ${iterations} opérations en ${duration.toFixed(2)}ms`);
  console.log(`✅ Temps moyen par opération: ${avgTime.toFixed(2)}ms`);
  
  // Nettoyage
  for (let i = 0; i < iterations; i++) {
    secureStorage.removeItem(`perf-test-${i}`);
  }
  
  return avgTime < 10; // Moins de 10ms par opération
};

// Test de sécurité
export const testSecurity = () => {
  console.log('🔒 Test de sécurité...');
  
  const sensitiveData = {
    password: 'super-secret-password',
    apiKey: 'sk-1234567890abcdef',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  };
  
  secureStorage.setItem('sensitive', sensitiveData);
  
  // Vérifier que les données ne sont pas visibles en clair
  const rawStorage = localStorage.getItem('secure_sensitive');
  const isEncrypted = rawStorage && 
    rawStorage.includes('"data"') && 
    rawStorage.includes('"iv"') && 
    rawStorage.includes('"salt"');
  
  console.log('✅ Test de sécurité - Chiffrement:', isEncrypted ? 'SUCCÈS' : 'ÉCHEC');
  
  // Vérifier que le déchiffrement fonctionne
  const decrypted = secureStorage.getItem('sensitive');
  const isDecrypted = JSON.stringify(decrypted) === JSON.stringify(sensitiveData);
  
  console.log('✅ Test de sécurité - Déchiffrement:', isDecrypted ? 'SUCCÈS' : 'ÉCHEC');
  
  // Nettoyage
  secureStorage.removeItem('sensitive');
  
  return isEncrypted && isDecrypted;
};

// Exécution automatique des tests
export const runAllTests = () => {
  console.log('🚀 Démarrage des tests SecureStorage...\n');
  
  const results = {
    basic: testSecureStorage(),
    performance: testPerformance(),
    security: testSecurity()
  };
  
  console.log('\n📊 Résultats des tests:');
  console.log('✅ Tests de base:', results.basic ? 'SUCCÈS' : 'ÉCHEC');
  console.log('⚡ Tests de performance:', results.performance ? 'SUCCÈS' : 'ÉCHEC');
  console.log('🔒 Tests de sécurité:', results.security ? 'SUCCÈS' : 'ÉCHEC');
  
  const allPassed = Object.values(results).every(Boolean);
  console.log(`\n${allPassed ? '🎉' : '❌'} Tous les tests: ${allPassed ? 'PASSÉS' : 'ÉCHOUÉS'}`);
  
  return allPassed;
};

// Export pour utilisation dans la console
if (typeof window !== 'undefined') {
  (window as any).testSecureStorage = runAllTests;
} 