import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Flag } from 'lucide-react';

interface RRQSimpleFormProps {
  personNumber: 1 | 2;
  personName: string;
  userData: any;
  onDataChange: (data: any) => void;
  isFrench: boolean;
}

const RRQSimpleForm: React.FC<RRQSimpleFormProps> = ({
  personNumber,
  personName,
  userData,
  onDataChange,
  isFrench
}) => {
  const [formData, setFormData] = useState({
    ageActuel: '',
    prestationActuelle: '',
    prestation70: ''
  });

  // Charger les données existantes
  useEffect(() => {
    const rrqAgeActuel = personNumber === 1 
      ? userData?.retirement?.rrqAgeActuel1 
      : userData?.retirement?.rrqAgeActuel2;
    
    const rrqMontantActuel = personNumber === 1 
      ? userData?.retirement?.rrqMontantActuel1 
      : userData?.retirement?.rrqMontantActuel2;
    
    const rrqMontant70 = personNumber === 1 
      ? userData?.retirement?.rrqMontant70_1 
      : userData?.retirement?.rrqMontant70_2;

    setFormData({
      ageActuel: rrqAgeActuel ? rrqAgeActuel.toString() : '',
      prestationActuelle: rrqMontantActuel ? rrqMontantActuel.toString() : '',
      prestation70: rrqMontant70 ? rrqMontant70.toString() : ''
    });
  }, [userData, personNumber]);

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Sauvegarder dans userData
    const fieldMap = {
      ageActuel: personNumber === 1 ? 'rrqAgeActuel1' : 'rrqAgeActuel2',
      prestationActuelle: personNumber === 1 ? 'rrqMontantActuel1' : 'rrqMontantActuel2',
      prestation70: personNumber === 1 ? 'rrqMontant70_1' : 'rrqMontant70_2'
    };

    const updates = {
      [fieldMap[field as keyof typeof fieldMap]]: value === '' ? 0 : parseFloat(value) || 0
    };

    onDataChange(updates);
  };

  return (
    <Card className="bg-white border-2 border-blue-200 shadow-lg">
      <CardHeader className="bg-blue-50 border-b-2 border-blue-200">
        <CardTitle className="text-xl font-bold text-blue-800 flex items-center gap-2">
          <Flag className="w-6 h-6" />
          {isFrench ? 'RRQ/CPP - Régime de rentes du Québec' : 'QPP/CPP - Quebec Pension Plan'}
        </CardTitle>
        <p className="text-sm text-blue-600">
          {isFrench 
            ? `Saisissez vos montants RRQ/CPP pour Personne ${personNumber} et Personne 2`
            : `Enter your QPP/CPP amounts for Person ${personNumber} and Person 2`
          }
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Personne 1 */}
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {personNumber} RRQ/CPP - {personName}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{personName}</p>
            
            <div className="senior-form-row-triple">
              <div className="senior-form-field">
                <label className="senior-form-label">
                  {isFrench ? 'Âge actuel' : 'Current Age'}
                </label>
                <Input
                  id="ageActuel"
                  type="number"
                  value={formData.ageActuel}
                  onChange={(e) => handleInputChange('ageActuel', e.target.value)}
                  placeholder="Ex: 58"
                  className="senior-form-input"
                />
              </div>
              
              <div className="senior-form-field">
                <label className="senior-form-label">
                  {isFrench ? 'Prestation RRQ actuelle' : 'Current QPP Benefit'}
                </label>
                <Input
                  id="prestationActuelle"
                  type="number"
                  value={formData.prestationActuelle}
                  onChange={(e) => handleInputChange('prestationActuelle', e.target.value)}
                  placeholder="Ex: 1 200"
                  className="senior-form-input"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {isFrench 
                    ? 'Montant mensuel exact fourni par RRQ (consultez "Mon Dossier")'
                    : 'Exact monthly amount provided by QPP (consult "My File")'
                  }
                </p>
              </div>
              
              <div className="senior-form-field">
                <label className="senior-form-label">
                  {isFrench ? 'Prestation RRQ à 70 ans' : 'QPP Benefit at 70 years old'}
                </label>
                <Input
                  id="prestation70"
                  type="number"
                  value={formData.prestation70}
                  onChange={(e) => handleInputChange('prestation70', e.target.value)}
                  placeholder="Ex: 1 500"
                  className="senior-form-input"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {isFrench 
                    ? 'Montant mensuel si vous attendez jusqu\'à 70 ans'
                    : 'Monthly amount if you wait until 70 years old'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RRQSimpleForm;
