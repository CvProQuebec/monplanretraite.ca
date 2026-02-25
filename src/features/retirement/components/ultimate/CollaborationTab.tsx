// Onglet de collaboration - Plan Ultimate
// Gestion des accès partagés, workflow collaboratif et notifications
// Respectant la typographie québécoise et les limites professionnelles

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Share2, 
  Bell,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Mail,
  Smartphone,
  User,
  Lock,
  EyeOff,
  Calendar,
  Settings,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UltimatePlanningService } from '../../services/UltimatePlanningService';
import { UltimatePlanningData, SharedAccess, WorkflowStep, NotificationSetting, SecuritySettings } from '../../types/ultimate-planning';
import { useToast } from '@/hooks/use-toast';

interface CollaborationTabProps {
  data: UltimatePlanningData;
  onUpdate: (data: UltimatePlanningData) => void;
}

export const CollaborationTab: React.FC<CollaborationTabProps> = ({ 
  data, 
  onUpdate 
}) => {
  const { toast } = useToast();
  const [showSharedAccessDialog, setShowSharedAccessDialog] = useState(false);
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [showSecurityDialog, setShowSecurityDialog] = useState(false);
  
  const [newSharedAccess, setNewSharedAccess] = useState({
    email: '',
    name: '',
    role: 'lecture' as const,
    permissions: [] as string[],
    expiryDate: ''
  });

  const [newWorkflowStep, setNewWorkflowStep] = useState({
    name: '',
    description: '',
    responsible: '',
    required: true,
    order: 1
  });

  const [newNotification, setNewNotification] = useState({
    type: 'email' as const,
    event: '',
    enabled: true,
    frequency: 'immédiat' as const,
    recipients: ['']
  });

  const [newSecuritySettings, setNewSecuritySettings] = useState({
    encryptionLevel: 'standard' as const,
    twoFactorRequired: false,
    sessionTimeout: 30,
    ipRestrictions: [''],
    auditLog: true
  });

  const handleCreateSharedAccess = () => {
    if (!newSharedAccess.email.trim() || !newSharedAccess.name.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive'
      });
      return;
    }

    try {
      const updatedData = { ...data };
      const sharedAccess: SharedAccess = {
        id: `access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: newSharedAccess.email,
        name: newSharedAccess.name,
        role: newSharedAccess.role,
        permissions: newSharedAccess.permissions.filter(p => p.trim()),
        grantedDate: new Date(),
        expiryDate: newSharedAccess.expiryDate ? new Date(newSharedAccess.expiryDate) : undefined,
        status: 'actif'
      };
      
      updatedData.collaboration.sharedAccess.push(sharedAccess);
      onUpdate(updatedData);
      
      setShowSharedAccessDialog(false);
      resetNewSharedAccess();
      
      toast({
        title: 'Succès',
        description: 'Accès partagé créé avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création de l\'accès partagé',
        variant: 'destructive'
      });
    }
  };

  const handleCreateWorkflowStep = () => {
    if (!newWorkflowStep.name.trim() || !newWorkflowStep.responsible.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive'
      });
      return;
    }

    try {
      const updatedData = { ...data };
      const workflowStep: WorkflowStep = {
        id: `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: newWorkflowStep.name,
        description: newWorkflowStep.description,
        responsible: newWorkflowStep.responsible,
        required: newWorkflowStep.required,
        order: newWorkflowStep.order,
        status: 'en attente',
        comments: []
      };
      
      updatedData.collaboration.workflow.push(workflowStep);
      onUpdate(updatedData);
      
      setShowWorkflowDialog(false);
      resetNewWorkflowStep();
      
      toast({
        title: 'Succès',
        description: 'Étape de workflow créée avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création de l\'étape de workflow',
        variant: 'destructive'
      });
    }
  };

  const handleCreateNotification = () => {
    if (!newNotification.event.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive'
      });
      return;
    }

    try {
      const updatedData = { ...data };
      const notification: NotificationSetting = {
        type: newNotification.type,
        event: newNotification.event,
        enabled: newNotification.enabled,
        frequency: newNotification.frequency,
        recipients: newNotification.recipients.filter(r => r.trim())
      };
      
      updatedData.collaboration.notifications.push(notification);
      onUpdate(updatedData);
      
      setShowNotificationDialog(false);
      resetNewNotification();
      
      toast({
        title: 'Succès',
        description: 'Notification créée avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création de la notification',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateSecuritySettings = () => {
    try {
      const updatedData = { ...data };
      updatedData.collaboration.security = {
        encryptionLevel: newSecuritySettings.encryptionLevel,
        twoFactorRequired: newSecuritySettings.twoFactorRequired,
        sessionTimeout: newSecuritySettings.sessionTimeout,
        ipRestrictions: newSecuritySettings.ipRestrictions.filter(ip => ip.trim()),
        auditLog: newSecuritySettings.auditLog
      };
      
      onUpdate(updatedData);
      
      setShowSecurityDialog(false);
      resetNewSecuritySettings();
      
      toast({
        title: 'Succès',
        description: 'Paramètres de sécurité mis à jour avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour des paramètres de sécurité',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteSharedAccess = (accessId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet accès partagé ? Cette action est irréversible.')) {
      try {
        const updatedData = { ...data };
        updatedData.collaboration.sharedAccess = updatedData.collaboration.sharedAccess.filter(a => a.id !== accessId);
        onUpdate(updatedData);
        
        toast({
          title: 'Succès',
          description: 'Accès partagé supprimé avec succès',
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

  const handleDeleteWorkflowStep = (stepId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette étape de workflow ? Cette action est irréversible.')) {
      try {
        const updatedData = { ...data };
        updatedData.collaboration.workflow = updatedData.collaboration.workflow.filter(w => w.id !== stepId);
        onUpdate(updatedData);
        
        toast({
          title: 'Succès',
          description: 'Étape de workflow supprimée avec succès',
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

  const handleDeleteNotification = (notificationId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette notification ? Cette action est irréversible.')) {
      try {
        const updatedData = { ...data };
        updatedData.collaboration.notifications = updatedData.collaboration.notifications.filter(n => n.id !== notificationId);
        onUpdate(updatedData);
        
        toast({
          title: 'Succès',
          description: 'Notification supprimée avec succès',
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

  const resetNewSharedAccess = () => {
    setNewSharedAccess({
      email: '',
      name: '',
      role: 'lecture',
      permissions: [],
      expiryDate: ''
    });
  };

  const resetNewWorkflowStep = () => {
    setNewWorkflowStep({
      name: '',
      description: '',
      responsible: '',
      required: true,
      order: 1
    });
  };

  const resetNewNotification = () => {
    setNewNotification({
      type: 'email',
      event: '',
      enabled: true,
      frequency: 'immédiat',
      recipients: ['']
    });
  };

  const resetNewSecuritySettings = () => {
    setNewSecuritySettings({
      encryptionLevel: 'standard',
      twoFactorRequired: false,
      sessionTimeout: 30,
      ipRestrictions: [''],
      auditLog: true
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'lecture':
        return <Badge variant="outline" className="bg-mpr-interactive-lt text-mpr-navy border-mpr-border">Lecture</Badge>;
      case 'commentaire':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Commentaire</Badge>;
      case 'édition':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Édition</Badge>;
      case 'approbation':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Approbation</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en attente':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" /> En attente</Badge>;
      case 'en cours':
        return <Badge variant="default" className="flex items-center gap-1"><Clock className="h-3 w-3" /> En cours</Badge>;
      case 'approuvé':
        return <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3" /> Approuvé</Badge>;
      case 'rejeté':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'push':
        return <Bell className="h-4 w-4" />;
      case 'sms':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getEncryptionLevelColor = (level: string) => {
    switch (level) {
      case 'standard':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'élevé':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maximum':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
                <Users className="h-5 w-5" />
                Collaboration et partage
              </CardTitle>
              <CardDescription>
                Gérez les accès partagés, workflow collaboratif et notifications
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowSharedAccessDialog(true)} variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Accès partagé
              </Button>
              <Button onClick={() => setShowWorkflowDialog(true)} variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Workflow
              </Button>
              <Button onClick={() => setShowNotificationDialog(true)} variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Notification
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-mpr-interactive-lt rounded-lg">
              <div className="text-2xl font-bold text-mpr-navy">{data.collaboration.sharedAccess.length}</div>
              <div className="text-sm text-mpr-navy">Accès partagés</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">{data.collaboration.workflow.length}</div>
              <div className="text-sm text-green-700">Étapes de workflow</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">{data.collaboration.notifications.length}</div>
              <div className="text-sm text-purple-700">Notifications</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-900">
                {data.collaboration.sharedAccess.filter(a => a.status === 'actif').length}
              </div>
              <div className="text-sm text-orange-700">Accès actifs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accès partagés */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Accès partagés
              </CardTitle>
              <CardDescription>
                Gérez les accès partagés pour les professionnels et collaborateurs
              </CardDescription>
            </div>
            <Button onClick={() => setShowSharedAccessDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouvel accès
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.collaboration.sharedAccess.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              <Share2 className="h-12 w-12 mx-auto mb-4" />
              <p>Aucun accès partagé configuré</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.collaboration.sharedAccess.map((access) => (
                <motion.div
                  key={access.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-5 w-5" />
                            <h3 className="font-semibold">{access.name}</h3>
                            {getRoleBadge(access.role)}
                            <Badge variant={access.status === 'actif' ? 'default' : 'secondary'}>
                              {access.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="text-sm">
                              <span className="font-medium">Email :</span> {access.email}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Accordé le :</span> {new Date(access.grantedDate).toLocaleDateString('fr-CA')}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Expire le :</span> {access.expiryDate ? new Date(access.expiryDate).toLocaleDateString('fr-CA') : 'Jamais'}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Permissions :</span> {access.permissions.length}
                            </div>
                          </div>

                          {access.permissions.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {access.permissions.map((permission, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSharedAccess(access.id)}
                            title="Supprimer l'accès"
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
        </CardContent>
      </Card>

      {/* Workflow collaboratif */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Workflow collaboratif
              </CardTitle>
              <CardDescription>
                Gérez les étapes de validation et d'approbation
              </CardDescription>
            </div>
            <Button onClick={() => setShowWorkflowDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle étape
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.collaboration.workflow.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4" />
              <p>Aucune étape de workflow configurée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.collaboration.workflow
                .sort((a, b) => a.order - b.order)
                .map((step) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-mpr-interactive-lt text-mpr-interactive flex items-center justify-center text-sm font-medium">
                              {step.order}
                            </div>
                            <h3 className="font-semibold">{step.name}</h3>
                            {getStatusBadge(step.status)}
                            {step.required && (
                              <Badge variant="destructive" className="text-xs">Requis</Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                            <div className="text-sm">
                              <span className="font-medium">Responsable :</span> {step.responsible}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Ordre :</span> {step.order}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Commentaires :</span> {step.comments.length}
                            </div>
                          </div>

                          {step.comments.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-sm font-medium text-mpr-interactive">Commentaires :</span>
                              <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                                {step.comments.map((comment, index) => (
                                  <li key={index}>{comment}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteWorkflowStep(step.id)}
                            title="Supprimer l'étape"
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
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configurez les alertes et notifications automatiques
              </CardDescription>
            </div>
            <Button onClick={() => setShowNotificationDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle notification
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.collaboration.notifications.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4" />
              <p>Aucune notification configurée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.collaboration.notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getNotificationIcon(notification.type)}
                            <h3 className="font-semibold">{notification.event}</h3>
                            <Badge variant={notification.enabled ? 'default' : 'secondary'}>
                              {notification.enabled ? 'Activée' : 'Désactivée'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="text-sm">
                              <span className="font-medium">Type :</span> {notification.type}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Fréquence :</span> {notification.frequency}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Destinataires :</span> {notification.recipients.length}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Statut :</span> {notification.enabled ? 'Actif' : 'Inactif'}
                            </div>
                          </div>

                          {notification.recipients.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {notification.recipients.map((recipient, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {recipient}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id)}
                            title="Supprimer la notification"
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
        </CardContent>
      </Card>

      {/* Paramètres de sécurité */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Paramètres de sécurité
              </CardTitle>
              <CardDescription>
                Configurez la sécurité et la confidentialité de vos données
              </CardDescription>
            </div>
            <Button onClick={() => setShowSecurityDialog(true)} variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Modifier
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4" />
                <span className="font-medium">Niveau de chiffrement</span>
              </div>
              <Badge className={getEncryptionLevelColor(data.collaboration.security.encryptionLevel)}>
                {data.collaboration.security.encryptionLevel}
              </Badge>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Authentification 2FA</span>
              </div>
              <Badge variant={data.collaboration.security.twoFactorRequired ? 'default' : 'secondary'}>
                {data.collaboration.security.twoFactorRequired ? 'Requis' : 'Optionnel'}
              </Badge>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Délai de session</span>
              </div>
              <span className="text-sm">{data.collaboration.security.sessionTimeout} minutes</span>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4" />
                <span className="font-medium">Journal d'audit</span>
              </div>
              <Badge variant={data.collaboration.security.auditLog ? 'default' : 'secondary'}>
                {data.collaboration.security.auditLog ? 'Activé' : 'Désactivé'}
              </Badge>
            </div>
          </div>

          {data.collaboration.security.ipRestrictions.length > 0 && (
            <div className="mt-4 p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4" />
                <span className="font-medium">Restrictions d'adresses IP</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {data.collaboration.security.ipRestrictions.map((ip, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {ip}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs de création */}
      {/* Dialog d'accès partagé */}
      <Dialog open={showSharedAccessDialog} onOpenChange={setShowSharedAccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Créer un nouvel accès partagé</DialogTitle>
            <DialogDescription>
              Accordez l'accès à un professionnel ou collaborateur
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="access-email">Email</Label>
              <Input
                id="access-email"
                type="email"
                value={newSharedAccess.email}
                onChange={(e) => setNewSharedAccess({ ...newSharedAccess, email: e.target.value })}
                placeholder="collaborateur@exemple.com"
              />
            </div>

            <div>
              <Label htmlFor="access-name">Nom complet</Label>
              <Input
                id="access-name"
                value={newSharedAccess.name}
                onChange={(e) => setNewSharedAccess({ ...newSharedAccess, name: e.target.value })}
                placeholder="Nom du collaborateur"
              />
            </div>

            <div>
              <Label htmlFor="access-role">Rôle</Label>
              <Select value={newSharedAccess.role} onValueChange={(value: any) => setNewSharedAccess({ ...newSharedAccess, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecture">Lecture</SelectItem>
                  <SelectItem value="commentaire">Commentaire</SelectItem>
                  <SelectItem value="édition">Édition</SelectItem>
                  <SelectItem value="approbation">Approbation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="access-expiry">Date d'expiration (optionnel)</Label>
              <Input
                id="access-expiry"
                type="date"
                value={newSharedAccess.expiryDate}
                onChange={(e) => setNewSharedAccess({ ...newSharedAccess, expiryDate: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowSharedAccessDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateSharedAccess}>
                Créer l'accès
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de workflow */}
      <Dialog open={showWorkflowDialog} onOpenChange={setShowWorkflowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle étape de workflow</DialogTitle>
            <DialogDescription>
              Ajoutez une étape de validation ou d'approbation
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="workflow-name">Nom de l'étape</Label>
              <Input
                id="workflow-name"
                value={newWorkflowStep.name}
                onChange={(e) => setNewWorkflowStep({ ...newWorkflowStep, name: e.target.value })}
                placeholder="Ex: Validation juridique"
              />
            </div>

            <div>
              <Label htmlFor="workflow-description">Description</Label>
              <Textarea
                id="workflow-description"
                value={newWorkflowStep.description}
                onChange={(e) => setNewWorkflowStep({ ...newWorkflowStep, description: e.target.value })}
                placeholder="Décrivez l'objectif de cette étape"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="workflow-responsible">Responsable</Label>
              <Input
                id="workflow-responsible"
                value={newWorkflowStep.responsible}
                onChange={(e) => setNewWorkflowStep({ ...newWorkflowStep, responsible: e.target.value })}
                placeholder="Ex: Avocat, Notaire"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workflow-order">Ordre</Label>
                <Input
                  id="workflow-order"
                  type="number"
                  value={newWorkflowStep.order}
                  onChange={(e) => setNewWorkflowStep({ ...newWorkflowStep, order: parseInt(e.target.value) || 1 })}
                  min="1"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="workflow-required"
                  checked={newWorkflowStep.required}
                  onCheckedChange={(checked) => setNewWorkflowStep({ ...newWorkflowStep, required: checked as boolean })}
                />
                <Label htmlFor="workflow-required">Étape requise</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowWorkflowDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateWorkflowStep}>
                Créer l'étape
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de notification */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle notification</DialogTitle>
            <DialogDescription>
              Configurez une alerte ou notification automatique
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="notification-event">Événement</Label>
              <Input
                id="notification-event"
                value={newNotification.event}
                onChange={(e) => setNewNotification({ ...newNotification, event: e.target.value })}
                placeholder="Ex: Document finalisé"
              />
            </div>

            <div>
              <Label htmlFor="notification-type">Type</Label>
              <Select value={newNotification.type} onValueChange={(value: any) => setNewNotification({ ...newNotification, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="push">Notification push</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notification-frequency">Fréquence</Label>
              <Select value={newNotification.frequency} onValueChange={(value: any) => setNewNotification({ ...newNotification, frequency: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la fréquence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immédiat">Immédiat</SelectItem>
                  <SelectItem value="quotidien">Quotidien</SelectItem>
                  <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notification-enabled"
                checked={newNotification.enabled}
                onCheckedChange={(checked) => setNewNotification({ ...newNotification, enabled: checked as boolean })}
              />
              <Label htmlFor="notification-enabled">Notification activée</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowNotificationDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateNotification}>
                Créer la notification
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de sécurité */}
      <Dialog open={showSecurityDialog} onOpenChange={setShowSecurityDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Paramètres de sécurité</DialogTitle>
            <DialogDescription>
              Configurez la sécurité et la confidentialité
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="security-encryption">Niveau de chiffrement</Label>
              <Select value={newSecuritySettings.encryptionLevel} onValueChange={(value: any) => setNewSecuritySettings({ ...newSecuritySettings, encryptionLevel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="élevé">Élevé</SelectItem>
                  <SelectItem value="maximum">Maximum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="security-session">Délai de session (minutes)</Label>
              <Input
                id="security-session"
                type="number"
                value={newSecuritySettings.sessionTimeout}
                onChange={(e) => setNewSecuritySettings({ ...newSecuritySettings, sessionTimeout: parseInt(e.target.value) || 30 })}
                min="5"
                max="480"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="security-2fa"
                checked={newSecuritySettings.twoFactorRequired}
                onCheckedChange={(checked) => setNewSecuritySettings({ ...newSecuritySettings, twoFactorRequired: checked as boolean })}
              />
              <Label htmlFor="security-2fa">Authentification 2FA requise</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="security-audit"
                checked={newSecuritySettings.auditLog}
                onCheckedChange={(checked) => setNewSecuritySettings({ ...newSecuritySettings, auditLog: checked as boolean })}
              />
              <Label htmlFor="security-audit">Journal d'audit activé</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowSecurityDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateSecuritySettings}>
                Mettre à jour
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Informations et aide */}
      <Card className="border-mpr-border bg-mpr-interactive-lt">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-mpr-navy">
            <Info className="h-5 w-5" />
            À propos de la collaboration
          </CardTitle>
        </CardHeader>
        <CardContent className="text-mpr-navy">
          <p className="mb-3">
            La collaboration vous permet de partager vos informations de planification successorale 
            avec des professionnels qualifiés tout en maintenant le contrôle sur les accès et permissions.
          </p>
          <p>
            <strong>Note importante :</strong> Assurez-vous de ne partager qu'avec des personnes 
            de confiance et de révoquer les accès qui ne sont plus nécessaires.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
