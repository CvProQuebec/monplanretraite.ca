// src/utils/nameUtils.ts
// Utilitaires pour le traitement et formatage des noms

export interface ParsedName {
  firstName: string;
  lastName: string;
  fullName: string;
  displayName: string;
  initials: string;
}

/**
 * Parse un nom complet et extrait les différentes parties
 * Gère les prénoms composés et noms de famille
 */
export function parseName(fullName: string): ParsedName {
  if (!fullName || fullName.trim() === '') {
    return {
      firstName: '',
      lastName: '',
      fullName: '',
      displayName: '',
      initials: ''
    };
  }

  const trimmedName = fullName.trim();
  const nameParts = trimmedName.split(/\s+/);

  let firstName = '';
  let lastName = '';

  if (nameParts.length === 1) {
    // Un seul mot - considéré comme prénom
    firstName = nameParts[0];
    lastName = '';
  } else if (nameParts.length === 2) {
    // Deux mots - prénom et nom de famille
    firstName = nameParts[0];
    lastName = nameParts[1];
  } else {
    // Plus de deux mots - les derniers mots sont le nom de famille
    // Gère les cas comme "Jean Philippe Dubois" ou "Marie-Claire De La Fontaine"
    
    // Si le dernier mot commence par une minuscule, il fait probablement partie d'un nom composé
    // Ex: "Marie-Claire de la Fontaine" -> prénom: "Marie-Claire", nom: "de la Fontaine"
    let lastNameStartIndex = nameParts.length - 1;
    
    // Chercher où commence le nom de famille (mots qui commencent par une majuscule ou particules)
    for (let i = nameParts.length - 2; i >= 1; i--) {
      const word = nameParts[i];
      // Particules courantes en français
      const particles = ['de', 'du', 'des', 'le', 'la', 'les', 'van', 'von', 'da', 'di', 'del'];
      
      if (particles.includes(word.toLowerCase()) || word[0] === word[0].toUpperCase()) {
        lastNameStartIndex = i;
      } else {
        break;
      }
    }
    
    firstName = nameParts.slice(0, lastNameStartIndex).join(' ');
    lastName = nameParts.slice(lastNameStartIndex).join(' ');
  }

  // Générer les initiales
  const initials = generateInitials(firstName, lastName);

  // Nom d'affichage (prénom + première lettre du nom si disponible)
  const displayName = lastName 
    ? `${firstName} ${lastName.charAt(0).toUpperCase()}.`
    : firstName;

  return {
    firstName: firstName,
    lastName: lastName,
    fullName: trimmedName,
    displayName: displayName,
    initials: initials
  };
}

/**
 * Génère les initiales à partir du prénom et nom
 */
export function generateInitials(firstName: string, lastName: string): string {
  let initials = '';
  
  if (firstName) {
    // Prendre la première lettre de chaque partie du prénom
    const firstNameParts = firstName.split(/[\s-]+/);
    initials += firstNameParts.map(part => part.charAt(0).toUpperCase()).join('');
  }
  
  if (lastName) {
    // Prendre la première lettre de chaque partie du nom (sauf particules)
    const lastNameParts = lastName.split(/\s+/);
    const particles = ['de', 'du', 'des', 'le', 'la', 'les', 'van', 'von', 'da', 'di', 'del'];
    
    lastNameParts.forEach(part => {
      if (!particles.includes(part.toLowerCase())) {
        initials += part.charAt(0).toUpperCase();
      }
    });
  }
  
  return initials;
}

/**
 * Formate un nom pour l'affichage dans les rapports
 */
export function formatNameForReport(fullName: string, style: 'formal' | 'friendly' | 'initials' = 'formal'): string {
  const parsed = parseName(fullName);
  
  switch (style) {
    case 'formal':
      return parsed.fullName;
    case 'friendly':
      return parsed.firstName || parsed.fullName;
    case 'initials':
      return parsed.initials;
    default:
      return parsed.fullName;
  }
}

/**
 * Génère un nom d'affichage pour un couple
 */
export function formatCoupleNames(person1Name: string, person2Name?: string): string {
  const person1 = parseName(person1Name);
  
  if (!person2Name) {
    return person1.fullName;
  }
  
  const person2 = parseName(person2Name);
  
  // Si les deux ont des noms de famille différents
  if (person1.lastName && person2.lastName && person1.lastName !== person2.lastName) {
    return `${person1.firstName} ${person1.lastName} et ${person2.firstName} ${person2.lastName}`;
  }
  
  // Si ils partagent le même nom de famille ou si un seul a un nom de famille
  const sharedLastName = person1.lastName || person2.lastName;
  if (sharedLastName) {
    return `${person1.firstName} et ${person2.firstName} ${sharedLastName}`;
  }
  
  // Sinon, juste les prénoms
  return `${person1.firstName} et ${person2.firstName}`;
}

/**
 * Valide qu'un nom est acceptable (pas vide, pas que des espaces, etc.)
 */
export function validateName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Le nom ne peut pas être vide' };
  }
  
  const trimmedName = name.trim();
  
  // Vérifier la longueur minimale
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Le nom doit contenir au moins 2 caractères' };
  }
  
  // Vérifier la longueur maximale
  if (trimmedName.length > 100) {
    return { isValid: false, error: 'Le nom ne peut pas dépasser 100 caractères' };
  }
  
  // Vérifier les caractères autorisés (lettres, espaces, tirets, apostrophes)
  const validNameRegex = /^[a-zA-ZÀ-ÿ\s\-'\.]+$/;
  if (!validNameRegex.test(trimmedName)) {
    return { isValid: false, error: 'Le nom contient des caractères non autorisés' };
  }
  
  return { isValid: true };
}

/**
 * Exemples d'utilisation pour les tests
 */
export const nameExamples = {
  simple: ['Jean', 'Marie', 'Pierre'],
  compound: ['Jean-Philippe', 'Marie-Claire', 'Anne-Sophie'],
  withLastName: ['Jean Dupont', 'Marie Martin', 'Pierre Dubois'],
  compoundWithLastName: ['Jean-Philippe Tremblay', 'Marie-Claire Dubois', 'Louis-Alexandre Veillette'],
  withParticles: ['Jean de la Fontaine', 'Marie du Plessis', 'Pierre van der Berg'],
  complex: ['Jean-Philippe de la Fontaine-Dubois', 'Marie-Claire van der Berg-Tremblay']
};
