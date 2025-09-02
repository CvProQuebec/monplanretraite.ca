import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Alert, AlertDescription } from './alert';
import { IndividualSaveManager, SaveProfileType } from '../../services/IndividualSaveManager';
import { Download, Users, User, UserCheck, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface IndividualSaveDialogProps {
  userData: any;
  isOpen: boolean;
  onClose: () => void;
  onSaveComplete?: (results: any) => void;
}

export function IndividualSaveDialog({
  userData,
  isOpen,
  onClose,
  onSaveComplete
}: IndividualSaveDialogProps) {
  const [selectedProfiles, setSelectedProfiles] = useState<Set<SaveProfileType>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [saveResults, setSaveResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Obtenir les profils disponibles
  const availableProfiles = IndividualSaveManager.getAvailableProfiles(userData);

  const handleProfileToggle = (profileType: SaveProfileType) => {
    const newSelected = new Set(selectedProfiles);
    if (newSelected.has(profileType)) {
      newSelected.delete(profileType);
    } else {
      newSelected.add(profileType);
    }
    setSelectedProfiles(newSelected);
  };

  const handleSaveSelected = async () => {
    if (selectedProfiles.size === 0) return;

    setIsSaving(true);
    setError(null);
    setSaveResults([]);

    const results: any[] = [];

    try {
      for (const profileType of selectedProfiles) {
        const result = await IndividualSaveManager.saveIndividualProfileDirect(userData, {
          profileType,
          includeTimestamp: true
        });
        results.push(result);
      }

      setSaveResults(results);

      if (onSaveComplete) {
        onSaveComplete(results);
      }

      // Fermer automatiquement après 3 secondes si tout est réussi
      const allSuccessful = results.every(r => r.success);
      if (allSuccessful) {
        setTimeout(() => {
          onClose();
          setSaveResults([]);
          setSelectedProfiles(new Set());
        }, 3000);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setError(null);
    setSaveResults([]);

    try {
      const { results, summary } = await IndividualSaveManager.saveAllAvailableProfiles(userData);
      setSaveResults(results);

      if (onSaveComplete) {
        onSaveComplete({ results, summary });
      }

      // Fermer automatiquement après 3 secondes si tout est réussi
      if (summary.successful === summary.total) {
        setTimeout(() => {
          onClose();
          setSaveResults([]);
          setSelectedProfiles(new Set());
        }, 3000);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const getProfileIcon = (profileType: SaveProfileType) => {
    switch (profileType) {
      case 'person1': return <User className="w-5 h-5" />;
      case 'person2': return <UserCheck className="w-5 h-5" />;
      case 'couple': return <Users className="w-5 h-5" />;
    }
  };

  const getProfileDescription = (profileType: SaveProfileType) => {
    switch (profileType) {
      case 'person1': return 'Données individuelles de la personne 1';
      case 'person2': return 'Données individuelles de la personne 2';
      case 'couple': return 'Toutes les données du couple';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-6 h-6" />
            Sauvegarde Individuelle des Profils
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Choisissez les profils à sauvegarder</h3>
            <p className="text-blue-800 text-sm">
              Vous pouvez sauvegarder les données de chaque personne individuellement ou
              toutes les données du couple. Les fichiers seront nommés automatiquement.
            </p>
          </div>

          {/* Profils disponibles */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Profils disponibles :</h4>

            {Object.entries(availableProfiles).map(([profileType, info]) => {
              const type = profileType as SaveProfileType;
              const isSelected = selectedProfiles.has(type);
              const canSave = IndividualSaveManager.canSaveProfile(userData, type);

              return (
                <div
                  key={type}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!info.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => info.available && handleProfileToggle(type)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {getProfileIcon(type)}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">
                          {info.name || `Profil ${type}`}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {getProfileDescription(type)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {info.available ? (
                        <Badge variant={isSelected ? "default" : "secondary"}>
                          {isSelected ? "Sélectionné" : "Disponible"}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Non disponible</Badge>
                      )}

                      {isSelected && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleSaveSelected}
              disabled={selectedProfiles.size === 0 || isSaving}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sauvegarde en cours...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Sauvegarder la sélection ({selectedProfiles.size})
                </>
              )}
            </Button>

            <Button
              onClick={handleSaveAll}
              disabled={isSaving}
              variant="outline"
              className="flex-1"
            >
              <Users className="w-4 h-4 mr-2" />
              Tout sauvegarder
            </Button>

            <Button
              onClick={onClose}
              disabled={isSaving}
              variant="ghost"
            >
              Annuler
            </Button>
          </div>

          {/* Résultats de sauvegarde */}
          {saveResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Résultats de sauvegarde :</h4>
              {saveResults.map((result, index) => (
                <Alert key={index} className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                      <strong>{result.profileType}:</strong> {result.success
                        ? `Sauvegardé (${result.filename})`
                        : `Échec: ${result.error}`
                      }
                    </AlertDescription>
                  </div>
                </Alert>
              ))}
            </div>
          )}

          {/* Erreur générale */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Erreur:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Informations supplémentaires */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <p><strong>Format:</strong> JSON avec métadonnées complètes</p>
            <p><strong>Nom de fichier:</strong> mon-plan-retraite-[profil]-[date].json</p>
            <p><strong>Protection:</strong> Vérification de licence automatique</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook pour utiliser le dialogue
export function useIndividualSaveDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return {
    isOpen,
    openDialog,
    closeDialog
  };
}
