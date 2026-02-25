// src/features/retirement/components/EmergencyContactsForm.tsx
// Formulaire pour les contacts d'urgence

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
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { EmergencyContact } from '../types/emergency-planning';
import { EmergencyPlanningService } from '../services/EmergencyPlanningService';

interface EmergencyContactsFormProps {
  contacts: EmergencyContact[];
  onChange: (contacts: EmergencyContact[]) => void;
  className?: string;
}

const relationOptions = [
  { value: 'conjoint', label: 'Conjoint(e)' },
  { value: 'enfant', label: 'Enfant' },
  { value: 'parent', label: 'Parent' },
  { value: 'frere_soeur', label: 'Frère/Sœur' },
  { value: 'ami', label: 'Ami(e)' },
  { value: 'autre', label: 'Autre' }
];

const priorityOptions = [
  { value: 1, label: 'Priorité haute', color: 'bg-red-100 text-red-800 border-red-200' },
  { value: 2, label: 'Priorité moyenne', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 3, label: 'Priorité basse', color: 'bg-green-100 text-green-800 border-green-200' }
];

export const EmergencyContactsForm: React.FC<EmergencyContactsFormProps> = ({
  contacts,
  onChange,
  className
}) => {
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<EmergencyContact>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createEmptyContact = (): Partial<EmergencyContact> => ({
    nom: '',
    prenom: '',
    relation: 'autre',
    telephone: '',
    email: '',
    priorite: 2,
    notes: '',
    adresse: {
      rue: '',
      ville: '',
      province: 'QC',
      codePostal: ''
    }
  });

  const validateContact = (contact: Partial<EmergencyContact>): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!contact.nom?.trim()) newErrors.nom = 'Le nom est requis';
    if (!contact.prenom?.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!contact.telephone?.trim()) newErrors.telephone = 'Le téléphone est requis';
    
    // Validation du format téléphone (format canadien)
    if (contact.telephone && !/^(\+1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/.test(contact.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide (ex: 514-123-4567)';
    }

    // Validation email si fourni
    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Validation code postal si fourni
    if (contact.adresse?.codePostal && !/^[A-Za-z]\d[A-Za-z][-.\s]?\d[A-Za-z]\d$/.test(contact.adresse.codePostal)) {
      newErrors.codePostal = 'Format de code postal invalide (ex: H1A 1A1)';
    }

    return newErrors;
  };

  const handleStartAdd = () => {
    setFormData(createEmptyContact());
    setIsAdding(true);
    setEditingContact(null);
    setErrors({});
  };

  const handleStartEdit = (contact: EmergencyContact) => {
    setFormData({ ...contact });
    setEditingContact(contact);
    setIsAdding(false);
    setErrors({});
  };

  const handleSave = () => {
    const validationErrors = validateContact(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const contactToSave: EmergencyContact = {
      id: editingContact?.id || EmergencyPlanningService.generateId(),
      nom: formData.nom!,
      prenom: formData.prenom!,
      relation: formData.relation as EmergencyContact['relation'],
      telephone: formData.telephone!,
      email: formData.email || undefined,
      priorite: formData.priorite as EmergencyContact['priorite'],
      notes: formData.notes || undefined,
      adresse: formData.adresse?.rue ? formData.adresse : undefined
    };

    let updatedContacts;
    if (editingContact) {
      updatedContacts = contacts.map(c => c.id === editingContact.id ? contactToSave : c);
    } else {
      updatedContacts = [...contacts, contactToSave];
    }

    onChange(updatedContacts);
    handleCancel();
  };

  const handleCancel = () => {
    setFormData({});
    setEditingContact(null);
    setIsAdding(false);
    setErrors({});
  };

  const handleDelete = (contactId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      onChange(contacts.filter(c => c.id !== contactId));
    }
  };

  const updateFormData = (field: string, value: any) => {
    if (field.startsWith('adresse.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        adresse: {
          ...prev.adresse,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const getPriorityBadge = (priorite: number) => {
    const option = priorityOptions.find(p => p.value === priorite);
    return (
      <Badge className={option?.color}>
        {priorite === 1 && <Star className="w-3 h-3 mr-1" />}
        {option?.label}
      </Badge>
    );
  };

  const sortedContacts = [...contacts].sort((a, b) => a.priorite - b.priorite);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-mpr-interactive" />
            Contacts d'urgence
          </CardTitle>
          <CardDescription>
            Personnes à contacter en cas d'urgence, d'invalidité ou de décès. 
            Assurez-vous d'avoir au moins un contact prioritaire.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {contacts.length} contact{contacts.length !== 1 ? 's' : ''} défini{contacts.length !== 1 ? 's' : ''}
              {contacts.filter(c => c.priorite === 1).length > 0 && (
                <span className="ml-2 text-green-600">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Contact prioritaire défini
                </span>
              )}
            </div>
            <Button onClick={handleStartAdd} disabled={isAdding || editingContact !== null}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un contact
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerte si aucun contact prioritaire */}
      {contacts.length > 0 && contacts.filter(c => c.priorite === 1).length === 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Il est recommandé d'avoir au moins un contact avec une priorité haute pour les urgences.
          </AlertDescription>
        </Alert>
      )}

      {/* Formulaire d'ajout/édition */}
      <AnimatePresence>
        {(isAdding || editingContact) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-mpr-border bg-mpr-interactive-lt">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingContact ? 'Modifier le contact' : 'Nouveau contact d\'urgence'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input
                      id="prenom"
                      value={formData.prenom || ''}
                      onChange={(e) => updateFormData('prenom', e.target.value)}
                      className={errors.prenom ? 'border-red-500' : ''}
                    />
                    {errors.prenom && <p className="text-sm text-red-500 mt-1">{errors.prenom}</p>}
                  </div>

                  <div>
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                      id="nom"
                      value={formData.nom || ''}
                      onChange={(e) => updateFormData('nom', e.target.value)}
                      className={errors.nom ? 'border-red-500' : ''}
                    />
                    {errors.nom && <p className="text-sm text-red-500 mt-1">{errors.nom}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="relation">Relation</Label>
                    <Select
                      value={formData.relation || 'autre'}
                      onValueChange={(value) => updateFormData('relation', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {relationOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priorite">Priorité</Label>
                    <Select
                      value={formData.priorite?.toString() || '2'}
                      onValueChange={(value) => updateFormData('priorite', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map(option => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telephone">Téléphone *</Label>
                    <Input
                      id="telephone"
                      type="tel"
                      placeholder="514-123-4567"
                      value={formData.telephone || ''}
                      onChange={(e) => updateFormData('telephone', e.target.value)}
                      className={errors.telephone ? 'border-red-500' : ''}
                    />
                    {errors.telephone && <p className="text-sm text-red-500 mt-1">{errors.telephone}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@exemple.com"
                      value={formData.email || ''}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Adresse */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Adresse (optionnel)</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <Input
                      placeholder="Rue et numéro"
                      value={formData.adresse?.rue || ''}
                      onChange={(e) => updateFormData('adresse.rue', e.target.value)}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <Input
                        placeholder="Ville"
                        value={formData.adresse?.ville || ''}
                        onChange={(e) => updateFormData('adresse.ville', e.target.value)}
                      />
                      <Select
                        value={formData.adresse?.province || 'QC'}
                        onValueChange={(value) => updateFormData('adresse.province', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="QC">Québec</SelectItem>
                          <SelectItem value="ON">Ontario</SelectItem>
                          <SelectItem value="BC">Colombie-Britannique</SelectItem>
                          <SelectItem value="AB">Alberta</SelectItem>
                          <SelectItem value="MB">Manitoba</SelectItem>
                          <SelectItem value="SK">Saskatchewan</SelectItem>
                          <SelectItem value="NS">Nouvelle-Écosse</SelectItem>
                          <SelectItem value="NB">Nouveau-Brunswick</SelectItem>
                          <SelectItem value="PE">Île-du-Prince-Édouard</SelectItem>
                          <SelectItem value="NL">Terre-Neuve-et-Labrador</SelectItem>
                          <SelectItem value="YT">Yukon</SelectItem>
                          <SelectItem value="NT">Territoires du Nord-Ouest</SelectItem>
                          <SelectItem value="NU">Nunavut</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Code postal"
                        value={formData.adresse?.codePostal || ''}
                        onChange={(e) => updateFormData('adresse.codePostal', e.target.value.toUpperCase())}
                        className={errors.codePostal ? 'border-red-500' : ''}
                      />
                    </div>
                    {errors.codePostal && <p className="text-sm text-red-500">{errors.codePostal}</p>}
                  </div>
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
                    {editingContact ? 'Modifier' : 'Ajouter'}
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

      {/* Liste des contacts */}
      <div className="space-y-3">
        <AnimatePresence>
          {sortedContacts.map((contact) => (
            <motion.div
              key={contact.id}
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
                        <h3 className="font-semibold text-lg">
                          {contact.prenom} {contact.nom}
                        </h3>
                        {getPriorityBadge(contact.priorite)}
                        <Badge variant="outline">
                          {relationOptions.find(r => r.value === contact.relation)?.label}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${contact.telephone}`} className="hover:text-mpr-interactive">
                            {contact.telephone}
                          </a>
                        </div>
                        
                        {contact.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${contact.email}`} className="hover:text-mpr-interactive">
                              {contact.email}
                            </a>
                          </div>
                        )}
                        
                        {contact.adresse && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {contact.adresse.rue}, {contact.adresse.ville}, {contact.adresse.province} {contact.adresse.codePostal}
                            </span>
                          </div>
                        )}
                        
                        {contact.notes && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            {contact.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStartEdit(contact)}
                        disabled={isAdding || editingContact !== null}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(contact.id)}
                        disabled={isAdding || editingContact !== null}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Message si aucun contact */}
      {contacts.length === 0 && !isAdding && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-12">
            <Phone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucun contact d'urgence
            </h3>
            <p className="text-gray-500 mb-4">
              Ajoutez des personnes à contacter en cas d'urgence pour protéger vos proches.
            </p>
            <Button onClick={handleStartAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter votre premier contact
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
