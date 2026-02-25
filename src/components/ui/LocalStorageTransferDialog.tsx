/**
 * Composant UI pour le transfert des données localStorage vers fichier local
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Database, 
  FileDown, 
  Info, 
  AlertTriangle, 
  Check, 
  Trash2,
  Clock,
  FolderOpen
} from 'lucide-react';
import { LocalStorageTransferService } from '@/services/LocalStorageTransferService';
import { useToast } from '@/hooks/use-toast';

interface LocalStorageTransferDialogProps {
  onTransferComplete?: () => void;
}

const LocalStorageTransferDialog: React.FC<LocalStorageTransferDialogProps> = ({
  onTransferComplete
}) => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customFilename, setCustomFilename] = useState('');
  const [description, setDescription] = useState('');
  const [dataPreview, setDataPreview] = useState<any>(null);
  const [lastSaveInfo, setLastSaveInfo] = useState<any>(null);

  // Charger la prévisualisation des données au montage
  useEffect(() => {
    if (dialogOpen) {
      const preview = LocalStorageTransferService.previewTransferData();
      const lastSave = LocalStorageTransferService.getLastSaveInfo();
      setDataPreview(preview);
      setLastSaveInfo(lastSave);

      // Générer une description par défaut
      if (!description) {
        const now = new Date();
        const dateStr = now.toLocaleDateString('fr-CA');
        const timeStr = now.toLocaleTimeString('fr-CA', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        setDescription(`Sauvegarde complète du ${dateStr} à ${timeStr}`);
      }
    }
  }, [dialogOpen]);

  const handleTransfer = async () => {
    if (!dataPreview?.hasData) {
      toast({
        title: "Aucune donnée à sauvegarder",
        description: "Il n'y a aucune donnée dans le localStorage à transférer.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await LocalStorageTransferService.transferToLocalFile({
        suggestedFilename: customFilename || undefined,
        description: description || undefined,
        preserveLastSaveInfo: true
      });

      if (result.success) {
        toast({
          title: "✅ Transfert réussi !",
          description: `Données sauvegardées dans ${result.filename} (${result.dataSize})`,
          variant: "default"
        });

        // Fermer le dialogue et notifier le parent
        setDialogOpen(false);
        onTransferComplete?.();
        
        // Réinitialiser les champs
        setCustomFilename('');
        setDescription('');
      } else if (result.cancelled) {
        toast({
          title: "Transfert annulé",
          description: "La sauvegarde a été annulée par l'utilisateur.",
          variant: "default"
        });
      } else {
        toast({
          title: "Erreur de transfert",
          description: result.error || "Une erreur inconnue s'est produite",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur de transfert",
        description: `Erreur : ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatLastSaveDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('fr-CA');
    } catch {
      return timestamp;
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="senior-btn">
          <Download className="mr-2 h-4 w-4" />
          Sauvegarder les données locales
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Database className="h-6 w-6 text-mpr-interactive" />
            Transfert vers fichier local
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations sur la dernière sauvegarde */}
          {lastSaveInfo && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm text-green-800">
                  <Clock className="h-4 w-4" />
                  Dernière sauvegarde
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1 text-sm text-green-700">
                  <div><strong>Fichier :</strong> {lastSaveInfo.filename}</div>
                  <div><strong>Emplacement :</strong> {lastSaveInfo.location}</div>
                  <div><strong>Date :</strong> {formatLastSaveDate(lastSaveInfo.timestamp)}</div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prévisualisation des données */}
          {dataPreview && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-mpr-interactive" />
                    Données à transférer
                  </div>
                  <Badge variant={dataPreview.hasData ? "default" : "secondary"}>
                    {dataPreview.estimatedSize}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dataPreview.hasData ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-mpr-navy mb-1">
                          Données sécurisées ({dataPreview.secureKeys.length})
                        </div>
                        <div className="space-y-1">
                          {dataPreview.secureKeys.slice(0, 5).map((key, index) => (
                            <div key={index} className="text-gray-600 text-xs">
                              🔐 {key}
                            </div>
                          ))}
                          {dataPreview.secureKeys.length > 5 && (
                            <div className="text-gray-500 text-xs">
                              ... et {dataPreview.secureKeys.length - 5} autres
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-green-700 mb-1">
                          Données régulières ({dataPreview.regularKeys.length})
                        </div>
                        <div className="space-y-1">
                          {dataPreview.regularKeys.slice(0, 5).map((key, index) => (
                            <div key={index} className="text-gray-600 text-xs">
                              📄 {key}
                            </div>
                          ))}
                          {dataPreview.regularKeys.length > 5 && (
                            <div className="text-gray-500 text-xs">
                              ... et {dataPreview.regularKeys.length - 5} autres
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                          <strong>Important :</strong> Après la sauvegarde, toutes ces données seront 
                          supprimées du navigateur. Assurez-vous que la sauvegarde est réussie avant de continuer.
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Aucune donnée trouvée dans le localStorage</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Configuration de la sauvegarde */}
          {dataPreview?.hasData && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="custom-filename" className="text-base font-medium">
                  Nom du fichier (optionnel)
                </Label>
                <Input
                  id="custom-filename"
                  type="text"
                  value={customFilename}
                  onChange={(e) => setCustomFilename(e.target.value)}
                  placeholder="plan-retraite-2025-01-27-14h30.json"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Laissez vide pour utiliser un nom généré automatiquement
                </p>
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-medium">
                  Description de la sauvegarde
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description de cette sauvegarde..."
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4 border-t">
            {dataPreview?.hasData ? (
              <Button 
                onClick={handleTransfer} 
                disabled={isLoading}
                className="flex-1 senior-btn senior-btn-primary"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sauvegarde en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FileDown className="h-4 w-4" />
                    Transférer vers fichier
                  </div>
                )}
              </Button>
            ) : (
              <div className="flex-1 text-center text-gray-500 py-2">
                Aucune donnée à sauvegarder
              </div>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              className="senior-btn"
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocalStorageTransferDialog;