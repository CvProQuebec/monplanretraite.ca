// Onglet des personnes à charge
// Composant de base pour la version gratuite

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Trash2, Info } from 'lucide-react';
import { Dependent } from '../../types/emergency-info';

interface DependentsTabProps {
  data: Dependent[];
  onUpdate: (dependants: Dependent[]) => void;
}

export const DependentsTab: React.FC<DependentsTabProps> = ({ data, onUpdate }) => {
  // Mettre à jour un dépendant
  const updateDependent = (index: number, field: keyof Dependent, value: string) => {
    const newDependants = [...data];
    newDependants[index] = { ...newDependants[index], [field]: value };
    onUpdate(newDependants);
  };

  // Ajouter un dépendant
  const addDependent = () => {
    if (data.length < 4) { // Limite à 4 pour la version gratuite
      const newDependent: Dependent = {
        nom: '',
        coordonnees: '',
        instructionsSpeciales: ''
      };
      onUpdate([...data, newDependent]);
    }
  };

  // Supprimer un dépendant
  const removeDependent = (index: number) => {
    if (data.length > 1) {
      const newDependants = data.filter((_, i) => i !== index);
      onUpdate(newDependants);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-mpr-border bg-mpr-interactive-lt">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-mpr-navy">
            <Users className="w-5 h-5" />
            Personnes à charge
          </CardTitle>
          <CardDescription className="text-mpr-navy">
            Informations sur les personnes qui dépendent de vous financièrement ou autrement.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {data.map((dependent, index) => (
          <Card key={index} className="border-2 border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Personne à charge {index + 1}</CardTitle>
                {data.length > 1 && (
                  <button
                    onClick={() => removeDependent(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                    title="Supprimer cette personne à charge"
                    aria-label="Supprimer cette personne à charge"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`nom-${index}`}>Nom</Label>
                  <Input
                    id={`nom-${index}`}
                    value={dependent.nom}
                    onChange={(e) => updateDependent(index, 'nom', e.target.value)}
                    placeholder="Nom complet"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`coordonnees-${index}`}>Coordonnées</Label>
                  <Input
                    id={`coordonnees-${index}`}
                    value={dependent.coordonnees}
                    onChange={(e) => updateDependent(index, 'coordonnees', e.target.value)}
                    placeholder="Téléphone, courriel, adresse"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`instructions-${index}`}>Instructions spéciales</Label>
                <Textarea
                  id={`instructions-${index}`}
                  value={dependent.instructionsSpeciales || ''}
                  onChange={(e) => updateDependent(index, 'instructionsSpeciales', e.target.value)}
                  placeholder="Besoins particuliers, allergies, médicaments..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.length < 4 && (
        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
          <CardContent className="pt-6">
            <button
              onClick={addDependent}
              className="w-full p-4 text-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">Ajouter une personne à charge</span>
            </button>
          </CardContent>
        </Card>
      )}

      {data.length >= 4 && (
        <Card className="border-mpr-border bg-mpr-interactive-lt">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-mpr-navy">
              <Info className="w-5 h-5" />
              <span className="text-sm">
                <strong>Limite de la version gratuite :</strong> Maximum 4 personnes à charge. 
                Passez au plan Professionnel pour plus de fonctionnalités.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
