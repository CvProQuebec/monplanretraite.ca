/* ESLint Boundaries Config — UI/Domaine/Services
   Objectif: empêcher les dépendances inverses et clarifier les couches.
   Utilise le rule core "no-restricted-imports" + overrides (pas de plugin requis).
   Commande: npm run lint:boundaries
*/
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: ['react-hooks'],
  rules: {
    // Eviter les erreurs lorsque des directives font référence à cette règle sans charger le plugin par défaut
    'react-hooks/exhaustive-deps': 'off'
  },
  ignorePatterns: [
    'dist/**',
    'node_modules/**',
    'public/**',
    // Modules marketing (longs brouillons UI) — ignorés pour "lint:boundaries" uniquement
    'src/components/ui/AssetConsolidationModule.tsx',
    'src/components/ui/CashWedgeBucketModule.tsx',
    'src/components/ui/TaxEducationCenter.tsx',
    'src/components/ui/TenTipsDashboard.tsx',
    'src/components/ui/FERROptimizationModule.tsx'
  ],
  overrides: [
    // UI (pages, components) ne doivent pas importer directement les workers
    {
      files: ['src/pages/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@/workers/*', 'src/workers/*', '../workers/*', '../../workers/*'],
                message: 'UI (pages/components) ne doit pas importer les workers directement. Passez via un service/adapter.',
              },
              {
                group: ['@/services/tax/*', 'src/services/tax/*', '../services/tax/*', '../../services/tax/*'],
                message: 'UI (pages/components) ne doit pas importer services/tax/* directement. Utiliser le contrat de domaine (RetirementDomainAdapter) ou un helper.',
              },
            ],
          },
        ],
      },
    },

    // Services ne doivent pas dépendre de la UI (pages/components)
    {
      files: ['src/services/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@/pages/*', 'src/pages/*', '../pages/*', '../../pages/*'],
                message: 'Services ne doivent pas dépendre des pages (UI).',
              },
              {
                group: ['@/components/*', 'src/components/*', '../components/*', '../../components/*'],
                message: 'Services ne doivent pas dépendre des composants UI.',
              },
            ],
          },
        ],
      },
    },

    // Routes: éviter d’appeler les services/workers directement (laisser les pages gérer).
    {
      files: ['src/routes/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@/services/*', 'src/services/*', '../services/*', '../../services/*'],
                message: 'Routes ne doivent pas importer directement les services. Importer les pages/components; la logique se trouve dans la UI ou les hooks.',
              },
              {
                group: ['@/workers/*', 'src/workers/*', '../workers/*', '../../workers/*'],
                message: 'Routes ne doivent pas importer les workers.',
              },
            ],
          },
        ],
      },
    },
    // Exception temporaire: Laboratoire d’optimisation (réf à services/tax) — à migrer ultérieurement
    {
      files: ['src/components/ui/TaxOptimizationLab.tsx'],
      rules: {
        'no-restricted-imports': 'off'
      }
    },
  ],
};
