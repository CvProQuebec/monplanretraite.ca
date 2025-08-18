// Onglet de l'emploi et prestations
// Composant de base pour la version gratuite

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Building, User, Phone, Mail, CreditCard } from 'lucide-react';
import { EmploymentInfo } from '../../types/emergency-info';

interface EmploymentTabProps {
  data: EmploymentInfo;
  onUpdate: (emploi: EmploymentInfo) => void;
}

export const EmploymentTab: React.FC<EmploymentTabProps> = ({ data, onUpdate }) => {
  // Mettre à jour un champ
  const updateField = (field: keyof EmploymentInfo, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Briefcase className="w-5 h-5" />
            Emploi et prestations
          </CardTitle>
          <CardDescription className="text-blue-700">
            Informations sur votre emploi actuel et vos prestations sociales.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations de l'entreprise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom-entreprise">Nom de l'entreprise</Label>
              <Input
                id="nom-entreprise"
                value={data.nomEntreprise}
                onChange={(e) => updateField('nomEntreprise', e.target.value)}
                placeholder="Nom de votre employeur"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adresse-entreprise">Adresse</Label>
              <Input
                id="adresse-entreprise"
                value={data.adresse}
                onChange={(e) => updateField('adresse', e.target.value)}
                placeholder="Adresse de l'entreprise"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero-employe">Numéro d'employé</Label>
              <Input
                id="numero-employe"
                value={data.numeroEmploye}
                onChange={(e) => updateField('numeroEmploye', e.target.value)}
                placeholder="Votre numéro d'employé"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="superieur">Supérieur immédiat</Label>
              <Input
                id="superieur"
                value={data.superieurImmediat}
                onChange={(e) => updateField('superieurImmediat', e.target.value)}
                placeholder="Nom de votre superviseur"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contacts et coordonnées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telephone-courriel">Téléphone/Courriel principal</Label>
              <Input
                id="telephone-courriel"
                value={data.telephoneCourriel}
                onChange={(e) => updateField('telephoneCourriel', e.target.value)}
                placeholder="Téléphone ou courriel principal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personne-rh">Personne-ressource RH</Label>
              <Input
                id="personne-rh"
                value={data.personneRessourceRH}
                onChange={(e) => updateField('personneRessourceRH', e.target.value)}
                placeholder="Nom de la personne RH"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telephone-courriel-rh">Téléphone/Courriel RH</Label>
            <Input
              id="telephone-courriel-rh"
              value={data.telephoneCourrielRH}
              onChange={(e) => updateField('telephoneCourrielRH', e.target.value)}
              placeholder="Coordonnées de la personne RH"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Prestations et avantages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="avantages-sociaux">Avantages sociaux</Label>
            <Textarea
              id="avantages-sociaux"
              value={data.avantagesSociaux || ''}
              onChange={(e) => updateField('avantagesSociaux', e.target.value)}
              placeholder="Assurance collective, congés payés, autres avantages..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reer-collectif">REER collectif</Label>
            <Textarea
              id="reer-collectif"
              value={data.reerCollectif || ''}
              onChange={(e) => updateField('reerCollectif', e.target.value)}
              placeholder="Détails de votre REER collectif, contribution de l'employeur..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
