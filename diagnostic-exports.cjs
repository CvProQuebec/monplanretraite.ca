// Script de diagnostic des exports/imports
// Exécuter avec: node diagnostic-exports.js

const fs = require('fs');
const path = require('path');

// Fonction pour lire récursivement tous les fichiers TypeScript
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
      findTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Fonction pour analyser les exports d'un fichier
function analyzeExports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    const exports = [];
    const imports = [];
    
    lines.forEach((line, index) => {
      // Détecter les exports
      if (line.includes('export')) {
        const exportMatch = line.match(/export\s+(?:{([^}]+)}|(\w+))/);
        if (exportMatch) {
          const exportItems = exportMatch[1] || exportMatch[2];
          if (exportItems) {
            exportItems.split(',').forEach(item => {
              const cleanItem = item.trim().split(' as ')[0].trim();
              if (cleanItem) {
                exports.push({
                  name: cleanItem,
                  line: index + 1,
                  fullLine: line.trim()
                });
              }
            });
          }
        }
      }
      
      // Détecter les imports
      if (line.includes('import')) {
        const importMatch = line.match(/import\s+{([^}]+)}\s+from/);
        if (importMatch) {
          const importItems = importMatch[1];
          importItems.split(',').forEach(item => {
            const cleanItem = item.trim().split(' as ')[0].trim();
            if (cleanItem) {
              imports.push({
                name: cleanItem,
                line: index + 1,
                fullLine: line.trim()
              });
            }
          });
        }
      }
    });
    
    return { exports, imports };
  } catch (error) {
    return { exports: [], imports: [], error: error.message };
  }
}

// Fonction principale de diagnostic
function runDiagnostic() {
  console.log('🔍 DIAGNOSTIC DES EXPORTS/IMPORTS - MonPlanRetraite.ca\n');
  
  const srcDir = path.join(__dirname, 'src');
  const tsFiles = findTsFiles(srcDir);
  
  console.log(`📁 Fichiers TypeScript trouvés: ${tsFiles.length}\n`);
  
  const allExports = new Map();
  const allImports = new Map();
  const problems = [];
  
  // Analyser chaque fichier
  tsFiles.forEach(filePath => {
    const relativePath = path.relative(__dirname, filePath);
    const analysis = analyzeExports(filePath);
    
    if (analysis.error) {
      problems.push({
        file: relativePath,
        type: 'ERREUR_LECTURE',
        message: analysis.error
      });
      return;
    }
    
    // Enregistrer les exports
    analysis.exports.forEach(exp => {
      if (!allExports.has(exp.name)) {
        allExports.set(exp.name, []);
      }
      allExports.get(exp.name).push({
        file: relativePath,
        line: exp.line,
        fullLine: exp.fullLine
      });
    });
    
    // Enregistrer les imports
    analysis.imports.forEach(imp => {
      if (!allImports.has(imp.name)) {
        allImports.set(imp.name, []);
      }
      allImports.get(imp.name).push({
        file: relativePath,
        line: imp.line,
        fullLine: imp.fullLine
      });
    });
  });
  
  // Identifier les problèmes
  console.log('📊 ANALYSE DES EXPORTS:\n');
  allExports.forEach((locations, exportName) => {
    console.log(`✅ ${exportName}:`);
    locations.forEach(loc => {
      console.log(`   📄 ${loc.file}:${loc.line} - ${loc.fullLine}`);
    });
    console.log('');
  });
  
  console.log('📊 ANALYSE DES IMPORTS:\n');
  allImports.forEach((locations, importName) => {
    console.log(`🔍 ${importName}:`);
    locations.forEach(loc => {
      console.log(`   📄 ${loc.file}:${loc.line} - ${loc.fullLine}`);
    });
    console.log('');
  });
  
  // Identifier les imports sans exports correspondants
  console.log('⚠️  PROBLÈMES DÉTECTÉS:\n');
  allImports.forEach((locations, importName) => {
    if (!allExports.has(importName)) {
      problems.push({
        type: 'IMPORT_SANS_EXPORT',
        importName,
        locations
      });
      
      console.log(`❌ IMPORT SANS EXPORT: ${importName}`);
      locations.forEach(loc => {
        console.log(`   📄 ${loc.file}:${loc.line} - ${loc.fullLine}`);
      });
      console.log('');
    }
  });
  
  // Identifier les exports non utilisés
  allExports.forEach((locations, exportName) => {
    if (!allImports.has(exportName)) {
      console.log(`⚠️  EXPORT NON UTILISÉ: ${exportName}`);
      locations.forEach(loc => {
        console.log(`   📄 ${loc.file}:${loc.line} - ${loc.fullLine}`);
      });
      console.log('');
    }
  });
  
  // Résumé
  console.log('📋 RÉSUMÉ:');
  console.log(`   📁 Fichiers analysés: ${tsFiles.length}`);
  console.log(`   ✅ Exports uniques: ${allExports.size}`);
  console.log(`   🔍 Imports uniques: ${allImports.size}`);
  console.log(`   ❌ Problèmes détectés: ${problems.length}`);
  
  if (problems.length === 0) {
    console.log('\n🎉 Aucun problème d\'export/import détecté !');
  } else {
    console.log('\n🔧 Problèmes à résoudre:');
    problems.forEach((problem, index) => {
      console.log(`   ${index + 1}. ${problem.type}: ${problem.importName || problem.message}`);
    });
  }
}

// Exécuter le diagnostic
if (require.main === module) {
  runDiagnostic();
}

module.exports = { runDiagnostic, findTsFiles, analyzeExports };
