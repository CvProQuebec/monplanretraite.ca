
import React from "react";

/**
 * Utilitaires pour le formatage de données
 */

/**
 * Formate un numéro de téléphone pour l'affichage au format +15145135633
 * mais seulement si demandé explicitement (pour l'utilisation avec onBlur)
 * @param phoneNumber Numéro de téléphone à formater
 * @param formatNow Si vrai, applique le formatage immédiatement
 * @returns Numéro de téléphone formaté ou non
 */
export const formatPhoneForDisplay = (phoneNumber: string, formatNow: boolean = false): string => {
  // Si on ne veut pas formater maintenant, on retourne juste le numéro
  if (!formatNow) {
    return phoneNumber;
  }
  
  // Supprime tous les caractères non numériques
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Si c'est vide, on retourne une chaîne vide
  if (digits.length === 0) {
    return '';
  }
  
  // Format international +1XXXXXXXXXX
  if (digits.length <= 10) {
    return `+1${digits}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    // Si on a déjà un 1 au début, on ajoute juste le +
    return `+${digits}`;
  } else {
    // On garde seulement les 11 premiers chiffres (avec le code pays)
    return `+${digits.slice(0, 11)}`;
  }
};

/**
 * Formate du texte avec des sauts de ligne HTML
 * @param text Texte à formater
 * @returns Fragment React avec des sauts de ligne
 */
export const formatTextWithLineBreaks = (text: string) => {
  return text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < text.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));
};

/**
 * Améliore le contenu HTML pour un meilleur rendu
 * @param content Contenu HTML à améliorer
 * @returns Contenu HTML amélioré
 */
export const enhanceContentLayout = (content: string): string => {
  // Remplace les retours à la ligne par des balises <br />
  let enhancedContent = content.replace(/\n/g, '<br />');
  
  // Autres améliorations possibles
  // Par exemple, transformer les liens en balises <a href>
  enhancedContent = enhancedContent.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-gold underline">$1</a>'
  );
  
  return enhancedContent;
};
