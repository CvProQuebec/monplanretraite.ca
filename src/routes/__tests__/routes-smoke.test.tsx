import React, { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { renderToString } from 'react-dom/server';

import { LocalizedRoute } from '@/routes/LocalizedRoute';
import { RetirementRoutes } from '@/routes/retirementRoutes';
import { MarketingRoutes } from '@/routes/marketingRoutes';
import { BlogRoutes } from '@/routes/blogRoutes';
import { MainRoutesHome } from '@/routes/mainRoutes';
import { MainRoutesCore } from '@/routes/mainRoutesCore';
import { GovernmentRoutes } from '@/routes/governmentRoutes';
import MarketingExtrasRoutes from '@/routes/marketingExtrasRoutes';
import ReportsRoutes from '@/routes/reportsRoutes';

function ssrRender(element: React.ReactElement) {
  // Smoke helper: render synchronously to string (Suspense fallbacks will be emitted)
  return renderToString(element);
}

describe('Routes smoke tests', () => {
  test('LocalizedRoute renders twin FR/EN paths without throwing', () => {
    const Dummy: React.FC = () => <div>Dummy</div>;
    const html = ssrRender(
      <MemoryRouter initialEntries={['/fr/foo']}>
        <Suspense fallback={null}>
          <Routes>
            {LocalizedRoute({ fr: "/fr/foo", en: "/en/foo", component: Dummy })}
          </Routes>
        </Suspense>
      </MemoryRouter>
    );
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThanOrEqual(0);
  });

  test('All extracted route modules render inside <Routes /> without crash', () => {
    const html = ssrRender(
      <MemoryRouter initialEntries={['/']}>
        <Suspense fallback={null}>
          <Routes>
            <MainRoutesHome />
            <MainRoutesCore />
            <BlogRoutes />
            <GovernmentRoutes />
            {RetirementRoutes()}
            {MarketingRoutes()}
            {MarketingExtrasRoutes()}
            <ReportsRoutes />
          </Routes>
        </Suspense>
      </MemoryRouter>
    );
    expect(typeof html).toBe('string');
  });

  test('MarketingRoutes: specific FR alias route does not throw', () => {
    const html = ssrRender(
      <MemoryRouter initialEntries={['/pourquoi-nous-choisir']}>
        <Suspense fallback={null}>
          <Routes>
            {MarketingRoutes()}
          </Routes>
        </Suspense>
      </MemoryRouter>
    );
    expect(typeof html).toBe('string');
  });

  test('RetirementRoutes: some typical paths can be instantiated', () => {
    const html = ssrRender(
      <MemoryRouter initialEntries={['/planification-urgence', '/rappels', '/optimisation-fiscale']}>
        <Suspense fallback={null}>
          <Routes>
            {RetirementRoutes()}
          </Routes>
        </Suspense>
      </MemoryRouter>
    );
    expect(typeof html).toBe('string');
  });
});
