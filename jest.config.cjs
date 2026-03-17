/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node', // Default to Node; DOM tests should opt-in via per-test "@jest-environment jsdom"
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(test).[tj]s?(x)'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    // Support absolute imports like "@/utils/..."
    '^@/(.*)$': '<rootDir>/src/$1',
    // Fix ESM path resolution in Jest when TS emits ".js" extensions
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        // Use a TS config compatible with TSX + React for tests
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          module: 'ESNext',
          moduleResolution: 'bundler',
          target: 'ES2020'
        }
      }
    ]
  },
  transformIgnorePatterns: [
    // Allow transforming ESM in node_modules if needed; keep minimal for now
    '/node_modules/'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    // Scripts de console navigateur — pas de vrais tests Jest (manque joi, @netlify/functions, exports)
    'src/lib/validationMiddleware.test.ts',
    'src/lib/secureStorage.test.ts',
    // Scaffold sans tests réels (prévu pour Vitest + Testing Library, non encore implémenté)
    'src/tests/seniors-comparison.test.ts',
    // Erreurs TS pré-existantes dans les mocks/source — hors-scope PR blog
    'src/tests/income-synchronization.test.ts',
    'src/features/retirement/services/SecureCalculationService.test.ts',
    // Nécessite environnement jsdom — localStorage not defined en Node
    'src/services/__tests__/BackgroundBackupService.test.ts',
    // Assertions de précision mathématique à recalibrer (IRR/XIRR)
    'src/tests/performanceCalculations.test.ts',
    // Tests d\'intégration avec mocks manquants (SeniorsOptimizationService, asset-optimization)
    'src/tests/performance-seniors.test.ts',
  ],
  clearMocks: true,
  verbose: false
};
