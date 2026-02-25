/**
 * Page MVP "Hypothèses de Calcul" - Interface Seniors-Friendly
 * Fond blanc, texte noir, gros caractères, espacement généreux
 * 
 * @version 2025.1.0
 * @date 2025-01-09
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Info, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { SimpleAssumptionsService } from '@/services/SimpleAssumptionsService';
import type { SimpleTooltip } from '@/types/assumptions-simple';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';

export default function SimpleAssumptionsPage() {
  const assumptions = SimpleAssumptionsService.getAssumptions();
  const tooltips = SimpleAssumptionsService.getTooltips();
  const { userData, updateUserData } = useRetirementData();
  const tauxRemplacement = (userData?.personal as any)?.tauxRemplacement ?? 0.75;
  const inflationUser = (userData?.personal as any)?.inflationPersonnalisee ?? 2.1;
  
  return (
    <div className="min-h-screen bg-white p-4">
      {/* Navigation retour */}
      <div className="max-w-4xl mx-auto mb-6">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-3 text-lg text-gray-700 hover:text-gray-900 transition-colors p-3 hover:bg-gray-50 rounded-lg"
        >
          <ArrowLeft className="w-6 h-6" />
          Retour
        </button>
      </div>

      {/* En-tête simple */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nos hypothèses de calcul
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Découvrez les standards professionnels utilisés pour vos projections
          </p>
        </div>
        
        {/* Badge de conformité */}
        <div className="flex justify-center mb-8">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg px-8 py-4 flex items-center gap-4">
            <Shield className="w-8 h-8 text-green-600" />
            <span className="text-xl font-semibold text-green-800">
              Conforme aux normes IPF 2025
            </span>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Paramètres simples (interactifs) */}
      <div className="max-w-4xl mx-auto mb-6">
        <Card className="bg-white border-2 border-mpr-border shadow-md">
          <CardHeader className="p-6">
            <h2 className="text-2xl font-bold text-gray-900">Vos paramètres simples</h2>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Taux de remplacement */}
              <div className="bg-mpr-interactive-lt border-2 border-mpr-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="slider-remplacement" className="text-lg font-semibold text-mpr-navy">
                    Taux de remplacement (%)
                  </label>
                  <div className="text-xl font-bold text-mpr-navy">
                    {Math.round(((typeof tauxRemplacement === 'number' ? (tauxRemplacement > 1 ? tauxRemplacement / 100 : tauxRemplacement) : 0.75) * 100) * 10) / 10} %
                  </div>
                </div>
                <input
                  id="slider-remplacement"
                  type="range"
                  min={60}
                  max={90}
                  step={1}
                  value={Math.round(((typeof tauxRemplacement === 'number' ? (tauxRemplacement > 1 ? tauxRemplacement / 100 : tauxRemplacement) : 0.75) * 100))}
                  onChange={(e) => {
                    const pct = Number(e.target.value);
                    updateUserData('personal', { tauxRemplacement: pct / 100 });
                  }}
                  className="w-full"
                />
                <p className="text-sm text-mpr-navy mt-2">
                  Ajustez entre 60 % et 90 % selon votre style de vie. Par défaut: 75 %.
                </p>
              </div>

              {/* Inflation personnalisée */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="input-inflation" className="text-lg font-semibold text-amber-900">
                    Inflation utilisée (%)
                  </label>
                  <div className="text-xl font-bold text-amber-700">
                    {Number(inflationUser).toFixed(1)} %
                  </div>
                </div>
                <input
                  id="input-inflation"
                  type="number"
                  step={0.1}
                  min={0}
                  max={10}
                  value={inflationUser}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    updateUserData('personal', { inflationPersonnalisee: isNaN(val) ? 2.1 : val });
                  }}
                  className="w-full p-2 border rounded-md"
                  placeholder="2.1"
                />
                <p className="text-sm text-amber-800 mt-2">
                  Norme IPF 2025: 2,1 %. Vous pouvez l’ajuster ici (affecte les projections).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau principal - Style seniors */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white border-2 border-gray-200 shadow-lg">
          <CardHeader className="bg-gray-50 border-b-2 border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Hypothèses utilisées pour vos calculs
            </h2>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Inflation */}
              <AssumptionRow
                label="Taux d'inflation annuel"
                value={SimpleAssumptionsService.formatPercentage(assumptions.inflation)}
                tooltip={tooltips.inflation}
                icon="📈"
              />
              
              {/* Actions */}
              <AssumptionRow
                label="Rendement actions canadiennes"
                value={SimpleAssumptionsService.formatPercentage(assumptions.stockReturns)}
                tooltip={tooltips.stockReturns}
                icon="📊"
              />
              
              {/* Obligations */}
              <AssumptionRow
                label="Rendement obligations"
                value={SimpleAssumptionsService.formatPercentage(assumptions.bondReturns)}
                tooltip={tooltips.bondReturns}
                icon="🏛️"
              />
              
              {/* Salaires */}
              <AssumptionRow
                label="Croissance des salaires"
                value={SimpleAssumptionsService.formatPercentage(assumptions.salaryGrowth)}
                tooltip={tooltips.salaryGrowth}
                icon="💰"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Section méthodologie simple */}
        <div className="mt-8">
          <Card className="bg-mpr-interactive-lt border-2 border-mpr-border">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-mpr-navy mb-6 flex items-center gap-3">
                <Info className="w-8 h-8" />
                Pourquoi ces hypothèses ?
              </h3>
              <div className="text-xl text-mpr-navy space-y-4 leading-relaxed">
                <p>
                  <strong>L'Institut de planification financière</strong> établit les standards 
                  que tous les professionnels du Québec doivent suivre.
                </p>
                <p>
                  En utilisant ces mêmes hypothèses, vos projections sont 
                  <strong> cohérentes avec celles d'un planificateur financier professionnel</strong>.
                </p>
                <p className="text-lg text-mpr-navy pt-4 border-t border-mpr-border">
                  Source : {assumptions.source} • Mise à jour : {assumptions.lastUpdated}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section exemples éducatifs */}
        <div className="mt-8">
          <Card className="bg-gray-50 border-2 border-gray-200">
            <CardHeader className="p-8 border-b-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 text-center">
                Exemples concrets
              </h3>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <ExampleCard
                  title="Impact de l'inflation"
                  icon="📈"
                  examples={[
                    "100 $ aujourd'hui = 102,10 $ l'an prochain",
                    "Panier d'épicerie coûtera 23 $ de plus dans 10 ans"
                  ]}
                />
                <ExampleCard
                  title="Croissance des actions"
                  icon="📊"
                  examples={[
                    "10 000 $ pourrait valoir 66 200 $ après 30 ans",
                    "REER de 1 000 $/an = plus de 100 000 $ en 20 ans"
                  ]}
                />
                <ExampleCard
                  title="Sécurité des obligations"
                  icon="🏛️"
                  examples={[
                    "10 000 $ pourrait valoir 27 400 $ après 30 ans",
                    "Moins de risque, croissance plus prévisible"
                  ]}
                />
                <ExampleCard
                  title="Évolution des salaires"
                  icon="💰"
                  examples={[
                    "50 000 $ aujourd'hui = 126 000 $ dans 30 ans",
                    "Augmentation moyenne de 3,1 % par année"
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Composant ligne d'hypothèse - Style seniors
function AssumptionRow({ label, value, tooltip, icon }: {
  label: string;
  value: string;
  tooltip: SimpleTooltip;
  icon: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-4xl">{icon}</span>
          <div>
            <h4 className="text-2xl font-semibold text-gray-900 mb-2">{label}</h4>
            <p className="text-lg text-gray-600">{tooltip.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-4xl font-bold text-gray-900 font-mono">{value}</div>
            <div className="text-base text-gray-600 mt-1">Norme IPF 2025</div>
          </div>
          
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className="w-12 h-12 bg-mpr-interactive-lt hover:bg-mpr-interactive-lt rounded-full flex items-center justify-center transition-colors"
            aria-label={`Plus d'informations sur ${tooltip.title}`}
          >
            <Info className="w-6 h-6 text-mpr-interactive" />
          </button>
        </div>
      </div>
      
      {/* Tooltip simple */}
      {showTooltip && (
        <div className="mt-6 p-6 bg-mpr-interactive-lt border-2 border-mpr-border rounded-lg">
          <h5 className="font-semibold text-mpr-navy mb-3 text-xl">{tooltip.title}</h5>
          <p className="text-mpr-navy mb-3 text-lg">{tooltip.description}</p>
          <p className="text-mpr-navy italic text-lg">
            <strong>Exemple :</strong> {tooltip.example}
          </p>
        </div>
      )}
    </div>
  );
}

// Composant carte d'exemple
function ExampleCard({ title, icon, examples }: {
  title: string;
  icon: string;
  examples: string[];
}) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h4 className="text-xl font-semibold text-gray-900">{title}</h4>
      </div>
      <div className="space-y-3">
        {examples.map((example, index) => (
          <div key={index} className="text-lg text-gray-700 leading-relaxed">
            • {example}
          </div>
        ))}
      </div>
    </div>
  );
}
