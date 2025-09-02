import type { ComparisonAdvantage, UserProfile as ComparisonUserProfile } from './CompetitiveComparisonService';

export class ComparisonAnalytics {
  static trackComparison(profile: ComparisonUserProfile, advantages: ComparisonAdvantage[]) {
    const event = {
      event: 'comparison_viewed',
      user_age: profile.currentAge,
      user_gender: profile.gender,
      capital_advantage: advantages.find((a) => a.category === 'Capital de retraite')?.advantage || 0,
      timestamp: new Date().toISOString(),
    };

    // Intégrer avec votre système analytics existant
    // Actuellement: simple trace console pour développement
    // Remplacer par envoi vers un service interne si nécessaire (sans fuite de données sensibles)
    // Exemple futur: window.dispatchEvent(new CustomEvent('mpr_analytics', { detail: event }))
    // Nota: respecter la règle "aucune transmission réseau de données confidentielles"
    // Les champs transmis ici ne contiennent aucune donnée personnelle directe.
    // eslint-disable-next-line no-console
    console.log('Comparison Analytics:', event);
  }

  static trackConversion(source: 'comparison_page' | 'home_widget') {
    const event = {
      event: 'comparison_conversion',
      source,
      timestamp: new Date().toISOString(),
    };
    // eslint-disable-next-line no-console
    console.log('Comparison Conversion:', event);
  }
}

export default ComparisonAnalytics;
