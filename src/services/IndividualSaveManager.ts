/**
 * Service de sauvegarde individuelle pour les forfaits
 * Permet de sauvegarder les données de personne 1, personne 2, ou couple
 */

import { EnhancedSaveManager } from './EnhancedSaveManager';
import { LicenseManager } from './LicenseManager';
import { generateFilename } from '../utils/nameUtils';

export type SaveProfileType = 'person1' | 'person2' | 'couple';

interface IndividualSaveOptions {
  profileType: SaveProfileType;
  filename?: string;
  includeTimestamp?: boolean;
  format?: 'json' | 'encrypted';
}

interface IndividualSaveResult {
  success: boolean;
  filename?: string;
  error?: string;
  profileType?: SaveProfileType;
  dataSize?: number;
}

export class IndividualSaveManager {
  /**
   * Sauvegarde les données selon le type de profil choisi
   */
  static async saveIndividualProfile(
    userData: any,
    options: IndividualSaveOptions
  ): Promise<IndividualSaveResult> {
    try {
      // Vérifier la licence avant de sauvegarder
      const licenseCheck = LicenseManager.checkLicense(userData);

      if (!licenseCheck.isValid) {
        return {
          success: false,
          error: 'Sauvegarde bloquée par la protection de licence',
          profileType: options.profileType
        };
      }

      // Extraire les données selon le type de profil
      const profileData = this.extractProfileData(userData, options.profileType);

      // Générer le nom de fichier spécifique au profil
      const filename = this.generateProfileFilename(userData, options);

      // Sauvegarder avec le gestionnaire existant
      const saveOptions = {
        filename,
        includeTimestamp: options.includeTimestamp !== false,
        format: options.format || 'json'
      };

      const result = await EnhancedSaveManager.saveWithDialog(profileData, saveOptions);

      return {
        success: result.success,
        filename: result.filename,
        error: result.error,
        profileType: options.profileType,
        dataSize: result.success ? this.calculateDataSize(profileData) : undefined
      };

    } catch (error) {
      console.error('Erreur lors de la sauvegarde individuelle:', error);
      return {
        success: false,
        error: `Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        profileType: options.profileType
      };
    }
  }

  /**
   * Sauvegarde directe sans dialogue pour un profil spécifique
   */
  static async saveIndividualProfileDirect(
    userData: any,
    options: IndividualSaveOptions
  ): Promise<IndividualSaveResult> {
    try {
      // Vérifier la licence avant de sauvegarder
      const licenseCheck = LicenseManager.checkLicense(userData);

      if (!licenseCheck.isValid) {
        return {
          success: false,
          error: 'Sauvegarde bloquée par la protection de licence',
          profileType: options.profileType
        };
      }

      // Extraire les données selon le type de profil
      const profileData = this.extractProfileData(userData, options.profileType);

      // Générer le nom de fichier spécifique au profil
      const filename = this.generateProfileFilename(userData, options);

      // Sauvegarder directement
      const saveOptions = {
        filename,
        includeTimestamp: options.includeTimestamp !== false,
        format: options.format || 'json'
      };

      const result = await EnhancedSaveManager.saveDirectly(profileData, saveOptions);

      return {
        success: result.success,
        filename: result.filename,
        error: result.error,
        profileType: options.profileType,
        dataSize: result.success ? this.calculateDataSize(profileData) : undefined
      };

    } catch (error) {
      console.error('Erreur lors de la sauvegarde directe individuelle:', error);
      return {
        success: false,
        error: `Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        profileType: options.profileType
      };
    }
  }

  /**
   * Extrait les données selon le type de profil
   */
  private static extractProfileData(userData: any, profileType: SaveProfileType): any {
    if (!userData) {
      throw new Error('Données utilisateur manquantes');
    }

    const baseData = {
      version: '2.1',
      profileType,
      extractedAt: new Date().toISOString(),
      appName: 'Mon Plan Retraite',
      licenseInfo: LicenseManager.getProfileInfo()
    };

    switch (profileType) {
      case 'person1':
        return {
          ...baseData,
          personal: this.extractPerson1Data(userData.personal),
          retirement: this.extractPerson1Data(userData.retirement),
          savings: this.extractPerson1Data(userData.savings),
          cashflow: userData.cashflow, // Les dépenses sont communes
          advancedExpenses: userData.advancedExpenses
        };

      case 'person2':
        return {
          ...baseData,
          personal: this.extractPerson2Data(userData.personal),
          retirement: this.extractPerson2Data(userData.retirement),
          savings: this.extractPerson2Data(userData.savings),
          cashflow: userData.cashflow, // Les dépenses sont communes
          advancedExpenses: userData.advancedExpenses
        };

      case 'couple':
        return {
          ...baseData,
          ...userData // Toutes les données pour le couple
        };

      default:
        throw new Error(`Type de profil non reconnu: ${profileType}`);
    }
  }

  /**
   * Extrait les données de la personne 1
   */
  private static extractPerson1Data(data: any): any {
    if (!data) return {};

    const person1Data: any = {};

    // Extraire tous les champs se terminant par '1'
    Object.keys(data).forEach(key => {
      if (key.endsWith('1')) {
        person1Data[key] = data[key];
      }
    });

    // Champs spécifiques à la personne 1 (sans numéro)
    const person1Fields = [
      'prenom1', 'nom1', 'naissance1', 'sexe1', 'salaire1',
      'statutProfessionnel1', 'ageRetraiteSouhaite1',
      'secteurActivite1', 'niveauCompetences1',
      'travailleurConstruction1', 'certificatCCQ1',
      'seasonalJobs1', 'unifiedIncome1'
    ];

    person1Fields.forEach(field => {
      if (data[field] !== undefined) {
        person1Data[field] = data[field];
      }
    });

    // Informations communes (pour contexte)
    const commonFields = ['province', 'regionEconomique', 'tauxChomageRegional'];
    commonFields.forEach(field => {
      if (data[field] !== undefined) {
        person1Data[field] = data[field];
      }
    });

    return person1Data;
  }

  /**
   * Extrait les données de la personne 2
   */
  private static extractPerson2Data(data: any): any {
    if (!data) return {};

    const person2Data: any = {};

    // Extraire tous les champs se terminant par '2'
    Object.keys(data).forEach(key => {
      if (key.endsWith('2')) {
        person2Data[key] = data[key];
      }
    });

    // Champs spécifiques à la personne 2 (sans numéro)
    const person2Fields = [
      'prenom2', 'nom2', 'naissance2', 'sexe2', 'salaire2',
      'statutProfessionnel2', 'ageRetraiteSouhaite2',
      'secteurActivite2', 'niveauCompetences2',
      'travailleurConstruction2', 'certificatCCQ2',
      'seasonalJobs2', 'unifiedIncome2'
    ];

    person2Fields.forEach(field => {
      if (data[field] !== undefined) {
        person2Data[field] = data[field];
      }
    });

    // Informations communes (pour contexte)
    const commonFields = ['province', 'regionEconomique', 'tauxChomageRegional'];
    commonFields.forEach(field => {
      if (data[field] !== undefined) {
        person2Data[field] = data[field];
      }
    });

    return person2Data;
  }

  /**
   * Génère un nom de fichier spécifique au profil
   */
  private static generateProfileFilename(userData: any, options: IndividualSaveOptions): string {
    const baseName = 'mon-plan-retraite';
    const timestamp = options.includeTimestamp !== false ? `-${new Date().toISOString().split('T')[0]}` : '';
    const profileSuffix = this.getProfileSuffix(options.profileType, userData);

    return `${baseName}${profileSuffix}${timestamp}.json`;
  }

  /**
   * Génère le suffixe selon le type de profil
   */
  private static getProfileSuffix(profileType: SaveProfileType, userData: any): string {
    switch (profileType) {
      case 'person1':
        const name1 = userData?.personal?.prenom1 || userData?.personal?.nom1 || 'personne1';
        return `-${name1.toLowerCase().replace(/\s+/g, '-')}`;

      case 'person2':
        const name2 = userData?.personal?.prenom2 || userData?.personal?.nom2 || 'personne2';
        return `-${name2.toLowerCase().replace(/\s+/g, '-')}`;

      case 'couple':
        const nameCouple1 = userData?.personal?.prenom1 || userData?.personal?.nom1 || 'personne1';
        const nameCouple2 = userData?.personal?.prenom2 || userData?.personal?.nom2 || 'personne2';
        return `-couple-${nameCouple1.toLowerCase()}-${nameCouple2.toLowerCase()}`.replace(/\s+/g, '-');

      default:
        return '';
    }
  }

  /**
   * Calcule la taille des données en octets
   */
  private static calculateDataSize(data: any): number {
    return new Blob([JSON.stringify(data)]).size;
  }

  /**
   * Vérifie si un profil peut être sauvegardé
   */
  static canSaveProfile(userData: any, profileType: SaveProfileType): {
    canSave: boolean;
    reason?: string;
    hasData: boolean;
  } {
    // Vérifier la licence
    const licenseCheck = LicenseManager.checkLicense(userData);
    if (!licenseCheck.isValid) {
      return {
        canSave: false,
        reason: licenseCheck.reason,
        hasData: false
      };
    }

    // Vérifier la présence des données selon le profil
    const hasData = this.hasProfileData(userData, profileType);

    return {
      canSave: hasData,
      reason: hasData ? undefined : `Données manquantes pour le profil ${profileType}`,
      hasData
    };
  }

  /**
   * Vérifie si les données existent pour un profil
   */
  private static hasProfileData(userData: any, profileType: SaveProfileType): boolean {
    if (!userData || !userData.personal) {
      return false;
    }

    switch (profileType) {
      case 'person1':
        return !!(userData.personal.prenom1 || userData.personal.nom1 ||
                 userData.personal.naissance1 || userData.personal.salaire1);

      case 'person2':
        return !!(userData.personal.prenom2 || userData.personal.nom2 ||
                 userData.personal.naissance2 || userData.personal.salaire2);

      case 'couple':
        const hasPerson1 = this.hasProfileData(userData, 'person1');
        const hasPerson2 = this.hasProfileData(userData, 'person2');
        return hasPerson1 || hasPerson2;

      default:
        return false;
    }
  }

  /**
   * Obtient les informations sur les profils disponibles
   */
  static getAvailableProfiles(userData: any): {
    person1: { available: boolean; name?: string };
    person2: { available: boolean; name?: string };
    couple: { available: boolean; name?: string };
  } {
    const getPersonName = (prefix: string) => {
      const prenom = userData?.personal?.[`prenom${prefix}`];
      const nom = userData?.personal?.[`nom${prefix}`];
      return prenom || nom || `Personne ${prefix}`;
    };

    return {
      person1: {
        available: this.hasProfileData(userData, 'person1'),
        name: getPersonName('1')
      },
      person2: {
        available: this.hasProfileData(userData, 'person2'),
        name: getPersonName('2')
      },
      couple: {
        available: this.hasProfileData(userData, 'couple'),
        name: `${getPersonName('1')} & ${getPersonName('2')}`
      }
    };
  }

  /**
   * Sauvegarde tous les profils disponibles en une fois
   */
  static async saveAllAvailableProfiles(userData: any): Promise<{
    results: IndividualSaveResult[];
    summary: { total: number; successful: number; failed: number };
  }> {
    const availableProfiles = this.getAvailableProfiles(userData);
    const results: IndividualSaveResult[] = [];

    const profilesToSave: SaveProfileType[] = [];
    if (availableProfiles.person1.available) profilesToSave.push('person1');
    if (availableProfiles.person2.available) profilesToSave.push('person2');
    if (availableProfiles.couple.available) profilesToSave.push('couple');

    for (const profileType of profilesToSave) {
      const result = await this.saveIndividualProfileDirect(userData, { profileType });
      results.push(result);

      // Petit délai entre les sauvegardes pour éviter la surcharge
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const summary = {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    };

    return { results, summary };
  }
}
