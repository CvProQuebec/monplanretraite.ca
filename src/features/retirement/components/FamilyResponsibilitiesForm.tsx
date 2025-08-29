// src/features/retirement/components/FamilyResponsibilitiesForm.tsx
// Formulaire pour les responsabilités familiales

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Phone,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Heart,
  Baby,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { FamilyResponsibility, Pet } from '../types/emergency-planning';
import { EmergencyPlanningService } from '../services/EmergencyPlanningService';

interface FamilyResponsibilitiesFormProps {
  responsibilities: FamilyResponsibility[];
  pets: Pet[];
  onChange: (responsibilities: FamilyResponsibility[], pets: Pet[]) => void;
  className?: string;
}

const responsibilityTypeOptions = [
  { value: 'enfant_mineur', label: 'Enfant mineur', icon: '👶', color: 'bg-blue-100 text-blue-800', priority: 'high' },
  { value: 'parent_dependant', label: 'Parent dépendant', icon: '👴', color: 'bg-purple-100 text-purple-800', priority: 'high' },
  { value: 'conjoint', label: 'Conjoint', icon: '💑', color: 'bg-pink-100 text-pink-800', priority: 'high' },
  { value: 'animal', label: 'Animal de compagnie', icon: '🐕', color: 'bg-green-100 text-green-800', priority: 'medium' },
  { value: 'autre', label: 'Autre responsabilité', icon: '👥', color: 'bg-gray-100 text-gray-800', priority: 'low' }
];

const petTypeOptions = [
  { value: 'chien', label: 'Chien', icon: '🐕' },
  { value: 'chat', label: 'Chat', icon: '🐱' },
  { value: 'oiseau', label: 'Oiseau', icon: '🐦' },
  { value: 'poisson', label: 'Poisson', icon: '🐠' },
  { value: 'autre', label: 'Autre', icon: '🐾' }
];

export const FamilyResponsibilitiesForm: React.FC<FamilyResponsibilitiesFormProps> = ({
  responsibilities,
  pets,
  onChange,
  className
}) => {
  const [activeTab, setActiveTab] = useState<'responsibilities' | 'pets'>('responsibilities');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createEmptyResponsibility = (): Partial<FamilyResponsibility> => ({
    type: 'enfant_mineur',
    nom: '',
    age: undefined,
    besoinsSpeciaux: '',
    coutsMensuels: 0,
    gardienDesigne: undefined,
    notes: ''
  });

  const createEmptyPet = (): Partial<Pet> => ({
    nom: '',
    type: 'chien',
    race: '',
    age: undefined,
    coutsMensuels: 0,
    veterinaire: undefined,
    personneDesignee: undefined,
    instructionsSpeciales: '',
    notes: ''
  });

  const validateResponsibility = (responsibility: Partial<FamilyResponsibility>): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!responsibility.nom?.trim()) newErrors.nom = 'Le nom est requis';
    if (responsibility.type === 'enfant_mineur' && (!responsibility.age || responsibility.age >= 18)) {
      newErrors.age = 'L\'âge doit être inférieur à 18 ans pour un enfant mineur';
    }

    return newErrors;
  };

  const validatePet = (pet: Partial<Pet>): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!pet.nom?.trim()) newErrors.nom = 'Le nom de l\'animal est requis';

    return newErrors;
  };

  const handleStartAdd = (type: 'responsibility' | 'pet') => {
    if (type === 'responsibility') {
      setFormData(createEmptyResponsibility());
    } else {
      setFormData(createEmptyPet());
    }
    setIsAdding(true);
    setEditingItem(null);
    setErrors({});
  };

  const handleStartEdit = (item: any, type: 'responsibility' | 'pet') => {
    setFormData({ ...item });
    setEditingItem({ ...item, type });
    setIsAdding(false);
    setErrors({});
  };

  const handleSave = () => {
    const isResponsibility = activeTab === 'responsibilities';
    const validationErrors = isResponsibility 
      ? validateResponsibility(formData) 
      : validatePet(formData);
    
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (isResponsibility) {
      const responsibilityToSave: FamilyResponsibility = {
        id: editingItem?.id || EmergencyPlanningService.generateId(),
        type: formData.type as FamilyResponsibility['type'],
        nom: formData.nom!,
        age: formData.age || undefined,
        besoinsSpeciaux: formData.besoinsSpeciaux || undefined,
        gardienDesigne: formData.gardienDesigne || undefined,
        coutsMensuels: formData.coutsMensuels || undefined,
        notes: formData.notes || undefined
      };

      let updatedResponsibilities;
      if (editingItem && editingItem.type === 'responsibility') {
        updatedResponsibilities = responsibilities.map(r => r.id === editingItem.id ? responsibilityToSave : r);
      } else {
        updatedResponsibilities = [...responsibilities, responsibilityToSave];
      }

      onChange(updatedResponsibilities, pets);
    } else {
      const petToSave: Pet = {
        id: editingItem?.id || EmergencyPlanningService.generateId(),
        nom: formData.nom!,
        type: formData.type as Pet['type'],
        race: formData.race || undefined,
        age: formData.age || undefined,
        veterinaire: formData.veterinaire || undefined,
        personneDesignee: formData.personneDesignee || undefined,
        instructionsSpeciales: formData.instructionsSpeciales || undefined,
        coutsMensuels: formData.coutsMensuels || undefined,
        notes: formData.notes || undefined
      };

      let updatedPets;
      if (editingItem && editingItem.type === 'pet') {
        updatedPets = pets.map(p => p.id === editingItem.id ? petToSave : p);
      } else {
        updatedPets = [...pets, petToSave];
      }

      onChange(responsibilities, updatedPets);
    }

    handleCancel();
  };

  const handleCancel = () => {
    setFormData({});
    setEditingItem(null);
    setIsAdding(false);
    setErrors({});
  };

  const handleDelete = (itemId: string, type: 'responsibility' | 'pet') => {
    const confirmMessage = type === 'responsibility' 
      ? 'Êtes-vous sûr de vouloir supprimer cette responsabilité ?' 
      : 'Êtes-vous sûr de vouloir supprimer cet animal ?';
    
    if (window.confirm(confirmMessage)) {
      if (type === 'responsibility') {
        onChange(responsibilities.filter(r => r.id !== itemId), pets);
      } else {
        onChange(responsibilities, pets.filter(p => p.id !== itemId));
      }
    }
  };

  const updateFormData = (field: string, value: any) => {
    if (field.startsWith('gardienDesigne.') || field.startsWith('veterinaire.') || field.startsWith('personneDesignee.')) {
      const [parentField, childField] = field.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parentField]: {
          ...prev[parentField],
          [childField]: value
        }
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
    }
  };

  const getResponsibilityTypeInfo = (type: string) => {
    return responsibilityTypeOptions.find(option => option.value === type) || responsibilityTypeOptions[0];
  };

  const getPetTypeInfo = (type: string) => {
    return petTypeOptions.find(option => option.value === type) || petTypeOptions[0];
  };

  const getTotalMonthlyCosts = () => {
    const responsibilityCosts = responsibilities.reduce((total, r) => total + (r.coutsMensuels || 0), 0);
    const petCosts = pets.reduce((total, p) => total + (p.coutsMensuels || 0), 0);
    return responsibilityCosts + petCosts;
  };

  const getCriticalResponsibilities = () => {
    return responsibilities.filter(r => ['enfant_mineur', 'parent_dependant', 'conjoint'].includes(r.type));
  };

  const criticalResponsibilities = getCriticalResponsibilities();
  const totalMonthlyCosts = getTotalMonthlyCosts();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Responsabilités familiales
          </CardTitle>
          <CardDescription>
            Répertoriez toutes vos responsabilités : enfants mineurs, parents dépendants, animaux de compagnie. 
            Désignez qui s'en occupera et prévoyez les coûts associés.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              {responsibilities.length} responsabilité{responsibilities.length !== 1 ? 's' : ''} • {pets.length} animal{pets.length !== 1 ? 'aux' : ''}
              {(responsibilities.length > 0 || pets.length > 0) && (
                <div className="mt-2 space-y-1">
                  {criticalResponsibilities.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-red-600">
                        {criticalResponsibilities.length} responsabilité{criticalResponsibilities.length !== 1 ? 's' : ''} critique{criticalResponsibilities.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  )}
                  {totalMonthlyCosts > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-blue-600">
                        Coûts mensuels: {totalMonthlyCosts.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation par onglets */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4">
            <button
              onClick={() => setActiveTab('responsibilities')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'responsibilities'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Responsabilités ({responsibilities.length})
            </button>
            <button
              onClick={() => setActiveTab('pets')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'pets'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Heart className="w-4 h-4 inline mr-2" />
              Animaux ({pets.length})
            </button>
          </div>

          <Button 
            onClick={() => handleStartAdd(activeTab === 'responsibilities' ? 'responsibility' : 'pet')} 
            disabled={isAdding || editingItem !== null}
          >
            <Plus className="w-4 h-4 mr-2" />
            {activeTab === 'responsibilities' ? 'Ajouter une responsabilité' : 'Ajouter un animal'}
          </Button>
        </CardContent>
      </Card>

      {/* Alerte pour responsabilités critiques */}
      {criticalResponsibilities.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Responsabilités critiques :</strong> Vous avez {criticalResponsibilities.length} responsabilité{criticalResponsibilities.length !== 1 ? 's' : ''} 
            critique{criticalResponsibilities.length !== 1 ? 's' : ''} qui nécessite{criticalResponsibilities.length === 1 ? '' : 'nt'} une attention particulière. 
            Assurez-vous d'avoir désigné des gardiens appropriés.
          </AlertDescription>
        </Alert>
      )}

      {/* Formulaire d'ajout/édition */}
      <AnimatePresence>
        {(isAdding || editingItem) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingItem 
                    ? `Modifier ${activeTab === 'responsibilities' ? 'la responsabilité' : 'l\'animal'}` 
                    : `Nouvelle ${activeTab === 'responsibilities' ? 'responsabilité' : 'animal'}`
                  }
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeTab === 'responsibilities' ? (
                  // Formulaire pour responsabilités
                  <>
                    {/* Type et nom */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Type de responsabilité *</Label>
                        <Select
                          value={formData.type || 'enfant_mineur'}
                          onValueChange={(value) => updateFormData('type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {responsibilityTypeOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <span>{option.icon}</span>
                                  {option.label}
                                  {option.priority === 'high' && (
                                    <Badge variant="outline" className="text-xs text-red-600">
                                      Critique
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="nom">Nom *</Label>
                        <Input
                          id="nom"
                          placeholder="Nom de la personne"
                          value={formData.nom || ''}
                          onChange={(e) => updateFormData('nom', e.target.value)}
                          className={errors.nom ? 'border-red-500' : ''}
                        />
                        {errors.nom && <p className="text-sm text-red-500 mt-1">{errors.nom}</p>}
                      </div>
                    </div>

                    {/* Âge et coûts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age">Âge</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="0"
                          value={formData.age || ''}
                          onChange={(e) => updateFormData('age', parseInt(e.target.value) || undefined)}
                          className={errors.age ? 'border-red-500' : ''}
                        />
                        {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age}</p>}
                      </div>

                      <div>
                        <Label htmlFor="coutsMensuels">Coûts mensuels</Label>
                        <Input
                          id="coutsMensuels"
                          type="number"
                          placeholder="0"
                          value={formData.coutsMensuels || ''}
                          onChange={(e) => updateFormData('coutsMensuels', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    {/* Gardien désigné */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Gardien désigné</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="gardienNom">Nom</Label>
                          <Input
                            id="gardienNom"
                            placeholder="Nom du gardien"
                            value={formData.gardienDesigne?.nom || ''}
                            onChange={(e) => updateFormData('gardienDesigne.nom', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="gardienTelephone">Téléphone</Label>
                          <Input
                            id="gardienTelephone"
                            placeholder="514-123-4567"
                            value={formData.gardienDesigne?.telephone || ''}
                            onChange={(e) => updateFormData('gardienDesigne.telephone', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="gardienRelation">Relation</Label>
                          <Input
                            id="gardienRelation"
                            placeholder="ex: Tante, Ami"
                            value={formData.gardienDesigne?.relation || ''}
                            onChange={(e) => updateFormData('gardienDesigne.relation', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Besoins spéciaux */}
                    <div>
                      <Label htmlFor="besoinsSpeciaux">Besoins spéciaux</Label>
                      <Textarea
                        id="besoinsSpeciaux"
                        placeholder="Allergies, médicaments, besoins particuliers..."
                        value={formData.besoinsSpeciaux || ''}
                        onChange={(e) => updateFormData('besoinsSpeciaux', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </>
                ) : (
                  // Formulaire pour animaux
                  <>
                    {/* Type et nom */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Type d'animal *</Label>
                        <Select
                          value={formData.type || 'chien'}
                          onValueChange={(value) => updateFormData('type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {petTypeOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <span>{option.icon}</span>
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="nom">Nom de l'animal *</Label>
                        <Input
                          id="nom"
                          placeholder="Nom de l'animal"
                          value={formData.nom || ''}
                          onChange={(e) => updateFormData('nom', e.target.value)}
                          className={errors.nom ? 'border-red-500' : ''}
                        />
                        {errors.nom && <p className="text-sm text-red-500 mt-1">{errors.nom}</p>}
                      </div>
                    </div>

                    {/* Race, âge et coûts */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="race">Race</Label>
                        <Input
                          id="race"
                          placeholder="Race de l'animal"
                          value={formData.race || ''}
                          onChange={(e) => updateFormData('race', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="age">Âge</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="0"
                          value={formData.age || ''}
                          onChange={(e) => updateFormData('age', parseInt(e.target.value) || undefined)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="coutsMensuels">Coûts mensuels</Label>
                        <Input
                          id="coutsMensuels"
                          type="number"
                          placeholder="0"
                          value={formData.coutsMensuels || ''}
                          onChange={(e) => updateFormData('coutsMensuels', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    {/* Vétérinaire */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Vétérinaire</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="vetNom">Nom</Label>
                          <Input
                            id="vetNom"
                            placeholder="Nom du vétérinaire"
                            value={formData.veterinaire?.nom || ''}
                            onChange={(e) => updateFormData('veterinaire.nom', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="vetTelephone">Téléphone</Label>
                          <Input
                            id="vetTelephone"
                            placeholder="514-123-4567"
                            value={formData.veterinaire?.telephone || ''}
                            onChange={(e) => updateFormData('veterinaire.telephone', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="vetAdresse">Adresse</Label>
                          <Input
                            id="vetAdresse"
                            placeholder="Adresse de la clinique"
                            value={formData.veterinaire?.adresse || ''}
                            onChange={(e) => updateFormData('veterinaire.adresse', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Personne désignée */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Personne désignée pour s'occuper de l'animal</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="personneNom">Nom</Label>
                          <Input
                            id="personneNom"
                            placeholder="Nom de la personne"
                            value={formData.personneDesignee?.nom || ''}
                            onChange={(e) => updateFormData('personneDesignee.nom', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="personneTelephone">Téléphone</Label>
                          <Input
                            id="personneTelephone"
                            placeholder="514-123-4567"
                            value={formData.personneDesignee?.telephone || ''}
                            onChange={(e) => updateFormData('personneDesignee.telephone', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="personneRelation">Relation</Label>
                          <Input
                            id="personneRelation"
                            placeholder="ex: Ami, Famille"
                            value={formData.personneDesignee?.relation || ''}
                            onChange={(e) => updateFormData('personneDesignee.relation', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Instructions spéciales */}
                    <div>
                      <Label htmlFor="instructionsSpeciales">Instructions spéciales</Label>
                      <Textarea
                        id="instructionsSpeciales"
                        placeholder="Habitudes, médicaments, soins particuliers..."
                        value={formData.instructionsSpeciales || ''}
                        onChange={(e) => updateFormData('instructionsSpeciales', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {/* Notes communes */}
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Informations supplémentaires..."
                    value={formData.notes || ''}
                    onChange={(e) => updateFormData('notes', e.target.value)}
                    rows={2}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {editingItem ? 'Modifier' : 'Ajouter'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste des éléments */}
      <div className="space-y-3">
        <AnimatePresence>
          {(activeTab === 'responsibilities' ? responsibilities : pets).map((item: any) => {
            const isResponsibility = activeTab === 'responsibilities';
            const typeInfo = isResponsibility 
              ? getResponsibilityTypeInfo(item.type) 
              : getPetTypeInfo(item.type);
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{typeInfo.icon}</span>
                          <div>
                            <h3 className="font-semibold text-lg">{item.nom}</h3>
                            <div className="flex items-center gap-2">
                              <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                              {isResponsibility && typeInfo.priority === 'high' && (
                                <Badge variant="outline" className="text-red-600 border-red-600">
                                  Critique
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          {item.age && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>Âge: {item.age} ans</span>
                            </div>
                          )}
                          
                          {!isResponsibility && item.race && (
                            <div className="flex items-center gap-2">
                              <span>Race: {item.race}</span>
                            </div>
                          )}
                          
                          {item.coutsMensuels && item.coutsMensuels > 0 && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              <span>Coûts mensuels: {item.coutsMensuels.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</span>
                            </div>
                          )}
                          
                          {/* Gardien ou personne désignée */}
                          {(isResponsibility ? item.gardienDesigne : item.personneDesignee) && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>
                                {isResponsibility ? 'Gardien' : 'Personne désignée'}: {' '}
                                {(isResponsibility ? item.gardienDesigne : item.personneDesignee).nom}
                                {(isResponsibility ? item.gardienDesigne : item.personneDesignee).telephone && 
                                  ` - ${(isResponsibility ? item.gardienDesigne : item.personneDesignee).telephone}`
                                }
                              </span>
                            </div>
                          )}

                          {/* Vétérinaire pour animaux */}
                          {!isResponsibility && item.veterinaire && (
                            <div className="flex items-center gap-2">
                              <span>Vétérinaire: {item.veterinaire.nom}</span>
                              {item.veterinaire.telephone && <span> - {item.veterinaire.telephone}</span>}
                            </div>
                          )}

                          {/* Besoins spéciaux ou instructions */}
                          {(isResponsibility ? item.besoinsSpeciaux : item.instructionsSpeciales) && (
                            <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                              <strong>{isResponsibility ? 'Besoins spéciaux:' : 'Instructions spéciales:'}</strong>
                              <p className="mt-1">{isResponsibility ? item.besoinsSpeciaux : item.instructionsSpeciales}</p>
                            </div>
                          )}

                          {item.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                              <strong>Notes:</strong>
                              <p className="mt-1">{item.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartEdit(item, isResponsibility ? 'responsibility' : 'pet')}
                          disabled={isAdding || editingItem !== null}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id, isResponsibility ? 'responsibility' : 'pet')}
                          disabled={isAdding || editingItem !== null}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Message si aucun élément */}
        {(activeTab === 'responsibilities' ? responsibilities : pets).length === 0 && !isAdding && !editingItem && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                {activeTab === 'responsibilities' ? (
                  <Users className="w-12 h-12 mx-auto" />
                ) : (
                  <Heart className="w-12 h-12 mx-auto" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'responsibilities' 
                  ? 'Aucune responsabilité ajoutée' 
                  : 'Aucun animal ajouté'
                }
              </h3>
              <p className="text-gray-500 mb-4">
                {activeTab === 'responsibilities'
                  ? 'Commencez par ajouter vos responsabilités familiales : enfants mineurs, parents dépendants, etc.'
                  : 'Ajoutez vos animaux de compagnie pour prévoir leur prise en charge.'
                }
              </p>
              <Button 
                onClick={() => handleStartAdd(activeTab === 'responsibilities' ? 'responsibility' : 'pet')}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                {activeTab === 'responsibilities' ? 'Ajouter une responsabilité' : 'Ajouter un animal'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Résumé des coûts */}
      {totalMonthlyCosts > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Coûts mensuels totaux</span>
              </div>
              <div className="text-xl font-bold text-blue-600">
                {totalMonthlyCosts.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
              </div>
            </div>
            <p className="text-sm text-blue-600 mt-2">
              Coût annuel estimé: {(totalMonthlyCosts * 12).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
