/* GENERATED: do not edit by hand. Safe, add-only route stubs. */
import React from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router';
import { ToolPlaceholder } from './ToolPlaceholder';

const SHOW_PLACEHOLDERS = (typeof importMeta !== "undefined" ? (importMeta as any) : (import.meta as any))?.env?.VITE_SHOW_PLACEHOLDERS === "true" as boolean;

function placeholder(id: string, title: string) {
  return SHOW_PLACEHOLDERS ? (<ToolPlaceholder id={id} title={title} />) : (<Navigate to="/outils" replace />);
}

export const GENERATED_TOOL_ROUTES: RouteObject[] = [
  { path: "/calculette-rendement-avancee", element: placeholder("advanced-performance-calculator", "Calculette de rendement avancée") },
  { path: "/advanced-performance-calculator", element: placeholder("advanced-performance-calculator", "Advanced performance calculator") },
  { path: "/celiapp", element: placeholder("celiapp", "CELIAPP") },
  { path: "/celiapp", element: placeholder("celiapp", "FHSA") },
  { path: "/consolidation-financiere", element: placeholder("financial-consolidation", "Consolidation financière") },
  { path: "/financial-consolidation", element: placeholder("financial-consolidation", "Financial consolidation") },
  { path: "/couts-sante", element: placeholder("healthcare-costs", "Coûts de santé") },
  { path: "/healthcare-costs", element: placeholder("healthcare-costs", "Healthcare costs") },
  { path: "/optimisation-ferr", element: placeholder("ferr-optimization", "Optimisation FERR") },
  { path: "/ferr-optimization", element: placeholder("ferr-optimization", "RRIF optimization") },
  { path: "/optimisation-fiscale-multi-sources", element: placeholder("multi-source-tax-optimization", "Optimisation fiscale multi-sources") },
  { path: "/multi-source-tax-optimization", element: placeholder("multi-source-tax-optimization", "Multi-source tax optimization") },
  { path: "/optimisation-timing-cpp", element: placeholder("cpp-timing", "Optimisation timing CPP") },
  { path: "/cpp-timing", element: placeholder("cpp-timing", "CPP timing optimization") },
  { path: "/planification-longevite", element: placeholder("longevity-planning", "Planification longévité") },
  { path: "/longevity-planning", element: placeholder("longevity-planning", "Longevity planning") },
  { path: "/planification-retrait-dynamique", element: placeholder("dynamic-withdrawal", "Planification des retraits dynamiques") },
  { path: "/dynamic-withdrawal", element: placeholder("dynamic-withdrawal", "Dynamic withdrawal planning") },
  { path: "/rvdaa", element: placeholder("rvdaa", "RVDAA") },
  { path: "/rvdaa", element: placeholder("rvdaa", "RVDAA") },
  { path: "/strategies-reer-meltdown", element: placeholder("rrsp-meltdown", "Stratégies de fonte du REER") },
  { path: "/rrsp-meltdown", element: placeholder("rrsp-meltdown", "RRSP meltdown strategies") },
];
