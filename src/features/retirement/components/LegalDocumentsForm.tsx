// src/features/retirement/components/LegalDocumentsForm.tsx
// Formulaire pour les documents légaux

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
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Scale,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { LegalDocument } from '../types/emergency-planning';
import { EmergencyPlanningService } from '../services/EmergencyPlanningService';

interface LegalDocumentsFormProps {
  documents: LegalDocument[];
  onChange: (documents: LegalDocument[]) => void;
  className?: string;
}

const documentTypeOptions = [
  { value: 'testament', label: 'Testament', icon: '📜', color: 'bg-blue-100 text-blue-800', priority: 'high' },
  { value: 'mandat_incapacite', label: 'Mandat d\'inaptitude', icon: '🏥', color: 'bg-red-100 text-red-800', priority: 'high' },
  { value: 'procuration', label: 'Procuration', icon: '✍️', color: 'bg-green-100 text-green-800', priority: 'medium' },
  { value: 'contrat_mariage', label: 'Contrat de mariage', icon: '💍', color: 'bg-purple-100 text-purple-800', priority: 'medium' },
  { value: 'autre', label: 'Autre document', icon: '📄', color: 'bg-gray-100 text-gray-800', priority: 'low' }
];

export const LegalDocumentsForm: React.FC<LegalDocumentsFormProps> = ({
  documents,
  onChange,
  className
}) => {
  const [editingDocument, setEditingDocument] = useState<LegalDocument | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<LegalDocument>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createEmptyDocument = (): Partial<LegalDocument> => ({
    type: 'testament',
    titre: '',
    dateCreation: new Date(),
    emplacement: '',
    notes: '',
    notaire: undefined
  });

  const validateDocument = (document: Partial<LegalDocument>): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!document.titre?.trim()) newErrors.titre = 'Le titre du document est requis';
    if (!document.emplacement?.trim()) newErrors.emplacement = 'L\'emplacement du document est requis';
    if (!document.dateCreation) newErrors.dateCreation = 'La date de création est requise';

    return newErrors;
  };

  const handleStartAdd = () => {
    setFormData(createEmptyDocument());
    setIsAdding(true);
    setEditingDocument(null);
    setErrors({});
  };

  const handleStartEdit = (document: LegalDocument) => {
    setFormData({ ...document });
    setEditingDocument(document);
    setIsAdding(false);
    setErrors({});
  };

  const handleSave = () => {
    const validationErrors = validateDocument(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const documentToSave: LegalDocument = {
      id: editingDocument?.id || EmergencyPlanningService.generateId(),
      type: formData.type as LegalDocument['type'],
      titre: formData.titre!,
      dateCreation: formData.dateCreation!,
      derniereMiseAJour: editingDocument ? new Date() : formData.dateCreation!,
      emplacement: formData.emplacement!,
      notaire: formData.notaire || undefined,
      notes: formData.notes || undefined
    };

    let updatedDocuments;
    if (editingDocument) {
      updatedDocuments = documents.map(d => d.id === editingDocument.id ? documentToSave : d);
    } else {
      updatedDocuments = [...documents, documentToSave];
    }

    onChange(updatedDocuments);
    handleCancel();
  };

  const handleCancel = () => {
    setFormData({});
    setEditingDocument(null);
    setIsAdding(false);
    setErrors({});
  };

  const handleDelete = (documentId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      onChange(documents.filter(d => d.id !== documentId));
    }
  };

  const updateFormData = (field: string, value: any) => {
    if (field.startsWith('notaire.')) {
      const notaireField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        notaire: {
          ...prev.notaire,
          [notaireField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const getDocumentTypeInfo = (type: string) => {
    return documentTypeOptions.find(option => option.value === type) || documentTypeOptions[0];
  };

  const getCriticalDocuments = () => {
    const hasTestament = documents.some(d => d.type === 'testament');
    const hasMandatIncapacite = documents.some(d => d.type === 'mandat_incapacite');
    
    return { hasTestament, hasMandatIncapacite };
  };

  const getOldDocuments = () => {
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    
    return documents.filter(doc => 
      new Date(doc.dateCreation) < fiveYearsAgo || 
      (doc.derniereMiseAJour && new Date(doc.derniereMiseAJour) < fiveYearsAgo)
    );
  };

  const { hasTestament, hasMandatIncapacite } = getCriticalDocuments();
  const oldDocuments = getOldDocuments();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            Documents légaux
          </CardTitle>
          <CardDescription>
            Répertoriez tous vos documents légaux importants : testament, mandats de protection, 
            procurations et autres documents officiels. Indiquez où ils sont conservés.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              {documents.length} document{documents.length !== 1 ? 's' : ''} répertorié{documents.length !== 1 ? 's' : ''}
              {documents.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {hasTestament && (
                    <Badge variant="outline" className="text-green-600">
                      ✓ Testament
                    </Badge>
                  )}
                  {hasMandatIncapacite && (
                    <Badge variant="outline" className="text-green-600">
                      ✓ Mandat d'inaptitude
                    </Badge>
                  )}
                  {!hasTestament && (
                    <Badge variant="outline" className="text-red-600">
                      ⚠ Testament manquant
                    </Badge>
                  )}
                  {!hasMandatIncapacite && (
                    <Badge variant="outline" className="text-red-600">
                      ⚠ Mandat d'inaptitude manquant
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <Button onClick={handleStartAdd} disabled={isAdding || editingDocument !== null}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un document
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alertes importantes */}
      {(!hasTestament || !hasMandatIncapacite) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Documents critiques manquants :</strong>
            {!hasTestament && !hasMandatIncapacite && ' Testament et mandat d\'inaptitude'}
            {!hasTestament && hasMandatIncapacite && ' Testament'}
            {hasTestament && !hasMandatIncapacite && ' Mandat d\'inaptitude'}
            . Ces documents sont essentiels pour protéger vos volontés et vos proches.
          </AlertDescription>
        </Alert>
      )}

      {oldDocuments.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Documents anciens :</strong> {oldDocuments.length} document{oldDocuments.length !== 1 ? 's' : ''} 
            {oldDocuments.length === 1 ? ' date' : ' datent'} de plus de 5 ans. 
            Considérez une révision : {oldDocuments.map(d => d.titre).join(', ')}.
          </AlertDescription>
        </Alert>
      )}

      {/* Formulaire d'ajout/édition */}
      <AnimatePresence>
        {(isAdding || editingDocument) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingDocument ? 'Modifier le document' : 'Nouveau document légal'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type et titre */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type de document *</Label>
                    <Select
                      value={formData.type || 'testament'}
                      onValueChange={(value) => updateFormData('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypeOptions.map(option => (
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
                    <Label htmlFor="titre">Titre du document *</Label>
                    <Input
                      id="titre"
                      placeholder="ex: Testament olographe, Mandat notarié"
                      value={formData.titre || ''}
                      onChange={(e) => updateFormData('titre', e.target.value)}
                      className={errors.titre ? 'border-red-500' : ''}
                    />
                    {errors.titre && <p className="text-sm text-red-500 mt-1">{errors.titre}</p>}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateCreation">Date de création *</Label>
                    <Input
                      id="dateCreation"
                      type="date"
                      value={formData.dateCreation ? new Date(formData.dateCreation).toISOString().split('T')[0] : ''}
                      onChange={(e) => updateFormData('dateCreation', e.target.value ? new Date(e.target.value) : undefined)}
                      className={errors.dateCreation ? 'border-red-500' : ''}
                    />
                    {errors.dateCreation && <p className="text-sm text-red-500 mt-1">{errors.dateCreation}</p>}
                  </div>

                  <div>
                    <Label htmlFor="derniereMiseAJour">Dernière mise à jour</Label>
                    <Input
                      id="derniereMiseAJour"
                      type="date"
                      value={formData.derniereMiseAJour ? new Date(formData.derniereMiseAJour).toISOString().split('T')[0] : ''}
                      onChange={(e) => updateFormData('derniereMiseAJour', e.target.value ? new Date(e.target.value) : undefined)}
                    />
                  </div>
                </div>

                {/* Emplacement */}
                <div>
                  <Label htmlFor="emplacement">Emplacement du document *</Label>
                  <Input
                    id="emplacement"
                    placeholder="ex: Coffre-fort à domicile, Étude du notaire, Coffre bancaire"
                    value={formData.emplacement || ''}
                    onChange={(e) => updateFormData('emplacement', e.target.value)}
                    className={errors.emplacement ? 'border-red-500' : ''}
                  />
                  {errors.emplacement && <p className="text-sm text-red-500 mt-1">{errors.emplacement}</p>}
                </div>

                {/* Notaire/Professionnel */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Notaire ou professionnel (si applicable)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="notaireNom">Nom</Label>
                      <Input
                        id="notaireNom"
                        placeholder="Nom du notaire/avocat"
                        value={formData.notaire?.nom || ''}
                        onChange={(e) => updateFormData('notaire.nom', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="notaireTelephone">Téléphone</Label>
                      <Input
                        id="notaireTelephone"
                        placeholder="514-123-4567"
                        value={formData.notaire?.telephone || ''}
                        onChange={(e) => updateFormData('notaire.telephone', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="notaireAdresse">Adresse</Label>
                      <Input
                        id="notaireAdresse"
                        placeholder="Adresse du bureau"
                        value={formData.notaire?.adresse || ''}
                        onChange={(e) => updateFormData('notaire.adresse', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Informations supplémentaires, instructions spéciales, numéro de dossier..."
                    value={formData.notes || ''}
                    onChange={(e) => updateFormData('notes', e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {editingDocument ? 'Modifier' : 'Ajouter'}
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

      {/* Liste des documents */}
      <div className="space-y-3">
        <AnimatePresence>
          {documents.map((document) => {
            const typeInfo = getDocumentTypeInfo(document.type);
            const isOld = new Date(document.dateCreation) < new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000);
            
            return (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`hover:shadow-md transition-shadow ${isOld ? 'border-yellow-200 bg-yellow-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{typeInfo.icon}</span>
                          <div>
                            <h3 className="font-semibold text-lg">{document.titre}</h3>
                            <div className="flex items-center gap-2">
                              <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                              {typeInfo.priority === 'high' && (
                                <Badge variant="outline" className="text-red-600 border-red-600">
                                  Critique
                                </Badge>
                              )}
                              {isOld && (
                                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                  Ancien (5+ ans)
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Créé le: {new Date(document.dateCreation).toLocaleDateString('fr-CA')}</span>
                            {document.derniereMiseAJour && (
                              <span className="text-gray-500">
                                (Mis à jour: {new Date(document.derniereMiseAJour).toLocaleDateString('fr-CA')})
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FolderOpen className="w-4 h-4" />
                            <span>Emplacement: {document.emplacement}</span>
                          </div>
                          
                          {document.notaire && (
                            <div className="flex items-center gap-2">
                              <Scale className="w-4 h-4" />
                              <span>Notaire: {document.notaire.nom}</span>
                              {document.notaire.telephone && (
                                <span className="text-gray-500">- {document.notaire.telephone}</span>
                              )}
                            </div>
                          )}
                          
                          {document.notaire?.adresse && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{document.notaire.adresse}</span>
                            </div>
                          )}
                          
                          {document.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                              {document.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartEdit(document)}
                          disabled={isAdding || editingDocument !== null}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(document.id)}
                          disabled={isAdding || editingDocument !== null}
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

      {/* Message si aucun document */}
      {documents.length === 0 && !isAdding && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucun document légal répertorié
            </h3>
            <p className="text-gray-500 mb-4">
              Ajoutez vos documents légaux importants pour faciliter les démarches de vos proches.
            </p>
            <Button onClick={handleStartAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter votre premier document
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Conseils */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">💡 Conseils importants</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>• <strong>Testament :</strong> Document essentiel qui détermine la répartition de vos biens</p>
          <p>• <strong>Mandat d'inaptitude :</strong> Désigne qui prendra les décisions si vous devenez inapte</p>
          <p>• <strong>Révision régulière :</strong> Mettez à jour vos documents lors de changements majeurs</p>
          <p>• <strong>Copies multiples :</strong> Conservez des copies en lieux sûrs et informez vos proches</p>
          <p>• <strong>Consultation professionnelle :</strong> Faites appel à un notaire pour les documents officiels</p>
        </CardContent>
      </Card>
    </div>
  );
};
