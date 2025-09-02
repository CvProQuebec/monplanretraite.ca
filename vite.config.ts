import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001, // Port pour MonPlanRetraite.ca
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 500,
    target: 'es2020',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // Séparer les gros modules financiers
          if (id.includes('./src/config/financial-assumptions') ||
              id.includes('./src/config/cpm2014-mortality-table')) {
            return 'financial-core';
          }

          if (id.includes('./src/features/retirement/services/AnalyticsService') ||
              id.includes('./src/features/retirement/services/AdvancedMonteCarloService')) {
            return 'analytics';
          }

          if (id.includes('./src/services/ProfessionalReportGenerator') ||
              id.includes('./src/services/reports/UnifiedReportManager')) {
            return 'reports';
          }

          if (id.includes('./src/components/charts') ||
              id.includes('./src/components/visualization')) {
            return 'charts';
          }

          if (id.includes('./src/services/CompetitiveComparisonService') ||
              id.includes('./src/components/comparison')) {
            return 'comparison';
          }

          // Group date libraries into a single chunk to avoid circular init/TDZ issues across chunks
          if (id.includes('date-fns') || id.includes('@date-fns') || id.includes('date-fns-jalali')) {
            return 'date-lib';
          }

          // Split large areas for better initial load for seniors
          if (id.includes('/features/retirement/services')) return 'retirement-services';
          if (id.includes('/services/')) return 'core-services';
          if (id.includes('/features/retirement/components')) return 'retirement-components';
          if (id.includes('/components/ui')) return 'ui-components';
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('@radix-ui')) return 'radix';
          if (id.includes('react-router')) return 'router';
          if (id.includes('firebase')) return 'firebase';

          return undefined;
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@vite/client', '@vite/env']
  }
})
