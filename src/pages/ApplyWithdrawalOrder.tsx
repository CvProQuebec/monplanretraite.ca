import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { wizardService } from '@/services/WizardService';

/**
 * ApplyWithdrawalOrder
 * Handler de lien profond pour appliquer un ordre de retraits fiscal optimal au scénario.
 *
 * Utilisation:
 * - /withdrawals/apply?order=CELI,PLACEMENTS_NON_ENREGISTRES,REER_OPTIMISE&redirect=/optimisation-fiscale&scenarioId=default
 * - /retraits/apply?order=REER_OPTIMISE,CELI,PLACEMENTS_NON_ENREGISTRES (redirect implicite vers /optimisation-fiscale)
 *
 * Convention des sources (exemples usuels):
 * - CELI
 * - PLACEMENTS_NON_ENREGISTRES
 * - REER_OPTIMISE (ou FERR)
 * - FERR
 * - CELI_COMPLEMENT
 */
const ApplyWithdrawalOrder: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'applying' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setStatus('applying');
      setError(null);

      const orderParam = params.get('order');
      const redirect = params.get('redirect') || '/optimisation-fiscale';
      const scenarioId = params.get('scenarioId') || 'default';

      try {
        if (!orderParam) {
          throw new Error('Paramètre "order" manquant. Exemple: order=CELI,PLACEMENTS_NON_ENREGISTRES,REER_OPTIMISE');
        }

        // Nettoyage/normalisation basique
        const order = orderParam
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);

        if (order.length === 0) {
          throw new Error('Aucun élément valide dans "order".');
        }

        await wizardService.applyWithdrawalOrder(order, scenarioId);
        setStatus('done');
        setTimeout(() => navigate(redirect), 200);
      } catch (e: any) {
        console.error('ApplyWithdrawalOrder error:', e);
        setError(e?.message || 'Erreur lors de l’application de l’ordre de retraits');
        setStatus('error');
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        {status === 'applying' && <p className="text-gray-700">Application de l’ordre de retraits…</p>}
        {status === 'done' && <p className="text-green-700">Ordre de retraits appliqué. Redirection…</p>}
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

export default ApplyWithdrawalOrder;
