// Onglet des accès numériques
// Plan Professional - Gestion avancée des accès numériques
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Plus, Trash2, Edit, Shield, User, Lock, Mail, Smartphone, AlertTriangle, Info, Key, Eye, EyeOff } from 'lucide-react';
import { DigitalAccess, EmailAccount, SocialNetwork, OnlineAccount, OnlineBankingService } from '../../types/emergency-info';

interface DigitalTabProps {
  data: DigitalAccess;
  onUpdate: (data: DigitalAccess) => void;
}

export const DigitalTab: React.FC<DigitalTabProps> = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('emails');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showSocialForm, setShowSocialForm] = useState(false);
  const [showOnlineAccountForm, setShowOnlineAccountForm] = useState(false);
  const [showBankingForm, setShowBankingForm] = useState(false);
  const [editingEmailIndex, setEditingEmailIndex] = useState<number | null>(null);
  const [editingSocialIndex, setEditingSocialIndex] = useState<number | null>(null);
  const [editingOnlineAccountIndex, setEditingOnlineAccountIndex] = useState<number | null>(null);
  const [editingBankingIndex, setEditingBankingIndex] = useState<number | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const [newEmail, setNewEmail] = useState<Partial<EmailAccount>>({
    emailAddress: '',
    provider: '',
    purpose: 'personal',
    recoveryEmail: '',
    recoveryPhone: '',
    twoFactorEnabled: false,
    notes: ''
  });

  const [newSocial, setNewSocial] = useState<Partial<SocialNetwork>>({
    platformName: '',
    username: '',
    email: '',
    purpose: 'personal',
    isPublic: false,
    notes: ''
  });

  const [newOnlineAccount, setNewOnlineAccount] = useState<Partial<OnlineAccount>>({
    serviceName: '',
    username: '',
    email: '',
    purpose: 'personal',
    hasTwoFactor: false,
    notes: ''
  });

  const [newBanking, setNewBanking] = useState<Partial<OnlineBankingService>>({
    bankName: '',
    serviceType: 'online-banking',
    username: '',
    email: '',
    hasTwoFactor: false,
    notes: ''
  });

  const emailPurposes = [
    { value: 'personal', label: 'Personnel' },
    { value: 'work', label: 'Travail' },
    { value: 'business', label: 'Entreprise' },
    { value: 'financial', label: 'Financier' },
    { value: 'other', label: 'Autre' }
  ];

  const socialPlatforms = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'snapchat', label: 'Snapchat' },
    { value: 'other', label: 'Autre' }
  ];

  const serviceTypes = [
    { value: 'online-banking', label: 'Banque en ligne' },
    { value: 'investment', label: 'Investissement' },
    { value: 'insurance', label: 'Assurance' },
    { value: 'shopping', label: 'Achats en ligne' },
    { value: 'streaming', label: 'Streaming' },
    { value: 'gaming', label: 'Jeux vidéo' },
    { value: 'other', label: 'Autre' }
  ];

  // Gestion des comptes email
  const handleAddEmail = () => {
    if (!newEmail.emailAddress || !newEmail.provider) return;

    const email: EmailAccount = {
      id: Date.now().toString(),
      emailAddress: newEmail.emailAddress!,
      provider: newEmail.provider!,
      purpose: newEmail.purpose!,
      recoveryEmail: newEmail.recoveryEmail || '',
      recoveryPhone: newEmail.recoveryPhone || '',
      twoFactorEnabled: newEmail.twoFactorEnabled || false,
      notes: newEmail.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedEmails = [...data.emailAccounts, email];
    onUpdate({ ...data, emailAccounts: updatedEmails });
    
    setNewEmail({
      emailAddress: '',
      provider: '',
      purpose: 'personal',
      recoveryEmail: '',
      recoveryPhone: '',
      twoFactorEnabled: false,
      notes: ''
    });
    setShowEmailForm(false);
  };

  const handleAddSocial = () => {
    if (!newSocial.platformName || !newSocial.username) return;

    const social: SocialNetwork = {
      id: Date.now().toString(),
      platformName: newSocial.platformName!,
      username: newSocial.username!,
      email: newSocial.email || '',
      purpose: newSocial.purpose!,
      isPublic: newSocial.isPublic || false,
      notes: newSocial.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedSocials = [...data.socialNetworks, social];
    onUpdate({ ...data, socialNetworks: updatedSocials });
    
    setNewSocial({
      platformName: '',
      username: '',
      email: '',
      purpose: 'personal',
      isPublic: false,
      notes: ''
    });
    setShowSocialForm(false);
  };

  const handleAddOnlineAccount = () => {
    if (!newOnlineAccount.serviceName || !newOnlineAccount.username) return;

    const account: OnlineAccount = {
      id: Date.now().toString(),
      serviceName: newOnlineAccount.serviceName!,
      username: newOnlineAccount.username!,
      email: newOnlineAccount.email || '',
      purpose: newOnlineAccount.purpose!,
      hasTwoFactor: newOnlineAccount.hasTwoFactor || false,
      notes: newOnlineAccount.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedAccounts = [...data.onlineAccounts, account];
    onUpdate({ ...data, onlineAccounts: updatedAccounts });
    
    setNewOnlineAccount({
      serviceName: '',
      username: '',
      email: '',
      purpose: 'personal',
      hasTwoFactor: false,
      notes: ''
    });
    setShowOnlineAccountForm(false);
  };

  const handleAddBanking = () => {
    if (!newBanking.bankName || !newBanking.serviceType) return;

    const banking: OnlineBankingService = {
      id: Date.now().toString(),
      bankName: newBanking.bankName!,
      serviceType: newBanking.serviceType!,
      username: newBanking.username || '',
      email: newBanking.email || '',
      hasTwoFactor: newBanking.hasTwoFactor || false,
      notes: newBanking.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedBanking = [...data.onlineBankingServices, banking];
    onUpdate({ ...data, onlineBankingServices: updatedBanking });
    
    setNewBanking({
      bankName: '',
      serviceType: 'online-banking',
      username: '',
      email: '',
      hasTwoFactor: false,
      notes: ''
    });
    setShowBankingForm(false);
  };

  // Fonctions d'édition et suppression
  const handleEditEmail = (index: number) => {
    const email = data.emailAccounts[index];
    setNewEmail({
      emailAddress: email.emailAddress,
      provider: email.provider,
      purpose: email.purpose,
      recoveryEmail: email.recoveryEmail,
      recoveryPhone: email.recoveryPhone,
      twoFactorEnabled: email.twoFactorEnabled,
      notes: email.notes
    });
    setEditingEmailIndex(index);
    setShowEmailForm(true);
  };

  const handleUpdateEmail = () => {
    if (editingEmailIndex === null || !newEmail.emailAddress || !newEmail.provider) return;

    const updatedEmails = [...data.emailAccounts];
    updatedEmails[editingEmailIndex] = {
      ...updatedEmails[editingEmailIndex],
      ...newEmail,
      updatedAt: new Date()
    };

    onUpdate({ ...data, emailAccounts: updatedEmails });
    setEditingEmailIndex(null);
    setShowEmailForm(false);
    setNewEmail({
      emailAddress: '',
      provider: '',
      purpose: 'personal',
      recoveryEmail: '',
      recoveryPhone: '',
      twoFactorEnabled: false,
      notes: ''
    });
  };

  const handleDeleteEmail = (index: number) => {
    const updatedEmails = data.emailAccounts.filter((_, i) => i !== index);
    onUpdate({ ...data, emailAccounts: updatedEmails });
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Calculs des statistiques
  const totalAccounts = data.emailAccounts.length + data.socialNetworks.length + 
                       data.onlineAccounts.length + data.onlineBankingServices.length;
  
  const accountsWithTwoFactor = data.emailAccounts.filter(e => e.twoFactorEnabled).length +
                               data.onlineAccounts.filter(a => a.hasTwoFactor).length +
                               data.onlineBankingServices.filter(b => b.hasTwoFactor).length;

  const publicSocialAccounts = data.socialNetworks.filter(s => s.isPublic).length;

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total des comptes</p>
                <p className="text-2xl font-bold">{totalAccounts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avec 2FA</p>
                <p className="text-2xl font-bold">{accountsWithTwoFactor}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Comptes email</p>
                <p className="text-2xl font-bold">{data.emailAccounts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Réseaux sociaux</p>
                <p className="text-2xl font-bold">{data.socialNetworks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes de sécurité */}
      {accountsWithTwoFactor < totalAccounts * 0.5 && totalAccounts > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <strong>Recommandation de sécurité :</strong> Moins de 50 % de vos comptes ont l'authentification à deux facteurs activée. 
            Considérez l'activer pour tous vos comptes importants.
          </AlertDescription>
        </Alert>
      )}

      {publicSocialAccounts > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <strong>Information :</strong> {publicSocialAccounts} de vos comptes de réseaux sociaux sont publics. 
            Assurez-vous que les informations partagées sont appropriées.
          </AlertDescription>
        </Alert>
      )}

      {/* Interface à onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
          <TabsTrigger value="accounts">Comptes en ligne</TabsTrigger>
          <TabsTrigger value="banking">Services bancaires</TabsTrigger>
        </TabsList>

        {/* Onglet Comptes email */}
        <TabsContent value="emails" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Comptes email</h3>
              <p className="text-sm text-muted-foreground">
                Gérez vos comptes email et leurs informations de récupération
              </p>
            </div>
            <Button onClick={() => setShowEmailForm(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Ajouter un email</span>
            </Button>
          </div>

          {/* Formulaire d'ajout/édition d'email */}
          {showEmailForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingEmailIndex !== null ? 'Modifier l\'email' : 'Ajouter un compte email'}
                </CardTitle>
                <CardDescription>
                  Renseignez les informations sur votre compte email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-address">Adresse email *</Label>
                    <Input
                      id="email-address"
                      type="email"
                      value={newEmail.emailAddress}
                      onChange={(e) => setNewEmail({ ...newEmail, emailAddress: e.target.value })}
                      placeholder="exemple@email.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-provider">Fournisseur *</Label>
                    <Input
                      id="email-provider"
                      value={newEmail.provider}
                      onChange={(e) => setNewEmail({ ...newEmail, provider: e.target.value })}
                      placeholder="Ex : Gmail, Outlook, Yahoo"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-purpose">Usage</Label>
                    <Select
                      value={newEmail.purpose}
                      onValueChange={(value) => setNewEmail({ ...newEmail, purpose: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {emailPurposes.map(purpose => (
                          <SelectItem key={purpose.value} value={purpose.value}>
                            {purpose.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recovery-email">Email de récupération</Label>
                    <Input
                      id="recovery-email"
                      type="email"
                      value={newEmail.recoveryEmail}
                      onChange={(e) => setNewEmail({ ...newEmail, recoveryEmail: e.target.value })}
                      placeholder="email-recupération@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recovery-phone">Téléphone de récupération</Label>
                    <Input
                      id="recovery-phone"
                      value={newEmail.recoveryPhone}
                      onChange={(e) => setNewEmail({ ...newEmail, recoveryPhone: e.target.value })}
                      placeholder="(514) 555-0123"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-notes">Notes</Label>
                    <Input
                      id="email-notes"
                      value={newEmail.notes}
                      onChange={(e) => setNewEmail({ ...newEmail, notes: e.target.value })}
                      placeholder="Informations supplémentaires"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="two-factor"
                    checked={newEmail.twoFactorEnabled}
                    onCheckedChange={(checked) => 
                      setNewEmail({ ...newEmail, twoFactorEnabled: checked as boolean })
                    }
                  />
                  <Label htmlFor="two-factor">Authentification à deux facteurs activée</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEmailForm(false);
                      setEditingEmailIndex(null);
                      setNewEmail({
                        emailAddress: '',
                        provider: '',
                        purpose: 'personal',
                        recoveryEmail: '',
                        recoveryPhone: '',
                        twoFactorEnabled: false,
                        notes: ''
                      });
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={editingEmailIndex !== null ? handleUpdateEmail : handleAddEmail}
                    disabled={!newEmail.emailAddress || !newEmail.provider}
                  >
                    {editingEmailIndex !== null ? 'Mettre à jour' : 'Ajouter'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des comptes email */}
          <div className="space-y-4">
            {data.emailAccounts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun compte email enregistré</h3>
                  <p className="text-muted-foreground mb-4">
                    Commencez par ajouter vos comptes email
                  </p>
                  <Button onClick={() => setShowEmailForm(true)}>
                    Ajouter votre premier email
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {data.emailAccounts.map((email, index) => (
                  <Card key={email.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-lg">{email.emailAddress}</h4>
                            <Badge variant="outline">
                              {emailPurposes.find(p => p.value === email.purpose)?.label}
                            </Badge>
                            {email.twoFactorEnabled && (
                              <Badge className="bg-green-100 text-green-800">
                                <Shield className="h-3 w-3 mr-1" />
                                2FA
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Fournisseur :</strong> {email.provider}</span>
                            </div>
                            
                            {email.recoveryEmail && (
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Récupération :</strong> {email.recoveryEmail}</span>
                              </div>
                            )}
                            
                            {email.recoveryPhone && (
                              <div className="flex items-center space-x-2">
                                <Smartphone className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Téléphone :</strong> {email.recoveryPhone}</span>
                              </div>
                            )}
                          </div>
                          
                          {email.notes && (
                            <div className="mt-2 p-2 bg-muted rounded-md">
                              <p className="text-sm text-muted-foreground">{email.notes}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEmail(index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEmail(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Onglet Réseaux sociaux */}
        <TabsContent value="social" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Réseaux sociaux</h3>
              <p className="text-sm text-muted-foreground">
                Gérez vos comptes de réseaux sociaux
              </p>
            </div>
            <Button onClick={() => setShowSocialForm(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Ajouter un réseau</span>
            </Button>
          </div>

          {/* Formulaire d'ajout/édition de réseau social */}
          {showSocialForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingSocialIndex !== null ? 'Modifier le réseau' : 'Ajouter un réseau social'}
                </CardTitle>
                <CardDescription>
                  Renseignez les informations sur votre compte de réseau social
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Nom de la plateforme *</Label>
                    <Select
                      value={newSocial.platformName}
                      onValueChange={(value) => setNewSocial({ ...newSocial, platformName: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une plateforme" />
                      </SelectTrigger>
                      <SelectContent>
                        {socialPlatforms.map(platform => (
                          <SelectItem key={platform.value} value={platform.value}>
                            {platform.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="social-username">Nom d'utilisateur *</Label>
                    <Input
                      id="social-username"
                      value={newSocial.username}
                      onChange={(e) => setNewSocial({ ...newSocial, username: e.target.value })}
                      placeholder="Nom d'utilisateur"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="social-email">Email associé</Label>
                    <Input
                      id="social-email"
                      type="email"
                      value={newSocial.email}
                      onChange={(e) => setNewSocial({ ...newSocial, email: e.target.value })}
                      placeholder="email@exemple.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="social-purpose">Usage</Label>
                    <Select
                      value={newSocial.purpose}
                      onValueChange={(value) => setNewSocial({ ...newSocial, purpose: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {emailPurposes.map(purpose => (
                          <SelectItem key={purpose.value} value={purpose.value}>
                            {purpose.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social-notes">Notes</Label>
                  <Textarea
                    id="social-notes"
                    value={newSocial.notes}
                    onChange={(e) => setNewSocial({ ...newSocial, notes: e.target.value })}
                    placeholder="Informations supplémentaires"
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="social-public"
                    checked={newSocial.isPublic}
                    onCheckedChange={(checked) => 
                      setNewSocial({ ...newSocial, isPublic: checked as boolean })
                    }
                  />
                  <Label htmlFor="social-public">Compte public</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSocialForm(false);
                      setEditingSocialIndex(null);
                      setNewSocial({
                        platformName: '',
                        username: '',
                        email: '',
                        purpose: 'personal',
                        isPublic: false,
                        notes: ''
                      });
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleAddSocial}
                    disabled={!newSocial.platformName || !newSocial.username}
                  >
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des réseaux sociaux */}
          <div className="space-y-4">
            {data.socialNetworks.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun réseau social enregistré</h3>
                  <p className="text-muted-foreground mb-4">
                    Commencez par ajouter vos comptes de réseaux sociaux
                  </p>
                  <Button onClick={() => setShowSocialForm(true)}>
                    Ajouter votre premier réseau
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {data.socialNetworks.map((social, index) => (
                  <Card key={social.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-lg">{social.platformName}</h4>
                            <Badge variant="outline">
                              {emailPurposes.find(p => p.value === social.purpose)?.label}
                            </Badge>
                            {social.isPublic ? (
                              <Badge className="bg-blue-100 text-blue-800">Public</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">Privé</Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Utilisateur :</strong> {social.username}</span>
                            </div>
                            
                            {social.email && (
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Email :</strong> {social.email}</span>
                              </div>
                            )}
                          </div>
                          
                          {social.notes && (
                            <div className="mt-2 p-2 bg-muted rounded-md">
                              <p className="text-sm text-muted-foreground">{social.notes}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEmail(index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEmail(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Onglets Comptes en ligne et Services bancaires (placeholders pour l'instant) */}
        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Gestion des comptes en ligne</h3>
              <p className="text-muted-foreground mb-4">
                Cette fonctionnalité sera bientôt disponible
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banking" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Services bancaires en ligne</h3>
              <p className="text-muted-foreground mb-4">
                Cette fonctionnalité sera bientôt disponible
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
