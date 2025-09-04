import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { UserData } from '@/types';

interface ValidationAlertProps {
  userData: UserData;
  isFrench: boolean;
  onValidationComplete?: (isValid: boolean) => void;
}

const ValidationAlert: React.FC<ValidationAlertProps> = ({
  userData,
  isFrench,
  onValidationComplete
}) => {
  // Validation logic for required fields
  const validateRequiredFields = () => {
    const personal = userData.personal || {};
    const requiredFields = [
      { key: 'naissance1', label: isFrench ? 'Date de naissance (Personne 1)' : 'Birth date (Person 1)' },
      { key: 'sexe1', label: isFrench ? 'Sexe (Personne 1)' : 'Gender (Person 1)' },
      { key: 'province1', label: isFrench ? 'Province (Personne 1)' : 'Province (Person 1)' },
      { key: 'naissance2', label: isFrench ? 'Date de naissance (Personne 2)' : 'Birth date (Person 2)', optional: true },
      { key: 'sexe2', label: isFrench ? 'Sexe (Personne 2)' : 'Gender (Person 2)', optional: true },
      { key: 'province2', label: isFrench ? 'Province (Personne 2)' : 'Province (Person 2)', optional: true }
    ];

    const missingFields: string[] = [];
    const warnings: string[] = [];

    requiredFields.forEach(field => {
      const value = (personal as any)[field.key];
      if (!field.optional && (!value || value === '')) {
        missingFields.push(field.label);
      } else if (field.optional && (!value || value === '')) {
        warnings.push(field.label);
      }
    });

    // Check for recommended fields for personalized analysis
    const recommendedFields = [
      { key: 'etatSante1', label: isFrench ? 'État de santé (Personne 1)' : 'Health status (Person 1)' },
      { key: 'modeVieActif1', label: isFrench ? 'Mode de vie actif (Personne 1)' : 'Active lifestyle (Person 1)' },
      { key: 'niveauCompetences1', label: isFrench ? 'Niveau d\'éducation (Personne 1)' : 'Education level (Person 1)' },
      { key: 'secteurActivite1', label: isFrench ? 'Secteur d\'activité (Personne 1)' : 'Work sector (Person 1)' }
    ];

    recommendedFields.forEach(field => {
      const value = (personal as any)[field.key];
      if (!value || value === '') {
        warnings.push(field.label);
      }
    });

    return {
      isValid: missingFields.length === 0,
      missingFields,
      warnings,
      hasWarnings: warnings.length > 0
    };
  };

  const validation = validateRequiredFields();

  // Call the callback if provided
  React.useEffect(() => {
    if (onValidationComplete) {
      onValidationComplete(validation.isValid);
    }
  }, [validation.isValid, onValidationComplete]);

  if (validation.isValid && !validation.hasWarnings) {
    return (
      <Alert className="border-green-300 bg-green-50">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <AlertDescription className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-green-800">
              {isFrench ? '✅ Tous les champs requis sont complétés' : '✅ All required fields are completed'}
            </span>
            <Badge variant="default" className="bg-green-600">
              {isFrench ? 'Prêt pour l\'analyse' : 'Ready for analysis'}
            </Badge>
          </div>
          <p className="text-sm text-green-700">
            {isFrench
              ? 'Vos données sont complètes pour une analyse de longévité précise.'
              : 'Your data is complete for accurate longevity analysis.'
            }
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  if (!validation.isValid) {
    return (
      <Alert className="border-red-300 bg-red-50">
        <XCircle className="h-5 w-5 text-red-500" />
        <AlertDescription className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-red-800">
              {isFrench ? '❌ Champs requis manquants' : '❌ Required fields missing'}
            </span>
            <Badge variant="destructive">
              {isFrench ? 'Analyse impossible' : 'Analysis impossible'}
            </Badge>
          </div>
          <p className="text-sm text-red-700 mb-2">
            {isFrench
              ? 'Veuillez compléter les champs suivants pour obtenir une analyse de longévité :'
              : 'Please complete the following fields to get longevity analysis:'
            }
          </p>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {validation.missingFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
          <p className="text-xs text-red-600 mt-2">
            {isFrench
              ? 'L\'analyse de longévité affichera 0 tant que ces champs ne sont pas remplis.'
              : 'Longevity analysis will show 0 until these fields are filled.'
            }
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-yellow-300 bg-yellow-50">
      <AlertTriangle className="h-5 w-5 text-yellow-500" />
      <AlertDescription className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-yellow-800">
            {isFrench ? '⚠️ Champs recommandés manquants' : '⚠️ Recommended fields missing'}
          </span>
          <Badge variant="secondary" className="bg-yellow-600 text-white">
            {isFrench ? 'Analyse basique' : 'Basic analysis'}
          </Badge>
        </div>
        <p className="text-sm text-yellow-700 mb-2">
          {isFrench
            ? 'Pour une analyse plus précise, considérez compléter ces champs :'
            : 'For more accurate analysis, consider completing these fields:'
          }
        </p>
        <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
          {validation.warnings.slice(0, 4).map((field, index) => (
            <li key={index}>{field}</li>
          ))}
          {validation.warnings.length > 4 && (
            <li className="italic">
              {isFrench
                ? `... et ${validation.warnings.length - 4} autres`
                : `... and ${validation.warnings.length - 4} more`
              }
            </li>
          )}
        </ul>
        <p className="text-xs text-yellow-600 mt-2">
          {isFrench
            ? 'L\'analyse fonctionnera avec des valeurs par défaut, mais sera moins précise.'
            : 'Analysis will work with default values, but will be less accurate.'
          }
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default ValidationAlert;
