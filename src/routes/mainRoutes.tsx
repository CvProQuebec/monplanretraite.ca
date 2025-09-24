import React from "react";
import { Route } from "react-router-dom";

/**
 * MainRoutesHome
 * Extrait les routes d'accueil FR/EN pour alleger App.tsx.
 * Etape 1: petite extraction non risquee. D'autres groupes pourront suivre (profil, budget, etc.).
 */
const Accueil = React.lazy(() => import("@/pages/Accueil"));
const Home = React.lazy(() => import("@/pages/Home"));

export function MainRoutesHome() {
  return (
    <>
      {/* Page d'accueil - "VOTRE RETRAITE, VOTRE HISTOIRE" */}
      <Route path="/" element={<Accueil />} />
      <Route path="/accueil" element={<Accueil />} />
      <Route path="/fr" element={<Accueil />} />
      <Route path="/home" element={<Home />} />
      <Route path="/en" element={<Home />} />
    </>
  );
}

export default MainRoutesHome;
