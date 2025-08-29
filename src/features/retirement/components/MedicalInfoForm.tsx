// src/features/retirement/components/MedicalInfoForm.tsx
// Formulaire pour les informations médicales

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Heart, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Pill,
  Stethoscope,
  Building2,
  FileText,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { MedicalInfo } from '../types/emergency-planning';
import { EmergencyPlanningService } from '../services/EmergencyPlanningService';

interface MedicalInfoFormProps {
  medicalInfo: MedicalInfo;
  onChange: (medicalInfo: MedicalInfo) => void;
  className?: string;
}

const bloodGroupOptions = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' }
];

const commonAllergies = [
  'Pénicilline', 'Aspirine', 'Iode', 'Latex', 'Arachides', 'Fruits de mer', 
  'Œufs', 'Lait', 'Soja', 'Blé', 'Pollen', 'Acariens', 'Poils d\'animaux'
];

const commonMedications = [
  'Aspirine', 'Tylenol', 'Advil', 'Lipitor', 'Metformine', 'Lisinopril',
  'Amlodipine', 'Metoprolol', 'Omeprazole', 'Synthroid', 'Warfarine'
];

const commonConditions = [
  'Hypertension', 'Diabète type 2', 'Cholestérol élevé', 'Arthrite', 
  'Ostéoporose', 'Maladie cardiaque', 'Asthme', 'MPOC', 'Dépression', 
  'Anxiété', 'Migraine', 'Reflux gastrique'
];

export const MedicalInfoForm: React.FC<MedicalInfoFormProps> = ({
  medicalInfo,
  onChange,
  className
}) => {
  const [editingMedication, setEditingMedication] = useState<number | null>(null);
  const [newMedication, setNewMedication] = useState({
    nom: '',
    dosage: '',
    frequence: '',
    prescripteur: ''
  });
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateMedicalInfo = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!medicalInfo.numeroAssuranceMaladie.trim()) {
      newErrors.numeroAssuranceMaladie = 'Le numéro d\'assurance maladie est requis';
    } else if (!/^[A-Z]{4}\d{8}$/.test(medicalInfo.numeroAssuranceMaladie.replace(/\s/g, ''))) {
      newErrors.numeroAssuranceMaladie = 'Format invalide (ex: ABCD12345678)';
    }

    return newErrors;
  };

  const updateMedicalInfo = (field: string, value: any) => {
    if (field.startsWith('medecinFamille.')) {
      const doctorField = field.split('.')[1];
      onChange({
        ...medicalInfo,
        medecinFamille: {
          ...medicalInfo.medecinFamille,
          [doctorField]: value
        }
      });
    } else if (field.startsWith('hopitalPrefere.')) {
      const hospitalField = field.split('.')[1];
      onChange({
        ...medicalInfo,
        hopitalPrefere: {
          ...medicalInfo.hopitalPrefere,
          [hospitalField]: value
        }
      });
    } else if (field.startsWith('directivesAvancees.')) {
      const directiveField = field.split('.')[1];
      onChange({
        ...medicalInfo,
        directivesAvancees: {
          ...medicalInfo.directivesAvancees,
          [directiveField]: value
        }
      });
    } else {
      onChange({
        ...medicalInfo,
        [field]: value
      });
    }
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !medicalInfo.allergies.includes(newAllergy.trim())) {
      onChange({
        ...medicalInfo,
        allergies: [...medicalInfo.allergies, newAllergy.trim()]
      });
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    onChange({
      ...medicalInfo,
      allergies: medicalInfo.allergies.filter((_, i) => i !== index)
    });
  };

  const addCondition = () => {
    if (newCondition.trim() && !medicalInfo.conditionsMedicales.includes(newCondition.trim())) {
      onChange({
        ...medicalInfo,
        conditionsMedicales: [...medicalInfo.conditionsMedicales, newCondition.trim()]
      });
      setNewCondition('');
    }
  };

  const removeCondition = (index: number) => {
    onChange({
      ...medicalInfo,
      conditionsMedicales: medicalInfo.conditionsMedicales.filter((_, i) => i !== index)
    });
  };

  const addMedication = () => {
    if (newMedication.nom.trim()) {
      onChange({
        ...medicalInfo,
        medicaments: [...medicalInfo.medicaments, { ...newMedication }]
      });
      setNewMedication({ nom: '', dosage: '', frequence: '', prescripteur: '' });
    }
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updatedMedications = medicalInfo.medicaments.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    );
    onChange({
      ...medicalInfo,
      medicaments: updatedMedications
    });
  };

  const removeMedication = (index: number) => {
    onChange({
      ...medicalInfo,
      medicaments: medicalInfo.medicaments.filter((_, i) => i !== index)
    });
  };

  const formatHealthCardNumber = (value: string) => {
    // Enlever tous les espaces et convertir en majuscules
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    // Ajouter un espace après les 4 premières lettres
    if (cleaned.length > 4) {
      return cleaned.slice(0, 4) + ' ' + cleaned.slice(4, 12);
    }
    return cleaned;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            Informations médicales
          </CardTitle>
          <CardDescription>
            Informations essentielles pour les professionnels de la santé en cas d'urgence.
            Ces données peuvent sauver des vies.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Informations de base */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations de base</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numeroAssuranceMaladie">Numéro d'assurance maladie *</Label>
              <Input
                id="numeroAssuranceMaladie"
                placeholder="ABCD 12345678"
                value={medicalInfo.numeroAssuranceMaladie}
                onChange={(e) => updateMedicalInfo('numeroAssuranceMaladie', formatHealthCardNumber(e.target.value))}
                className={errors.numeroAssuranceMaladie ? 'border-red-500' : ''}
                maxLength={13}
              />
              {errors.numeroAssuranceMaladie && (
                <p className="text-sm text-red-500 mt-1">{errors.numeroAssuranceMaladie}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Format: 4 lettres suivies de 8 chiffres (ex: ABCD 12345678)
              </p>
            </div>

            <div>
              <Label htmlFor="groupeSanguin">Groupe sanguin</Label>
              <Select
                value={medicalInfo.groupeSanguin || ''}
                onValueChange={(value) => updateMedicalInfo('groupeSanguin', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Non spécifié</SelectItem>
                  {bloodGroupOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Allergies
          </CardTitle>
          <CardDescription>
            Listez toutes vos allergies connues. Si vous n'en avez aucune, ajoutez "Aucune".
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Ajout d'allergie */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Select
                value={newAllergy}
                onValueChange={setNewAllergy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une allergie courante..." />
                </SelectTrigger>
                <SelectContent>
                  {commonAllergies.map(allergy => (
                    <SelectItem key={allergy} value={allergy}>
                      {allergy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Ou saisir une allergie..."
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
              className="flex-1"
            />
            <Button onClick={addAllergy} disabled={!newAllergy.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Liste des allergies */}
          <div className="flex flex-wrap gap-2">
            {medicalInfo.allergies.map((allergy, index) => (
              <Badge key={index} variant="destructive" className="flex items-center gap-1">
                {allergy}
                <button
                  onClick={() => removeAllergy(index)}
                  className="ml-1 hover:bg-red-700 rounded-full p-0.5"
                  title={`Supprimer l'allergie ${allergy}`}
                  aria-label={`Supprimer l'allergie ${allergy}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>

          {medicalInfo.allergies.length === 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Aucune allergie définie. Ajoutez "Aucune" si vous n'avez pas d'allergies connues.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Médicaments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            Médicaments actuels
          </CardTitle>
          <CardDescription>
            Tous les médicaments que vous prenez régulièrement, incluant les suppléments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Ajout de médicament */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs">Nom du médicament</Label>
                  <Select
                    value={newMedication.nom}
                    onValueChange={(value) => setNewMedication({...newMedication, nom: value})}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {commonMedications.map(med => (
                        <SelectItem key={med} value={med}>
                          {med}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Ou saisir le nom..."
                    value={newMedication.nom}
                    onChange={(e) => setNewMedication({...newMedication, nom: e.target.value})}
                    className="h-8 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Dosage</Label>
                  <Input
                    placeholder="ex: 10mg"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Fréquence</Label>
                  <Input
                    placeholder="ex: 2x/jour"
                    value={newMedication.frequence}
                    onChange={(e) => setNewMedication({...newMedication, frequence: e.target.value})}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Prescripteur</Label>
                  <Input
                    placeholder="Dr. Nom"
                    value={newMedication.prescripteur}
                    onChange={(e) => setNewMedication({...newMedication, prescripteur: e.target.value})}
                    className="h-8"
                  />
                </div>
              </div>
              <Button 
                onClick={addMedication} 
                disabled={!newMedication.nom.trim()}
                className="mt-3 h-8"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </CardContent>
          </Card>

          {/* Liste des médicaments */}
          <div className="space-y-2">
            {medicalInfo.medicaments.map((medication, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-3">
                  {editingMedication === index ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <Input
                        value={medication.nom}
                        onChange={(e) => updateMedication(index, 'nom', e.target.value)}
                        className="h-8"
                      />
                      <Input
                        value={medication.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        className="h-8"
                      />
                      <Input
                        value={medication.frequence}
                        onChange={(e) => updateMedication(index, 'frequence', e.target.value)}
                        className="h-8"
                      />
                      <div className="flex gap-1">
                        <Input
                          value={medication.prescripteur}
                          onChange={(e) => updateMedication(index, 'prescripteur', e.target.value)}
                          className="h-8 flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={() => setEditingMedication(null)}
                          className="h-8"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{medication.nom}</div>
                        <div className="text-sm text-gray-600">
                          {medication.dosage} • {medication.frequence}
                          {medication.prescripteur && ` • Prescrit par ${medication.prescripteur}`}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingMedication(index)}
                          className="h-8"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeMedication(index)}
                          className="h-8 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conditions médicales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-green-600" />
            Conditions médicales
          </CardTitle>
          <CardDescription>
            Maladies chroniques, conditions médicales importantes à connaître.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Ajout de condition */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Select
                value={newCondition}
                onValueChange={setNewCondition}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une condition courante..." />
                </SelectTrigger>
                <SelectContent>
                  {commonConditions.map(condition => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Ou saisir une condition..."
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCondition()}
              className="flex-1"
            />
            <Button onClick={addCondition} disabled={!newCondition.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Liste des conditions */}
          <div className="flex flex-wrap gap-2">
            {medicalInfo.conditionsMedicales.map((condition, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {condition}
                <button
                  onClick={() => removeCondition(index)}
                  className="ml-1 hover:bg-gray-400 rounded-full p-0.5"
                  title={`Supprimer la condition ${condition}`}
                  aria-label={`Supprimer la condition ${condition}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Médecin de famille */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            Médecin de famille
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="medecinNom">Nom du médecin</Label>
              <Input
                id="medecinNom"
                placeholder="Dr. Prénom Nom"
                value={medicalInfo.medecinFamille?.nom || ''}
                onChange={(e) => updateMedicalInfo('medecinFamille.nom', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="medecinTelephone">Téléphone</Label>
              <Input
                id="medecinTelephone"
                type="tel"
                placeholder="514-123-4567"
                value={medicalInfo.medecinFamille?.telephone || ''}
                onChange={(e) => updateMedicalInfo('medecinFamille.telephone', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="medecinAdresse">Adresse de la clinique</Label>
            <Textarea
              id="medecinAdresse"
              placeholder="Adresse complète de la clinique..."
              value={medicalInfo.medecinFamille?.adresse || ''}
              onChange={(e) => updateMedicalInfo('medecinFamille.adresse', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Hôpital préféré */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-red-600" />
            Hôpital préféré
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hopitalNom">Nom de l'hôpital</Label>
              <Input
                id="hopitalNom"
                placeholder="Hôpital général de..."
                value={medicalInfo.hopitalPrefere?.nom || ''}
                onChange={(e) => updateMedicalInfo('hopitalPrefere.nom', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hopitalTelephone">Téléphone</Label>
              <Input
                id="hopitalTelephone"
                type="tel"
                placeholder="514-123-4567"
                value={medicalInfo.hopitalPrefere?.telephone || ''}
                onChange={(e) => updateMedicalInfo('hopitalPrefere.telephone', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="hopitalAdresse">Adresse</Label>
            <Textarea
              id="hopitalAdresse"
              placeholder="Adresse complète de l'hôpital..."
              value={medicalInfo.hopitalPrefere?.adresse || ''}
              onChange={(e) => updateMedicalInfo('hopitalPrefere.adresse', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Directives avancées */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Directives avancées
          </CardTitle>
          <CardDescription>
            Documents légaux concernant vos soins de santé et vos volontés de fin de vie.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="testament"
                checked={medicalInfo.directivesAvancees?.testament || false}
                onCheckedChange={(checked) => updateMedicalInfo('directivesAvancees.testament', checked)}
              />
              <Label htmlFor="testament">J'ai un testament de vie</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="mandatIncapacite"
                checked={medicalInfo.directivesAvancees?.mandatIncapacite || false}
                onCheckedChange={(checked) => updateMedicalInfo('directivesAvancees.mandatIncapacite', checked)}
              />
              <Label htmlFor="mandatIncapacite">J'ai un mandat en cas d'inaptitude</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="donOrganes"
                checked={medicalInfo.directivesAvancees?.donOrganes || false}
                onCheckedChange={(checked) => updateMedicalInfo('directivesAvancees.donOrganes', checked)}
              />
              <Label htmlFor="donOrganes">Je consens au don d'organes</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="volontesFinVie">Volontés de fin de vie</Label>
            <Textarea
              id="volontesFinVie"
              placeholder="Décrivez vos volontés concernant les soins de fin de vie, l'acharnement thérapeutique, etc."
              value={medicalInfo.directivesAvancees?.volontesFinVie || ''}
              onChange={(e) => updateMedicalInfo('directivesAvancees.volontesFinVie', e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
