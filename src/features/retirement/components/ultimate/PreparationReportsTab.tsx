// Onglet des rapports de préparation - Plan Ultimate
// Gestion des rapports pour notaires, avocats, conseillers et assureurs
// Respectant la typographie québécoise et les limites professionnelles

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Share2, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  User,
  Building,
  Shield,
  CreditCard,
  Calendar,
  FileCheck,
  Users,
  Home,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UltimatePlanningService } from '../../services/UltimatePlanningService';
import { UltimatePlanningData, PreparationReport } from '../../types/ultimate-planning';
import { EmergencyInfoData } from '../../types/emergency-info';
import { useToast } from '@/hooks/use-toast';

interface PreparationReportsTabProps {
  data: UltimatePlanningData;
  emergencyData: EmergencyInfoData;
  onUpdate: (data: UltimatePlanningData) => void;
}

export const PreparationReportsTab: React.FC<PreparationReportsTabProps> = ({ 
  data, 
  emergencyData, 
  onUpdate 
}) => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<PreparationReport | null>(null);
  const [newReportType, setNewReportType] = useState<'notaire' | 'avocat' | 'conseiller' | 'assureur'>('notaire');
  const [newReportTitle, setNewReportTitle] = useState('');

  const handleCreateReport = () => {
    if (!newReportTitle.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez saisir un titre pour le rapport',
        variant: 'destructive'
      });
      return;
    }

    try {
      const newReport = UltimatePlanningService.createPreparationReport(newReportType, emergencyData);
      newReport.title = newReportTitle;
      
      const updatedData = { ...data };
      updatedData.preparationReports.push(newReport);
      
      onUpdate(updatedData);
      
      setShowCreateDialog(false);
      setNewReportTitle('');
      setNewReportType('notaire');
      
      toast({
        title: 'Succès',
        description: 'Rapport de préparation créé avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création du rapport',
        variant: 'destructive'
      });
    }
  };

  const handleViewReport = (report: PreparationReport) => {
    setSelectedReport(report);
    setShowViewDialog(true);
  };

  const handleEditReport = (report: PreparationReport) => {
    // Logique d'édition à implémenter
    toast({
      title: 'Info',
      description: 'Fonctionnalité d\'édition en cours de développement',
    });
  };

  const handleDeleteReport = (reportId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ? Cette action est irréversible.')) {
      try {
        const updatedData = { ...data };
        updatedData.preparationReports = updatedData.preparationReports.filter(r => r.id !== reportId);
        onUpdate(updatedData);
        
        toast({
          title: 'Succès',
          description: 'Rapport supprimé avec succès',
        });
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Erreur lors de la suppression',
          variant: 'destructive'
        });
      }
    }
  };

  const handleFinalizeReport = (reportId: string) => {
    try {
      const updatedData = { ...data };
      const reportIndex = updatedData.preparationReports.findIndex(r => r.id === reportId);
      if (reportIndex !== -1) {
        updatedData.preparationReports[reportIndex].status = 'finalisé';
        onUpdate(updatedData);
        
        toast({
          title: 'Succès',
          description: 'Rapport finalisé avec succès',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la finalisation',
        variant: 'destructive'
      });
    }
  };

  const handleShareReport = (reportId: string) => {
    try {
      const updatedData = { ...data };
      const reportIndex = updatedData.preparationReports.findIndex(r => r.id === reportId);
      if (reportIndex !== -1) {
        updatedData.preparationReports[reportIndex].status = 'partagé';
        onUpdate(updatedData);
        
        toast({
          title: 'Succès',
          description: 'Rapport partagé avec succès',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du partage',
        variant: 'destructive'
      });
    }
  };

  const handleExportReport = (report: PreparationReport) => {
    try {
      // Générer le rapport en format PDF ou Word
      const reportContent = generateReportContent(report);
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export réussi',
        description: 'Rapport exporté avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'export',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'brouillon':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Brouillon</Badge>;
      case 'finalisé':
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Finalisé</Badge>;
      case 'partagé':
        return <Badge variant="outline" className="flex items-center gap-1"><Share2 className="h-3 w-3" /> Partagé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'notaire':
        return <Building className="h-5 w-5" />;
      case 'avocat':
        return <Shield className="h-5 w-5" />;
      case 'conseiller':
        return <CreditCard className="h-5 w-5" />;
      case 'assureur':
        return <Heart className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'notaire':
        return 'Notaire';
      case 'avocat':
        return 'Avocat';
      case 'conseiller':
        return 'Conseiller financier';
      case 'assureur':
        return 'Conseiller en assurance';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Rapports de préparation
              </CardTitle>
              <CardDescription>
                Créez et gérez des rapports professionnels pour vos consultations
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouveau rapport
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-mpr-interactive-lt rounded-lg">
              <div className="text-2xl font-bold text-mpr-navy">{data.preparationReports.length}</div>
              <div className="text-sm text-mpr-navy">Total des rapports</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">
                {data.preparationReports.filter(r => r.status === 'finalisé').length}
              </div>
              <div className="text-sm text-green-700">Finalisés</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">
                {data.preparationReports.filter(r => r.status === 'partagé').length}
              </div>
              <div className="text-sm text-purple-700">Partagés</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-900">
                {data.preparationReports.filter(r => r.status === 'brouillon').length}
              </div>
              <div className="text-sm text-orange-700">En brouillon</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des rapports */}
      {data.preparationReports.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun rapport créé</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par créer votre premier rapport de préparation pour optimiser vos consultations
            </p>
            <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Créer un rapport
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data.preparationReports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getTypeIcon(report.type)}
                        <div>
                          <h3 className="text-lg font-semibold">{report.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Type : {getTypeLabel(report.type)}</span>
                            <span>•</span>
                            <span>Créé le {new Date(report.createdAt).toLocaleDateString('fr-CA')}</span>
                            <span>•</span>
                            <span>Modifié le {new Date(report.lastModified).toLocaleDateString('fr-CA')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {getStatusBadge(report.status)}
                        <Badge variant="outline" className="text-xs">
                          {report.verificationChecklist.length} points à vérifier
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {report.preparedQuestions.length} questions préparées
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {report.requiredDocuments.length} documents requis
                        </Badge>
                      </div>

                      {report.notes && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {report.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReport(report)}
                        title="Voir le rapport"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditReport(report)}
                        title="Modifier le rapport"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportReport(report)}
                        title="Exporter le rapport"
                      >
                        <Download className="h-4 w-4" />
                      </Button>

                      {report.status === 'brouillon' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFinalizeReport(report.id)}
                          title="Finaliser le rapport"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}

                      {report.status === 'finalisé' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareReport(report.id)}
                          title="Partager le rapport"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteReport(report.id)}
                        title="Supprimer le rapport"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Dialog de création de rapport */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Créer un nouveau rapport</DialogTitle>
            <DialogDescription>
              Créez un rapport de préparation pour optimiser vos consultations professionnelles
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="report-type">Type de professionnel</Label>
              <Select value={newReportType} onValueChange={(value: any) => setNewReportType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notaire">Notaire</SelectItem>
                  <SelectItem value="avocat">Avocat</SelectItem>
                  <SelectItem value="conseiller">Conseiller financier</SelectItem>
                  <SelectItem value="assureur">Conseiller en assurance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="report-title">Titre du rapport</Label>
              <Input
                id="report-title"
                value={newReportTitle}
                onChange={(e) => setNewReportTitle(e.target.value)}
                placeholder="Ex: Consultation planification successorale"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateReport}>
                Créer le rapport
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de visualisation du rapport */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedReport && getTypeIcon(selectedReport.type)}
              {selectedReport?.title}
            </DialogTitle>
            <DialogDescription>
              Rapport de préparation pour {selectedReport && getTypeLabel(selectedReport.type)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6">
              {/* Résumé exécutif */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Résumé exécutif</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.content.executiveSummary}
                  </p>
                </CardContent>
              </Card>

              {/* Checklist de vérification */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Points à vérifier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedReport.verificationChecklist.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{item.description}</span>
                            <Badge variant={item.importance === 'critique' ? 'destructive' : 'outline'}>
                              {item.importance}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.notes}</p>
                        </div>
                        <Badge variant="outline">{item.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Questions préparées */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Questions préparées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedReport.preparedQuestions.map((question) => (
                      <div key={question.id} className="p-3 border rounded-lg">
                        <div className="font-medium mb-2">{question.question}</div>
                        <div className="text-sm text-muted-foreground mb-2">
                          <strong>Contexte :</strong> {question.context}
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          <strong>Réponse attendue :</strong> {question.expectedAnswer}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{question.importance}</Badge>
                          {question.notes && (
                            <span className="text-sm text-muted-foreground">{question.notes}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Documents requis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documents à apporter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedReport.requiredDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-sm text-muted-foreground">{doc.description}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{doc.type}</Badge>
                            <Badge variant="outline">{doc.category}</Badge>
                            {doc.isRequired && (
                              <Badge variant="destructive">Requis</Badge>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline">{doc.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Fonction utilitaire pour générer le contenu du rapport
function generateReportContent(report: PreparationReport): string {
  let content = `RAPPORT DE PRÉPARATION\n`;
  content += `========================\n\n`;
  content += `Titre : ${report.title}\n`;
  content += `Type : ${report.type}\n`;
  content += `Date de création : ${new Date(report.createdAt).toLocaleDateString('fr-CA')}\n`;
  content += `Statut : ${report.status}\n\n`;
  
  content += `RÉSUMÉ EXÉCUTIF\n`;
  content += `----------------\n`;
  content += `${report.content.executiveSummary}\n\n`;
  
  content += `POINTS À VÉRIFIER\n`;
  content += `------------------\n`;
  report.verificationChecklist.forEach((item, index) => {
    content += `${index + 1}. ${item.description} (${item.importance})\n`;
    content += `   Notes : ${item.notes}\n`;
    content += `   Statut : ${item.status}\n\n`;
  });
  
  content += `QUESTIONS PRÉPARÉES\n`;
  content += `--------------------\n`;
  report.preparedQuestions.forEach((question, index) => {
    content += `${index + 1}. ${question.question}\n`;
    content += `   Contexte : ${question.context}\n`;
    content += `   Réponse attendue : ${question.expectedAnswer}\n\n`;
  });
  
  content += `DOCUMENTS REQUIS\n`;
  content += `----------------\n`;
  report.requiredDocuments.forEach((doc, index) => {
    content += `${index + 1}. ${doc.name} (${doc.type})\n`;
    content += `   Description : ${doc.description}\n`;
    content += `   Statut : ${doc.status}\n\n`;
  });
  
  return content;
}
