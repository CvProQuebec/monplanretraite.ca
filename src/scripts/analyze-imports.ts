import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ImportAnalysis {
  file: string;
  imports: Array<{
    statement: string;
    type: 'named' | 'default' | 'namespace' | 'side-effect';
    source: string;
    specifiers: string[];
    isMassive: boolean;
  }>;
  totalImports: number;
  massiveImports: number;
}

interface BundleImpact {
  library: string;
  totalSize: number;
  usedExports: string[];
  unusedExports: string[];
  potentialSavings: number;
}

class ImportAnalyzer {
  private analysis: ImportAnalysis[] = [];
  private bundleImpacts: Map<string, BundleImpact> = new Map();

  /**
   * Analyse tous les fichiers TypeScript/JavaScript du projet
   */
  async analyzeProject(rootDir: string = path.join(__dirname, '..')): Promise<void> {
    console.log('🔍 Analyse des imports en cours...');

    const files = this.getAllSourceFiles(rootDir);
    console.log(`📁 ${files.length} fichiers trouvés`);

    for (const file of files) {
      await this.analyzeFile(file);
    }

    this.generateReport();
  }

  /**
   * Récupère tous les fichiers source TypeScript/JavaScript
   */
  private getAllSourceFiles(dir: string): string[] {
    const files: string[] = [];

    function scanDirectory(currentDir: string): void {
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !this.shouldSkipDirectory(item)) {
          scanDirectory(fullPath);
        } else if (stat.isFile() && this.isSourceFile(item)) {
          files.push(fullPath);
        }
      }
    }

    scanDirectory.call(this, dir);
    return files;
  }

  /**
   * Détermine si un répertoire doit être ignoré
   */
  private shouldSkipDirectory(dirName: string): boolean {
    const skipDirs = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.vscode'];
    return skipDirs.includes(dirName);
  }

  /**
   * Détermine si un fichier est un fichier source
   */
  private isSourceFile(fileName: string): boolean {
    return /\.(ts|tsx|js|jsx)$/.test(fileName) && !fileName.endsWith('.d.ts');
  }

  /**
   * Analyse un fichier individuel
   */
  private async analyzeFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const imports = this.parseImports(content, filePath);

      if (imports.length > 0) {
        this.analysis.push({
          file: path.relative(process.cwd(), filePath),
          imports,
          totalImports: imports.length,
          massiveImports: imports.filter(imp => imp.isMassive).length
        });
      }
    } catch (error) {
      console.warn(`⚠️ Erreur lors de l'analyse de ${filePath}:`, error);
    }
  }

  /**
   * Parse les imports d'un fichier
   */
  private parseImports(content: string, filePath: string): ImportAnalysis['imports'][0][] {
    const imports: ImportAnalysis['imports'][0][] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Détection des imports ES6
      if (line.startsWith('import')) {
        const importInfo = this.parseImportStatement(line, filePath);
        if (importInfo) {
          imports.push(importInfo);
        }
      }

      // Détection des imports require (pour les fichiers JS)
      if (line.includes('require(') && line.includes('import')) {
        const requireMatch = line.match(/const\s+{\s*([^}]+)\s*}\s*=\s*require\(['"]([^'"]+)['"]\)/);
        if (requireMatch) {
          const [, specifiers, source] = requireMatch;
          imports.push({
            statement: line,
            type: 'named',
            source,
            specifiers: specifiers.split(',').map(s => s.trim()),
            isMassive: specifiers.trim() === '*' || specifiers.includes('* as')
          });
        }
      }
    }

    return imports;
  }

  /**
   * Parse une déclaration d'import individuelle
   */
  private parseImportStatement(line: string, filePath: string): ImportAnalysis['imports'][0] | null {
    try {
      // Import par défaut: import DefaultExport from 'module'
      const defaultMatch = line.match(/^import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/);
      if (defaultMatch) {
        const [, specifier, source] = defaultMatch;
        return {
          statement: line,
          type: 'default',
          source,
          specifiers: [specifier],
          isMassive: false
        };
      }

      // Import nommé: import { named1, named2 } from 'module'
      const namedMatch = line.match(/^import\s+{\s*([^}]+)\s*}\s+from\s+['"]([^'"]+)['"]/);
      if (namedMatch) {
        const [, specifiersStr, source] = namedMatch;
        const specifiers = specifiersStr.split(',').map(s => s.trim().replace(/\s+as\s+\w+/g, ''));
        return {
          statement: line,
          type: 'named',
          source,
          specifiers,
          isMassive: specifiers.length > 5 || specifiers.includes('*') // Considérer > 5 imports comme massif
        };
      }

      // Import namespace: import * as name from 'module'
      const namespaceMatch = line.match(/^import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]/);
      if (namespaceMatch) {
        const [, specifier, source] = namespaceMatch;
        return {
          statement: line,
          type: 'namespace',
          source,
          specifiers: [specifier],
          isMassive: true // Les imports namespace sont toujours considérés comme massifs
        };
      }

      // Import side-effect: import 'module'
      const sideEffectMatch = line.match(/^import\s+['"]([^'"]+)['"]/);
      if (sideEffectMatch) {
        const [, source] = sideEffectMatch;
        return {
          statement: line,
          type: 'side-effect',
          source,
          specifiers: [],
          isMassive: false
        };
      }

      return null;
    } catch (error) {
      console.warn(`⚠️ Erreur lors du parsing de l'import: ${line}`);
      return null;
    }
  }

  /**
   * Génère un rapport d'analyse
   */
  private generateReport(): void {
    console.log('\n📊 RAPPORT D\'ANALYSE DES IMPORTS');
    console.log('=' .repeat(50));

    // Statistiques générales
    const totalFiles = this.analysis.length;
    const totalImports = this.analysis.reduce((sum, file) => sum + file.totalImports, 0);
    const totalMassiveImports = this.analysis.reduce((sum, file) => sum + file.massiveImports, 0);

    console.log(`📁 Fichiers analysés: ${totalFiles}`);
    console.log(`📦 Imports totaux: ${totalImports}`);
    console.log(`⚠️ Imports massifs: ${totalMassiveImports}`);
    console.log(`📈 Ratio d'imports massifs: ${((totalMassiveImports / totalImports) * 100).toFixed(1)}%`);

    // Top 10 des fichiers avec le plus d'imports massifs
    console.log('\n🔥 TOP 10 - Fichiers avec imports massifs:');
    const sortedByMassive = this.analysis
      .filter(file => file.massiveImports > 0)
      .sort((a, b) => b.massiveImports - a.massiveImports)
      .slice(0, 10);

    sortedByMassive.forEach((file, index) => {
      console.log(`${index + 1}. ${file.file} (${file.massiveImports} imports massifs)`);
    });

    // Analyse par bibliothèque
    console.log('\n📚 Analyse par bibliothèque:');
    this.analyzeLibraries();

    // Recommandations
    console.log('\n💡 RECOMMANDATIONS D\'OPTIMISATION:');
    this.generateRecommendations();
  }

  /**
   * Analyse l'impact des bibliothèques
   */
  private analyzeLibraries(): void {
    const libraryStats: Map<string, { count: number; files: string[] }> = new Map();

    this.analysis.forEach(file => {
      file.imports.forEach(imp => {
        if (!imp.source.startsWith('./') && !imp.source.startsWith('../')) {
          const count = libraryStats.get(imp.source)?.count || 0;
          const files = libraryStats.get(imp.source)?.files || [];
          libraryStats.set(imp.source, {
            count: count + 1,
            files: [...files, file.file]
          });
        }
      });
    });

    // Trier par nombre d'utilisations
    const sortedLibraries = Array.from(libraryStats.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10);

    sortedLibraries.forEach(([library, stats]) => {
      console.log(`• ${library}: ${stats.count} imports dans ${stats.files.length} fichiers`);
    });
  }

  /**
   * Génère des recommandations d'optimisation
   */
  private generateRecommendations(): void {
    const recommendations: string[] = [];

    // Recommandation 1: Imports massifs
    const massiveFiles = this.analysis.filter(file => file.massiveImports > 0);
    if (massiveFiles.length > 0) {
      recommendations.push(`${massiveFiles.length} fichiers ont des imports massifs qui peuvent être optimisés`);
    }

    // Recommandation 2: Bibliothèques lourdes
    const heavyLibraries = ['recharts', 'd3', 'chart.js', 'framer-motion'];
    const usedHeavyLibs = this.analysis.flatMap(file =>
      file.imports.filter(imp => heavyLibraries.some(lib => imp.source.includes(lib)))
    );

    if (usedHeavyLibs.length > 0) {
      recommendations.push('Considérer le lazy loading pour les bibliothèques de visualisation (recharts, d3, chart.js)');
    }

    // Recommandation 3: Imports multiples de la même bibliothèque
    const libraryUsage = new Map<string, number>();
    this.analysis.forEach(file => {
      file.imports.forEach(imp => {
        if (!imp.source.startsWith('./') && !imp.source.startsWith('../')) {
          libraryUsage.set(imp.source, (libraryUsage.get(imp.source) || 0) + 1);
        }
      });
    });

    const frequentlyUsedLibs = Array.from(libraryUsage.entries())
      .filter(([, count]) => count > 5)
      .map(([lib]) => lib);

    if (frequentlyUsedLibs.length > 0) {
      recommendations.push(`Créer des fichiers d'index pour les bibliothèques fréquemment utilisées: ${frequentlyUsedLibs.join(', ')}`);
    }

    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });

    if (recommendations.length === 0) {
      console.log('✅ Aucun problème majeur détecté. Les imports sont déjà optimisés!');
    }
  }

  /**
   * Génère un fichier de rapport détaillé
   */
  generateDetailedReport(outputPath: string = 'import-analysis-report.json'): void {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalFiles: this.analysis.length,
        totalImports: this.analysis.reduce((sum, file) => sum + file.totalImports, 0),
        totalMassiveImports: this.analysis.reduce((sum, file) => sum + file.massiveImports, 0)
      },
      files: this.analysis,
      recommendations: this.generateRecommendationsText()
    };

    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`📄 Rapport détaillé généré: ${outputPath}`);
  }

  /**
   * Génère les recommandations sous forme de texte
   */
  private generateRecommendationsText(): string[] {
    // Similaire à generateRecommendations mais retourne un tableau
    const recommendations: string[] = [];

    const massiveFiles = this.analysis.filter(file => file.massiveImports > 0);
    if (massiveFiles.length > 0) {
      recommendations.push(`Optimiser ${massiveFiles.length} fichiers avec des imports massifs`);
    }

    recommendations.push('Implémenter le lazy loading pour les composants lourds');
    recommendations.push('Utiliser des imports nommés spécifiques plutôt que des imports namespace');
    recommendations.push('Créer des chunks séparés pour les fonctionnalités optionnelles');

    return recommendations;
  }
}

// Fonction principale
async function main() {
  const analyzer = new ImportAnalyzer();

  try {
    await analyzer.analyzeProject();
    analyzer.generateDetailedReport();
  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse:', error);
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ImportAnalyzer, type ImportAnalysis, type BundleImpact };
