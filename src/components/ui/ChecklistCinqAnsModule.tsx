import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock3 } from 'lucide-react';

const STORAGE_KEY = 'checklist-5ans';

type ChecklistItem = {
  id: string;
  label: string;
};

type ChecklistCategory = {
  id: string;
  title: string;
  items: ChecklistItem[];
};

const checklistCategories: ChecklistCategory[] = [
  {
    id: 'epargne',
    title: 'Catégorie 1 — Épargne',
    items: [
      { id: 'epargne-reer', label: 'Maximiser mes cotisations REER (plafond 2026 : 33 810 $)' },
      { id: 'epargne-celi', label: 'Maximiser mes cotisations CELI (7 000 $/an)' },
      { id: 'epargne-droits-reer', label: 'Vérifier mes droits de cotisation REER inutilisés (avis de cotisation ARC)' },
    ],
  },
  {
    id: 'decaissement',
    title: 'Catégorie 2 — Planification du décaissement',
    items: [
      { id: 'decaissement-reer-progressif', label: 'Planifier le retrait progressif du REER avant 71 ans pour réduire l’impôt' },
      { id: 'decaissement-ferr-65', label: 'Évaluer une conversion partielle du REER en FERR dès 65 ans (crédit revenu retraite 2 000 $)' },
      { id: 'decaissement-ordre-optimal', label: 'Déterminer l’ordre optimal de décaissement (revenus garantis → FERR → REER → CELI)' },
    ],
  },
  {
    id: 'pensions',
    title: 'Catégorie 3 — Pensions gouvernementales',
    items: [
      { id: 'pensions-rrq-releve', label: 'Vérifier mon relevé de participation RRQ (service en ligne Retraite Québec)' },
      { id: 'pensions-rrq-age', label: 'Décider de l’âge optimal pour demander ma rente RRQ (60, 65 ou 70 ans)' },
      { id: 'pensions-sv-age', label: 'Décider de l’âge optimal pour demander ma Sécurité de la vieillesse (65 ou 70 ans)' },
      { id: 'pensions-srg', label: 'Vérifier mon admissibilité au Supplément de revenu garanti (SRG)' },
    ],
  },
  {
    id: 'fiscalite',
    title: 'Catégorie 4 — Fiscalité et fractionnement',
    items: [
      { id: 'fiscalite-t1032', label: 'Analyser le fractionnement de revenus avec mon conjoint (formulaire T1032)' },
      { id: 'fiscalite-sv', label: 'Estimer mon revenu de retraite annuel et l’impact sur la récupération de la SV (seuil 2026 : 95 323 $)' },
      { id: 'fiscalite-conseiller', label: 'Consulter un fiscaliste ou planificateur financier' },
    ],
  },
  {
    id: 'protection',
    title: 'Catégorie 5 — Protection et assurances',
    items: [
      { id: 'protection-invalidite', label: 'Vérifier mes assurances invalidité (couvrent-elles jusqu’à 65 ans ?)' },
      { id: 'protection-vie', label: 'Évaluer le besoin d’une assurance vie ou maladies graves à la retraite' },
      { id: 'protection-beneficiaires', label: 'Réviser mes bénéficiaires désignés (REER, CELI, assurances)' },
    ],
  },
  {
    id: 'succession',
    title: 'Catégorie 6 — Succession et documents',
    items: [
      { id: 'succession-testament', label: 'Rédiger ou mettre à jour mon testament' },
      { id: 'succession-mandat', label: 'Établir ou réviser mon mandat de protection (protection en cas d’inaptitude)' },
      { id: 'succession-documents', label: 'Rassembler et organiser mes documents financiers importants' },
      { id: 'succession-proche', label: 'Informer un proche de confiance de l’emplacement de mes documents' },
    ],
  },
];

const allItems = checklistCategories.flatMap((category) => category.items);

const buildInitialState = () =>
  allItems.reduce<Record<string, boolean>>((accumulator, item) => {
    accumulator[item.id] = false;
    return accumulator;
  }, {});

export const ChecklistCinqAnsModule: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(buildInitialState);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHasLoaded(true);
        return;
      }

      const parsed = JSON.parse(raw) as Record<string, boolean>;
      setCheckedItems((previous) => ({ ...previous, ...parsed }));
    } catch {
      // Ignore invalid localStorage content and keep defaults.
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded || typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedItems));
  }, [checkedItems, hasLoaded]);

  const completedTasks = useMemo(
    () => Object.values(checkedItems).filter(Boolean).length,
    [checkedItems]
  );
  const totalTasks = allItems.length;
  const progress = (completedTasks / totalTasks) * 100;

  const toggleItem = (itemId: string) => {
    setCheckedItems((previous) => ({
      ...previous,
      [itemId]: !previous[itemId],
    }));
  };

  return (
    <div className="w-full space-y-6" style={{ color: 'var(--mpr-text)' }}>
      <Card
        className="overflow-hidden border"
        style={{
          borderColor: 'var(--mpr-border)',
          borderRadius: 'var(--senior-radius-xl, 16px)',
          boxShadow: 'var(--senior-shadow-lg)',
          background:
            'radial-gradient(circle at top right, rgba(227, 242, 253, 0.85), transparent 30%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <CardHeader className="space-y-3 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 min-h-12 w-12 min-w-12 items-center justify-center rounded-xl border"
              style={{
                borderColor: 'rgba(76, 110, 245, 0.2)',
                background: 'rgba(76, 110, 245, 0.08)',
                color: 'var(--mpr-primary)',
              }}
            >
              <Clock3 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle
                className="text-[28px] font-semibold leading-[1.35]"
                style={{ color: 'var(--mpr-h2)', letterSpacing: '0.025em' }}
              >
                Votre plan des 5 dernières années avant la retraite
              </CardTitle>
              <CardDescription
                className="mt-2 text-[18px] leading-[1.65]"
                style={{ color: 'var(--mpr-text-muted)' }}
              >
                Cochez chaque étape au fur et à mesure de votre progression
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6 pt-0 md:p-8 md:pt-0">
          <Card
            className="border"
            style={{
              borderColor: 'var(--mpr-border)',
              borderRadius: 'var(--senior-radius-lg, 12px)',
              boxShadow: 'var(--senior-shadow)',
              background: '#ffffff',
            }}
          >
            <CardContent className="space-y-4 p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[20px] font-semibold leading-[1.5]" style={{ color: 'var(--mpr-h4)' }}>
                    {completedTasks} tâches sur {totalTasks} complétées
                  </p>
                  <p className="mt-1 text-[16px] leading-[1.7]" style={{ color: 'var(--mpr-text-muted)' }}>
                    Avancez une étape à la fois pour arriver à la retraite avec confiance.
                  </p>
                </div>
                <div
                  className="inline-flex min-h-12 items-center rounded-full border px-4 py-2 text-[16px] font-semibold"
                  style={{
                    borderColor: 'rgba(76, 110, 245, 0.2)',
                    color: 'var(--mpr-primary)',
                    background: 'rgba(76, 110, 245, 0.06)',
                  }}
                >
                  {Math.round(progress)} %
                </div>
              </div>

              <Progress value={progress} className="h-4" />

              {completedTasks === totalTasks && (
                <div
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: 'rgba(22, 163, 74, 0.25)',
                    background: '#f0fdf4',
                  }}
                >
                  <p className="text-[18px] font-semibold leading-[1.7]" style={{ color: 'var(--mpr-success)' }}>
                    Tout est coché. Vous avez complété votre plan des 5 dernières années avec beaucoup de rigueur.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {checklistCategories.map((category) => (
              <Card
                key={category.id}
                className="border"
                style={{
                  borderColor: 'var(--mpr-border)',
                  borderRadius: 'var(--senior-radius-lg, 12px)',
                  boxShadow: 'var(--senior-shadow)',
                  background: '#ffffff',
                }}
              >
                <CardHeader>
                  <CardTitle className="text-[24px]" style={{ color: 'var(--mpr-h3)' }}>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.items.map((item) => {
                    const isChecked = checkedItems[item.id];

                    return (
                      <label
                        key={item.id}
                        htmlFor={item.id}
                        className="flex min-h-14 cursor-pointer items-start gap-4 rounded-xl border px-4 py-3 transition-colors"
                        style={{
                          borderColor: isChecked ? 'rgba(22, 163, 74, 0.25)' : 'var(--mpr-border)',
                          background: isChecked ? '#f0fdf4' : '#ffffff',
                        }}
                      >
                        <input
                          id={item.id}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItem(item.id)}
                          className="mt-1 h-6 w-6 shrink-0 accent-[var(--mpr-primary)]"
                          aria-label={item.label}
                        />
                        <span
                          className="flex-1 text-[18px] leading-[1.7]"
                          style={{
                            color: 'var(--mpr-text)',
                            textDecoration: isChecked ? 'line-through' : 'none',
                          }}
                        >
                          {item.label}
                        </span>
                        {isChecked && <CheckCircle2 className="mt-1 h-5 w-5 shrink-0" style={{ color: 'var(--mpr-success)' }} />}
                      </label>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <a
              href="/blog/fr/cinq-dernieres-annees-avant-retraite-checklist"
              className="inline-flex min-h-14 items-center rounded-xl border px-5 py-3 text-[18px] font-semibold no-underline transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none"
              style={{
                color: 'var(--mpr-primary)',
                borderColor: 'var(--mpr-primary)',
                background: '#ffffff',
                boxShadow: 'var(--senior-shadow-sm)',
              }}
            >
              Lire notre guide complet sur les 5 dernières années
            </a>

            <p className="text-[16px] leading-[1.7]" style={{ color: 'var(--mpr-text-muted)' }}>
              Ces projections sont à titre éducatif uniquement. Consultez un planificateur financier pour une analyse personnalisée.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChecklistCinqAnsModule;
