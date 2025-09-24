import React from 'react';
import { Route } from 'react-router-dom';

type AnyProps = Record<string, any>;

type LocalizedRouteProps =
  | {
      fr: string;
      en: string;
      component: React.ComponentType<AnyProps>;
      element?: never;
      componentFr?: never;
      componentEn?: never;
      elementFr?: never;
      elementEn?: never;
      elementProps?: AnyProps;
    }
  | {
      fr: string;
      en: string;
      component?: never;
      element: React.ReactElement;
      componentFr?: never;
      componentEn?: never;
      elementFr?: never;
      elementEn?: never;
      elementProps?: never;
    }
  | {
      fr: string;
      en: string;
      component?: never;
      element?: never;
      componentFr: React.ComponentType<AnyProps>;
      componentEn: React.ComponentType<AnyProps>;
      elementFr?: never;
      elementEn?: never;
      elementProps?: AnyProps;
    }
  | {
      fr: string;
      en: string;
      component?: never;
      element?: never;
      componentFr?: never;
      componentEn?: never;
      elementFr: React.ReactElement;
      elementEn: React.ReactElement;
      elementProps?: never;
    };

/**
 * LocalizedRoute
 * Rend deux <Route /> jumelles FR/EN pour réduire la duplication.
 *
 * Exemples:
 *  - Même composant pour FR/EN
 *    <LocalizedRoute fr="/optimisation-fiscale" en="/tax-optimization" component={TaxOptimizationDashboard} />
 *
 *  - Élément JSX commun aux deux (placeholders/CTA statiques)
 *    <LocalizedRoute fr="/regle-4-pourcent" en="/4-percent-rule" element={<FourPercentRuleModule />} />
 */
export function LocalizedRoute(props: LocalizedRouteProps) {
  // Distinct JSX elements per locale
  if ('elementFr' in props && 'elementEn' in props) {
    const { fr, en, elementFr, elementEn } = props as unknown as {
      fr: string; en: string; elementFr: React.ReactElement; elementEn: React.ReactElement;
    };
    return (
      <>
        <Route path={fr} element={elementFr} />
        <Route path={en} element={elementEn} />
      </>
    );
  }

  // Same JSX element for both locales
  if ('element' in props) {
    const { fr, en, element } = props as unknown as { fr: string; en: string; element: React.ReactElement };
    return (
      <>
        <Route path={fr} element={element} />
        <Route path={en} element={element} />
      </>
    );
  }

  // Distinct components per locale
  if ('componentFr' in props && 'componentEn' in props) {
    const { fr, en, componentFr: CFr, componentEn: CEn, elementProps } = props as unknown as {
      fr: string; en: string; componentFr: React.ComponentType<AnyProps>; componentEn: React.ComponentType<AnyProps>; elementProps?: AnyProps;
    };
    return (
      <>
        <Route path={fr} element={<CFr {...(elementProps || {})} />} />
        <Route path={en} element={<CEn {...(elementProps || {})} />} />
      </>
    );
  }

  // Same component for both locales
  const { fr, en, component: C, elementProps } = props as unknown as {
    fr: string; en: string; component: React.ComponentType<AnyProps>; elementProps?: AnyProps;
  };
  return (
    <>
      <Route path={fr} element={<C {...(elementProps || {})} />} />
      <Route path={en} element={<C {...(elementProps || {})} />} />
    </>
  );
}

/**
 * Helper: génère une liste de LocalizedRoute à partir d&#39;une config simple.
 */
export function LocalizedRoutes(configs: Array<{
  fr: string;
  en: string;
  component?: React.ComponentType<AnyProps>;
  componentFr?: React.ComponentType<AnyProps>;
  componentEn?: React.ComponentType<AnyProps>;
  element?: React.ReactElement;
  elementFr?: React.ReactElement;
  elementEn?: React.ReactElement;
  elementProps?: AnyProps;
}>) {
  return (
    <>
      {configs.map((cfg, idx) => {
        if (cfg.elementFr && cfg.elementEn) {
          return (
            <LocalizedRoute
              key={idx}
              fr={cfg.fr}
              en={cfg.en}
              elementFr={cfg.elementFr}
              elementEn={cfg.elementEn}
            />
          );
        }
        if (cfg.element) {
          return <LocalizedRoute key={idx} fr={cfg.fr} en={cfg.en} element={cfg.element} />;
        }
        if (cfg.componentFr && cfg.componentEn) {
          return (
            <LocalizedRoute
              key={idx}
              fr={cfg.fr}
              en={cfg.en}
              componentFr={cfg.componentFr}
              componentEn={cfg.componentEn}
              elementProps={cfg.elementProps}
            />
          );
        }
        if (cfg.component) {
          return (
            <LocalizedRoute
              key={idx}
              fr={cfg.fr}
              en={cfg.en}
              component={cfg.component}
              elementProps={cfg.elementProps}
            />
          );
        }
        return null;
      })}
    </>
  );
}
