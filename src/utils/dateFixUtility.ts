// Utilitaire pour corriger les dates de naissance corrompues dans le localStorage
export const fixCorruptedBirthDates = (): void => {
  try {
    console.log('🔧 Début de la correction des dates de naissance corrompues...');
    
    // Lister toutes les clés du localStorage
    const keys = Object.keys(localStorage);
    let fixedCount = 0;
    
    keys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (!value) return;
        
        // Essayer de parser la valeur comme JSON
        let data;
        try {
          data = JSON.parse(value);
        } catch {
          // Si ce n'est pas du JSON, ignorer
          return;
        }
        
        // Vérifier si c'est un objet avec des données personnelles
        if (data && typeof data === 'object' && data.personal) {
          let hasChanges = false;
          
          // Corriger naissance1
          if (data.personal.naissance1) {
            const corrected1 = fixBirthDateValue(data.personal.naissance1);
            if (corrected1 !== data.personal.naissance1) {
              console.log(`🔧 Correction naissance1: ${data.personal.naissance1} → ${corrected1}`);
              data.personal.naissance1 = corrected1;
              hasChanges = true;
              fixedCount++;
            }
          }
          
          // Corriger naissance2
          if (data.personal.naissance2) {
            const corrected2 = fixBirthDateValue(data.personal.naissance2);
            if (corrected2 !== data.personal.naissance2) {
              console.log(`🔧 Correction naissance2: ${data.personal.naissance2} → ${corrected2}`);
              data.personal.naissance2 = corrected2;
              hasChanges = true;
              fixedCount++;
            }
          }
          
          // Sauvegarder les changements
          if (hasChanges) {
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`✅ Données corrigées pour la clé: ${key}`);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Erreur lors du traitement de la clé ${key}:`, error);
      }
    });
    
    console.log(`🎉 Correction terminée! ${fixedCount} dates corrigées.`);
    
    if (fixedCount > 0) {
      // Recharger la page pour appliquer les corrections
      console.log('🔄 Rechargement de la page pour appliquer les corrections...');
      window.location.reload();
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction des dates:', error);
  }
};

// Fonction pour corriger une valeur de date de naissance individuelle
const fixBirthDateValue = (value: string): string => {
  if (!value) return '';
  
  // Nettoyer la valeur (enlever tout ce qui n'est pas un chiffre)
  const cleanValue = value.replace(/[^\d]/g, '');
  
  // Si la valeur est vide après nettoyage
  if (!cleanValue) return '';
  
  // Si la valeur a plus de 8 caractères, la tronquer à 8
  if (cleanValue.length > 8) {
    const truncated = cleanValue.substring(0, 8);
    console.log(`🔧 Troncature: ${cleanValue} → ${truncated}`);
    return truncated;
  }
  
  // Si la valeur a exactement 8 caractères, elle est correcte
  if (cleanValue.length === 8) {
    return cleanValue;
  }
  
  // Si la valeur a 6 caractères et ressemble à une année + mois invalide
  if (cleanValue.length === 6) {
    const year = cleanValue.substring(0, 4);
    const monthDay = cleanValue.substring(4, 6);
    
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    const monthNum = parseInt(monthDay);
    
    // Si l'année semble valide et le mois est invalide (> 12)
    if (yearNum >= 1900 && yearNum <= currentYear && monthNum > 12) {
      // Corriger en ajoutant 01-01
      const corrected = year + '0101';
      console.log(`🔧 Correction automatique: ${cleanValue} → ${corrected}`);
      return corrected;
    }
  }
  
  // Pour les autres cas, retourner la valeur nettoyée
  return cleanValue;
};

// Fonction pour vérifier s'il y a des dates corrompues
export const checkForCorruptedDates = (): boolean => {
  try {
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      try {
        const value = localStorage.getItem(key);
        if (!value) continue;
        
        let data;
        try {
          data = JSON.parse(value);
        } catch {
          continue;
        }
        
        if (data && typeof data === 'object' && data.personal) {
          // Vérifier naissance1
          if (data.personal.naissance1) {
            const clean1 = data.personal.naissance1.replace(/[^\d]/g, '');
            if (clean1.length > 8 || (clean1.length === 6 && parseInt(clean1.substring(4, 6)) > 12)) {
              return true;
            }
          }
          
          // Vérifier naissance2
          if (data.personal.naissance2) {
            const clean2 = data.personal.naissance2.replace(/[^\d]/g, '');
            if (clean2.length > 8 || (clean2.length === 6 && parseInt(clean2.substring(4, 6)) > 12)) {
              return true;
            }
          }
        }
      } catch (error) {
        continue;
      }
    }
    
    return false;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des dates:', error);
    return false;
  }
};

// Fonction pour nettoyer complètement le localStorage (option nucléaire)
export const clearAllStorageData = (): void => {
  try {
    console.log('🧹 Nettoyage complet du localStorage...');
    localStorage.clear();
    sessionStorage.clear();
    console.log('✅ Nettoyage terminé!');
    
    // Recharger la page
    window.location.reload();
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
};
