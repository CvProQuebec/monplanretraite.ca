#!/usr/bin/env node

/**
 * Script de réparation complète pour tous les dégâts causés par l'Agent OQLF
 * Corrige les guillemets français (« ») ramenés aux guillemets anglais (") dans le code
 */

import fs from 'fs';
import path from 'path';
import glob from 'glob';

const patterns = [
  'src/**/*.ts',
  'src/**/*.tsx', 
  'src/**/*.js',
  'src/**/*.jsx',
  '*.html',
  '*.json'
];

function fixOQLFDamageInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let changes = [];
    
    // 1. Corriger les imports avec guillemets français
    // Exemple: import { Card } from « ./card »; -> import { Card } from "./card";
    const beforeImports = content;
    content = content.replace(/import\s+([^;]+?)\s+from\s+«\s*([^»]+?)\s*»\s*;/g, 'import $1 from "$2";');
    content = content.replace(/import\s+«\s*([^»]+?)\s*»\s*;/g, 'import "$1";');
    content = content.replace(/from\s+«\s*([^»]+?)\s*»/g, 'from "$1"');
    if (content !== beforeImports) changes.push('imports corrompus');
    
    // 2. Corriger les strings avec guillemets français dans les constantes et variables
    // Exemple: const name = « value »; -> const name = "value";
    const beforeStrings = content;
    content = content.replace(/=\s*«\s*([^»]*?)\s*»/g, '= "$1"');
    content = content.replace(/:\s*«\s*([^»]*?)\s*»/g, ': "$1"');
    if (content !== beforeStrings) changes.push('strings constantes');
    
    // 3. Corriger les attributs d'éléments avec guillemets français
    // Exemple: className=« text-center » -> className="text-center"  
    const beforeAttributes = content;
    content = content.replace(/(\w+)=\s*«\s*([^»]*?)\s*»/g, '$1="$2"');
    if (content !== beforeAttributes) changes.push('attributs HTML/JSX');
    
    // 4. Corriger les chaînes dans les tableaux/objets
    // Exemple: options: [« value1 », « value2 »] -> options: ["value1", "value2"]
    const beforeArrays = content;
    content = content.replace(/\[\s*«\s*([^»]*?)\s*»/g, '["$1"');
    content = content.replace(/,\s*«\s*([^»]*?)\s*»/g, ', "$1"');
    content = content.replace(/«\s*([^»]*?)\s*»\s*\]/g, '"$1"]');
    if (content !== beforeArrays) changes.push('tableaux et objets');
    
    // 5. Corriger les conditions avec guillemets français  
    // Exemple: if (language === « fr ») -> if (language === "fr")
    const beforeConditions = content;
    content = content.replace(/(===|==|!==|!=)\s*«\s*([^»]*?)\s*»/g, '$1 "$2"');
    content = content.replace(/«\s*([^»]*?)\s*»\s*(===|==|!==|!=)/g, '"$1" $2');
    if (content !== beforeConditions) changes.push('conditions et comparaisons');
    
    // 6. Corriger les types TypeScript
    // Exemple: userPlan: « free » | « professional » -> userPlan: "free" | "professional"
    const beforeTypes = content;
    content = content.replace(/«\s*([^»]*?)\s*»\s*\|/g, '"$1" |');
    content = content.replace(/\|\s*«\s*([^»]*?)\s*»/g, '| "$1"');
    content = content.replace(/:\s*«\s*([^»]*?)\s*»\s*>/g, ': "$1">');
    if (content !== beforeTypes) changes.push('types TypeScript');
    
    // 7. Corriger les guillemets français isolés en fin de chaîne
    // Exemple: "text » -> "text"
    const beforeTrailing = content;
    content = content.replace(/"\s*([^"]*?)\s*»/g, '"$1"');
    content = content.replace(/«\s*([^"]*?)\s*"/g, '"$1"');
    if (content !== beforeTrailing) changes.push('guillemets isolés');
    
    // 8. Corriger les patterns spécifiques vus dans les erreurs
    const beforeSpecific = content;
    
    // Pattern: "J\"attends -> "J'attends  
    content = content.replace(/"([JLNSTDM])\\"([a-zA-ZÀ-ÿ])/g, '"$1\'$2');
    
    // Pattern: "Actions d"entreprises -> "Actions d'entreprises"
    content = content.replace(/"([^"]*[a-zA-Z])\s*"\s*([a-zA-ZÀ-ÿ])/g, '"$1\'$2');
    
    // Pattern spécifique pour Layout import dans App.tsx
    content = content.replace(/import Layout from\s*«\s*([^»]+?)\s*»/g, 'import Layout from "$1"');
    
    // Pattern pour les chaînes non terminées dans Accueil.tsx
    content = content.replace(/{isFrench\?\s*«\s*([^»]*?)\s*:\s*«\s*([^»]*?)\s*»}/g, '{isFrench? "$1" : "$2"}');
    
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
  console.log('🔧 Réparation complète des dégâts OQLF...\n');
  
  let totalFixed = 0;
  const foundFiles = [];
  
  patterns.forEach(pattern => {
    const files = glob.sync(pattern);
    foundFiles.push(...files);
  });
  
  console.log(`📁 ${foundFiles.length} fichiers trouvés à analyser\n`);
  
  foundFiles.forEach(file => {
    if (fixOQLFDamageInFile(file)) {
      totalFixed++;
    }
  });
  
  console.log(`\n🎉 Réparation terminée ! ${totalFixed} fichiers corrigés.`);
  console.log('\n🔍 Vérifiez maintenant avec: npm run dev');
}

main();