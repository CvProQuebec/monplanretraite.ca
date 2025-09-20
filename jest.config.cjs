/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node', // Switch to 'jsdom' if you add DOM/React tests and install 'jest-environment-jsdom'
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
        tsconfig: 'tsconfig.json'
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
