import React, { useState } from 'react';
import { CustomBirthDateInput } from './CustomBirthDateInput';

export const CustomBirthDateInputTest: React.FC = () => {
  const [date1, setDate1] = useState('198564'); // Valeur problématique existante
  const [date2, setDate2] = useState('');

  return (
    <div className="p-8 space-y-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Test CustomBirthDateInput</h1>
      
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Test 1: Date existante problématique</h2>
          <p className="text-sm text-gray-600 mb-4">
            Valeur actuelle: <code className="bg-gray-200 px-2 py-1 rounded">{date1}</code>
          </p>
          <CustomBirthDateInput
            id="test1"
            label="Date de naissance (problématique)"
            value={date1}
            onChange={setDate1}
          />
          <div className="mt-4 p-3 bg-mpr-interactive-lt border border-mpr-border rounded">
            <strong>Résultat:</strong> {date1}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Test 2: Nouvelle date</h2>
          <CustomBirthDateInput
            id="test2"
            label="Date de naissance (nouvelle)"
            value={date2}
            onChange={setDate2}
          />
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <strong>Résultat:</strong> {date2}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Instructions de test</h2>
          <div className="space-y-2 text-sm">
            <p>1. Le premier champ devrait automatiquement corriger "198564" → "1985-64" (et tronquer à 8 chiffres)</p>
            <p>2. Dans le second champ, tapez "19870605" → devrait devenir "1987-06-05"</p>
            <p>3. Testez aussi "1987-06-05" directement</p>
          </div>
        </div>
      </div>
    </div>
  );
};
