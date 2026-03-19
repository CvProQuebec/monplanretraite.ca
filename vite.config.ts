import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Normalize paths to forward slashes so manualChunks checks work cross-OS
const norm = (p: string) => p.replace(/\\/g, '/');

export default defineConfig(({ mode }) => {
  const isAnalyze = mode === 'analyze';

  return {
    plugins: [
      react()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      port: 3001, // Port pour MonPlanRetraite.ca
      open: true
    },
    // Use esbuild (default) and drop console/debugger in prod builds
    esbuild: {
      drop: ['console', 'debugger']
    },
    build: {
      outDir: 'dist',
      // Only enable sourcemaps when analyzing to keep bundles lean by default
      sourcemap: isAnalyze,
      chunkSizeWarningLimit: 1500,
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            const pid = norm(id);

            // Séparer les gros modules financiers
            if (
              pid.includes('/src/config/financial-assumptions') ||
              pid.includes('/src/config/cpm2014-mortality-table')
            ) {
              return 'financial-core';
            }

            if (
              pid.includes('/src/features/retirement/services/AnalyticsService') ||
              pid.includes('/src/features/retirement/services/AdvancedMonteCarloService')
            ) {
              return 'analytics';
            }

            if (
              pid.includes('/src/services/ProfessionalReportGenerator') ||
              pid.includes('/src/services/reports/UnifiedReportManager')
            ) {
              return 'reports';
            }

            if (
              pid.includes('/src/components/charts') ||
              pid.includes('/src/components/visualization')
            ) {
              return 'charts';
            }

            if (
              pid.includes('/src/services/CompetitiveComparisonService') ||
              pid.includes('/src/components/comparison')
            ) {
              return 'comparison';
            }

            // Group date libraries into a single chunk to avoid circular init/TDZ issues across chunks
            if (pid.includes('date-fns')) {
              return 'date-lib';
            }

            // Content/Markdown processing libs (heavy) — split further to keep chunks < 500 kB
            if (pid.includes('markdown-it')) {
              return 'markdown';
            }
            if (pid.includes('gray-matter')) {
              return 'matter';
            }

            // Keep jsPDF with its importers to avoid cross-chunk init cycles.
            if (pid.includes('html2canvas')) {
              return 'html2canvas';
            }

            // Animation libs (heavy)
            if (pid.includes('framer-motion')) {
              return 'motion';
            }

            if (pid.includes('lucide-react')) return 'icons';
            if (pid.includes('firebase')) return 'firebase';

            return undefined;
          }
        }
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: ['@vite/client', '@vite/env']
    }
  };
});
