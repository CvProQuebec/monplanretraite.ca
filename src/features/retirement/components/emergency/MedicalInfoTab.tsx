// Onglet des informations médicales
// Respectant la typographie québécoise (espaces avant : et $, pas avant ; ! ?)

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Heart, 
  Pill, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Info, 
  Calendar,
  User,
  Phone
} from 'lucide-react';
import { MedicalInfo, Medication } from '../../types/emergency-info';

interface MedicalInfoTabProps {
  data: MedicalInfo;
  onUpdate: (medical: MedicalInfo) => void;
}

export const MedicalInfoTab: React.FC<MedicalInfoTabProps> = ({ data, onUpdate }) => {
  const [newMedication, setNewMedication] = useState<Medication>({
    nom: '',
    dosage: '',
    frequence: ''
  });

  // Mettre à jour un champ spécifique
  const updateField = (field: keyof MedicalInfo, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  // Ajouter un médicament
  const addMedication = () => {
    if (newMedication.nom.trim() && newMedication.dosage.trim()) {
      const updatedMedications = [...data.medicamentsActuels, { ...newMedication }];
      updateField('medicamentsActuels', updatedMedications);
      setNewMedication({ nom: '', dosage: '', frequence: '' });
    }
  };

  // Supprimer un médicament
  const removeMedication = (index: number) => {
    const updatedMedications = data.medicamentsActuels.filter((_, i) => i !== index);
    updateField('medicamentsActuels', updatedMedications);
  };

  // Mettre à jour un médicament
  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updatedMedications = [...data.medicamentsActuels];
    updatedMedications[index] = { ...updatedMedications[index], [field]: value };
    updateField('medicamentsActuels', updatedMedications);
  };

  // Vérifier si les informations médicales sont complètes
  const isMedicalInfoComplete = () => {
    return (
      data.groupeSanguin?.trim() !== '' &&
      data.contactsUrgenceMedicale?.trim() !== ''
    );
  };

  // Compter les médicaments
  const medicationsCount = data.medicamentsActuels.length;

  return (
    <div className="space-y-6">
      {/* En-tête de l'onglet */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <Heart className="w-5 h-5" />
            Informations médicales critiques
          </CardTitle>
          <CardDescription className="text-red-700">
            Ces informations sont essentielles en cas d'urgence médicale ou d'hospitalisation.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Note importante */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Important :</strong> Ces informations médicales peuvent sauver votre vie en cas d'urgence. 
          Assurez-vous qu'elles sont à jour et précises.
        </AlertDescription>
      </Alert>

      {/* Informations de base */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations de base</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Groupe sanguin */}
            <div className="space-y-2">
              <Label htmlFor="groupe-sanguin" className="text-sm font-medium">
                Groupe sanguin
              </Label>
              <Input
                id="groupe-sanguin"
                value={data.groupeSanguin || ''}
                onChange={(e) => updateField('groupeSanguin', e.target.value)}
                placeholder="Ex : O+, A-, B+, AB-"
              />
            </div>

            {/* Date de mise à jour */}
            <div className="space-y-2">
              <Label htmlFor="date-mise-a-jour" className="text-sm font-medium">
                Mis à jour le
              </Label>
              <Input
                id="date-mise-a-jour"
                type="date"
                value={data.dateMiseAJour}
                onChange={(e) => updateField('dateMiseAJour', e.target.value)}
              />
            </div>
          </div>

          {/* Contacts d'urgence médicale */}
          <div className="space-y-2">
            <Label htmlFor="contacts-urgence-medicale" className="text-sm font-medium">
              Personnes à contacter en cas d'urgence médicale
            </Label>
            <Input
              id="contacts-urgence-medicale"
              value={data.contactsUrgenceMedicale || ''}
              onChange={(e) => updateField('contactsUrgenceMedicale', e.target.value)}
              placeholder="Ex : Conjoint, Enfant, Médecin de famille"
            />
          </div>

          {/* Directives médicales anticipées */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Directives médicales anticipées
            </Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="directives-oui"
                  checked={data.directivesMedicalesAnticipees === true}
                  onCheckedChange={(checked) => updateField('directivesMedicalesAnticipees', checked)}
                />
                <Label htmlFor="directives-oui">Oui</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="directives-non"
                  checked={data.directivesMedicalesAnticipees === false}
                  onCheckedChange={(checked) => updateField('directivesMedicalesAnticipees', !checked)}
                />
                <Label htmlFor="directives-non">Non</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allergies médicamenteuses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Allergies médicamenteuses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="allergies" className="text-sm font-medium">
              Liste de vos allergies médicamenteuses
            </Label>
            <Textarea
              id="allergies"
              value={data.allergiesMedicamenteuses || ''}
              onChange={(e) => updateField('allergiesMedicamenteuses', e.target.value)}
              placeholder="Ex : Pénicilline, Aspirine, Ibuprofène, Sulfamides..."
              rows={3}
              className="resize-none"
            />
            <p className="text-sm text-gray-600">
              Incluez le nom du médicament et la réaction allergique (ex : éruption cutanée, difficulté respiratoire)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Conditions médicales chroniques */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Conditions médicales chroniques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="conditions" className="text-sm font-medium">
              Liste de vos conditions médicales chroniques
            </Label>
            <Textarea
              id="conditions"
              value={data.conditionsMedicalesChroniques || ''}
              onChange={(e) => updateField('conditionsMedicalesChroniques', e.target.value)}
              placeholder="Ex : Diabète de type 2, Hypertension artérielle, Asthme, Maladie cardiaque..."
              rows={3}
              className="resize-none"
            />
            <p className="text-sm text-gray-600">
              Incluez la date de diagnostic et le nom de votre médecin traitant si applicable
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Médicaments actuels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Pill className="w-5 h-5" />
            Médicaments actuels
            <Badge variant="secondary">{medicationsCount}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Liste des médicaments existants */}
          {data.medicamentsActuels.map((medication, index) => (
            <Card key={index} className="border-2 border-mpr-border bg-mpr-interactive-lt">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-mpr-navy">Médicament {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMedication(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-mpr-navy">Nom</Label>
                    <Input
                      value={medication.nom}
                      onChange={(e) => updateMedication(index, 'nom', e.target.value)}
                      placeholder="Nom du médicament"
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs text-mpr-navy">Dosage</Label>
                    <Input
                      value={medication.dosage}
                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                      placeholder="Ex : 10 mg"
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs text-mpr-navy">Fréquence</Label>
                    <Input
                      value={medication.frequence}
                      onChange={(e) => updateMedication(index, 'frequence', e.target.value)}
                      placeholder="Ex : 2 fois par jour"
                      className="text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Formulaire d'ajout de médicament */}
          <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
            <CardContent className="pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Ajouter un nouveau médicament</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-700">Nom</Label>
                  <Input
                    value={newMedication.nom}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, nom: e.target.value }))}
                    placeholder="Nom du médicament"
                    className="text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs text-gray-700">Dosage</Label>
                  <Input
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                    placeholder="Ex : 10 mg"
                    className="text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs text-gray-700">Fréquence</Label>
                  <Input
                    value={newMedication.frequence}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, frequence: e.target.value }))}
                    placeholder="Ex : 2 fois par jour"
                    className="text-sm"
                  />
                </div>
              </div>
              
              <Button
                onClick={addMedication}
                disabled={!newMedication.nom.trim() || !newMedication.dosage.trim()}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter le médicament
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Conseils d'utilisation */}
      <Card className="border-mpr-border bg-mpr-interactive-lt">
        <CardHeader>
          <CardTitle className="text-mpr-navy">Conseils pour vos informations médicales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-mpr-navy">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-mpr-interactive rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Mettez à jour régulièrement</strong> vos informations médicales, surtout après un changement de traitement
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-mpr-interactive rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Incluez tous vos médicaments</strong> : prescrits, en vente libre, vitamines et suppléments
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-mpr-interactive rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Précisez les allergies</strong> et leurs réactions pour éviter les complications
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-mpr-interactive rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Partagez ce document</strong> avec vos proches et votre médecin traitant
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Limite de la version gratuite */}
      {medicationsCount >= 5 && (
        <Alert className="border-mpr-border bg-mpr-interactive-lt">
          <Info className="h-4 w-4 text-mpr-interactive" />
          <AlertDescription className="text-mpr-navy">
            <strong>Limite de la version gratuite :</strong> Vous avez atteint le maximum de 5 médicaments. 
            Passez au plan Professionnel pour ajouter plus de médicaments et accéder à toutes les fonctionnalités.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
