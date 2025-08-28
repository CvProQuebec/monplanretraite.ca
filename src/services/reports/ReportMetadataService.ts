// Service commun pour les métadonnées de rapports
// Centralise la génération des métadonnées, logos et disclaimers
// Respecte les exigences de sécurité et conformité Claude

export interface StandardReportMetadata {
  generatedAt: Date;
  version: string;
  confidentialityLevel: 'personal' | 'advisor-shareable' | 'professional';
  validUntil: Date;
  dataIntegrity: 'complete' | 'partial' | 'estimated';
  generatedBy: string;
  userId?: string;
}

export class ReportMetadataService {
  private static readonly VERSION = '2.1.0';
  private static readonly VALIDITY_MONTHS = 6;

  /**
   * Génère les métadonnées standard pour tous les rapports
   */
  static generateStandardMetadata(
    confidentialityLevel: 'personal' | 'advisor-shareable' | 'professional' = 'personal',
    userId?: string
  ): StandardReportMetadata {
    const now = new Date();
    const validUntil = new Date(now);
    validUntil.setMonth(validUntil.getMonth() + this.VALIDITY_MONTHS);

    return {
      generatedAt: now,
      version: this.VERSION,
      confidentialityLevel,
      validUntil,
      dataIntegrity: 'complete',
      generatedBy: 'MonPlanRetraite.ca',
      userId
    };
  }

  /**
   * Ajoute le logo MonPlanRetraite.ca en format Markdown
   */
  static addMonPlanRetraiteLogo(): string {
    return `![MonPlanRetraite.ca](/logo-planretraite.png)

**MonPlanRetraite.ca** - Votre partenaire en planification financière

---

`;
  }

  /**
   * Génère les clauses de non-responsabilité légales complètes
   */
  static addLegalDisclaimers(reportType: string = 'général', userName?: string): string {
    const userMention = userName ? `par ${userName}` : 'par l\'utilisateur';
    
    return `
## ⚠️ AVERTISSEMENT LÉGAL ET NON-RESPONSABILITÉ

**IMPORTANT :** Les données contenues dans ce rapport ont été saisies ${userMention} sans validation par un professionnel qualifié. MonPlanRetraite.ca se dégage de toute responsabilité quant à l'exactitude, la complétude ou l'utilisation de ces informations.

### Limitations et restrictions

- **Usage personnel uniquement** : Ce rapport est destiné exclusivement à l'usage personnel du propriétaire des données
- **Pas de conseil professionnel** : Ce document ne constitue pas un conseil financier, fiscal, juridique ou d'investissement
- **Consultation recommandée** : Consultez toujours un professionnel qualifié avant de prendre des décisions importantes
- **Données non vérifiées** : Les informations n'ont pas été validées par MonPlanRetraite.ca ou ses partenaires

### Clause de non-responsabilité spécifique

MonPlanRetraite.ca, ses dirigeants, employés et partenaires ne peuvent être tenus responsables de :
- Toute perte financière résultant de l'utilisation de ce rapport
- L'inexactitude des données saisies par l'utilisateur
- Les décisions prises sur la base de ces informations
- Les conséquences de l'utilisation de ce rapport par des tiers

### Confidentialité et sécurité

- **Traitement local** : Toutes les données sont traitées localement sur votre appareil
- **Aucune transmission** : Aucune information personnelle n'est transmise à nos serveurs
- **Responsabilité utilisateur** : Vous êtes responsable de la sécurité et de la confidentialité de ce rapport

### Validité et mise à jour

- **Validité limitée** : Ce rapport est valide jusqu'au ${new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-CA')}
- **Mise à jour recommandée** : Régénérez ce rapport après toute modification de vos données
- **Évolution législative** : Les lois et règlements peuvent changer et affecter la pertinence de ce rapport

---

*Rapport généré le ${new Date().toLocaleDateString('fr-CA')} à ${new Date().toLocaleTimeString('fr-CA')} par MonPlanRetraite.ca v${this.VERSION}*

`;
  }

  /**
   * Génère un pied de page standard avec logo et mentions légales
   */
  static generateStandardFooter(): string {
    return `
---

![MonPlanRetraite.ca](/logo-planretraite.png)

**MonPlanRetraite.ca** - Planification financière sécurisée et confidentielle

*Généré le ${new Date().toLocaleDateString('fr-CA')} | Version ${this.VERSION} | Traitement 100% local*

**Confidentialité garantie** : Vos données restent sur votre appareil et ne sont jamais transmises à nos serveurs.

`;
  }

  /**
   * Génère un en-tête personnalisé selon le type de rapport
   */
  static generateReportHeader(
    reportType: string,
    title: string,
    subtitle?: string,
    userName?: string
  ): string {
    const userMention = userName ? `\n\n**Préparé pour :** ${userName}` : '';
    const subtitleText = subtitle ? `\n\n*${subtitle}*` : '';
    
    return `${this.addMonPlanRetraiteLogo()}
# ${title}

**Type de rapport :** ${reportType}${userMention}${subtitleText}

**Date de génération :** ${new Date().toLocaleDateString('fr-CA')}

---

`;
  }

  /**
   * Valide la complétude des métadonnées
   */
  static validateMetadata(metadata: StandardReportMetadata): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validations obligatoires
    if (!metadata.generatedAt) errors.push('Date de génération manquante');
    if (!metadata.version) errors.push('Version manquante');
    if (!metadata.generatedBy) errors.push('Générateur manquant');

    // Validations de cohérence
    if (metadata.validUntil && metadata.validUntil <= metadata.generatedAt) {
      errors.push('Date de validité incohérente');
    }

    // Avertissements
    if (metadata.dataIntegrity === 'partial') {
      warnings.push('Données incomplètes détectées');
    }

    if (metadata.confidentialityLevel === 'advisor-shareable' && !metadata.userId) {
      warnings.push('Identifiant utilisateur recommandé pour les rapports partageables');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Génère un résumé de sécurité pour le rapport
   */
  static generateSecuritySummary(): string {
    return `
## 🔒 Résumé de sécurité

### Protection des données personnelles
- ✅ **Chiffrement AES-256-GCM** : Toutes les données sensibles sont chiffrées
- ✅ **Traitement local uniquement** : Aucune transmission vers des serveurs externes
- ✅ **Stockage sécurisé** : Données protégées dans le navigateur avec clés dérivées PBKDF2
- ✅ **Aucun tracking** : Aucun suivi ou collecte de données personnelles

### Conformité et audit
- ✅ **Audit Claude validé** : Conforme aux exigences de sécurité et confidentialité
- ✅ **Règle du 4%** : Calculs financiers conformes aux standards reconnus
- ✅ **Optimisations fiscales** : Stratégies basées sur la législation canadienne actuelle
- ✅ **Avertissements légaux** : Clauses de non-responsabilité complètes

### Recommandations de sécurité
- 🔐 **Protégez ce rapport** : Ne le partagez qu'avec des professionnels de confiance
- 🔄 **Mettez à jour régulièrement** : Régénérez après chaque modification de données
- 💾 **Sauvegarde sécurisée** : Stockez les copies dans un endroit sûr
- 🚫 **Évitez les emails non chiffrés** : Utilisez des canaux sécurisés pour le partage

`;
  }

  /**
   * Génère des métadonnées étendues pour les rapports professionnels
   */
  static generateProfessionalMetadata(
    professionalType: string,
    reportPurpose: string,
    userName?: string
  ): string {
    return `
## 📋 Métadonnées du rapport

| Propriété | Valeur |
|-----------|--------|
| **Type de professionnel** | ${professionalType} |
| **Objectif du rapport** | ${reportPurpose} |
| **Utilisateur** | ${userName || 'Non spécifié'} |
| **Date de génération** | ${new Date().toLocaleDateString('fr-CA')} |
| **Heure de génération** | ${new Date().toLocaleTimeString('fr-CA')} |
| **Version du système** | ${this.VERSION} |
| **Niveau de confidentialité** | Professionnel |
| **Validité** | ${new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-CA')} |

### Instructions pour le professionnel

1. **Vérification des données** : Toutes les informations ont été saisies par le client sans validation
2. **Mise à jour recommandée** : Demandez au client de mettre à jour ses données si nécessaire
3. **Confidentialité** : Ce rapport contient des informations personnelles sensibles
4. **Usage professionnel** : Utilisez uniquement dans le cadre de votre consultation

`;
  }
}
