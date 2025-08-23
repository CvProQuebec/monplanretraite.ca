import { useMemo } from 'react';
import { useRetirementData } from './useRetirementData';
import { parseName, formatNameForReport } from '@/utils/nameUtils';

export interface PersonName {
  id: string;
  fullName: string;
  displayName: string;
  firstName: string;
  lastName: string;
  initials: string;
  fallbackName: string;
}

/**
 * Hook pour récupérer les noms personnalisés des personnes
 * Utilise les vrais noms saisis dans "Mon profil" ou retourne les noms par défaut
 */
export const usePersonNames = () => {
  const { userData } = useRetirementData();

  const personNames = useMemo(() => {
    // Récupérer les noms depuis les données utilisateur
    const person1Name = userData.personal?.prenom1 || '';
    const person2Name = userData.personal?.prenom2 || '';

    // Parser les noms
    const person1Parsed = parseName(person1Name);
    const person2Parsed = parseName(person2Name);

    const person1: PersonName = {
      id: 'person1',
      fullName: person1Parsed.fullName,
      displayName: person1Parsed.displayName || person1Parsed.firstName || 'Personne 1',
      firstName: person1Parsed.firstName,
      lastName: person1Parsed.lastName,
      initials: person1Parsed.initials || 'P1',
      fallbackName: 'Personne 1'
    };

    const person2: PersonName = {
      id: 'person2',
      fullName: person2Parsed.fullName,
      displayName: person2Parsed.displayName || person2Parsed.firstName || 'Personne 2',
      firstName: person2Parsed.firstName,
      lastName: person2Parsed.lastName,
      initials: person2Parsed.initials || 'P2',
      fallbackName: 'Personne 2'
    };

    return { person1, person2 };
  }, [userData.personal?.prenom1, userData.personal?.prenom2]);

  /**
   * Obtenir le nom d'affichage pour une personne spécifique
   */
  const getPersonDisplayName = (personId: 'person1' | 'person2', style: 'full' | 'display' | 'first' | 'initials' = 'display') => {
    const person = personNames[personId];
    
    switch (style) {
      case 'full':
        return person.fullName || person.fallbackName;
      case 'display':
        return person.displayName;
      case 'first':
        return person.firstName || person.fallbackName;
      case 'initials':
        return person.initials;
      default:
        return person.displayName;
    }
  };

  /**
   * Obtenir le nom pour les titres de section (avec fallback élégant)
   */
  const getSectionTitle = (personId: 'person1' | 'person2') => {
    const person = personNames[personId];
    
    if (person.firstName) {
      // Si on a un prénom, l'utiliser avec une icône
      return `👤 ${person.firstName}`;
    }
    
    // Sinon utiliser le nom générique avec numéro
    return personId === 'person1' ? '1️⃣ Personne 1' : '2️⃣ Personne 2';
  };

  /**
   * Obtenir le nom pour les boutons de sauvegarde
   */
  const getSaveButtonLabel = (personId: 'person1' | 'person2', action: 'save' | 'export' | 'print' = 'save') => {
    const person = personNames[personId];
    const name = person.firstName || person.fallbackName;
    
    switch (action) {
      case 'save':
        return `💾 Sauvegarder ${name}`;
      case 'export':
        return `📤 Exporter ${name}`;
      case 'print':
        return `🖨️ Imprimer ${name}`;
      default:
        return name;
    }
  };

  /**
   * Vérifier si une personne a un nom personnalisé
   */
  const hasCustomName = (personId: 'person1' | 'person2') => {
    const person = personNames[personId];
    return person.fullName.length > 0;
  };

  /**
   * Obtenir les options pour le dropdown de sélection
   */
  const getSelectOptions = () => {
    return [
      {
        value: 'person1',
        label: personNames.person1.displayName,
        icon: hasCustomName('person1') ? '👤' : '1️⃣'
      },
      {
        value: 'person2',
        label: personNames.person2.displayName,
        icon: hasCustomName('person2') ? '👤' : '2️⃣'
      }
    ];
  };

  /**
   * Formater les noms pour les rapports
   */
  const formatForReport = (personId: 'person1' | 'person2', style: 'formal' | 'friendly' | 'initials' = 'formal') => {
    const person = personNames[personId];
    
    if (!person.fullName) {
      return person.fallbackName;
    }
    
    return formatNameForReport(person.fullName, style);
  };

  return {
    personNames,
    getPersonDisplayName,
    getSectionTitle,
    getSaveButtonLabel,
    hasCustomName,
    getSelectOptions,
    formatForReport
  };
};
