import React from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { CheckCircle, Settings, Zap } from 'lucide-react';

interface LongevityModeSelectorProps {
  mode: 'standard' | 'personalized';
  onModeChange: (mode: 'standard' | 'personalized') => void;
  isFrench: boolean;
}

const LongevityModeSelector: React.FC<LongevityModeSelectorProps> = ({
  mode,
  onModeChange,
  isFrench
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {isFrench ? 'Mode d\'analyse de longévité' : 'Longevity Analysis Mode'}
          </h3>
          <p className="text-gray-600">
            {isFrench
              ? 'Choisissez le niveau de détail pour votre analyse personnalisée'
              : 'Choose the level of detail for your personalized analysis'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mode Standard */}
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              mode === 'standard'
                ? 'border-mpr-interactive bg-mpr-interactive-lt'
                : 'border-gray-200 hover:border-mpr-border'
            }`}
            onClick={() => onModeChange('standard')}
          >
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-mpr-interactive" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {isFrench ? 'Mode Standard IPF2025' : 'Standard IPF2025 Mode'}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {isFrench ? 'Rapide' : 'Quick'}
                </Badge>
              </div>
              {mode === 'standard' && <CheckCircle className="w-5 h-5 text-mpr-interactive" />}
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {isFrench
                ? 'Analyse basée sur les normes actuarielles IPF2025. Calcul rapide avec les données de base.'
                : 'Analysis based on current IPF2025 actuarial standards. Quick calculation with basic data.'
              }
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• {isFrench ? 'Date de naissance' : 'Date of birth'}</li>
              <li>• {isFrench ? 'Sexe' : 'Gender'}</li>
              <li>• {isFrench ? 'Province' : 'Province'}</li>
              <li>• {isFrench ? 'Statut professionnel' : 'Professional status'}</li>
            </ul>
          </div>

          {/* Mode Personnalisé */}
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              mode === 'personalized'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => onModeChange('personalized')}
          >
            <div className="flex items-center gap-3 mb-3">
              <Settings className="w-6 h-6 text-purple-600" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {isFrench ? 'Mode Analyse Personnalisée' : 'Personalized Analysis Mode'}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {isFrench ? 'Détaillé' : 'Detailed'}
                </Badge>
              </div>
              {mode === 'personalized' && <CheckCircle className="w-5 h-5 text-purple-600" />}
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {isFrench
                ? 'Analyse approfondie intégrant vos facteurs de risque personnels pour une projection plus précise.'
                : 'In-depth analysis incorporating your personal risk factors for more accurate projections.'
              }
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• {isFrench ? 'Tous les facteurs du mode standard' : 'All standard mode factors'}</li>
              <li>• {isFrench ? 'Profil socio-économique' : 'Socio-economic profile'}</li>
              <li>• {isFrench ? 'Habitudes de vie' : 'Lifestyle habits'}</li>
              <li>• {isFrench ? 'État de santé' : 'Health status'}</li>
              <li>• {isFrench ? 'Conditions médicales' : 'Medical conditions'}</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>{isFrench ? 'Note:' : 'Note:'}</strong>{' '}
            {isFrench
              ? 'Le mode personnalisé utilise des coefficients scientifiques validés pour ajuster vos projections de longévité.'
              : 'The personalized mode uses validated scientific coefficients to adjust your longevity projections.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LongevityModeSelector;
