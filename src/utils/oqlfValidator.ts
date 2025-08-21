// Validateur OQLF pour vérifier la conformité des textes français
// selon les normes de l'Office Québécois de la langue française

export interface OQLFValidationResult {
  text: string;
  rule: string;
  status: 'valid' | 'invalid' | 'warning';
  message: string;
  suggestion?: string;
}

export class OQLFValidator {
  private static rules = {
    // Règle 1: Seulement le premier mot d'un titre porte la majuscule
    titleCapitalization: {
      pattern: /^[A-ZÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ][a-zàâäéèêëïîôùûüÿç\s'-]+$/,
      message: 'Seulement le premier mot d\'un titre doit porter la majuscule',
      suggestion: 'Exemple: "Vue d\'ensemble" au lieu de "Vue D\'ensemble"'
    },

    // Règle 2: Espace fixe devant les symboles (: $ %)
    spaceBeforeSymbols: {
      pattern: /(?<=\S)\s*[:$%]/g,
      message: 'Espace fixe requis devant les symboles (: $ %)',
      suggestion: 'Exemple: "Progression : 35 %" au lieu de "Progression: 35%"'
    },

    // Règle 3: Aucune espace devant (; ! ?)
    noSpaceBeforePunctuation: {
      pattern: /\s+[;!?]/g,
      message: 'Aucune espace ne doit précéder (; ! ?)',
      suggestion: 'Exemple: "Bonjour!" au lieu de "Bonjour !"'
    },

    // Règle 4: Format des montants d'argent "1 234,56 $"
    moneyFormat: {
      pattern: /\d{1,3}(?:\s\d{3})*(?:,\d{2})?\s\$/g,
      message: 'Format des montants: espace pour milliers, virgule pour décimales, espace avant $',
      suggestion: 'Exemple: "1 234,56 $" au lieu de "1234.56$"'
    },

    // Règle 5: Format des heures "13 h 5"
    timeFormat: {
      pattern: /\d{1,2}\s+h\s+\d{1,2}/g,
      message: 'Format des heures: espace avant et après "h"',
      suggestion: 'Exemple: "13 h 5" au lieu de "13h5"'
    }
  };

  /**
   * Valide un texte selon les règles OQLF
   */
  static validateText(text: string, context: 'title' | 'content' | 'button' = 'content'): OQLFValidationResult[] {
    const results: OQLFValidationResult[] = [];

    // Validation de la capitalisation des titres
    if (context === 'title') {
      const words = text.split(' ');
      if (words.length > 1) {
        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          // Ignorer les mots qui commencent par une apostrophe ou un tiret
          if (word.startsWith("'") || word.startsWith('-')) continue;
          
          if (/^[A-ZÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ]/.test(word)) {
            results.push({
              text,
              rule: 'Capitalisation des titres',
              status: 'invalid',
              message: `Le mot "${word}" ne devrait pas commencer par une majuscule dans un titre`,
              suggestion: 'Seulement le premier mot du titre doit porter la majuscule'
            });
          }
        }
      }
    }

    // Validation des espaces devant les symboles
    const spaceBeforeSymbols = text.match(this.rules.spaceBeforeSymbols);
    if (spaceBeforeSymbols) {
      results.push({
        text,
        rule: 'Espace devant les symboles',
        status: 'invalid',
        message: 'Espace fixe requis devant (: $ %)',
        suggestion: 'Ajouter un espace avant les symboles'
      });
    }

    // Validation des espaces avant la ponctuation
    const noSpaceBeforePunctuation = text.match(this.rules.noSpaceBeforePunctuation);
    if (noSpaceBeforePunctuation) {
      results.push({
        text,
        rule: 'Espace avant ponctuation',
        status: 'invalid',
        message: 'Aucune espace ne doit précéder (; ! ?)',
        suggestion: 'Supprimer l\'espace avant la ponctuation'
      });
    }

    // Validation du format des montants
    const moneyMatches = text.match(/\$\d+/g);
    if (moneyMatches) {
      results.push({
        text,
        rule: 'Format des montants',
        status: 'warning',
        message: 'Vérifier le format des montants selon OQLF',
        suggestion: 'Format recommandé: "1 234,56 $" (espace pour milliers, virgule pour décimales, espace avant $)'
      });
    }

    // Validation du format des heures
    const timeMatches = text.match(/\d+h\d+/g);
    if (timeMatches) {
      results.push({
        text,
        rule: 'Format des heures',
        status: 'warning',
        message: 'Vérifier le format des heures selon OQLF',
        suggestion: 'Format recommandé: "13 h 5" (espace avant et après "h")'
      });
    }

    return results;
  }

  /**
   * Valide un objet contenant des textes
   */
  static validateObject(obj: any, context: string = 'content'): OQLFValidationResult[] {
    const results: OQLFValidationResult[] = [];

    const validateRecursive = (obj: any, path: string = '') => {
      if (typeof obj === 'string') {
        const textResults = this.validateText(obj, context as any);
        textResults.forEach(result => {
          result.text = `${path}: ${result.text}`;
          results.push(result);
        });
      } else if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
          const newPath = path ? `${path}.${key}` : key;
          validateRecursive(value, newPath);
        }
      }
    };

    validateRecursive(obj);
    return results;
  }

  /**
   * Génère un rapport de validation OQLF
   */
  static generateReport(validationResults: OQLFValidationResult[]): string {
    if (validationResults.length === 0) {
      return '✅ Tous les textes sont conformes aux normes OQLF !';
    }

    const invalidCount = validationResults.filter(r => r.status === 'invalid').length;
    const warningCount = validationResults.filter(r => r.status === 'warning').length;

    let report = `📋 Rapport de validation OQLF\n`;
    report += `================================\n\n`;
    report += `Résumé:\n`;
    report += `- ❌ Erreurs: ${invalidCount}\n`;
    report += `- ⚠️ Avertissements: ${warningCount}\n\n`;

    if (invalidCount > 0) {
      report += `❌ ERREURS À CORRIGER:\n`;
      report += `======================\n`;
      validationResults
        .filter(r => r.status === 'invalid')
        .forEach((result, index) => {
          report += `${index + 1}. ${result.rule}\n`;
          report += `   Texte: "${result.text}"\n`;
          report += `   Message: ${result.message}\n`;
          if (result.suggestion) {
            report += `   Suggestion: ${result.suggestion}\n`;
          }
          report += `\n`;
        });
    }

    if (warningCount > 0) {
      report += `⚠️ AVERTISSEMENTS:\n`;
      report += `==================\n`;
      validationResults
        .filter(r => r.status === 'warning')
        .forEach((result, index) => {
          report += `${index + 1}. ${result.rule}\n`;
          report += `   Texte: "${result.text}"\n`;
          report += `   Message: ${result.message}\n`;
          if (result.suggestion) {
            report += `   Suggestion: ${result.suggestion}\n`;
          }
          report += `\n`;
        });
    }

    return report;
  }

  /**
   * Vérifie la conformité OQLF des textes principaux de l'application
   */
  static validateApplicationTexts(): OQLFValidationResult[] {
    const applicationTexts = {
      'Page Accueil': {
        'Titre principal': 'Votre retraite, votre histoire',
        'Sous-titre': 'Chaque personne mérite de planifier son avenir avec dignité, peu importe son niveau d\'épargne actuel.',
        'Notre engagement': 'Notre engagement',
        'Ce que nous reconnaissons': 'Ce que nous reconnaissons :',
        'Le stress financier': 'Le stress financier peut être angoissant',
        'Le sentiment d\'abandon': 'Le sentiment d\'abandon face à la complexité',
        'Les barrières économiques': 'Les barrières économiques traditionnelles',
        'Notre promesse': 'Notre promesse :',
        'Accessibilité pour tous': 'Accessibilité pour tous, pas seulement les fortunés',
        'Bienveillance': 'Bienveillance sans jugement ni pression',
        'Accompagnement': 'Accompagnement personnalisé selon vos moyens',
        'Vue d\'ensemble': 'Vue d\'ensemble et progression',
        'Votre situation': 'Votre situation, nos ressources',
        'Travailler avec ce qu\'on a': 'Travailler avec ce qu\'on a',
        'Votre progrès': 'Votre progrès, nos félicitations',
        'Vous n\'êtes plus seul(e)': 'Vous n\'êtes plus seul(e)',
        'Chaque petit pas': 'Chaque petit pas compte vers votre sécurité financière. Commencez votre voyage avec bienveillance.',
        'Commencer maintenant': 'Commencer maintenant'
      },
      'Page Mon Profil': {
        'Titre': 'Mon profil',
        'Sous-titre': 'Votre situation est unique, comme vous. Nous travaillons avec vos moyens réels, pas avec des rêves inaccessibles.',
        'Votre progression': 'Votre progression',
        'Excellent travail': 'Excellent travail ! Vous avez complété',
        'Informations personnelles': 'Informations personnelles',
        'Chaque détail compte': 'Chaque détail compte pour personnaliser votre plan',
        'Nom complet': 'Nom complet',
        'Votre nom': 'Votre nom',
        'Âge': 'Âge',
        'Votre âge': 'Votre âge',
        'Situation familiale': 'Situation familiale',
        'État de santé': 'État de santé',
        'Lieu de résidence': 'Lieu de résidence',
        'Situation financière': 'Situation financière',
        'Soyez honnête': 'Soyez honnête, nous ne jugeons pas. Chaque situation mérite respect.',
        'Objectif de retraite': 'Objectif de retraite',
        'Épargne actuelle': 'Épargne actuelle',
        'Chaque dollar compte': 'Chaque dollar compte ! Votre épargne actuelle est un excellent début.',
        'Revenus mensuels': 'Revenus mensuels',
        'Félicitations pour chaque étape': 'Félicitations pour chaque étape !',
        'Vous construisez': 'Vous construisez votre avenir financier avec courage et détermination. Chaque information que vous partagez nous aide à mieux vous accompagner.',
        'Retour à l\'accueil': 'Retour à l\'accueil',
        'Continuer vers ma retraite': 'Continuer vers ma retraite'
      }
    };

    return this.validateObject(applicationTexts, 'title');
  }
}

export default OQLFValidator;
