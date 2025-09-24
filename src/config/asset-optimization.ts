// Optimisation des assets pour seniors
export const OPTIMIZED_ASSETS = {
  // Images optimisées
  images: {
    format: 'webp',        // Format moderne mais avec fallback
    quality: 85,           // Balance qualité/taille
    lazyLoading: true,     // Chargement différé
    maxWidth: 1200         // Limite résolution
  },

  // Fonts optimisées pour seniors
  fonts: {
    preload: ['Inter-Regular', 'Inter-SemiBold'], // Seulement les weights utilisés
    fallback: 'system-ui, sans-serif',
    display: 'swap'        // Éviter invisible text period
  },

  // Icons optimisés
  icons: {
    format: 'svg',         // Vector = léger
    inline: true,          // Inline pour petites icônes
    spriteSheet: false     // Éviter pour simplicité seniors
  }
};

// Configuration de préchargement intelligent
export const PRELOAD_CONFIG = {
  // Précharger selon parcours utilisateur typique seniors
  critical: [
    '/src/pages/Accueil.tsx',
    '/src/pages/MaRetraite.tsx',
    '/src/components/SeniorsLoadingSpinner.tsx'
  ],

  // Précharger au hover/navigation
  onDemand: [
    '/src/pages/ComparisonPage.tsx',
    '/src/features/retirement/components/optimization/MonteCarloSimulator.tsx',
    '/src/services/ProfessionalReportGenerator.ts'
  ]
};

// Cache des assets statiques
export const ASSET_CACHE_CONFIG = {
  // Cache long terme pour assets statiques
  static: {
    maxAge: 31536000, // 1 an
    immutable: true
  },

  // Cache court pour assets dynamiques
  dynamic: {
    maxAge: 86400, // 24h
    staleWhileRevalidate: true
  }
};
