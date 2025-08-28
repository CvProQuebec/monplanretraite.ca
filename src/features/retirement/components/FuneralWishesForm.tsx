// src/features/retirement/components/FuneralWishesForm.tsx
// Formulaire pour les préférences funéraires et instructions de fin de vie

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
  Phone,
  MapPin,
  AlertTriangle,
  CheckCircle,
  FileText,
  Users,
  Calendar,
  DollarSign,
  Church,
  Flower
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { FuneralWishes, PrearrangementContract, Cemetery } from '../types/emergency-planning';
import { EmergencyPlanningService } from '../services/EmergencyPlanningService';

interface FuneralWishesFormProps {
  funeralWishes: FuneralWishes;
  onChange: (funeralWishes: FuneralWishes) => void;
  className?: string;
}

const dispositionOptions = [
  { value: 'inhumation', label: 'Inhumation', icon: '⚰️', description: 'Enterrement traditionnel' },
  { value: 'cremation', label: 'Crémation', icon: '🔥', description: 'Incinération du corps' },
  { value: 'don_corps', label: 'Don du corps', icon: '🏥', description: 'Don à la science médicale' },
  { value: 'autre', label: 'Autre', icon: '❓', description: 'Autre méthode spécifiée' }
];

const ceremonyTypeOptions = [
  { value: 'religieuse', label: 'Religieuse', icon: '⛪' },
  { value: 'civile', label: 'Civile', icon: '🏛️' },
  { value: 'privee', label: 'Privée', icon: '👥' },
  { value: 'aucune', label: 'Aucune cérémonie', icon: '🚫' }
];

const religionOptions = [
  { value: 'catholique', label: 'Catholique' },
  { value: 'protestant', label: 'Protestant' },
  { value: 'orthodoxe', label: 'Orthodoxe' },
  { value: 'juif', label: 'Juif' },
  { value: 'musulman', label: 'Musulman' },
  { value: 'bouddhiste', label: 'Bouddhiste' },
  { value: 'hindou', label: 'Hindou' },
  { value: 'autre', label: 'Autre' }
];

export const FuneralWishesForm: React.FC<FuneralWishesFormProps> = ({
  funeralWishes,
  onChange,
  className
}) => {
  const [activeSection, setActiveSection] = useState<'preferences' | 'prearrangements' | 'cemetery'>('preferences');
  const [editingContract, setEditingContract] = useState<PrearrangementContract | null>(null);
  const [isAddingContract, setIsAddingContract] = useState(false);
  const [contractFormData, setContractFormData] = useState<Partial<PrearrangementContract>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFuneralWishes = (field: string, value: any) => {
    if (field.startsWith('cemetery.')) {
      const cemeteryField = field.split('.')[1];
      onChange({
        ...funeralWishes,
        cemetery: {
          ...funeralWishes.cemetery,
          [cemeteryField]: value
        }
      });
    } else {
      onChange({
        ...funeralWishes,
        [field]: value
      });
    }
  };

  const createEmptyContract = (): Partial<PrearrangementContract> => ({
    entreprise: '',
    numeroContrat: '',
    lieuContrat: '',
    personneContact: undefined,
    montantPaye: undefined,
    notes: ''
  });

  const validateContract = (contract: Partial<PrearrangementContract>): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!contract.entreprise?.trim()) newErrors.entreprise = 'Le nom de l\'entreprise est requis';
    if (!contract.numeroContrat?.trim()) newErrors.numeroContrat = 'Le numéro de contrat est requis';

    return newErrors;
  };

  const handleStartAddContract = () => {
    setContractFormData(createEmptyContract());
    setIsAddingContract(true);
    setEditingContract(null);
    setErrors({});
  };

  const handleStartEditContract = (contract: PrearrangementContract) => {
    setContractFormData({ ...contract });
    setEditingContract(contract);
    setIsAddingContract(false);
    setErrors({});
  };

  const handleSaveContract = () => {
    const validationErrors = validateContract(contractFormData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const contractToSave: PrearrangementContract = {
      id: editingContract?.id || EmergencyPlanningService.generateId(),
      entreprise: contractFormData.entreprise!,
      numeroContrat: contractFormData.numeroContrat!,
      lieuContrat: contractFormData.lieuContrat || undefined,
      personneContact: contractFormData.personneContact || undefined,
      montantPaye: contractFormData.montantPaye || undefined,
      notes: contractFormData.notes || undefined
    };

    let updatedContracts;
    if (editingContract) {
      updatedContracts = (funeralWishes.prearrangements || []).map(c => 
        c.id === editingContract.id ? contractToSave : c
      );
    } else {
      updatedContracts = [...(funeralWishes.prearrangements || []), contractToSave];
    }

    onChange({
      ...funeralWishes,
      prearrangements: updatedContracts
    });

    handleCancelContract();
  };

  const handleCancelContract = () => {
    setContractFormData({});
    setEditingContract(null);
    setIsAddingContract(false);
    setErrors({});
  };

  const handleDeleteContract = (contractId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contrat de préarrangements ?')) {
      const updatedContracts = (funeralWishes.prearrangements || []).filter(c => c.id !== contractId);
      onChange({
        ...funeralWishes,
        prearrangements: updatedContracts
      });
    }
  };

  const updateContractFormData = (field: string, value: any) => {
    if (field.startsWith('personneContact.')) {
      const contactField = field.split('.')[1];
      setContractFormData(prev => ({
        ...prev,
        personneContact: {
          ...prev.personneContact,
          [contactField]: value
        }
      }));
    } else {
      setContractFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const getDispositionInfo = (type: string) => {
    return dispositionOptions.find(option => option.value === type) || dispositionOptions[0];
  };

  const getCeremonyInfo = (type: string) => {
    return ceremonyTypeOptions.find(option => option.value === type) || ceremonyTypeOptions[0];
  };

  const hasPrearrangements = funeralWishes.prearrangements && funeralWishes.prearrangements.length > 0;
  const hasCemeteryInfo = funeralWishes.cemetery && (
    funeralWishes.cemetery.nom || 
    funeralWishes.cemetery.numeroLot || 
    funeralWishes.cemetery.personnesInhumees
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-600" />
            Préférences funéraires
          </CardTitle>
          <CardDescription>
            Documentez vos souhaits concernant vos funérailles, les cérémonies et la disposition de votre corps. 
            Ces informations guideront vos proches dans des moments difficiles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Badge 
                variant={activeSection === 'preferences' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setActiveSection('preferences')}
              >
                Préférences
              </Badge>
              <Badge 
                variant={activeSection === 'prearrangements' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setActiveSection('prearrangements')}
              >
                Préarrangements {hasPrearrangements && <CheckCircle className="w-3 h-3 ml-1" />}
              </Badge>
              <Badge 
                variant={activeSection === 'cemetery' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setActiveSection('cemetery')}
              >
                Cimetière {hasCemeteryInfo && <CheckCircle className="w-3 h-3 ml-1" />}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Préférences */}
      {activeSection === 'preferences' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          {/* Disposition du corps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Disposition du corps</CardTitle>
              <CardDescription>
                Choisissez votre préférence pour la disposition de votre corps après le décès.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dispositionOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      funeralWishes.dispositionCorps === option.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateFuneralWishes('dispositionCorps', option.value)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {funeralWishes.dispositionCorps === 'autre' && (
                <div>
                  <Label htmlFor="autre-disposition">Précisez votre choix</Label>
                  <Textarea
                    id="autre-disposition"
                    value={funeralWishes.autreDisposition || ''}
                    onChange={(e) => updateFuneralWishes('autreDisposition', e.target.value)}
                    placeholder="Décrivez vos préférences spécifiques..."
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Type de cérémonie */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Type de cérémonie</CardTitle>
              <CardDescription>
                Indiquez le type de cérémonie que vous souhaitez.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ceremonyTypeOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-3 border rounded-lg cursor-pointer text-center transition-colors ${
                      funeralWishes.typeCeremonie === option.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateFuneralWishes('typeCeremonie', option.value)}
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <div className="text-sm font-medium">{option.label}</div>
                  </div>
                ))}
              </div>

              {funeralWishes.typeCeremonie === 'religieuse' && (
                <div>
                  <Label htmlFor="religion">Religion</Label>
                  <Select
                    value={funeralWishes.religion || ''}
                    onValueChange={(value) => updateFuneralWishes('religion', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre religion" />
                    </SelectTrigger>
                    <SelectContent>
                      {religionOptions.map((religion) => (
                        <SelectItem key={religion.value} value={religion.value}>
                          {religion.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions spéciales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instructions spéciales</CardTitle>
              <CardDescription>
                Ajoutez toute instruction particulière concernant vos funérailles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={funeralWishes.instructionsSpeciales || ''}
                onChange={(e) => updateFuneralWishes('instructionsSpeciales', e.target.value)}
                placeholder="Musique préférée, lectures, personnes à contacter, restrictions alimentaires pour la réception, etc."
                rows={4}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Section Préarrangements */}
      {activeSection === 'prearrangements' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Contrats de préarrangements
              </CardTitle>
              <CardDescription>
                Documentez vos contrats de préarrangements funéraires existants.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Liste des contrats existants */}
                {funeralWishes.prearrangements && funeralWishes.prearrangements.length > 0 ? (
                  <div className="space-y-3">
                    {funeralWishes.prearrangements.map((contract) => (
                      <div key={contract.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium">{contract.entreprise}</div>
                            <div className="text-sm text-gray-600">
                              Contrat #{contract.numeroContrat}
                            </div>
                            {contract.lieuContrat && (
                              <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                {contract.lieuContrat}
                              </div>
                            )}
                            {contract.montantPaye && (
                              <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
                                <DollarSign className="w-3 h-3" />
                                {contract.montantPaye.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStartEditContract(contract)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteContract(contract.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun contrat de préarrangements documenté</p>
                  </div>
                )}

                {/* Bouton d'ajout */}
                {!isAddingContract && !editingContract && (
                  <Button onClick={handleStartAddContract} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un contrat
                  </Button>
                )}

                {/* Formulaire d'ajout/édition */}
                {(isAddingContract || editingContract) && (
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-medium mb-4">
                      {editingContract ? 'Modifier le contrat' : 'Nouveau contrat'}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="entreprise">Entreprise funéraire *</Label>
                        <Input
                          id="entreprise"
                          value={contractFormData.entreprise || ''}
                          onChange={(e) => updateContractFormData('entreprise', e.target.value)}
                          className={errors.entreprise ? 'border-red-500' : ''}
                        />
                        {errors.entreprise && (
                          <p className="text-red-500 text-sm mt-1">{errors.entreprise}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="numeroContrat">Numéro de contrat *</Label>
                        <Input
                          id="numeroContrat"
                          value={contractFormData.numeroContrat || ''}
                          onChange={(e) => updateContractFormData('numeroContrat', e.target.value)}
                          className={errors.numeroContrat ? 'border-red-500' : ''}
                        />
                        {errors.numeroContrat && (
                          <p className="text-red-500 text-sm mt-1">{errors.numeroContrat}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="lieuContrat">Lieu du contrat</Label>
                        <Input
                          id="lieuContrat"
                          value={contractFormData.lieuContrat || ''}
                          onChange={(e) => updateContractFormData('lieuContrat', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="montantPaye">Montant payé</Label>
                        <Input
                          id="montantPaye"
                          type="number"
                          value={contractFormData.montantPaye || ''}
                          onChange={(e) => updateContractFormData('montantPaye', parseFloat(e.target.value) || undefined)}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={contractFormData.notes || ''}
                        onChange={(e) => updateContractFormData('notes', e.target.value)}
                        placeholder="Notes additionnelles sur ce contrat..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleSaveContract}>
                        Sauvegarder
                      </Button>
                      <Button variant="outline" onClick={handleCancelContract}>
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Section Cimetière */}
      {activeSection === 'cemetery' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Flower className="w-5 h-5" />
                Informations sur le cimetière
              </CardTitle>
              <CardDescription>
                Documentez les informations sur votre lot au cimetière ou vos préférences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cemetery-name">Nom du cimetière</Label>
                  <Input
                    id="cemetery-name"
                    value={funeralWishes.cemetery?.nom || ''}
                    onChange={(e) => updateFuneralWishes('cemetery.nom', e.target.value)}
                    placeholder="Nom du cimetière"
                  />
                </div>

                <div>
                  <Label htmlFor="cemetery-lot">Numéro de lot</Label>
                  <Input
                    id="cemetery-lot"
                    value={funeralWishes.cemetery?.numeroLot || ''}
                    onChange={(e) => updateFuneralWishes('cemetery.numeroLot', e.target.value)}
                    placeholder="Numéro du lot"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cemetery-address">Adresse complète</Label>
                <Textarea
                  id="cemetery-address"
                  value={funeralWishes.cemetery?.adresse || ''}
                  onChange={(e) => updateFuneralWishes('cemetery.adresse', e.target.value)}
                  placeholder="Adresse complète du cimetière"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="cemetery-buried">Personnes déjà inhumées</Label>
                <Textarea
                  id="cemetery-buried"
                  value={funeralWishes.cemetery?.personnesInhumees || ''}
                  onChange={(e) => updateFuneralWishes('cemetery.personnesInhumees', e.target.value)}
                  placeholder="Noms des personnes déjà inhumées dans ce lot"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="cemetery-notes">Notes additionnelles</Label>
                <Textarea
                  id="cemetery-notes"
                  value={funeralWishes.cemetery?.notes || ''}
                  onChange={(e) => updateFuneralWishes('cemetery.notes', e.target.value)}
                  placeholder="Instructions spéciales, restrictions, etc."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Résumé des informations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Résumé de vos préférences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">
                {funeralWishes.dispositionCorps ? getDispositionInfo(funeralWishes.dispositionCorps).icon : '❓'}
              </div>
              <div className="font-medium">Disposition</div>
              <div className="text-sm text-gray-600">
                {funeralWishes.dispositionCorps ? getDispositionInfo(funeralWishes.dispositionCorps).label : 'Non spécifiée'}
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">
                {funeralWishes.typeCeremonie ? getCeremonyInfo(funeralWishes.typeCeremonie).icon : '❓'}
              </div>
              <div className="font-medium">Cérémonie</div>
              <div className="text-sm text-gray-600">
                {funeralWishes.typeCeremonie ? getCeremonyInfo(funeralWishes.typeCeremonie).label : 'Non spécifiée'}
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">
                {hasPrearrangements ? '✅' : '❌'}
              </div>
              <div className="font-medium">Préarrangements</div>
              <div className="text-sm text-gray-600">
                {hasPrearrangements ? `${funeralWishes.prearrangements!.length} contrat(s)` : 'Aucun contrat'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
