// Service de gestion des informations d'urgence
// Respectant la typographie québécoise et la sécurité des données

import { EmergencyInfoData, EmergencyContact, MedicalInfo, Dependent } from '../types/emergency-info';

export class EmergencyInfoService {
  private static readonly STORAGE_KEY = 'emergency_info_data';
  private static readonly BACKUP_KEY = 'emergency_info_backup';

  /**
   * Obtient les données d'urgence depuis le stockage local
   */
  static getData(): EmergencyInfoData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erreur lors de la lecture des données d\'urgence :', error);
    }

    // Retourner les données par défaut
    return this.getDefaultData();
  }

  /**
   * Sauvegarde les données d'urgence
   */
  static saveData(data: EmergencyInfoData): boolean {
    try {
      // Mettre à jour la date de révision
      data.dateDerniereRevision = new Date().toLocaleDateString('fr-CA');
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      
      // Créer une sauvegarde
      this.createBackup(data);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données d\'urgence :', error);
      return false;
    }
  }

  /**
   * Crée une sauvegarde des données
   */
  static createBackup(data: EmergencyInfoData): void {
    try {
      const backup = {
        data,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backup));
    } catch (error) {
      console.error('Erreur lors de la création de la sauvegarde :', error);
    }
  }

  /**
   * Restaure les données depuis une sauvegarde
   */
  static restoreFromBackup(): EmergencyInfoData | null {
    try {
      const backup = localStorage.getItem(this.BACKUP_KEY);
      if (backup) {
        const parsed = JSON.parse(backup);
        return parsed.data;
      }
    } catch (error) {
      console.error('Erreur lors de la restauration depuis la sauvegarde :', error);
    }
    
    return null;
  }

  /**
   * Réinitialise toutes les données
   */
  static resetData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.BACKUP_KEY);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation des données :', error);
    }
  }

  /**
   * Exporte les données en format JSON
   */
  static exportData(): string {
    const data = this.getData();
    return JSON.stringify(data, null, 2);
  }

  /**
   * Importe les données depuis un fichier JSON
   */
  static importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      
      // Valider la structure des données
      if (this.validateData(data)) {
        this.saveData(data);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'importation des données :', error);
      return false;
    }
  }

  /**
   * Valide la structure des données importées
   */
  private static validateData(data: any): data is EmergencyInfoData {
    // Validation de base - vérifier que les propriétés principales existent
    return (
      data &&
      Array.isArray(data.contactsUrgence) &&
      typeof data.informationsMedicales === 'object' &&
      Array.isArray(data.personnesCharge) &&
      typeof data.dateDerniereRevision === 'string'
    );
  }

  /**
   * Obtient les données par défaut pour un nouvel utilisateur
   */
  private static getDefaultData(): EmergencyInfoData {
    return {
      contactsUrgence: [
        { nom: '', telephone: '', adresseCourriel: '', lien: '' },
        { nom: '', telephone: '', adresseCourriel: '', lien: '' },
        { nom: '', telephone: '', adresseCourriel: '', lien: '' }
      ],
      informationsMedicales: {
        groupeSanguin: '',
        allergiesMedicamenteuses: '',
        conditionsMedicalesChroniques: '',
        medicamentsActuels: [],
        contactsUrgenceMedicale: '',
        directivesMedicalesAnticipees: false,
        dateMiseAJour: new Date().toLocaleDateString('fr-CA')
      },
      personnesCharge: [
        { nom: '', coordonnees: '', instructionsSpeciales: '' },
        { nom: '', coordonnees: '', instructionsSpeciales: '' },
        { nom: '', coordonnees: '', instructionsSpeciales: '' },
        { nom: '', coordonnees: '', instructionsSpeciales: '' }
      ],
      animauxCompagnie: [
        { nomAnimal: '', veterinaire: '', personneDesignee: '' },
        { nomAnimal: '', veterinaire: '', personneDesignee: '' },
        { nomAnimal: '', veterinaire: '', personneDesignee: '' }
      ],
      emploiPrestations: {
        nomEntreprise: '',
        adresse: '',
        superieurImmediat: '',
        telephoneCourriel: '',
        personneRessourceRH: '',
        telephoneCourrielRH: '',
        numeroEmploye: '',
        avantagesSociaux: '',
        reerCollectif: ''
      },
      documentsImportants: [],
      contactsMedicaux: [
        { nom: '', specialite: '', telephone: '', courriel: '' },
        { nom: '', specialite: '', telephone: '', courriel: '' },
        { nom: '', specialite: '', telephone: '', courriel: '' }
      ],
      contactsImportants: {
        familleProche: [
          { nom: '', telephone: '', adresseCourriel: '', lien: '' },
          { nom: '', telephone: '', adresseCourriel: '', lien: '' },
          { nom: '', telephone: '', adresseCourriel: '', lien: '' }
        ],
        amisProches: [
          { nom: '', telephone: '', adresseCourriel: '' },
          { nom: '', telephone: '', adresseCourriel: '' },
          { nom: '', telephone: '', adresseCourriel: '' }
        ],
        professionnels: [
          { nom: '', telephone: '', adresseCourriel: '' },
          { nom: '', telephone: '', adresseCourriel: '' },
          { nom: '', telephone: '', adresseCourriel: '' }
        ]
      },
      proprietes: [],
      biensEntreposes: {
        nomEntreprise: '',
        adresse: '',
        numeroLocalUnite: '',
        codeAccesCle: '',
        listeContenuPrincipal: ''
      },
      informationsFinancieres: {
        cartesCredit: [],
        comptesBancaires: [],
        servicesBancairesEnLigne: [],
        authentificationDeuxFacteurs: false,
        codesRecuperation: '',
        comptesEtranger: '',
        cryptomonnaies: '',
        dettesObligations: '',
        pretsPersonnels: [],
        autresDettes: []
      },
      investissements: [],
      comptesEnLigne: [],
      accesNumerique: {
        gestionnaireMotDePasse: '',
        motDePasseGestionnaire: '',
        numeroTelephoneCellulaire: '',
        methodeDeverrouillage: 'code',
        motDePasseTelephone: '',
        motDePasseOrdinateur: ''
      },
      comptesCourriels: [],
      reseauxSociaux: [],
      assurances: [],
      testamentSuccession: {},
      preferencesFuneraires: {},
      dateDerniereRevision: new Date().toLocaleDateString('fr-CA'),
      signature: ''
    };
  }

  /**
   * Obtient les statistiques d'utilisation
   */
  static getUsageStats(): {
    contactsCompletes: number;
    sectionsCompletes: number;
    totalSections: number;
    pourcentageCompletion: number;
  } {
    const data = this.getData();
    
    let contactsCompletes = 0;
    let sectionsCompletes = 0;
    
    // Compter les contacts complets
    data.contactsUrgence.forEach(contact => {
      if (contact.nom && contact.telephone) contactsCompletes++;
    });
    
    // Compter les sections complètes
    if (data.informationsMedicales.groupeSanguin) sectionsCompletes++;
    if (data.emploiPrestations.nomEntreprise) sectionsCompletes++;
    if (data.proprietes.length > 0) sectionsCompletes++;
    if (data.informationsFinancieres.cartesCredit.length > 0) sectionsCompletes++;
    
    const totalSections = 8; // Nombre total de sections principales
    const pourcentageCompletion = Math.round((sectionsCompletes / totalSections) * 100);
    
    return {
      contactsCompletes,
      sectionsCompletes,
      totalSections,
      pourcentageCompletion
    };
  }
}
