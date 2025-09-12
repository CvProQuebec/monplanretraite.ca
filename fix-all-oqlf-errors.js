#!/usr/bin/env node

/**
 * Script complet pour corriger toutes les erreurs causées par l'Agent OQLF
 */

import fs from 'fs';
import path from 'path';
import glob from 'glob';

const patterns = [
  'src/**/*.ts',
  'src/**/*.tsx',
  'src/**/*.js', 
  'src/**/*.jsx'
];

function fixAllErrorsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let changes = [];
    
    // 1. Corriger les apostrophes échappées incorrectement dans les chaînes
    const beforeApostrophes = content;
    content = content.replace(/([a-zA-ZÀ-ÿ])\\\"([a-zA-ZÀ-ÿ])/g, '$1\'$2');
    content = content.replace(/"([JLNSTDM])\\\"([a-zA-ZÀ-ÿ])/g, '"$1\'$2');
    if (content !== beforeApostrophes) changes.push('apostrophes échappées');
    
    // 2. Corriger les chaînes non terminées (pattern : "/en') -> "/en")
    const beforeUnterminated = content;
    content = content.replace(/\"([^\"]*)\'\)/g, '"$1")');
    content = content.replace(/\"([^\"]*)\'/g, '"$1"');
    if (content !== beforeUnterminated) changes.push('chaînes non terminées');
    
    // 3. Corriger les imports avec des noms de fichiers traduits
    const beforeImports = content;
    content = content.replace(/advanced-mise à niveau-modal/g, 'advanced-upgrade-modal');
    content = content.replace(/\"([^\"]*mise à niveau[^\"]*)\"/g, '"$1"'.replace('mise à niveau', 'upgrade'));
    if (content !== beforeImports) changes.push('noms de fichiers traduits');
    
    // 4. Corriger les guillemets cassés dans les chaînes (pattern: "text"autre -> "text autre")
    const beforeBrokenQuotes = content;
    content = content.replace(/\"([^\"]*)\"\s*([^,\]\)\}\s;][^,\]\)\}\s;]*)\s*\"/g, '"$1 $2"');
    content = content.replace(/\"([^\"]*)\"\s*([a-zA-ZÀ-ÿ])/g, '"$1 $2');
    if (content !== beforeBrokenQuotes) changes.push('guillemets cassés');
    
    // 5. Corriger les patterns spécifiques problématiques
    const beforeSpecific = content;
    // Pattern: "Actions d"entreprises -> "Actions d'entreprises"
    content = content.replace(/\"([^\"]*)\"\s*([a-zA-ZÀ-ÿ][^,\]\)\}\"]*)\s*\"/g, '"$1$2"');
    content = content.replace(/\"([^\"]*[a-zA-Z])\s*\"\s*([a-zA-ZÀ-ÿ])/g, '"$1$2');
    
    // Corriger spécifiquement les patterns comme "text d"autre
    content = content.replace(/\"([^\"]*d)\"\s*([a-zA-ZÀ-ÿ])/g, '"$1\'$2');
    content = content.replace(/\"([^\"]*l)\"\s*([a-zA-ZÀ-ÿ])/g, '"$1\'$2');
    
    if (content !== beforeSpecific) changes.push('patterns spécifiques');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corrigé: ${filePath} (${changes.join(', ')})`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erreur dans ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔧 Correction complète des erreurs OQLF...\n');
  
  let totalFixed = 0;
  
  patterns.forEach(pattern => {
    const files = glob.sync(pattern);
    
    files.forEach(file => {
      if (fixAllErrorsInFile(file)) {
        totalFixed++;
      }
    });
  });
  
  console.log(`\n🎉 Correction terminée ! ${totalFixed} fichiers corrigés.`);
}

main();