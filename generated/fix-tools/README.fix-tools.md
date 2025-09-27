# Fix Tools � Generated Route Stubs

What
- Adds React Router stubs for tools missing routes (using catalog paths routeFr/routeEn).
- Placeholders are gated by VITE_SHOW_PLACEHOLDERS (default OFF); otherwise redirects to /outils.

How to use
1) Import and spread into your router where appropriate (e.g., next to other route arrays):

   import { GENERATED_TOOL_ROUTES } from '../../generated/fix-tools/ROUTES.react-router';
   // If using array-based routes: const routes = [...baseRoutes, ...GENERATED_TOOL_ROUTES];
   // If using <Routes>, you can map these objects to <Route> elements.

2) Ensure VITE_SHOW_PLACEHOLDERS remains false in production.

Scope
- No changes under src/**. You may delete this folder once proper pages are implemented.

Summary
- Routes generated: 22
- Tools missing menu (see MENU.missing.csv): 15
- Affected tool ids: advanced-performance-calculator, celiapp, financial-consolidation, healthcare-costs, ferr-optimization, multi-source-tax-optimization, cpp-timing, longevity-planning, dynamic-withdrawal, rvdaa, rrsp-meltdown
