// src/features/retirement/components/InsuranceForm.tsx
// Formulaire pour les assurances

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
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Phone,
  Mail,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Insurance } from '../types/emergency-planning';
import { EmergencyPlanningService } from '../services/EmergencyPlanningService';

interface InsuranceFormProps {
  insurances: Insurance[];
  onChange: (insurances: Insurance[]) => void;
  className?: string;
}

const insuranceTypeOptions = [
  { value: 'vie', label: 'Assurance vie', icon: '❤️', color: 'bg-red-100 text-red-800' },
  { value: 'invalidite', label: 'Assurance invalidité', icon: '🦽', color: 'bg-blue-100 text-blue-800' },
  { value: 'maladie_grave', label: 'Assurance maladie grave', icon: '🏥', color: 'bg-purple-100 text-purple-800' },
  { value: 'soins_longue_duree', label: 'Soins de longue durée', icon: '🏠', color: 'bg-green-100 text-green-800' },
  { value: 'autre', label: 'Autre', icon: '🛡️', color: 'bg-gray-100 text-gray-800' }
];

export const InsuranceForm: React.FC<InsuranceFormProps> = ({
  insurances,
  onChange,
  className
}) => {
  const [editingInsurance, setEditingInsurance] = useState<Insurance | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Insurance>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createEmptyInsurance = (): Partial<Insurance> => ({
    type: 'vie',
    compagnie: '',
    numeroPolice: '',
    montantCouverture: 0,
    beneficiaires: [],
    primeAnnuelle: 0,
    agent: undefined
  });

  const validateInsurance = (insurance: Partial<Insurance>): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!insurance.compagnie?.trim()) newErrors.compagnie = 'La compagnie d\'assurance est requise';
    if (!insurance.numeroPolice?.trim()) newErrors.numeroPolice = 'Le numéro de police est requis';
    if (!insurance.montantCouverture || insurance.montantCouverture <= 0) {
      newErrors.montantCouverture = 'Le montant de couverture doit être supérieur à 0';
    }
    
    // Validation des bénéficiaires
    if (insurance.beneficiaires && insurance.beneficiaires.length > 0) {
      const totalPourcentage = insurance.beneficiaires.reduce((sum, b) => sum + b.pourcentage, 0);
      if (totalPourcentage !== 100) {
        newErrors.beneficiaires = 'Le total des pourcentages des bénéficiaires doit égaler 100 %';
      }
      
      // Vérifier que chaque bénéficiaire a un nom
      const hasEmptyBeneficiary = insurance.beneficiaires.some(b => !b.nom.trim());
      if (hasEmptyBeneficiary) {
        newErrors.beneficiaires = 'Tous les bénéficiaires doivent avoir un nom';
      }
    }

    return newErrors;
  };

  const handleStartAdd = () => {
    setFormData(createEmptyInsurance());
    setIsAdding(true);
    setEditingInsurance(null);
    setErrors({});
  };

  const handleStartEdit = (insurance: Insurance) => {
    setFormData({ ...insurance });
    setEditingInsurance(insurance);
    setIsAdding(false);
    setErrors({});
  };

  const handleSave = () => {
    const validationErrors = validateInsurance(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const insuranceToSave: Insurance = {
      id: editingInsurance?.id || EmergencyPlanningService.generateId(),
      type: formData.type as Insurance['type'],
      compagnie: formData.compagnie!,
      numeroPolice: formData.numeroPolice!,
      montantCouverture: formData.montantCouverture!,
      beneficiaires: formData.beneficiaires || [],
      agent: formData.agent || undefined,
      dateExpiration: formData.dateExpiration || undefined,
      primeAnnuelle: formData.primeAnnuelle || undefined
    };

    let updatedInsurances;
    if (editingInsurance) {
      updatedInsurances = insurances.map(i => i.id === editingInsurance.id ? insuranceToSave : i);
    } else {
      updatedInsurances = [...insurances, insuranceToSave];
    }

    onChange(updatedInsurances);
    handleCancel();
  };

  const handleCancel = () => {
    setFormData({});
    setEditingInsurance(null);
    setIsAdding(false);
    setErrors({});
  };

  const handleDelete = (insuranceId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette assurance ?')) {
      onChange(insurances.filter(i => i.id !== insuranceId));
    }
  };

  const updateFormData = (field: string, value: any) => {
    if (field.startsWith('agent.')) {
      const agentField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        agent: {
          ...prev.agent,
          [agentField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addBeneficiary = () => {
    const newBeneficiary = {
      nom: '',
      relation: '',
      pourcentage: 0
    };
    
    setFormData(prev => ({
      ...prev,
      beneficiaires: [...(prev.beneficiaires || []), newBeneficiary]
    }));
  };

  const updateBeneficiary = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      beneficiaires: prev.beneficiaires?.map((b, i) => 
        i === index ? { ...b, [field]: value } : b
      ) || []
    }));
  };

  const removeBeneficiary = (index: number) => {
    setFormData(prev => ({
      ...prev,
      beneficiaires: prev.beneficiaires?.filter((_, i) => i !== index) || []
    }));
  };

  const getInsuranceTypeInfo = (type: string) => {
    return insuranceTypeOptions.find(option => option.value === type) || insuranceTypeOptions[0];
  };

  const getTotalCoverage = () => {
    return insurances.reduce((total, insurance) => total + insurance.montantCouverture, 0);
  };

  const getTotalPremiums = () => {
    return insurances.reduce((total, insurance) => total + (insurance.primeAnnuelle || 0), 0);
  };

  const getExpiringInsurances = () => {
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    
    return insurances.filter(insurance => 
      insurance.dateExpiration && new Date(insurance.dateExpiration) <= sixMonthsFromNow
    );
  };

  const expiringInsurances = getExpiringInsurances();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Assurances
          </CardTitle>
          <CardDescription>
            Répertoriez toutes vos polices d'assurance (vie, invalidité, habitation, automobile, etc.). 
            Ces informations sont essentielles pour vos bénéficiaires et la gestion de votre succession.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              {insurances.length} assurance{insurances.length !== 1 ? 's' : ''} répertoriée{insurances.length !== 1 ? 's' : ''}
              {insurances.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600">
                      Couverture totale: {getTotalCoverage().toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                    </Badge>
                  </div>
                  {getTotalPremiums() > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-blue-600">
                        Primes annuelles: {getTotalPremiums().toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button onClick={handleStartAdd} disabled={isAdding || editingInsurance !== null}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une assurance
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerte pour assurances expirant bientôt */}
      {expiringInsurances.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Attention :</strong> {expiringInsurances.length} assurance{expiringInsurances.length !== 1 ? 's' : ''} 
            expire{expiringInsurances.length === 1 ? '' : 'nt'} dans les 6 prochains mois. 
            Pensez à les renouveler : {expiringInsurances.map(i => i.compagnie).join(', ')}.
          </AlertDescription>
        </Alert>
      )}

      {/* Formulaire d'ajout/édition */}
      <AnimatePresence>
        {(isAdding || editingInsurance) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingInsurance ? 'Modifier l\'assurance' : 'Nouvelle assurance'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type et compagnie */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type d'assurance *</Label>
                    <Select
                      value={formData.type || 'vie'}
                      onValueChange={(value) => updateFormData('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {insuranceTypeOptions.map(option => (
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
                    <Label htmlFor="compagnie">Compagnie d'assurance *</Label>
                    <Input
                      id="compagnie"
                      placeholder="ex: Sun Life, Assureur, etc."
                      value={formData.compagnie || ''}
                      onChange={(e) => updateFormData('compagnie', e.target.value)}
                      className={errors.compagnie ? 'border-red-500' : ''}
                    />
                    {errors.compagnie && <p className="text-sm text-red-500 mt-1">{errors.compagnie}</p>}
                  </div>
                </div>

                {/* Numéro de police et montant */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numeroPolice">Numéro de police *</Label>
                    <Input
                      id="numeroPolice"
                      placeholder="Numéro de la police d'assurance"
                      value={formData.numeroPolice || ''}
                      onChange={(e) => updateFormData('numeroPolice', e.target.value)}
                      className={errors.numeroPolice ? 'border-red-500' : ''}
                    />
                    {errors.numeroPolice && <p className="text-sm text-red-500 mt-1">{errors.numeroPolice}</p>}
                  </div>

                  <div>
                    <Label htmlFor="montantCouverture">Montant de couverture *</Label>
                    <Input
                      id="montantCouverture"
                      type="number"
                      placeholder="0"
                      value={formData.montantCouverture || ''}
                      onChange={(e) => updateFormData('montantCouverture', parseFloat(e.target.value) || 0)}
                      className={errors.montantCouverture ? 'border-red-500' : ''}
                    />
                    {errors.montantCouverture && <p className="text-sm text-red-500 mt-1">{errors.montantCouverture}</p>}
                  </div>
                </div>

                {/* Prime annuelle et date d'expiration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primeAnnuelle">Prime annuelle</Label>
                    <Input
                      id="primeAnnuelle"
                      type="number"
                      placeholder="0"
                      value={formData.primeAnnuelle || ''}
                      onChange={(e) => updateFormData('primeAnnuelle', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateExpiration">Date d'expiration</Label>
                    <Input
                      id="dateExpiration"
                      type="date"
                      value={formData.dateExpiration ? new Date(formData.dateExpiration).toISOString().split('T')[0] : ''}
                      onChange={(e) => updateFormData('dateExpiration', e.target.value ? new Date(e.target.value) : undefined)}
                    />
                  </div>
                </div>

                {/* Agent/courtier */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Agent ou courtier</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="agentNom">Nom</Label>
                      <Input
                        id="agentNom"
                        placeholder="Nom de l'agent"
                        value={formData.agent?.nom || ''}
                        onChange={(e) => updateFormData('agent.nom', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="agentTelephone">Téléphone</Label>
                      <Input
                        id="agentTelephone"
                        placeholder="514-123-4567"
                        value={formData.agent?.telephone || ''}
                        onChange={(e) => updateFormData('agent.telephone', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="agentEmail">Email</Label>
                      <Input
                        id="agentEmail"
                        type="email"
                        placeholder="agent@exemple.com"
                        value={formData.agent?.email || ''}
                        onChange={(e) => updateFormData('agent.email', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Bénéficiaires */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Bénéficiaires</h4>
                    <Button type="button" variant="outline" size="sm" onClick={addBeneficiary}>
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un bénéficiaire
                    </Button>
                  </div>

                  {formData.beneficiaires?.map((beneficiary, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Nom *</Label>
                          <Input
                            placeholder="Nom du bénéficiaire"
                            value={beneficiary.nom}
                            onChange={(e) => updateBeneficiary(index, 'nom', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label>Relation</Label>
                          <Input
                            placeholder="ex: Conjoint, Enfant"
                            value={beneficiary.relation}
                            onChange={(e) => updateBeneficiary(index, 'relation', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label>Pourcentage *</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0"
                            value={beneficiary.pourcentage}
                            onChange={(e) => updateBeneficiary(index, 'pourcentage', parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeBeneficiary(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {errors.beneficiaires && (
                    <p className="text-sm text-red-500">{errors.beneficiaires}</p>
                  )}

                  {formData.beneficiaires && formData.beneficiaires.length > 0 && (
                    <div className="text-sm text-gray-600">
                      Total des pourcentages: {formData.beneficiaires.reduce((sum, b) => sum + b.pourcentage, 0)}%
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {editingInsurance ? 'Modifier' : 'Ajouter'}
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

      {/* Liste des assurances */}
      <div className="space-y-3">
        <AnimatePresence>
          {insurances.map((insurance) => {
            const typeInfo = getInsuranceTypeInfo(insurance.type);
            const isExpiringSoon = insurance.dateExpiration && 
              new Date(insurance.dateExpiration) <= new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000);
            
            return (
              <motion.div
                key={insurance.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`hover:shadow-md transition-shadow ${isExpiringSoon ? 'border-orange-200 bg-orange-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{typeInfo.icon}</span>
                          <div>
                            <h3 className="font-semibold text-lg">{insurance.compagnie}</h3>
                            <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                            {isExpiringSoon && (
                              <Badge variant="outline" className="ml-2 text-orange-600 border-orange-600">
                                Expire bientôt
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>Police: {insurance.numeroPolice}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>Couverture: {insurance.montantCouverture.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</span>
                          </div>
                          
                          {insurance.primeAnnuelle && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Prime annuelle: {insurance.primeAnnuelle.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</span>
                            </div>
                          )}
                          
                          {insurance.dateExpiration && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Expiration: {new Date(insurance.dateExpiration).toLocaleDateString('fr-CA')}</span>
                            </div>
                          )}
                          
                          {insurance.agent && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>Agent: {insurance.agent.nom} - {insurance.agent.telephone}</span>
                            </div>
                          )}
                          
                          {insurance.beneficiaires.length > 0 && (
                            <div className="mt-2 p-2 bg-blue-50 rounded">
                              <div className="text-blue-800 font-medium text-xs mb-1">Bénéficiaires</div>
                              <div className="space-y-1">
                                {insurance.beneficiaires.map((beneficiary, index) => (
                                  <div key={index} className="text-blue-700 text-xs">
                                    {beneficiary.nom} ({beneficiary.relation}) - {beneficiary.pourcentage}%
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartEdit(insurance)}
                          disabled={isAdding || editingInsurance !== null}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(insurance.id)}
                          disabled={isAdding || editingInsurance !== null}
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

      {/* Message si aucune assurance */}
      {insurances.length === 0 && !isAdding && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucune assurance répertoriée
            </h3>
            <p className="text-gray-500 mb-4">
              Ajoutez vos polices d'assurance pour protéger vos bénéficiaires et faciliter les démarches.
            </p>
            <Button onClick={handleStartAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter votre première assurance
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
