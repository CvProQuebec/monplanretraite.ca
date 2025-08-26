/**
 * Utilitaires pour la gestion des noms et caractères spéciaux
 */

/**
 * Convertit les caractères accentués en caractères sans accents
 */
export function removeAccents(str: string): string {
  const accentsMap: { [key: string]: string } = {
    'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
    'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
    'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
    'ý': 'y', 'ÿ': 'y',
    'ñ': 'n',
    'ç': 'c',
    'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A',
    'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
    'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O',
    'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
    'Ý': 'Y', 'Ÿ': 'Y',
    'Ñ': 'N',
    'Ç': 'C'
  };

  return str.replace(/[àáâãäåèéêëìíîïòóôõöùúûüýÿñçÀÁÂÃÄÅÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝŸÑÇ]/g, (match) => {
    return accentsMap[match] || match;
  });
}

/**
 * Nettoie un nom pour l'utiliser dans un nom de fichier
 */
export function sanitizeForFilename(name: string): string {
  // Enlever les accents
  let cleaned = removeAccents(name);
  
  // Remplacer les espaces et caractères spéciaux par des tirets
  cleaned = cleaned.replace(/[^a-zA-Z0-9]/g, '-');
  
  // Enlever les tirets multiples
  cleaned = cleaned.replace(/-+/g, '-');
  
  // Enlever les tirets au début et à la fin
  cleaned = cleaned.replace(/^-+|-+$/g, '');
  
  return cleaned;
}

/**
 * Génère un nom de fichier basé sur les noms des personnes
 */
export function generateFilename(userData: any, includeTimestamp: boolean = true): string {
  let filename = 'mon-plan-retraite';
  
  // Ajouter le nom du profil si disponible
  if (userData.personal?.prenom1) {
    const nom1 = sanitizeForFilename(userData.personal.prenom1);
    const nom2 = userData.personal?.prenom2 ? sanitizeForFilename(userData.personal.prenom2) : '';
    
    if (nom2) {
      filename = `${nom1}-et-${nom2}-retraite`;
    } else {
      filename = `${nom1}-retraite`;
    }
  }
  
  // Ajouter timestamp si demandé
  if (includeTimestamp) {
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    filename += `-${timestamp}`;
  }
  
  return filename + '.json';
}

/**
 * Formate un nom pour l'affichage dans les rapports
 */
export function formatNameForReport(name: string): string {
  if (!name || typeof name !== 'string') {
    return '';
  }
  
  // Capitaliser la première lettre de chaque mot
  return name
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Formate les noms des deux conjoints pour l'affichage
 */
export function formatCoupleNames(prenom1: string, prenom2?: string): string {
  const nom1 = formatNameForReport(prenom1);
  const nom2 = prenom2 ? formatNameForReport(prenom2) : '';
  
  if (nom1 && nom2) {
    return `${nom1} et ${nom2}`;
  } else if (nom1) {
    return nom1;
  } else if (nom2) {
    return nom2;
  }
  
  return 'Utilisateur';
}

/**
 * Parse un nom complet en prénom et nom de famille
 */
export function parseName(fullName: string): { firstName: string; lastName: string } {
  if (!fullName || typeof fullName !== 'string') {
    return { firstName: '', lastName: '' };
  }
  
  const parts = fullName.trim().split(' ');
  
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  } else if (parts.length === 2) {
    return { firstName: parts[0], lastName: parts[1] };
  } else {
    // Si plus de 2 parties, prendre la première comme prénom et le reste comme nom
    return { 
      firstName: parts[0], 
      lastName: parts.slice(1).join(' ') 
    };
  }
}

/**
 * Valide si un nom contient seulement des caractères valides
 */
export function isValidName(name: string): boolean {
  if (!name || typeof name !== 'string') {
    return false;
  }
  
  // Accepter les lettres, espaces, tirets et apostrophes
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
  return nameRegex.test(name.trim()) && name.trim().length > 0;
}
