// src/features/retirement/utils/formatters.ts

// Formatage des montants en dollars canadiens
export const formatCurrency = (amount: number, options?: {
  showCents?: boolean;
  compact?: boolean;
}): string => {
  if (isNaN(amount) || !isFinite(amount)) {
    return '0 $';
  }

  const { showCents = false, compact = false } = options || {};

  if (compact && Math.abs(amount) >= 1000000) {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  }

  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0
  }).format(amount);
};

// Formatage des pourcentages
export const formatPercentage = (value: number, options?: {
  showPlusSign?: boolean;
  decimals?: number;
}): string => {
  if (isNaN(value) || !isFinite(value)) {
    return '0 %';
  }

  const { showPlusSign = false, decimals = 1 } = options || {};
  const formatted = value.toFixed(decimals);
  const sign = showPlusSign && value > 0 ? '+' : '';
  
  return `${sign}${formatted}%`;
};

// Formatage des nombres
export const formatNumber = (value: number, options?: {
  compact?: boolean;
  decimals?: number;
}): string => {
  if (isNaN(value) || !isFinite(value)) {
    return '0';
  }

  const { compact = false, decimals = 0 } = options || {};

  if (compact && Math.abs(value) >= 1000) {
    return new Intl.NumberFormat('fr-CA', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  }

  return new Intl.NumberFormat('fr-CA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

// Formatage des dates
export const formatDate = (date: string | Date, options?: {
  format?: 'short' | 'long' | 'year';
}): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }

    const { format = 'short' } = options || {};

    switch (format) {
      case 'long':
        return new Intl.DateTimeFormat('fr-CA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(dateObj);
      
      case 'year':
        return new Intl.DateTimeFormat('fr-CA', {
          year: 'numeric'
        }).format(dateObj);
      
      default:
        return new Intl.DateTimeFormat('fr-CA', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(dateObj);
    }
  } catch (error) {
    return 'Date invalide';
  }
};

// Formatage de l'âge
export const formatAge = (birthDate: string): string => {
  try {
    const birth = new Date(birthDate);
    const today = new Date();
    
    if (isNaN(birth.getTime())) {
      return 'Âge invalide';
    }

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return `${age} ans`;
  } catch (error) {
    return 'Âge invalide';
  }
};

// Formatage des durées
export const formatDuration = (years: number): string => {
  if (isNaN(years) || !isFinite(years)) {
    return '0 an';
  }

  if (years === 1) {
    return '1 an';
  }

  if (years < 1) {
    const months = Math.round(years * 12);
    return `${months} mois`;
  }

  return `${Math.round(years)} ans`;
};

// Formatage des montants mensuels/annuels
export const formatMonthlyAmount = (amount: number): string => {
  return `${formatCurrency(amount)}/mois`;
};

export const formatAnnualAmount = (amount: number): string => {
  return `${formatCurrency(amount)}/an`;
};

// Formatage pour les graphiques (version courte)
export const formatChartValue = (value: number, type: 'currency' | 'percentage' | 'number' = 'currency'): string => {
  switch (type) {
    case 'currency':
      return formatCurrency(value, { compact: true });
    case 'percentage':
      return formatPercentage(value, { decimals: 0 });
    case 'number':
      return formatNumber(value, { compact: true });
    default:
      return formatCurrency(value, { compact: true });
  }
};