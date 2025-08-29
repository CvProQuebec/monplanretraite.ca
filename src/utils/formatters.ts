
/**
 * Formate un montant selon les règles OQLF (Office québécois de la langue française)
 * - Séparateur de milliers : espace insécable
 * - Séparateur décimal : virgule
 * - Symbole monétaire : $ suivi d'un espace insécable
 */
export const formatMontantOQLF = (montant: number): string => {
  // Convertir en string avec 2 décimales
  const montantString = Math.abs(montant).toFixed(2);
  
  // Séparer la partie entière et décimale
  const [partieEntiere, partieDecimale] = montantString.split('.');
  
  // Ajouter des espaces insécables tous les 3 chiffres (de droite à gauche)
  const partieEntiereFormatee = partieEntiere.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
  
  // Construire le montant formaté
  const montantFormate = `${partieEntiereFormatee},${partieDecimale}`;
  
  // Ajouter le signe et le symbole monétaire à la fin
  const signe = montant < 0 ? '-' : '';
  return `${signe}${montantFormate} $`;
};

/**
 * Formate un pourcentage selon les règles OQLF
 * - Séparateur décimal : virgule
 * - Symbole % suivi d'un espace insécable
 */
export const formatPourcentageOQLF = (pourcentage: number): string => {
  // Convertir en string avec 1 décimale
  const pourcentageString = Math.abs(pourcentage).toFixed(1);
  
  // Remplacer le point par une virgule
  const pourcentageFormate = pourcentageString.replace('.', ',');
  
  // Ajouter le signe et le symbole %
  const signe = pourcentage < 0 ? '-' : '';
  return `${signe}${pourcentageFormate}\u00A0%`;
};

/**
 * Formate un nombre entier selon les règles OQLF
 * - Séparateur de milliers : espace insécable
 */
export const formatNombreOQLF = (nombre: number): string => {
  return Math.abs(nombre).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
};

