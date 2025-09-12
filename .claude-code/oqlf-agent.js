#!/usr/bin/env node

/**
 * Agent Police OQLF - Inspecteur automatique des normes du français québécois
 * 
 * Ce script implémente un agent qui inspecte et corrige automatiquement
 * le contenu web selon les règles de l'Office québécois de la langue française.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class OQLFAgent {
    constructor() {
        this.config = this.loadConfig();
        this.ignorePatterns = this.loadIgnorePatterns();
        this.violations = [];
        this.corrections = [];
    }

    loadConfig() {
        try {
            const configPath = path.join(__dirname, 'oqlf-agent.json');
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        } catch (error) {
            console.error('Erreur lors du chargement de la configuration OQLF:', error);
            process.exit(1);
        }
    }

    loadIgnorePatterns() {
        try {
            const ignorePath = path.join(process.cwd(), '.oqlf-ignore');
            if (fs.existsSync(ignorePath)) {
                return fs.readFileSync(ignorePath, 'utf8')
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line && !line.startsWith('#'));
            }
        } catch (error) {
            console.warn('Impossible de charger .oqlf-ignore:', error.message);
        }
        return [];
    }

    shouldIgnoreFile(filePath) {
        // Extensions de code qui ne doivent jamais être modifiées
        const codeExtensions = ['.tsx', '.ts', '.jsx', '.js', '.html', '.json', '.css', '.scss', '.vue', '.svelte'];
        
        if (codeExtensions.some(ext => filePath.endsWith(ext))) {
            return true;
        }
        
        // Répertoires à ignorer complètement
        const ignoreDirectories = ['/src/', '\\src\\', '/node_modules/', '\\node_modules\\', '/.git/', '\\.git\\', '/dist/', '\\dist\\', '/build/', '\\build\\'];
        if (ignoreDirectories.some(dir => filePath.includes(dir))) {
            return true;
        }
        
        return this.ignorePatterns.some(pattern => {
            if (pattern.includes('/')) {
                return filePath.includes(pattern);
            }
            return path.basename(filePath).includes(pattern);
        });
    }

    analyzeTypography(content) {
        const violations = [];
        const rules = this.config.rules.typography;

        // Vérifier les espaces avant la ponctuation
        if (!rules.spaces_before.semicolon) {
            const semicolonMatches = content.match(/\s+;/g);
            if (semicolonMatches) {
                violations.push({
                    type: 'typography',
                    rule: 'spaces_before_semicolon',
                    count: semicolonMatches.length,
                    message: 'Espace inutile avant le point-virgule'
                });
            }
        }

        if (!rules.spaces_before.exclamation) {
            const exclamationMatches = content.match(/\s+!/g);
            if (exclamationMatches) {
                violations.push({
                    type: 'typography',
                    rule: 'spaces_before_exclamation',
                    count: exclamationMatches.length,
                    message: 'Espace inutile avant le point d\'exclamation'
                });
            }
        }

        if (!rules.spaces_before.question) {
            const questionMatches = content.match(/\s+\?/g);
            if (questionMatches) {
                violations.push({
                    type: 'typography',
                    rule: 'spaces_before_question',
                    count: questionMatches.length,
                    message: 'Espace inutile avant le point d\'interrogation'
                });
            }
        }

        // Vérifier les guillemets - DÉSACTIVÉ pour éviter de casser le code
        // Note: Cette règle modifie les guillemets dans TOUT le contenu, y compris le code
        // Elle est désactivée pour des raisons de sécurité
        if (false && rules.quotes && rules.quotes.use_french) {
            const englishQuotes = content.match(/["'][^"']*["']/g);
            if (englishQuotes) {
                violations.push({
                    type: 'typography',
                    rule: 'french_quotes',
                    count: englishQuotes.length,
                    message: 'Utiliser les guillemets français « … » (règle désactivée pour sécurité)'
                });
            }
        }

        // Vérifier le format monétaire
        const currencyMatches = content.match(/\d+\$|\$\d+/g);
        if (currencyMatches) {
            violations.push({
                type: 'typography',
                rule: 'currency_format',
                count: currencyMatches.length,
                message: 'Format monétaire incorrect (utiliser : 1 234,56 $)'
            });
        }

        return violations;
    }

    analyzeCapitalization(content) {
        const violations = [];
        const rules = this.config.rules.capitalization;

        if (rules.titles === 'first_word_only') {
            // Rechercher les titres avec trop de majuscules
            const titleMatches = content.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi);
            if (titleMatches) {
                titleMatches.forEach(title => {
                    const titleText = title.replace(/<[^>]+>/g, '');
                    const words = titleText.split(' ');
                    const capitalizedWords = words.filter(word => 
                        word.length > 0 && word[0] === word[0].toUpperCase()
                    );
                    
                    if (capitalizedWords.length > 1) {
                        violations.push({
                            type: 'capitalization',
                            rule: 'title_capitalization',
                            content: titleText,
                            message: 'Titre : seul le premier mot en majuscule'
                        });
                    }
                });
            }
        }

        return violations;
    }

    analyzeLanguage(content) {
        const violations = [];
        const rules = this.config.rules.language;

        if (rules.no_anglicisms) {
            const replacements = this.config.custom_rules.brand_names.replace;
            
            Object.entries(replacements).forEach(([anglicism, french]) => {
                const regex = new RegExp(`\\b${anglicism}\\b`, 'gi');
                const matches = content.match(regex);
                
                if (matches) {
                    violations.push({
                        type: 'language',
                        rule: 'anglicism',
                        count: matches.length,
                        anglicism: anglicism,
                        french: french,
                        message: `Remplacer "${anglicism}" par "${french}"`
                    });
                }
            });
        }

        return violations;
    }

    applyCorrections(content, violations, autoApply = false) {
        let correctedContent = content;
        const corrections = [];

        violations.forEach(violation => {
            switch (violation.rule) {
                case 'spaces_before_semicolon':
                    correctedContent = correctedContent.replace(/\s+;/g, ';');
                    corrections.push('Espaces supprimés avant les points-virgules');
                    break;

                case 'spaces_before_exclamation':
                    correctedContent = correctedContent.replace(/\s+!/g, '!');
                    corrections.push('Espaces supprimés avant les points d\'exclamation');
                    break;

                case 'spaces_before_question':
                    correctedContent = correctedContent.replace(/\s+\?/g, '?');
                    corrections.push('Espaces supprimés avant les points d\'interrogation');
                    break;

                case 'french_quotes':
                    // DÉSACTIVÉ - Cette règle était dangereuse et modifiait le code
                    // correctedContent = correctedContent.replace(/"([^"]*)"/g, '« $1 »');
                    // correctedContent = correctedContent.replace(/'([^']*)'/g, '« $1 »');
                    corrections.push('Règle guillemets français désactivée pour sécurité');
                    break;

                case 'anglicism':
                    const regex = new RegExp(`\\b${violation.anglicism}\\b`, 'gi');
                    correctedContent = correctedContent.replace(regex, violation.french);
                    corrections.push(`"${violation.anglicism}" remplacé par "${violation.french}"`);
                    break;
            }
        });

        return { correctedContent, corrections };
    }

    extractFrenchSections(content) {
        // Extraire uniquement les textes français marqués avec isFrench
        const frenchSections = [];
        
        // Pattern 1: {isFrench? "texte français" : "english text"}
        const ternaryPattern = /\{isFrench\?\s*["'`]([^"'`]*?)["'`]\s*:\s*["'`]([^"'`]*?)["'`]\}/g;
        let match;
        while ((match = ternaryPattern.exec(content)) !== null) {
            frenchSections.push({
                text: match[1],
                start: match.index,
                end: match.index + match[0].length,
                context: 'ternary'
            });
        }
        
        // Pattern 2: isFrench && "texte français"
        const andPattern = /isFrench\s*&&\s*["'`]([^"'`]*?)["'`]/g;
        while ((match = andPattern.exec(content)) !== null) {
            frenchSections.push({
                text: match[1],
                start: match.index,
                end: match.index + match[0].length,
                context: 'conditional'
            });
        }
        
        // Pattern 3: isFrench ? "texte" : null/undefined
        const nullPattern = /isFrench\s*\?\s*["'`]([^"'`]*?)["'`]\s*:\s*(?:null|undefined)/g;
        while ((match = nullPattern.exec(content)) !== null) {
            frenchSections.push({
                text: match[1],
                start: match.index,
                end: match.index + match[0].length,
                context: 'null_conditional'
            });
        }
        
        return frenchSections;
    }

    inspectFile(filePath) {
        if (this.shouldIgnoreFile(filePath)) {
            return null;
        }

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Extraire seulement les sections françaises
            const frenchSections = this.extractFrenchSections(content);
            
            if (frenchSections.length === 0) {
                return {
                    file: filePath,
                    violations: [],
                    score: 100,
                    message: 'Aucun texte français détecté (isFrench pattern)'
                };
            }
            
            // Analyser seulement le contenu français
            let allViolations = [];
            frenchSections.forEach(section => {
                const sectionViolations = [
                    ...this.analyzeTypography(section.text),
                    ...this.analyzeCapitalization(section.text),
                    ...this.analyzeLanguage(section.text)
                ];
                allViolations = [...allViolations, ...sectionViolations];
            });

            return {
                file: filePath,
                violations: allViolations,
                frenchSections: frenchSections.length,
                score: this.calculateConformityScore(allViolations, frenchSections.reduce((sum, s) => sum + s.text.length, 0))
            };
        } catch (error) {
            console.error(`Erreur lors de l'inspection de ${filePath}:`, error.message);
            return null;
        }
    }

    calculateConformityScore(violations, contentLength) {
        if (contentLength === 0) return 100;
        
        const totalViolations = violations.reduce((sum, v) => sum + (v.count || 1), 0);
        const penalty = Math.min(totalViolations * 2, 90); // Maximum 90% de pénalité
        
        return Math.max(10, 100 - penalty);
    }

    inspectProject(directory = '.') {
        console.log('🔍 Inspection OQLF en cours...\n');

        const filePatterns = this.config.file_patterns;
        let allFiles = [];

        filePatterns.forEach(pattern => {
            const files = glob.sync(pattern, { 
                cwd: directory,
                absolute: true,
                ignore: this.ignorePatterns 
            });
            allFiles = [...allFiles, ...files];
        });

        const results = [];
        let totalViolations = 0;

        allFiles.forEach(file => {
            const result = this.inspectFile(file);
            if (result) {
                results.push(result);
                totalViolations += result.violations.length;
            }
        });

        this.generateReport(results, totalViolations);
        return results;
    }

    generateReport(results, totalViolations) {
        console.log('📊 RAPPORT DE CONFORMITÉ OQLF');
        console.log('================================\n');

        const totalFiles = results.length;
        const filesWithViolations = results.filter(r => r.violations.length > 0).length;
        const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalFiles;

        console.log(`📁 Fichiers analysés : ${totalFiles}`);
        console.log(`⚠️  Fichiers avec violations : ${filesWithViolations}`);
        console.log(`🚨 Total des violations : ${totalViolations}`);
        console.log(`📈 Score moyen de conformité : ${averageScore.toFixed(1)}%\n`);

        // Détail par fichier
        results.forEach(result => {
            if (result.violations && result.violations.length > 0) {
                console.log(`📄 ${result.file} (Score: ${result.score}%) - ${result.frenchSections || 0} sections françaises`);
                result.violations.forEach(violation => {
                    console.log(`   • ${violation.message}`);
                    if (violation.count) {
                        console.log(`     (${violation.count} occurrence${violation.count > 1 ? 's' : ''})`);
                    }
                });
                console.log('');
            } else if (result.message) {
                console.log(`📄 ${result.file} - ${result.message}`);
            }
        });

        // Recommandations
        console.log('💡 RECOMMANDATIONS');
        console.log('==================');
        
        if (averageScore >= 90) {
            console.log('✅ Excellent ! Votre contenu respecte très bien les normes OQLF.');
        } else if (averageScore >= 70) {
            console.log('⚡ Bon travail ! Quelques améliorations mineures sont suggérées.');
        } else {
            console.log('🔧 Des améliorations importantes sont recommandées pour la conformité OQLF.');
        }
        
        console.log('\n🚀 Pour appliquer les corrections automatiquement :');
        console.log('   node .claude-code/oqlf-agent.js --fix');
    }

    applyCorrectionsToFrenchSections(content, violations) {
        let correctedContent = content;
        const corrections = [];
        
        // Extraire les sections françaises
        const frenchSections = this.extractFrenchSections(content);
        
        frenchSections.forEach(section => {
            const { correctedContent: sectionCorrected, corrections: sectionCorrections } = 
                this.applyCorrections(section.text, violations, true);
            
            if (sectionCorrections.length > 0) {
                // Remplacer uniquement cette section française dans le contenu complet
                correctedContent = correctedContent.substring(0, section.start) + 
                    correctedContent.substring(section.start, section.end).replace(section.text, sectionCorrected) +
                    correctedContent.substring(section.end);
                
                corrections.push(...sectionCorrections);
            }
        });
        
        return { correctedContent, corrections };
    }

    fixProject(directory = '.') {
        console.log('🔧 Correction automatique OQLF (sections isFrench uniquement)...\n');

        const results = this.inspectProject(directory);
        let totalCorrections = 0;

        results.forEach(result => {
            if (result.violations && result.violations.length > 0) {
                try {
                    const originalContent = fs.readFileSync(result.file, 'utf8');
                    const { correctedContent, corrections } = this.applyCorrectionsToFrenchSections(
                        originalContent, 
                        result.violations
                    );

                    if (corrections.length > 0) {
                        fs.writeFileSync(result.file, correctedContent, 'utf8');
                        console.log(`✅ ${result.file} corrigé (${corrections.length} corrections sur ${result.frenchSections || 0} sections françaises)`);
                        corrections.forEach(correction => {
                            console.log(`   • ${correction}`);
                        });
                        totalCorrections += corrections.length;
                        console.log('');
                    }
                } catch (error) {
                    console.error(`❌ Erreur lors de la correction de ${result.file}:`, error.message);
                }
            }
        });

        console.log(`🎉 Correction terminée ! ${totalCorrections} corrections appliquées aux textes français seulement.`);
    }
}

// Interface en ligne de commande
const isMain = import.meta.url.endsWith(path.basename(process.argv[1]));
if (isMain) {
    const args = process.argv.slice(2);
    const agent = new OQLFAgent();

    if (args.includes('--fix') || args.includes('-f')) {
        agent.fixProject();
    } else if (args.includes('--help') || args.includes('-h')) {
        console.log(`
🇫🇷 Agent Police OQLF - Inspecteur des normes du français québécois

UTILISATION :
  node .claude-code/oqlf-agent.js [OPTIONS]

OPTIONS :
  --fix, -f     Appliquer les corrections automatiquement
  --help, -h    Afficher cette aide

EXEMPLES :
  node .claude-code/oqlf-agent.js                  # Inspection seulement
  node .claude-code/oqlf-agent.js --fix            # Inspection + corrections
        `);
    } else {
        agent.inspectProject();
    }
}

export default OQLFAgent;