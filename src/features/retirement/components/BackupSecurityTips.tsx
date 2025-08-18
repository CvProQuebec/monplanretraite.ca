import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Usb, 
  HardDrive, 
  Cloud, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export const BackupSecurityTips: React.FC = () => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const translations = {
    fr: {
      title: "Conseils de sécurité pour la sauvegarde",
      subtitle: "Protégez vos données financières avec ces bonnes pratiques",
      expandButton: "Voir plus de conseils",
      collapseButton: "Voir moins",
      
      // Niveaux de sécurité
      securityLevels: {
        title: "Niveaux de sécurité recommandés",
        high: "Élevé",
        medium: "Moyen",
        low: "Faible"
      },

      // Supports de sauvegarde
      storageMedia: {
        title: "Supports de sauvegarde recommandés",
        usb: "Clé USB sécurisée",
        usbDesc: "Chiffrée, portable, facile à transporter",
        external: "Disque dur externe",
        externalDesc: "Grande capacité, chiffrement recommandé",
        cloud: "Stockage cloud",
        cloudDesc: "Synchronisation, accès partout, chiffrement obligatoire",
        local: "Ordinateur local",
        localDesc: "Rapide, mais vulnérable aux pannes"
      },

      // Bonnes pratiques
      bestPractices: {
        title: "Bonnes pratiques",
        password: "Utilisez un mot de passe fort et unique",
        passwordDesc: "Minimum 12 caractères, mélange de types",
        multiple: "Sauvegardes multiples",
        multipleDesc: "Au moins 2 copies sur supports différents",
        regular: "Sauvegardes régulières",
        regularDesc: "Avant chaque modification importante",
        test: "Testez vos sauvegardes",
        testDesc: "Vérifiez que vous pouvez restaurer vos données",
        location: "Stockage séparé",
        locationDesc: "Éloigné de votre ordinateur principal"
      },

      // Avertissements
      warnings: {
        title: "⚠️ Attention",
        public: "Ne sauvegardez jamais sur un ordinateur public",
        email: "N'envoyez jamais vos sauvegardes par email",
        sharing: "Ne partagez jamais vos mots de passe",
        unencrypted: "Vérifiez que vos données sont chiffrées"
      },

      // Conseils spécifiques
      specificTips: {
        title: "Conseils spécifiques MonPlanRetraite",
        naming: "Nommage intelligent des fichiers",
        namingDesc: "Incluez la date et une description claire",
        versioning: "Gestion des versions",
        versioningDesc: "Gardez les 3 dernières versions",
        metadata: "Métadonnées enrichies",
        metadataDesc: "Description, date, modifications apportées"
      }
    },
    en: {
      title: "Backup Security Tips",
      subtitle: "Protect your financial data with these best practices",
      expandButton: "Show more tips",
      collapseButton: "Show less",
      
      // Security levels
      securityLevels: {
        title: "Recommended Security Levels",
        high: "High",
        medium: "Medium",
        low: "Low"
      },

      // Storage media
      storageMedia: {
        title: "Recommended Backup Media",
        usb: "Secure USB Key",
        usbDesc: "Encrypted, portable, easy to transport",
        external: "External Hard Drive",
        externalDesc: "High capacity, encryption recommended",
        cloud: "Cloud Storage",
        cloudDesc: "Sync, access anywhere, encryption required",
        local: "Local Computer",
        localDesc: "Fast, but vulnerable to failures"
      },

      // Best practices
      bestPractices: {
        title: "Best Practices",
        password: "Use a strong and unique password",
        passwordDesc: "Minimum 12 characters, mixed types",
        multiple: "Multiple backups",
        multipleDesc: "At least 2 copies on different media",
        regular: "Regular backups",
        regularDesc: "Before each important modification",
        test: "Test your backups",
        testDesc: "Verify you can restore your data",
        location: "Separate storage",
        locationDesc: "Away from your main computer"
      },

      // Warnings
      warnings: {
        title: "⚠️ Warning",
        public: "Never backup on a public computer",
        email: "Never send your backups by email",
        sharing: "Never share your passwords",
        unencrypted: "Verify your data is encrypted"
      },

      // Specific tips
      specificTips: {
        title: "MonPlanRetraite Specific Tips",
        naming: "Smart file naming",
        namingDesc: "Include date and clear description",
        versioning: "Version management",
        versioningDesc: "Keep the last 3 versions",
        metadata: "Enriched metadata",
        metadataDesc: "Description, date, changes made"
      }
    }
  };

  const tr = translations[language as keyof typeof translations];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          {tr.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{tr.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Niveaux de sécurité */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">{tr.securityLevels.title}</h4>
          <div className="flex gap-2">
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              {tr.securityLevels.high}
            </Badge>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {tr.securityLevels.medium}
            </Badge>
            <Badge variant="outline" className="bg-red-100 text-red-800">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {tr.securityLevels.low}
            </Badge>
          </div>
        </div>

        {/* Supports de sauvegarde */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">{tr.storageMedia.title}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2 p-2 border rounded-lg">
              <Usb className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm">{tr.storageMedia.usb}</div>
                <div className="text-xs text-muted-foreground">{tr.storageMedia.usbDesc}</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 border rounded-lg">
              <HardDrive className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm">{tr.storageMedia.external}</div>
                <div className="text-xs text-muted-foreground">{tr.storageMedia.externalDesc}</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 border rounded-lg">
              <Cloud className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm">{tr.storageMedia.cloud}</div>
                <div className="text-xs text-muted-foreground">{tr.storageMedia.cloudDesc}</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 border rounded-lg">
              <HardDrive className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm">{tr.storageMedia.local}</div>
                <div className="text-xs text-muted-foreground">{tr.storageMedia.localDesc}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bonnes pratiques */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">{tr.bestPractices.title}</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium">{tr.bestPractices.password}</div>
                <div className="text-xs text-muted-foreground">{tr.bestPractices.passwordDesc}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium">{tr.bestPractices.multiple}</div>
                <div className="text-xs text-muted-foreground">{tr.bestPractices.multipleDesc}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium">{tr.bestPractices.regular}</div>
                <div className="text-xs text-muted-foreground">{tr.bestPractices.regularDesc}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Avertissements */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">{tr.warnings.title}</div>
            <ul className="text-sm space-y-1">
              <li>• {tr.warnings.public}</li>
              <li>• {tr.warnings.email}</li>
              <li>• {tr.warnings.sharing}</li>
              <li>• {tr.warnings.unencrypted}</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Conseils spécifiques MonPlanRetraite */}
        {isExpanded && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-sm">{tr.specificTips.title}</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">{tr.specificTips.naming}</div>
                  <div className="text-xs text-muted-foreground">{tr.specificTips.namingDesc}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">{tr.specificTips.versioning}</div>
                  <div className="text-xs text-muted-foreground">{tr.specificTips.versioningDesc}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">{tr.specificTips.metadata}</div>
                  <div className="text-xs text-muted-foreground">{tr.specificTips.metadataDesc}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bouton d'expansion */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              {tr.collapseButton}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              {tr.expandButton}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
