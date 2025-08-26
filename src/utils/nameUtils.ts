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
