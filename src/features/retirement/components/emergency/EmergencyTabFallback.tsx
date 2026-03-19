import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type EmergencyTabFallbackProps = {
  title: string;
  description: string;
};

function EmergencyTabFallback({ title, description }: EmergencyTabFallbackProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <Alert>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </div>
  );
}

export const EmergencyContactsTab: React.FC<any> = () => (
  <EmergencyTabFallback
    title="Contacts d'urgence"
    description="Le formulaire détaillé de cette section n'est plus présent dans cette branche. La section reste accessible le temps de restaurer le composant complet."
  />
);

export const MedicalInfoTab: React.FC<any> = () => (
  <EmergencyTabFallback
    title="Informations médicales"
    description="Le composant détaillé a été retiré de cette branche. Ce fallback évite de casser le module pendant la remise en état."
  />
);

export const DependentsTab: React.FC<any> = () => (
  <EmergencyTabFallback
    title="Personnes à charge"
    description="Le formulaire original n'est pas disponible dans cette branche. Un composant temporaire est affiché pour préserver la navigation."
  />
);

export const EmploymentTab: React.FC<any> = () => (
  <EmergencyTabFallback
    title="Emploi et prestations"
    description="Le détail de cette section a été retiré. Ce fallback maintient le chargement du module sans erreur de build."
  />
);

export const DocumentsTab: React.FC<any> = () => (
  <EmergencyTabFallback
    title="Documents importants"
    description="Le composant détaillé n'est plus présent. Cette version temporaire sert uniquement à rétablir la compatibilité du bundle."
  />
);

export const PropertiesTab: React.FC<any> = () => (
  <EmergencyTabFallback
    title="Propriétés"
    description="La version complète de cette section devra être restaurée séparément. Le fallback permet de garder la page fonctionnelle."
  />
);

export const FinancialTab: React.FC<any> = () => (
  <EmergencyTabFallback
    title="Informations financières"
    description="Le composant source manque dans cette branche. Un affichage minimal est utilisé pour débloquer la compilation."
  />
);

export const DigitalTab: React.FC<any> = () => (
  <EmergencyTabFallback
    title="Accès numériques"
    description="Le formulaire original est absent. Ce composant temporaire évite une erreur de résolution de module."
  />
);

export const InsuranceTab: React.FC<any> = () => (
  <EmergencyTabFallback
    title="Assurances"
    description="La section détaillée devra être réintroduite plus tard. Pour l'instant, ce fallback maintient le build et la navigation."
  />
);

export const SuccessionTab: React.FC<any> = () => (
  <EmergencyTabFallback
    title="Succession"
    description="Le composant d'origine n'existe plus à cet emplacement. Ce fallback maintient le module urgence compilable pendant la transition."
  />
);
