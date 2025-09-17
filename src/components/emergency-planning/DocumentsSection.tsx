import React from 'react';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { EmergencyData } from './types';

interface DocumentsSectionProps {
  data: EmergencyData;
  setData: (data: EmergencyData) => void;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ data, setData }) => {
  const { t } = useLanguage();

  // Documents organisés comme dans l'ancienne version (ordre exact des captures)
  const documentsData = [
    // Ligne 1
    { id: 'permis', nom: 'Permis de conduire', field: 'permisConduire' },
    { id: 'passeport', nom: 'Passeport', field: 'passeport' },
    { id: 'naissance', nom: 'Certificat de naissance', field: 'certificatNaissance' },
    
    // Ligne 2
    { id: 'mariage', nom: 'Certificat de mariage', field: 'certificatMariage' },
    { id: 'divorce', nom: 'Certificat de divorce', field: 'certificatDivorce' },
    { id: 'testament', nom: 'Testament', field: 'testament' },
    
    // Ligne 3
    { id: 'mandat', nom: 'Mandat de protection', field: 'mandatProtection' },
    { id: 'procuration', nom: 'Procuration', field: 'procuration' },
    { id: 'fiducie', nom: 'Fiducie', field: 'fiducie' },
    
    // Ligne 4
    { id: 'tutelle', nom: 'Tutelle/curatelle', field: 'tutelleCuratelle' },
    { id: 'releves', nom: 'Relevés bancaires', field: 'relevesBancaires' },
    { id: 'assuranceVie', nom: 'Polices d\'assurance-vie', field: 'policesAssuranceVie' },
    
    // Ligne 5
    { id: 'assuranceAuto', nom: 'Assurance auto', field: 'assuranceAuto' },
    { id: 'assuranceHabitation', nom: 'Assurance habitation', field: 'assuranceHabitation' },
    { id: 'assuranceInvalidite', nom: 'Assurance invalidité', field: 'assuranceInvalidite' }
  ];

  // Fonction pour obtenir la valeur d'un document (possédé ou non)
  const getDocumentValue = (field: string, type: 'possede' | 'emplacement') => {
    const possede = `${field}Possede` as keyof EmergencyData;
    const emplacement = `${field}Emplacement` as keyof EmergencyData;
    return type === 'possede' ? 
      (data[possede] as boolean) || false : 
      (data[emplacement] as string) || '';
  };

  // Fonction pour mettre à jour un document
  const updateDocument = (field: string, type: 'possede' | 'emplacement', value: boolean | string) => {
    const fieldName = `${field}${type === 'possede' ? 'Possede' : 'Emplacement'}` as keyof EmergencyData;
    setData({...data, [fieldName]: value});
  };

  // Fonction pour rendre un document avec sa checkbox et son champ d'emplacement
  const renderDocument = (doc: { id: string, nom: string, field: string }) => {
    const possede = getDocumentValue(doc.field, 'possede');
    const emplacement = getDocumentValue(doc.field, 'emplacement');

    return (
      <div key={doc.id} style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          <input
            type="checkbox"
            checked={possede}
            onChange={(e) => updateDocument(doc.field, 'possede', e.target.checked)}
            style={{
              width: '18px',
              height: '18px',
              cursor: 'pointer'
            }}
          />
          <span>{doc.nom}</span>
        </label>
        
        {possede && (
          <input
            type="text"
            className="form-input"
            value={emplacement}
            onChange={(e) => updateDocument(doc.field, 'emplacement', e.target.value)}
            placeholder="Emplacement du document"
            style={{
              marginLeft: '26px',
              fontSize: '14px',
              border: '2px solid #000',
              borderRadius: '4px',
              padding: '8px'
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="form-section">
      <div style={{
        backgroundColor: '#e0e7ff',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <FileText size={20} />
        <h2 style={{margin: 0, fontSize: '18px', fontWeight: '600', color: '#1e40af'}}>
          Documents importants
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        padding: '20px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px'
      }}>
        {documentsData.map((doc) => renderDocument(doc))}
      </div>
    </div>
  );
};

export default DocumentsSection;