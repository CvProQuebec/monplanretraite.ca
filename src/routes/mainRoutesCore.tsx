import React from "react";
import { Route } from "react-router-dom";

/**
 * MainRoutesCore
 * Regroupe les routes coeur d'app (profil, retraite, revenus, budget) pour alleger App.tsx.
 * Etend la modularisation entamee (MainRoutesHome, BlogRoutes).
 */
const ProfilePage = React.lazy(() => import("@/pages/ProfilePage"));
const MaRetraiteWithDashboard = React.lazy(() => import("@/pages/MaRetraiteWithDashboard"));
const Revenus = React.lazy(() => import("@/pages/Revenus"));
const IncomePageEn = React.lazy(() => import("@/pages/IncomePage"));
const Budget = React.lazy(() => import("@/pages/Budget"));

export function MainRoutesCore() {
  return (
    <>
      {/* Page profil - accessible directement (UX seniors) */}
      <Route path="/profil" element={<ProfilePage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* Page retraite - "TRAVAILLER AVEC CE QU'ON A" + teaser du tableau de bord (repliable) */}
      <Route path="/ma-retraite" element={<MaRetraiteWithDashboard />} />
      <Route path="/my-retirement" element={<MaRetraiteWithDashboard />} />

      {/* Page revenus - "GEREZ VOS SOURCES DE REVENUS" */}
      <Route path="/mes-revenus" element={<Revenus />} />
      <Route path="/my-income" element={<IncomePageEn />} />

      {/* Module Budget - "GEREZ VOS FINANCES INTELLIGEMMENT" */}
      <Route path="/budget" element={<Budget />} />
      <Route path="/mon-budget" element={<Budget />} />
      <Route path="/my-budget" element={<Budget />} />
    </>
  );
}

export default MainRoutesCore;
