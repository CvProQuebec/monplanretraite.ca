/**
 * Service de gestion des licences et protection anti-multi-clients
 */

interface ProfileFingerprint {
  id: string;
  nom1: string;
  naissance1: string;
  nom2?: string;
  naissance2?: string;
  createdAt: string;
  lastSavedAt: string;
  licenseKey: string;
}

interface LicenseInfo {
  isValid: boolean;
  allowMultipleProfiles: boolean;
  currentProfile?: ProfileFingerprint;
  reason?: string;
}

export class LicenseManager {
  private static readonly LICENSE_STORAGE_KEY = 'retirement-license-info';
  private static readonly PROFILE_STORAGE_KEY = 'retirement-active-profile';
  private static readonly MULTI_PROFILE_CODE = 'MULTIPLE2025';

  /**
   * Génère une empreinte unique basée sur les données personnelles
   */
  static generateFingerprint(userData: any): string {
    const nom1 = userData.personal?.prenom1?.trim().toLowerCase() || '';
    const naissance1 = userData.personal?.naissance1 || '';
    const nom2 = userData.personal?.prenom2?.trim().toLowerCase() || '';
    const naissance2 = userData.personal?.naissance2 || '';

    // Créer une empreinte basée sur les noms et dates de naissance
    const fingerprint = `${nom1}|${naissance1}|${nom2}|${naissance2}`;
    
    // Générer un hash simple (pour éviter les dépendances crypto)
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir en 32bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Vérifie si les données constituent un profil valide (au moins nom1 + naissance1)
   */
  static isValidProfile(userData: any): boolean {
    const nom1 = userData.personal?.prenom1?.trim();
    const naissance1 = userData.personal?.naissance1?.trim();
    
    return !!(nom1 && naissance1 && nom1.length > 0 && naissance1.length > 0);
  }

  /**
   * Vérifie si le code promo pour profils multiples est actif
   */
  static hasMultiProfileCode(): boolean {
    try {
      const promoCode = localStorage.getItem('promo-code');
      return promoCode === this.MULTI_PROFILE_CODE;
    } catch {
      return false;
    }
  }

  /**
   * Active le code promo pour profils multiples
   */
  static activateMultiProfileCode(code: string): boolean {
    if (code === this.MULTI_PROFILE_CODE) {
      try {
        localStorage.setItem('promo-code', code);
        console.log('🎫 Code promo MULTIPLE2025 activé');
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  /**
   * Récupère le profil actuel stocké
   */
  static getCurrentProfile(): ProfileFingerprint | null {
    try {
      const stored = localStorage.getItem(this.PROFILE_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    }
    return null;
  }

  /**
   * Sauvegarde le profil actuel
   */
  static saveCurrentProfile(userData: any): ProfileFingerprint | null {
    if (!this.isValidProfile(userData)) {
      return null;
    }

    try {
      const fingerprint: ProfileFingerprint = {
        id: this.generateFingerprint(userData),
        nom1: userData.personal.prenom1.trim(),
        naissance1: userData.personal.naissance1,
        nom2: userData.personal.prenom2?.trim() || undefined,
        naissance2: userData.personal.naissance2 || undefined,
        createdAt: new Date().toISOString(),
        lastSavedAt: new Date().toISOString(),
        licenseKey: this.generateLicenseKey()
      };

      localStorage.setItem(this.PROFILE_STORAGE_KEY, JSON.stringify(fingerprint));
      console.log('👤 Profil sauvegardé:', fingerprint.nom1);
      return fingerprint;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
      return null;
    }
  }

  /**
   * Met à jour la date de dernière sauvegarde du profil actuel
   */
  static updateLastSaved(): void {
    try {
      const current = this.getCurrentProfile();
      if (current) {
        current.lastSavedAt = new Date().toISOString();
        localStorage.setItem(this.PROFILE_STORAGE_KEY, JSON.stringify(current));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  }

  /**
   * Vérifie si l'utilisateur peut créer/modifier un profil
   */
  static checkLicense(userData: any): LicenseInfo {
    // Si le code promo est actif, autoriser tous les profils
    if (this.hasMultiProfileCode()) {
      return {
        isValid: true,
        allowMultipleProfiles: true,
        reason: 'Code promo MULTIPLE2025 actif'
      };
    }

    // Si pas de données valides, autoriser (nouveau profil en cours de création)
    if (!this.isValidProfile(userData)) {
      return {
        isValid: true,
        allowMultipleProfiles: false,
        reason: 'Profil en cours de création'
      };
    }

    const currentProfile = this.getCurrentProfile();
    const newFingerprint = this.generateFingerprint(userData);

    // Si aucun profil existant, autoriser
    if (!currentProfile) {
      return {
        isValid: true,
        allowMultipleProfiles: false,
        reason: 'Premier profil'
      };
    }

    // Si même empreinte, autoriser (même profil)
    if (currentProfile.id === newFingerprint) {
      return {
        isValid: true,
        allowMultipleProfiles: false,
        currentProfile,
        reason: 'Même profil'
      };
    }

    // Sinon, bloquer (profil différent sans code promo)
    return {
      isValid: false,
      allowMultipleProfiles: false,
      currentProfile,
      reason: 'Profil différent détecté. Une licence ne peut être utilisée que pour un seul couple.'
    };
  }

  /**
   * Supprime le profil actuel (pour les tests ou réinitialisation)
   */
  static clearCurrentProfile(): void {
    try {
      localStorage.removeItem(this.PROFILE_STORAGE_KEY);
      console.log('🗑️ Profil actuel supprimé');
    } catch (error) {
      console.error('Erreur lors de la suppression du profil:', error);
    }
  }

  /**
   * Génère une clé de licence unique
   */
  private static generateLicenseKey(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `LIC-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Obtient des informations sur le profil actuel pour l'affichage
   */
  static getProfileInfo(): { hasProfile: boolean; profileName: string; createdAt?: string } {
    const profile = this.getCurrentProfile();
    if (!profile) {
      return { hasProfile: false, profileName: '' };
    }

    const profileName = profile.nom2 
      ? `${profile.nom1} et ${profile.nom2}`
      : profile.nom1;

    return {
      hasProfile: true,
      profileName,
      createdAt: profile.createdAt
    };
  }

  /**
   * Vérifie si les données ont changé par rapport au profil stocké
   */
  static hasProfileChanged(userData: any): boolean {
    const currentProfile = this.getCurrentProfile();
    if (!currentProfile || !this.isValidProfile(userData)) {
      return false;
    }

    const newFingerprint = this.generateFingerprint(userData);
    return currentProfile.id !== newFingerprint;
  }
}
