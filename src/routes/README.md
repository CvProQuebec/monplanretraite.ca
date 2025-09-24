# Routes — Modularisation (2025‑09)

Objectif
- Extraire la configuration des routes hors de `src/App.tsx` pour:
  - réduire le risque de “fichier Dieu”,
  - clarifier les domaines,
  - faciliter les revues,
  - ouvrir la voie à des tests ciblés.

Structure actuelle
- `src/routes/blogRoutes.tsx`
  - Routes blog (accueil, article, catégories, compatibilité).
  - Consommé dans `App.tsx` via `<BlogRoutes />`.
- `src/routes/mainRoutes.tsx`
  - Routes d’accueil FR/EN (/, /fr, /en, /accueil, /home).
  - Consommé via `<MainRoutesHome />`.
- `src/routes/mainRoutesCore.tsx`
  - Routes cœur d’app (profil, retraite, revenus, budget).
  - Consommé via `<MainRoutesCore />`.

Conventions
- Un fichier = un groupe logique cohérent (ex.: blog, home, core, government, reports).
- Exporter une fonction React qui retourne un fragment de `<Route />`:
  ```tsx
  export function GovernmentRoutes() {
    return (
      <>
        <Route path="/oas-gis-analysis" element={<OASGISAnalysis />} />
        <Route path="/analyse-oas-gis" element={<OASGISAnalysis />} />
      </>
    );
  }
  ```
- Les pages lourdes doivent rester lazy (voir exemples existants dans `App.tsx`).

Intégration dans App.tsx
- Importer le module routes et insérer sa balise dans `<Routes>`:
  ```tsx
  import { GovernmentRoutes } from '@/routes/governmentRoutes';
  // ...
  <Routes>
    <MainRoutesHome />
    <MainRoutesCore />
    <GovernmentRoutes />
    <BlogRoutes />
    {/* autres routes spécifiques */}
  </Routes>
  ```

Placeholders marketing (flags)
- Variable: `VITE_SHOW_PLACEHOLDERS` (boolean as string).
- Exemple (dans `App.tsx`):
  ```ts
  const SHOW_PLACEHOLDERS = import.meta.env.VITE_SHOW_PLACEHOLDERS === 'true';
  {SHOW_PLACEHOLDERS && (
    <>
      <Route path="/education-4-pourcent" element={<Placeholder />} />
      <Route path="/simulateur-retraite" element={<Placeholder />} />
    </>
  )}
  ```
- Définir dans `env.local` / Netlify env: `VITE_SHOW_PLACEHOLDERS=false` en production.

Bonnes pratiques
- Un groupe de routes ≤ 150–200 lignes. Scinder si nécessaire (ex.: `governmentRoutes.tsx`, `reportsRoutes.tsx`).
- Garder `App.tsx` comme shell: providers, layout, fallback/lazy, import des modules de routes.
- Déclarer les import lazy des pages dans `App.tsx` pour partager les chunks et maîtriser le code splitting.
- Respecter i18n (FR/EN) et OQLF (titres/texte UI dans les pages concernées).

Definition of Done (ajout/modification de routes)
- [ ] Le groupe de routes est cohérent (un seul domaine).
- [ ] Aucune logique métier dans les fichiers de routes.
- [ ] Pages lourdes en lazy; chunk < 500 kB (sinon découpage).
- [ ] i18n et OQLF respectés.
- [ ] `App.tsx` reste lisible (import + balise du groupe).
