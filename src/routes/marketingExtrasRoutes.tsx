import React from 'react';
import { Route } from 'react-router-dom';
import { LocalizedRoute } from './LocalizedRoute';
import { useFlags } from '@/hooks/useFlags';
import PlaceholderInfoPage from '@/pages/placeholder/PlaceholderInfoPage';
import { FourPercentRuleModule } from '@/components/ui/FourPercentRuleModule';
import FourPercentRuleModuleEn from '@/components/ui/FourPercentRuleModuleEn';

/**
 * MarketingExtrasRoutes
 * - Déplace les pages marketing statiques (placeholders) hors de App.tsx
 * - Gère les routes 4 % FR/EN
 * - Respecte le flag de build (SHOW_PLACEHOLDERS)
 */
export function MarketingExtrasRoutes() {
  const { SHOW_PLACEHOLDERS } = useFlags();

  const fourPercentFr = (
    <div className="p-8">
      <FourPercentRuleModule />
    </div>
  );
  const fourPercentEn = (
    <div className="p-8">
      <FourPercentRuleModuleEn />
    </div>
  );

  return (
    <>
      {/* Règle du 4 % — FR/EN + alias */}
      {LocalizedRoute({
        fr: "/regle-4-pourcent",
        en: "/4-percent-rule",
        elementFr: fourPercentFr,
        elementEn: fourPercentEn
      })}
      {/* Alias supplémentaires conservés */}
      <Route path="/module-regle-4-pourcent" element={fourPercentFr} />
      <Route path="/four-percent-rule" element={fourPercentEn} />

      {/* Phase 1 - Modules Essentiels (placeholders marketing) */}
      <Route
        path="/module-celi-succession"
        element={
          <PlaceholderInfoPage
            title="Module Succession CÉLI"
            description="Optimisez la transmission de votre CÉLI selon les conseils d'experts."
            tone="blue"
          >
            <ul className="list-disc pl-6">
              <li>Nommez un titulaire successeur pour éviter les taxes</li>
              <li>Évitez les erreurs coûteuses de désignation</li>
              <li>Maximisez la transmission tax-free</li>
              <li>Protégez contre les frais d'homologation</li>
            </ul>
          </PlaceholderInfoPage>
        }
      />

      <Route
        path="/calculateur-impact-fiscal-65"
        element={
          <PlaceholderInfoPage
            title="Calculateur Impact Fiscal à 65 ans"
            description="Découvrez les économies fiscales automatiques à 65 ans."
            tone="green"
          >
            <ul className="list-disc pl-6">
              <li>Crédit d'âge fédéral et provincial</li>
              <li>Crédit pour revenu de pension (2&nbsp;000&nbsp;$ premiers)</li>
              <li>Fractionnement du revenu de pension</li>
              <li>Réduction d'impôt de 1&nbsp;600&nbsp;$+ par année</li>
            </ul>
          </PlaceholderInfoPage>
        }
      />

      <Route
        path="/tableau-bord-10-conseils"
        element={
          <PlaceholderInfoPage
            title="Tableau de Bord - 10 Conseils Essentiels"
            description="Suivez votre progression sur les conseils cruciaux pour la retraite."
            tone="orange"
          >
            <ul className="list-disc pl-6">
              <li>Connaître ses dépenses mensuelles</li>
              <li>Être libre de dettes</li>
              <li>Consolider ses actifs</li>
              <li>Automatiser les retraits</li>
              <li>...et autres conseils clés</li>
            </ul>
          </PlaceholderInfoPage>
        }
      />

      {/* Phase 2 - Optimisation Avancée */}
      <Route
        path="/module-consolidation-actifs"
        element={
          <PlaceholderInfoPage
            title="Module Consolidation d'Actifs"
            description="Simplifiez et optimisez la gestion de vos placements."
            tone="purple"
          >
            <ul className="list-disc pl-6">
              <li>Réduction des frais de gestion</li>
              <li>Simplification administrative</li>
              <li>Meilleur suivi de performance</li>
              <li>Économies de 0,5–2&nbsp;% par année</li>
            </ul>
          </PlaceholderInfoPage>
        }
      />

      <Route
        path="/module-coussin-liquidites"
        element={
          <PlaceholderInfoPage
            title="Module Coussin de Liquidités"
            description="Gérez la volatilité avec la stratégie bucket."
            tone="cyan"
          >
            <ul className="list-disc pl-6">
              <li>3–5 ans de liquidités protégées</li>
              <li>Éviter de vendre en baisse de marché</li>
              <li>Maintenir le style de vie désiré</li>
              <li>Réduire le stress financier</li>
            </ul>
          </PlaceholderInfoPage>
        }
      />

      <Route
        path="/centre-education-fiscale"
        element={
          <PlaceholderInfoPage
            title="Centre d'Éducation Fiscale"
            description="Maîtrisez les stratégies fiscales pour la retraite."
            tone="indigo"
          >
            <ul className="list-disc pl-6">
              <li>Fractionnement du revenu</li>
              <li>Optimisation des retraits</li>
              <li>Crédits d'impôt disponibles</li>
              <li>Planification successorale fiscale</li>
            </ul>
          </PlaceholderInfoPage>
        }
      />

      {/* Placeholders Phase 2/3 (guarded by build flag) */}
      {SHOW_PLACEHOLDERS && (
        <>
          <Route
            path="/education-4-pourcent"
            element={
              <PlaceholderInfoPage
                title="Centre d’éducation – Règle du 4 %"
                description="Contenu éducatif à venir."
                tone="blue"
              />
            }
          />
          <Route
            path="/simulateur-retraite"
            element={
              <PlaceholderInfoPage
                title="Simulateur de retraite"
                description="Module avancé à venir."
                tone="blue"
              />
            }
          />
        </>
      )}
    </>
  );
}

export default MarketingExtrasRoutes;
