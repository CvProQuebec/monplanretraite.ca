// src/features/retirement/components/PropertiesForm.tsx
// Formulaire pour les propriétés immobilières et biens

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
  Home, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin,
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { PropertyInfo } from '../types/emergency-planning';
import { EmergencyPlanningService } from '../services/EmergencyPlanningService';

interface PropertiesFormProps {
  properties: PropertyInfo[];
  onChange: (properties: PropertyInfo[]) => void;
  className?: string;
}

const propertyTypeOptions = [
  { value: 'residence_principale', label: 'Résidence principale', icon: '🏠' },
  { value: 'residence_secondaire', label: 'Résidence secondaire', icon: '🏡' },
  { value: 'chalet', label: 'Chalet', icon: '🏔️' },
  { value: 'investissement', label: 'Investissement locatif', icon: '🏢' },
  { value: 'terrain', label: 'Terrain', icon: '🌳' },
  { value: 'autre', label: 'Autre', icon: '📍' }
];

export const PropertiesForm: React.FC<PropertiesFormProps> = ({
  properties,
  onChange,
  className
}) => {
  const [editingProperty, setEditingProperty] = useState<PropertyInfo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<PropertyInfo>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createEmptyProperty = (): Partial<PropertyInfo> => ({
    type: 'residence_principale',
    adresse: '',
    numeroLotCadastral: '',
    titreProprietaire: '',
    emplacementTitre: '',
    valeurEstimee: 0,
    notes: '',
    hypotheque: undefined
  });

  const validateProperty = (property: Partial<PropertyInfo>): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!property.adresse?.trim()) newErrors.adresse = 'L\'adresse est requise';
    if (!property.titreProprietaire?.trim()) newErrors.titreProprietaire = 'Le titre de propriétaire est requis';
    if (!property.emplacementTitre?.trim()) newErrors.emplacementTitre = 'L\'emplacement du titre est requis';
    
    // Validation de l'hypothèque si présente
    if (property.hypotheque) {
      if (!property.hypotheque.institution?.trim()) {
        newErrors.hypothequeInstitution = 'L\'institution financière est requise';
      }
      if (!property.hypotheque.soldeApprox || property.hypotheque.soldeApprox <= 0) {
        newErrors.hypothequeSolde = 'Le solde approximatif doit être supérieur à 0';
      }
    }

    return newErrors;
  };

  const handleStartAdd = () => {
    setFormData(createEmptyProperty());
    setIsAdding(true);
    setEditingProperty(null);
    setErrors({});
  };

  const handleStartEdit = (property: PropertyInfo) => {
    setFormData({ ...property });
    setEditingProperty(property);
    setIsAdding(false);
    setErrors({});
  };

  const handleSave = () => {
    const validationErrors = validateProperty(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const propertyToSave: PropertyInfo = {
      id: editingProperty?.id || EmergencyPlanningService.generateId(),
      type: formData.type as PropertyInfo['type'],
      adresse: formData.adresse!,
      numeroLotCadastral: formData.numeroLotCadastral || undefined,
      titreProprietaire: formData.titreProprietaire!,
      emplacementTitre: formData.emplacementTitre!,
      valeurEstimee: formData.valeurEstimee || undefined,
      notes: formData.notes || undefined,
      hypotheque: formData.hypotheque || undefined
    };

    let updatedProperties;
    if (editingProperty) {
      updatedProperties = properties.map(p => p.id === editingProperty.id ? propertyToSave : p);
    } else {
      updatedProperties = [...properties, propertyToSave];
    }

    onChange(updatedProperties);
    handleCancel();
  };

  const handleCancel = () => {
    setFormData({});
    setEditingProperty(null);
    setIsAdding(false);
    setErrors({});
  };

  const handleDelete = (propertyId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      onChange(properties.filter(p => p.id !== propertyId));
    }
  };

  const updateFormData = (field: string, value: any) => {
    if (field.startsWith('hypotheque.')) {
      const hypothequeField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        hypotheque: {
          ...prev.hypotheque,
          [hypothequeField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const toggleHypotheque = (hasHypotheque: boolean) => {
    if (hasHypotheque) {
      setFormData(prev => ({
        ...prev,
        hypotheque: {
          institution: '',
          soldeApprox: 0,
          paiementMensuel: 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        hypotheque: undefined
      }));
    }
  };

  const getPropertyTypeInfo = (type: string) => {
    return propertyTypeOptions.find(option => option.value === type) || propertyTypeOptions[0];
  };

  const getTotalValue = () => {
    return properties.reduce((total, property) => total + (property.valeurEstimee || 0), 0);
  };

  const getTotalMortgageDebt = () => {
    return properties.reduce((total, property) => 
      total + (property.hypotheque?.soldeApprox || 0), 0
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-600" />
            Propriétés immobilières et biens
          </CardTitle>
          <CardDescription>
            Répertoriez toutes vos propriétés immobilières, terrains et biens immobiliers. 
            Ces informations sont essentielles pour la succession et les démarches administratives.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              {properties.length} propriété{properties.length !== 1 ? 's' : ''} répertoriée{properties.length !== 1 ? 's' : ''}
              {properties.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600">
                      Valeur totale estimée: {getTotalValue().toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                    </Badge>
                  </div>
                  {getTotalMortgageDebt() > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-orange-600">
                        Dettes hypothécaires: {getTotalMortgageDebt().toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button onClick={handleStartAdd} disabled={isAdding || editingProperty !== null}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une propriété
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerte informative */}
      {properties.length === 0 && !isAdding && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Il est important de répertorier toutes vos propriétés immobilières pour faciliter 
            les démarches de vos proches et assurer une gestion adéquate de votre succession.
          </AlertDescription>
        </Alert>
      )}

      {/* Formulaire d'ajout/édition */}
      <AnimatePresence>
        {(isAdding || editingProperty) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingProperty ? 'Modifier la propriété' : 'Nouvelle propriété'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type et adresse */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type de propriété *</Label>
                    <Select
                      value={formData.type || 'residence_principale'}
                      onValueChange={(value) => updateFormData('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypeOptions.map(option => (
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
                    <Label htmlFor="valeurEstimee">Valeur estimée</Label>
                    <Input
                      id="valeurEstimee"
                      type="number"
                      placeholder="0"
                      value={formData.valeurEstimee || ''}
                      onChange={(e) => updateFormData('valeurEstimee', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="adresse">Adresse complète *</Label>
                  <Input
                    id="adresse"
                    placeholder="123 Rue Principale, Ville, Province, Code postal"
                    value={formData.adresse || ''}
                    onChange={(e) => updateFormData('adresse', e.target.value)}
                    className={errors.adresse ? 'border-red-500' : ''}
                  />
                  {errors.adresse && <p className="text-sm text-red-500 mt-1">{errors.adresse}</p>}
                </div>

                <div>
                  <Label htmlFor="numeroLotCadastral">Numéro de lot cadastral</Label>
                  <Input
                    id="numeroLotCadastral"
                    placeholder="ex: 1234567"
                    value={formData.numeroLotCadastral || ''}
                    onChange={(e) => updateFormData('numeroLotCadastral', e.target.value)}
                  />
                </div>

                {/* Documents de propriété */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titreProprietaire">Titre de propriétaire *</Label>
                    <Input
                      id="titreProprietaire"
                      placeholder="Nom(s) sur le titre"
                      value={formData.titreProprietaire || ''}
                      onChange={(e) => updateFormData('titreProprietaire', e.target.value)}
                      className={errors.titreProprietaire ? 'border-red-500' : ''}
                    />
                    {errors.titreProprietaire && <p className="text-sm text-red-500 mt-1">{errors.titreProprietaire}</p>}
                  </div>

                  <div>
                    <Label htmlFor="emplacementTitre">Emplacement du titre *</Label>
                    <Input
                      id="emplacementTitre"
                      placeholder="ex: Coffre-fort, Notaire, etc."
                      value={formData.emplacementTitre || ''}
                      onChange={(e) => updateFormData('emplacementTitre', e.target.value)}
                      className={errors.emplacementTitre ? 'border-red-500' : ''}
                    />
                    {errors.emplacementTitre && <p className="text-sm text-red-500 mt-1">{errors.emplacementTitre}</p>}
                  </div>
                </div>

                {/* Hypothèque */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasHypotheque"
                      checked={!!formData.hypotheque}
                      onCheckedChange={toggleHypotheque}
                    />
                    <Label htmlFor="hasHypotheque">Cette propriété a une hypothèque</Label>
                  </div>

                  {formData.hypotheque && (
                    <div className="pl-6 space-y-4 border-l-2 border-orange-200 bg-orange-50 p-4 rounded">
                      <h4 className="font-semibold text-orange-800">Informations hypothécaires</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="hypothequeInstitution">Institution financière *</Label>
                          <Input
                            id="hypothequeInstitution"
                            placeholder="ex: Institution financière"
                            value={formData.hypotheque.institution || ''}
                            onChange={(e) => updateFormData('hypotheque.institution', e.target.value)}
                            className={errors.hypothequeInstitution ? 'border-red-500' : ''}
                          />
                          {errors.hypothequeInstitution && <p className="text-sm text-red-500 mt-1">{errors.hypothequeInstitution}</p>}
                        </div>

                        <div>
                          <Label htmlFor="hypothequeSolde">Solde approximatif *</Label>
                          <Input
                            id="hypothequeSolde"
                            type="number"
                            placeholder="0"
                            value={formData.hypotheque.soldeApprox || ''}
                            onChange={(e) => updateFormData('hypotheque.soldeApprox', parseFloat(e.target.value) || 0)}
                            className={errors.hypothequeSolde ? 'border-red-500' : ''}
                          />
                          {errors.hypothequeSolde && <p className="text-sm text-red-500 mt-1">{errors.hypothequeSolde}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="hypothequePaiement">Paiement mensuel</Label>
                          <Input
                            id="hypothequePaiement"
                            type="number"
                            placeholder="0"
                            value={formData.hypotheque.paiementMensuel || ''}
                            onChange={(e) => updateFormData('hypotheque.paiementMensuel', parseFloat(e.target.value) || 0)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="hypothequeEcheance">Date d'échéance</Label>
                          <Input
                            id="hypothequeEcheance"
                            type="date"
                            value={formData.hypotheque.echeance ? new Date(formData.hypotheque.echeance).toISOString().split('T')[0] : ''}
                            onChange={(e) => updateFormData('hypotheque.echeance', e.target.value ? new Date(e.target.value) : undefined)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Informations supplémentaires, instructions spéciales..."
                    value={formData.notes || ''}
                    onChange={(e) => updateFormData('notes', e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {editingProperty ? 'Modifier' : 'Ajouter'}
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

      {/* Liste des propriétés */}
      <div className="space-y-3">
        <AnimatePresence>
          {properties.map((property) => {
            const typeInfo = getPropertyTypeInfo(property.type);
            return (
              <motion.div
                key={property.id}
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
                            <h3 className="font-semibold text-lg">{typeInfo.label}</h3>
                            <Badge variant="outline">{property.type}</Badge>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{property.adresse}</span>
                          </div>
                          
                          {property.numeroLotCadastral && (
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span>Lot cadastral: {property.numeroLotCadastral}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            <span>Propriétaire: {property.titreProprietaire}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>Titre conservé: {property.emplacementTitre}</span>
                          </div>
                          
                          {property.valeurEstimee && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              <span>Valeur estimée: {property.valeurEstimee.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</span>
                            </div>
                          )}
                          
                          {property.hypotheque && (
                            <div className="mt-2 p-2 bg-orange-50 rounded border-l-4 border-orange-200">
                              <div className="text-orange-800 font-medium">Hypothèque</div>
                              <div className="text-orange-700">
                                {property.hypotheque.institution} - Solde: {property.hypotheque.soldeApprox.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                                {property.hypotheque.paiementMensuel && (
                                  <span> - Paiement: {property.hypotheque.paiementMensuel.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}/mois</span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {property.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                              {property.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartEdit(property)}
                          disabled={isAdding || editingProperty !== null}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(property.id)}
                          disabled={isAdding || editingProperty !== null}
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
      </div>

      {/* Message si aucune propriété */}
      {properties.length === 0 && !isAdding && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-12">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucune propriété répertoriée
            </h3>
            <p className="text-gray-500 mb-4">
              Ajoutez vos propriétés immobilières pour faciliter les démarches de vos proches.
            </p>
            <Button onClick={handleStartAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter votre première propriété
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
