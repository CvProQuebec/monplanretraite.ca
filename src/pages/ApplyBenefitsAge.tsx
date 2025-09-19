import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { wizardService } from '@/services/WizardService';

/**
 * ApplyBenefitsAge
 * Handler de liens profonds pour appliquer l'âge RRQ/SV au profil,
 * puis rediriger l'utilisateur vers la page cible (par défaut /budget).
 *
 * Exemples d'URL:
 * - /prestations/apply?rrqAge=68&redirect=/budget&scenarioId=default
 * - /prestations/apply?oasAge=66&redirect=/budget&scenarioId=default
 * - /prestations/apply?rrqAge=70&oasAge=66&redirect=/budget
 */
const ApplyBenefitsAge: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'applying' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setStatus('applying');
      setError(null);

      const rrqAgeParam = params.get('rrqAge');
      const oasAgeParam = params.get('oasAge');
      const redirect = params.get('redirect') || '/budget';
      const scenarioId = params.get('scenarioId') || 'default';

      try {
        if (rrqAgeParam) {
          const rrqAge = parseInt(rrqAgeParam, 10);
          await wizardService.applyRRQAge(rrqAge, scenarioId);
        }
        if (oasAgeParam) {
          const oasAge = parseInt(oasAgeParam, 10);
          await wizardService.applyOASAge(oasAge, scenarioId);
        }
        setStatus('done');
        // Petit délai pour laisser le temps de persister puis redirection
        setTimeout(() => navigate(redirect), 200);
      } catch (e: any) {
        console.error('ApplyBenefitsAge error:', e);
        setError(e?.message || 'Erreur lors de l’application des âges de prestations');
        setStatus('error');
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        {status === 'applying' && <p className="text-gray-700">Application de vos préférences de prestations…</p>}
        {status === 'done' && <p className="text-green-700">Âge(s) appliqué(s). Redirection…</p>}
        {status === 'error' && (
          <div className="text-red-700">
            <p>Une erreur est survenue.</p>
            {error && <p className="text-sm mt-2">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyBenefitsAge;
