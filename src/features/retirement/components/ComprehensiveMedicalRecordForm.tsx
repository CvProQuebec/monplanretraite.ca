// src/features/retirement/components/ComprehensiveMedicalRecordForm.tsx
// Formulaire pour le dossier médical complet

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Heart, 
  Plus, 
  Trash2, 
  Edit,
  Calendar,
  User,
  Activity,
  FileText,
  TestTube,
  Stethoscope,
  Pill,
  Shield,
  Info,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MedicalCondition {
  id: string;
  name: string;
  diagnosisDate?: Date;
  severity: 'mild' | 'moderate' | 'severe';
  status: 'active' | 'resolved' | 'chronic';
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate?: Date;
  endDate?: Date;
  purpose: string;
  sideEffects?: string;
  notes?: string;
}

export interface Surgery {
  id: string;
  procedure: string;
  date: Date;
  surgeon: string;
  hospital: string;
  complications?: string;
  notes?: string;
}

export interface Vaccination {
  id: string;
  vaccine: string;
  date: Date;
  boosterDate?: Date;
  provider: string;
  lotNumber?: string;
  notes?: string;
}

export interface LabResult {
  id: string;
  testName: string;
  date: Date;
  result: string;
  referenceRange: string;
  unit: string;
  status: 'normal' | 'abnormal' | 'critical';
  orderedBy: string;
  notes?: string;
}

export interface FamilyMedicalHistory {
  id: string;
  relation: 'father' | 'mother' | 'sibling' | 'grandparent' | 'other';
  name?: string;
  conditions: string[];
  ageAtDeath?: number;
  causeOfDeath?: string;
  notes?: string;
}

export interface ComprehensiveMedicalRecord {
  // Informations de base
  personalInfo: {
    height: string;
    weight: string;
    bloodType?: string;
    allergies: string[];
    emergencyContact: {
      name: string;
      phone: string;
      relation: string;
    };
  };

  // Conditions médicales
  currentConditions: MedicalCondition[];
  medicalHistory: MedicalCondition[];

  // Médicaments
  currentMedications: Medication[];
  pastMedications: Medication[];

  // Chirurgies et procédures
  surgeries: Surgery[];

  // Vaccinations
  vaccinations: Vaccination[];

  // Résultats de laboratoire
  labResults: LabResult[];

  // Antécédents familiaux
  familyHistory: FamilyMedicalHistory[];

  // Professionnels de la santé
  healthcareProviders: {
    primaryCare?: {
      name: string;
      phone: string;
      address?: string;
    };
    specialists: {
      name: string;
      specialty: string;
      phone: string;
      address?: string;
    }[];
    pharmacy?: {
      name: string;
      phone: string;
      address?: string;
    };
  };

  // Notes et observations
  notes: string;
  lastUpdated: Date;
}

interface ComprehensiveMedicalRecordFormProps {
  medicalRecord: ComprehensiveMedicalRecord;
  onChange: (record: ComprehensiveMedicalRecord) => void;
}

export const ComprehensiveMedicalRecordForm: React.FC<ComprehensiveMedicalRecordFormProps> = ({
  medicalRecord,
  onChange
}) => {
  const [activeTab, setActiveTab] = useState('personal');

  const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const updateRecord = (updates: Partial<ComprehensiveMedicalRecord>) => {
    onChange({
      ...medicalRecord,
      ...updates,
      lastUpdated: new Date()
    });
  };

  const addCondition = (type: 'current' | 'history') => {
    const newCondition: MedicalCondition = {
      id: generateId(),
      name: '',
      severity: 'mild',
      status: type === 'current' ? 'active' : 'resolved'
    };

    const key = type === 'current' ? 'currentConditions' : 'medicalHistory';
    updateRecord({
      [key]: [...medicalRecord[key], newCondition]
    });
  };

  const updateCondition = (id: string, updates: Partial<MedicalCondition>, type: 'current' | 'history') => {
    const key = type === 'current' ? 'currentConditions' : 'medicalHistory';
    const updatedConditions = medicalRecord[key].map(condition =>
      condition.id === id ? { ...condition, ...updates } : condition
    );
    updateRecord({ [key]: updatedConditions });
  };

  const deleteCondition = (id: string, type: 'current' | 'history') => {
    const key = type === 'current' ? 'currentConditions' : 'medicalHistory';
    const filteredConditions = medicalRecord[key].filter(condition => condition.id !== id);
    updateRecord({ [key]: filteredConditions });
  };

  const addMedication = (type: 'current' | 'past') => {
    const newMedication: Medication = {
      id: generateId(),
      name: '',
      dosage: '',
      frequency: '',
      prescribedBy: '',
      purpose: ''
    };

    const key = type === 'current' ? 'currentMedications' : 'pastMedications';
    updateRecord({
      [key]: [...medicalRecord[key], newMedication]
    });
  };

  const updateMedication = (id: string, updates: Partial<Medication>, type: 'current' | 'past') => {
    const key = type === 'current' ? 'currentMedications' : 'pastMedications';
    const updatedMedications = medicalRecord[key].map(medication =>
      medication.id === id ? { ...medication, ...updates } : medication
    );
    updateRecord({ [key]: updatedMedications });
  };

  const deleteMedication = (id: string, type: 'current' | 'past') => {
    const key = type === 'current' ? 'currentMedications' : 'pastMedications';
    const filteredMedications = medicalRecord[key].filter(medication => medication.id !== id);
    updateRecord({ [key]: filteredMedications });
  };

  const addSurgery = () => {
    const newSurgery: Surgery = {
      id: generateId(),
      procedure: '',
      date: new Date(),
      surgeon: '',
      hospital: ''
    };

    updateRecord({
      surgeries: [...medicalRecord.surgeries, newSurgery]
    });
  };

  const updateSurgery = (id: string, updates: Partial<Surgery>) => {
    const updatedSurgeries = medicalRecord.surgeries.map(surgery =>
      surgery.id === id ? { ...surgery, ...updates } : surgery
    );
    updateRecord({ surgeries: updatedSurgeries });
  };

  const deleteSurgery = (id: string) => {
    const filteredSurgeries = medicalRecord.surgeries.filter(surgery => surgery.id !== id);
    updateRecord({ surgeries: filteredSurgeries });
  };

  const addVaccination = () => {
    const newVaccination: Vaccination = {
      id: generateId(),
      vaccine: '',
      date: new Date(),
      provider: ''
    };

    updateRecord({
      vaccinations: [...medicalRecord.vaccinations, newVaccination]
    });
  };

  const updateVaccination = (id: string, updates: Partial<Vaccination>) => {
    const updatedVaccinations = medicalRecord.vaccinations.map(vaccination =>
      vaccination.id === id ? { ...vaccination, ...updates } : vaccination
    );
    updateRecord({ vaccinations: updatedVaccinations });
  };

  const deleteVaccination = (id: string) => {
    const filteredVaccinations = medicalRecord.vaccinations.filter(vaccination => vaccination.id !== id);
    updateRecord({ vaccinations: filteredVaccinations });
  };

  const addLabResult = () => {
    const newLabResult: LabResult = {
      id: generateId(),
      testName: '',
      date: new Date(),
      result: '',
      referenceRange: '',
      unit: '',
      status: 'normal',
      orderedBy: ''
    };

    updateRecord({
      labResults: [...medicalRecord.labResults, newLabResult]
    });
  };

  const updateLabResult = (id: string, updates: Partial<LabResult>) => {
    const updatedLabResults = medicalRecord.labResults.map(result =>
      result.id === id ? { ...result, ...updates } : result
    );
    updateRecord({ labResults: updatedLabResults });
  };

  const deleteLabResult = (id: string) => {
    const filteredLabResults = medicalRecord.labResults.filter(result => result.id !== id);
    updateRecord({ labResults: filteredLabResults });
  };

  const addFamilyHistory = () => {
    const newFamilyHistory: FamilyMedicalHistory = {
      id: generateId(),
      relation: 'other',
      conditions: []
    };

    updateRecord({
      familyHistory: [...medicalRecord.familyHistory, newFamilyHistory]
    });
  };

  const updateFamilyHistory = (id: string, updates: Partial<FamilyMedicalHistory>) => {
    const updatedFamilyHistory = medicalRecord.familyHistory.map(history =>
      history.id === id ? { ...history, ...updates } : history
    );
    updateRecord({ familyHistory: updatedFamilyHistory });
  };

  const deleteFamilyHistory = (id: string) => {
    const filteredFamilyHistory = medicalRecord.familyHistory.filter(history => history.id !== id);
    updateRecord({ familyHistory: filteredFamilyHistory });
  };

  const getSeverityColor = (severity: MedicalCondition['severity']) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'severe': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: LabResult['status']) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'abnormal': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-blue-900">Dossier médical complet</CardTitle>
              <CardDescription className="text-blue-700">
                Centralisez toutes vos informations médicales importantes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="space-y-2">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="personal" className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Personnel</span>
            </TabsTrigger>
            <TabsTrigger value="conditions" className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Conditions</span>
            </TabsTrigger>
            <TabsTrigger value="medications" className="flex items-center gap-1">
              <Pill className="w-4 h-4" />
              <span className="hidden sm:inline">Médicaments</span>
            </TabsTrigger>
            <TabsTrigger value="procedures" className="flex items-center gap-1">
              <Stethoscope className="w-4 h-4" />
              <span className="hidden sm:inline">Procédures</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="vaccinations" className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Vaccins</span>
            </TabsTrigger>
            <TabsTrigger value="lab-results" className="flex items-center gap-1">
              <TestTube className="w-4 h-4" />
              <span className="hidden sm:inline">Analyses</span>
            </TabsTrigger>
            <TabsTrigger value="family" className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Famille</span>
            </TabsTrigger>
            <TabsTrigger value="providers" className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Professionnels</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Informations personnelles */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="height">Taille</Label>
                  <Input
                    id="height"
                    value={medicalRecord.personalInfo.height}
                    onChange={(e) => updateRecord({
                      personalInfo: { ...medicalRecord.personalInfo, height: e.target.value }
                    })}
                    placeholder="Ex: 175 cm"
                  />
                </div>
                
                <div>
                  <Label htmlFor="weight">Poids</Label>
                  <Input
                    id="weight"
                    value={medicalRecord.personalInfo.weight}
                    onChange={(e) => updateRecord({
                      personalInfo: { ...medicalRecord.personalInfo, weight: e.target.value }
                    })}
                    placeholder="Ex: 70 kg"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bloodType">Groupe sanguin</Label>
                  <Select
                    value={medicalRecord.personalInfo.bloodType || ''}
                    onValueChange={(value) => updateRecord({
                      personalInfo: { ...medicalRecord.personalInfo, bloodType: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="allergies">Allergies connues</Label>
                <Textarea
                  id="allergies"
                  value={medicalRecord.personalInfo.allergies.join(', ')}
                  onChange={(e) => updateRecord({
                    personalInfo: { 
                      ...medicalRecord.personalInfo, 
                      allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                    }
                  })}
                  placeholder="Séparez les allergies par des virgules"
                  rows={2}
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Contact d'urgence</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="emergencyName">Nom</Label>
                    <Input
                      id="emergencyName"
                      value={medicalRecord.personalInfo.emergencyContact.name}
                      onChange={(e) => updateRecord({
                        personalInfo: {
                          ...medicalRecord.personalInfo,
                          emergencyContact: {
                            ...medicalRecord.personalInfo.emergencyContact,
                            name: e.target.value
                          }
                        }
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emergencyPhone">Téléphone</Label>
                    <Input
                      id="emergencyPhone"
                      value={medicalRecord.personalInfo.emergencyContact.phone}
                      onChange={(e) => updateRecord({
                        personalInfo: {
                          ...medicalRecord.personalInfo,
                          emergencyContact: {
                            ...medicalRecord.personalInfo.emergencyContact,
                            phone: e.target.value
                          }
                        }
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emergencyRelation">Relation</Label>
                    <Input
                      id="emergencyRelation"
                      value={medicalRecord.personalInfo.emergencyContact.relation}
                      onChange={(e) => updateRecord({
                        personalInfo: {
                          ...medicalRecord.personalInfo,
                          emergencyContact: {
                            ...medicalRecord.personalInfo.emergencyContact,
                            relation: e.target.value
                          }
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conditions médicales */}
        <TabsContent value="conditions">
          <div className="space-y-6">
            {/* Conditions actuelles */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Conditions médicales actuelles</CardTitle>
                  <Button onClick={() => addCondition('current')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicalRecord.currentConditions.map((condition) => (
                    <div key={condition.id} className="border rounded-lg p-4">
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <Label>Condition</Label>
                          <Input
                            value={condition.name}
                            onChange={(e) => updateCondition(condition.id, { name: e.target.value }, 'current')}
                            placeholder="Nom de la condition"
                          />
                        </div>
                        
                        <div>
                          <Label>Sévérité</Label>
                          <Select
                            value={condition.severity}
                            onValueChange={(value: MedicalCondition['severity']) => 
                              updateCondition(condition.id, { severity: value }, 'current')
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mild">Légère</SelectItem>
                              <SelectItem value="moderate">Modérée</SelectItem>
                              <SelectItem value="severe">Sévère</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Statut</Label>
                          <Select
                            value={condition.status}
                            onValueChange={(value: MedicalCondition['status']) => 
                              updateCondition(condition.id, { status: value }, 'current')
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="chronic">Chronique</SelectItem>
                              <SelectItem value="resolved">Résolue</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-end">
                          <Button
                            onClick={() => deleteCondition(condition.id, 'current')}
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <Label>Notes</Label>
                        <Textarea
                          value={condition.notes || ''}
                          onChange={(e) => updateCondition(condition.id, { notes: e.target.value }, 'current')}
                          placeholder="Notes additionnelles..."
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Historique médical */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Historique médical</CardTitle>
                  <Button onClick={() => addCondition('history')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicalRecord.medicalHistory.map((condition) => (
                    <div key={condition.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <Label>Condition</Label>
                          <Input
                            value={condition.name}
                            onChange={(e) => updateCondition(condition.id, { name: e.target.value }, 'history')}
                            placeholder="Nom de la condition"
                          />
                        </div>
                        
                        <div>
                          <Label>Date de diagnostic</Label>
                          <Input
                            type="date"
                            value={condition.diagnosisDate ? condition.diagnosisDate.toISOString().split('T')[0] : ''}
                            onChange={(e) => updateCondition(condition.id, { 
                              diagnosisDate: e.target.value ? new Date(e.target.value) : undefined 
                            }, 'history')}
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(condition.severity)}>
                            {condition.severity === 'mild' ? 'Légère' : 
                             condition.severity === 'moderate' ? 'Modérée' : 'Sévère'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-end">
                          <Button
                            onClick={() => deleteCondition(condition.id, 'history')}
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Autres onglets à implémenter... */}
        <TabsContent value="medications">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Section des médicaments en cours de développement...
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="procedures">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Section des procédures en cours de développement...
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="vaccinations">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Section des vaccinations en cours de développement...
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="lab-results">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Section des analyses de laboratoire en cours de développement...
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="family">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Section des antécédents familiaux en cours de développement...
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="providers">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Section des professionnels de la santé en cours de développement...
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Notes générales */}
      <Card>
        <CardHeader>
          <CardTitle>Notes et observations générales</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={medicalRecord.notes}
            onChange={(e) => updateRecord({ notes: e.target.value })}
            placeholder="Ajoutez des notes importantes sur votre santé, observations, questions pour le médecin..."
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );
};
