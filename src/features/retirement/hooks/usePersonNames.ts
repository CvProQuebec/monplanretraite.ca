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

const computeInitials = (first: string, last: string, fallback: string) => {
  const letters = [first, last]
    .filter(Boolean)
    .map(value => value.trim())
    .filter(Boolean)
    .map(name => name.charAt(0).toUpperCase());

  return letters.length > 0 ? letters.join('') : fallback;
};

/**
 * Hook pour récupérer les noms personnalisés des personnes.
 * Utilise les prénoms et noms saisis dans « Mon profil » ou fournit des valeurs de repli.
 */
export const usePersonNames = () => {
  const { userData } = useRetirementData();

  const personNames = useMemo(() => {
    const buildPerson = (
      id: 'person1' | 'person2',
      fallback: 'Personne 1' | 'Personne 2',
      rawFirst?: string,
      rawLast?: string
    ): PersonName => {
      const first = (rawFirst || '').trim();
      const last = (rawLast || '').trim();
      const combined = [first, last].filter(Boolean).join(' ').trim();
      const parsed = parseName(combined || first);

      const resolvedFirst = (parsed.firstName || first).trim();
      const resolvedLast = (parsed.lastName || last).trim();
      const fullName = [resolvedFirst, resolvedLast].filter(Boolean).join(' ').trim();
      const displayName = resolvedFirst || fullName || fallback;
      const initials = computeInitials(resolvedFirst, resolvedLast, id === 'person1' ? 'P1' : 'P2');

      return {
        id,
        fullName,
        displayName,
        firstName: resolvedFirst,
        lastName: resolvedLast,
        initials,
        fallbackName: fallback
      };
    };

    const person1 = buildPerson(
      'person1',
      'Personne 1',
      userData.personal?.prenom1,
      userData.personal?.nom1
    );
    const person2 = buildPerson(
      'person2',
      'Personne 2',
      userData.personal?.prenom2,
      userData.personal?.nom2
    );

    return { person1, person2 };
  }, [
    userData.personal?.prenom1,
    userData.personal?.nom1,
    userData.personal?.prenom2,
    userData.personal?.nom2
  ]);

  const getPersonDisplayName = (
    personId: 'person1' | 'person2',
    style: 'full' | 'display' | 'first' | 'initials' = 'display'
  ) => {
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

  const getSectionTitle = (personId: 'person1' | 'person2') => {
    const person = personNames[personId];

    if (person.firstName) {
      return `Profil de ${person.firstName}`;
    }

    return personId === 'person1' ? 'Personne 1' : 'Personne 2';
  };

  const getSaveButtonLabel = (
    personId: 'person1' | 'person2',
    action: 'save' | 'export' | 'print' = 'save'
  ) => {
    const person = personNames[personId];
    const name = person.firstName || person.fallbackName;

    switch (action) {
      case 'save':
        return `Sauvegarder ${name}`;
      case 'export':
        return `Exporter ${name}`;
      case 'print':
        return `Imprimer ${name}`;
      default:
        return name;
    }
  };

  const hasCustomName = (personId: 'person1' | 'person2') => {
    const person = personNames[personId];
    return person.fullName.length > 0 || person.firstName.length > 0;
  };

  const getSelectOptions = () => {
    return [
      {
        value: 'person1',
        label: personNames.person1.displayName,
        icon: hasCustomName('person1') ? personNames.person1.initials : 'P1'
      },
      {
        value: 'person2',
        label: personNames.person2.displayName,
        icon: hasCustomName('person2') ? personNames.person2.initials : 'P2'
      }
    ];
  };

  const formatForReport = (
    personId: 'person1' | 'person2',
    style: 'formal' | 'friendly' | 'initials' = 'formal'
  ) => {
    const person = personNames[personId];

    if (!person.fullName) {
      if (style === 'friendly') {
        return person.firstName || person.fallbackName;
      }
      if (style === 'initials') {
        return person.initials;
      }
      return person.fallbackName;
    }

    switch (style) {
      case 'friendly':
        return person.firstName || person.fullName;
      case 'initials':
        return person.initials;
      default:
        return formatNameForReport(person.fullName);
    }
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
