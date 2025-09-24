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
  clearMocks: true,
  verbose: false
};
