// src/features/retirement/components/DigitalAccessForm.tsx
// Formulaire pour les accès numériques et mots de passe

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
  Smartphone, 
  Plus, 
  Edit, 
  Trash2, 
  Globe,
  Shield,
  Key,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { DigitalAccess } from '../types/emergency-planning';
import { EmergencyPlanningService } from '../services/EmergencyPlanningService';

interface DigitalAccessFormProps {
  digitalAccess: DigitalAccess[];
  onChange: (digitalAccess: DigitalAccess[]) => void;
  className?: string;
}

const accessTypeOptions = [
  { value: 'email', label: 'Courriel', icon: '📧', color: 'bg-blue-100 text-blue-800' },
  { value: 'banking', label: 'Services bancaires', icon: '🏦', color: 'bg-green-100 text-green-800' },
  { value: 'social', label: 'Réseaux sociaux', icon: '👥', color: 'bg-purple-100 text-purple-800' },
  { value: 'subscription', label: 'Abonnements', icon: '📺', color: 'bg-orange-100 text-orange-800' },
  { value: 'government', label: 'Services gouvernementaux', icon: '🏛️', color: 'bg-red-100 text-red-800' },
  { value: 'autre', label: 'Autre', icon: '🔗', color: 'bg-gray-100 text-gray-800' }
];

export const DigitalAccessForm: React.FC<DigitalAccessFormProps> = ({
  digitalAccess,
  onChange,
  className
}) => {
  const [editingAccess, setEditingAccess] = useState<DigitalAccess | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<DigitalAccess>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSensitiveInfo, setShowSensitiveInfo] = useState<Record<string, boolean>>({});

  const createEmptyAccess = (): Partial<DigitalAccess> => ({
    type: 'email',
    service: '',
    nomUtilisateur: '',
    siteWeb: '',
    gestionnaireMotDePasse: '',
    motDePassePrincipal: '',
    authentificationDeuxFacteurs: false,
    codesRecuperation: '',
    questionSecurite: '',
    reponseSecurite: '',
    notes: ''
  });

  const validateAccess = (access: Partial<DigitalAccess>): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!access.service?.trim()) newErrors.service = 'Le nom du service est requis';
    if (!access.nomUtilisateur?.trim()) newErrors.nomUtilisateur = 'Le nom d\'utilisateur est requis';
    
    // Validation de l'URL si fournie
    if (access.siteWeb && access.siteWeb.trim()) {
      try {
        new URL(access.siteWeb);
      } catch {
        newErrors.siteWeb = 'Format d\'URL invalide (ex: https://exemple.com)';
      }
    }

    return newErrors;
  };

  const handleStartAdd = () => {
    setFormData(createEmptyAccess());
    setIsAdding(true);
    setEditingAccess(null);
    setErrors({});
  };

  const handleStartEdit = (access: DigitalAccess) => {
    setFormData({ ...access });
    setEditingAccess(access);
    setIsAdding(false);
    setErrors({});
  };

  const handleSave = () => {
    const validationErrors = validateAccess(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const accessToSave: DigitalAccess = {
      id: editingAccess?.id || EmergencyPlanningService.generateId(),
      type: formData.type as DigitalAccess['type'],
      service: formData.service!,
      nomUtilisateur: formData.nomUtilisateur!,
      siteWeb: formData.siteWeb || undefined,
      gestionnaireMotDePasse: formData.gestionnaireMotDePasse || undefined,
      motDePassePrincipal: formData.motDePassePrincipal || undefined,
      authentificationDeuxFacteurs: formData.authentificationDeuxFacteurs || false,
      codesRecuperation: formData.codesRecuperation || undefined,
      questionSecurite: formData.questionSecurite || undefined,
      reponseSecurite: formData.reponseSecurite || undefined,
      notes: formData.notes || undefined
    };

    let updatedAccess;
    if (editingAccess) {
      updatedAccess = digitalAccess.map(a => a.id === editingAccess.id ? accessToSave : a);
    } else {
      updatedAccess = [...digitalAccess, accessToSave];
    }

    onChange(updatedAccess);
    handleCancel();
  };

  const handleCancel = () => {
    setFormData({});
    setEditingAccess(null);
    setIsAdding(false);
    setErrors({});
  };

  const handleDelete = (accessId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet accès numérique ?')) {
      onChange(digitalAccess.filter(a => a.id !== accessId));
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSensitiveInfo = (accessId: string) => {
    setShowSensitiveInfo(prev => ({
      ...prev,
      [accessId]: !prev[accessId]
    }));
  };

  const getAccessTypeInfo = (type: string) => {
    return accessTypeOptions.find(option => option.value === type) || accessTypeOptions[0];
  };

  const getAccessCountByType = () => {
    const counts = digitalAccess.reduce((acc, access) => {
      acc[access.type] = (acc[access.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  };

  const accessCounts = getAccessCountByType();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            Accès numériques et mots de passe
          </CardTitle>
          <CardDescription>
            Répertoriez vos comptes en ligne, mots de passe et informations d'accès numériques. 
            Ces informations sont cruciales pour que vos proches puissent gérer vos comptes en cas d'urgence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              {digitalAccess.length} accès numérique{digitalAccess.length !== 1 ? 's' : ''} répertorié{digitalAccess.length !== 1 ? 's' : ''}
              {digitalAccess.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(accessCounts).map(([type, count]) => {
                    const typeInfo = getAccessTypeInfo(type);
                    return (
                      <Badge key={type} variant="outline" className={typeInfo.color}>
                        {typeInfo.icon} {typeInfo.label}: {count}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
            <Button onClick={handleStartAdd} disabled={isAdding || editingAccess !== null}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un accès
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerte de sécurité */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Sécurité importante :</strong> Ces informations sont très sensibles. Assurez-vous de 
          conserver ce document dans un endroit sûr et de ne jamais le partager par courriel ou sur des 
          services en ligne. Considérez l'utilisation d'un gestionnaire de mots de passe professionnel.
        </AlertDescription>
      </Alert>

      {/* Formulaire d'ajout/édition */}
      <AnimatePresence>
        {(isAdding || editingAccess) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  {editingAccess ? 'Modifier l\'accès numérique' : 'Nouvel accès numérique'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type et service */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type d'accès *</Label>
                    <Select
                      value={formData.type || 'email'}
                      onValueChange={(value) => updateFormData('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {accessTypeOptions.map(option => (
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
                    <Label htmlFor="service">Nom du service *</Label>
                    <Input
                      id="service"
                      placeholder="ex: Gmail, Facebook, Institution financière"
                      value={formData.service || ''}
                      onChange={(e) => updateFormData('service', e.target.value)}
                      className={errors.service ? 'border-red-500' : ''}
                    />
                    {errors.service && <p className="text-sm text-red-500 mt-1">{errors.service}</p>}
                  </div>
                </div>

                {/* Informations de connexion */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nomUtilisateur">Nom d'utilisateur / Email *</Label>
                    <Input
                      id="nomUtilisateur"
                      placeholder="ex: utilisateur@exemple.com"
                      value={formData.nomUtilisateur || ''}
                      onChange={(e) => updateFormData('nomUtilisateur', e.target.value)}
                      className={errors.nomUtilisateur ? 'border-red-500' : ''}
                    />
                    {errors.nomUtilisateur && <p className="text-sm text-red-500 mt-1">{errors.nomUtilisateur}</p>}
                  </div>

                  <div>
                    <Label htmlFor="siteWeb">Site web</Label>
                    <Input
                      id="siteWeb"
                      placeholder="https://exemple.com"
                      value={formData.siteWeb || ''}
                      onChange={(e) => updateFormData('siteWeb', e.target.value)}
                      className={errors.siteWeb ? 'border-red-500' : ''}
                    />
                    {errors.siteWeb && <p className="text-sm text-red-500 mt-1">{errors.siteWeb}</p>}
                  </div>
                </div>

                {/* Gestionnaire de mots de passe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gestionnaireMotDePasse">Gestionnaire de mots de passe</Label>
                    <Input
                      id="gestionnaireMotDePasse"
                      placeholder="ex: 1Password, LastPass, Bitwarden"
                      value={formData.gestionnaireMotDePasse || ''}
                      onChange={(e) => updateFormData('gestionnaireMotDePasse', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="motDePassePrincipal">Mot de passe principal du gestionnaire</Label>
                    <Input
                      id="motDePassePrincipal"
                      type="password"
                      placeholder="Mot de passe maître"
                      value={formData.motDePassePrincipal || ''}
                      onChange={(e) => updateFormData('motDePassePrincipal', e.target.value)}
                    />
                  </div>
                </div>

                {/* Authentification à deux facteurs */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="authentificationDeuxFacteurs"
                      checked={formData.authentificationDeuxFacteurs || false}
                      onCheckedChange={(checked) => updateFormData('authentificationDeuxFacteurs', checked)}
                    />
                    <Label htmlFor="authentificationDeuxFacteurs">Authentification à deux facteurs activée</Label>
                  </div>

                  {formData.authentificationDeuxFacteurs && (
                    <div className="pl-6 space-y-4 border-l-2 border-green-200 bg-green-50 p-4 rounded">
                      <h4 className="font-semibold text-green-800">Informations d'authentification à deux facteurs</h4>
                      
                      <div>
                        <Label htmlFor="codesRecuperation">Codes de récupération</Label>
                        <Textarea
                          id="codesRecuperation"
                          placeholder="Codes de récupération de sauvegarde (un par ligne)"
                          value={formData.codesRecuperation || ''}
                          onChange={(e) => updateFormData('codesRecuperation', e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Questions de sécurité */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="questionSecurite">Question de sécurité</Label>
                    <Input
                      id="questionSecurite"
                      placeholder="ex: Nom de votre premier animal"
                      value={formData.questionSecurite || ''}
                      onChange={(e) => updateFormData('questionSecurite', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="reponseSecurite">Réponse de sécurité</Label>
                    <Input
                      id="reponseSecurite"
                      type="password"
                      placeholder="Réponse à la question de sécurité"
                      value={formData.reponseSecurite || ''}
                      onChange={(e) => updateFormData('reponseSecurite', e.target.value)}
                    />
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
                    {editingAccess ? 'Modifier' : 'Ajouter'}
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

      {/* Liste des accès */}
      <div className="space-y-3">
        <AnimatePresence>
          {digitalAccess.map((access) => {
            const typeInfo = getAccessTypeInfo(access.type);
            const showSensitive = showSensitiveInfo[access.id];
            
            return (
              <motion.div
                key={access.id}
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
                            <h3 className="font-semibold text-lg">{access.service}</h3>
                            <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            <span>Utilisateur: {access.nomUtilisateur}</span>
                          </div>
                          
                          {access.siteWeb && (
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              <a 
                                href={access.siteWeb} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {access.siteWeb}
                              </a>
                            </div>
                          )}
                          
                          {access.gestionnaireMotDePasse && (
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              <span>Gestionnaire: {access.gestionnaireMotDePasse}</span>
                            </div>
                          )}
                          
                          {access.authentificationDeuxFacteurs && (
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-green-600" />
                              <span className="text-green-600">Authentification 2FA activée</span>
                            </div>
                          )}
                          
                          {/* Informations sensibles (masquées par défaut) */}
                          {(access.motDePassePrincipal || access.questionSecurite || access.codesRecuperation) && (
                            <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-yellow-800 font-medium text-xs">Informations sensibles</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleSensitiveInfo(access.id)}
                                  className="h-6 px-2 text-yellow-700 hover:text-yellow-800"
                                >
                                  {showSensitive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                  {showSensitive ? 'Masquer' : 'Afficher'}
                                </Button>
                              </div>
                              
                              {showSensitive && (
                                <div className="space-y-1 text-xs">
                                  {access.motDePassePrincipal && (
                                    <div>Mot de passe principal: {access.motDePassePrincipal}</div>
                                  )}
                                  {access.questionSecurite && (
                                    <div>Question: {access.questionSecurite}</div>
                                  )}
                                  {access.reponseSecurite && (
                                    <div>Réponse: {access.reponseSecurite}</div>
                                  )}
                                  {access.codesRecuperation && (
                                    <div>Codes de récupération: {access.codesRecuperation}</div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {access.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                              {access.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartEdit(access)}
                          disabled={isAdding || editingAccess !== null}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(access.id)}
                          disabled={isAdding || editingAccess !== null}
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

      {/* Message si aucun accès */}
      {digitalAccess.length === 0 && !isAdding && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-12">
            <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucun accès numérique répertorié
            </h3>
            <p className="text-gray-500 mb-4">
              Ajoutez vos comptes en ligne et informations d'accès pour faciliter la gestion par vos proches.
            </p>
            <Button onClick={handleStartAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter votre premier accès
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
