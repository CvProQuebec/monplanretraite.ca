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
    { id: 'permis', field: 'permisConduire' },
    { id: 'passeport', field: 'passeport' },
    { id: 'naissance', field: 'certificatNaissance' },
    
    // Ligne 2
    { id: 'mariage', field: 'certificatMariage' },
    { id: 'divorce', field: 'certificatDivorce' },
    { id: 'testament', field: 'testament' },
    
    // Ligne 3
    { id: 'mandat', field: 'mandatProtection' },
    { id: 'procuration', field: 'procuration' },
    { id: 'fiducie', field: 'fiducie' },
    
    // Ligne 4
    { id: 'tutelle', field: 'tutelleCuratelle' },
    { id: 'releves', field: 'relevesBancaires' },
    { id: 'assuranceVie', field: 'policesAssuranceVie' },
    
    // Ligne 5
    { id: 'assuranceAuto', field: 'assuranceAuto' },
    { id: 'assuranceHabitation', field: 'assuranceHabitation' },
    { id: 'assuranceInvalidite', field: 'assuranceInvalidite' }
  ];

  // Fonctions typées pour récupérer les champs documentaires
  const getDocumentPossede = (field: string): boolean => {
    return !!(data as any)[`${field}Possede`];
  };
  const getDocumentEmplacement = (field: string): string => {
    const val = (data as any)[`${field}Emplacement`];
    return typeof val === 'string' ? val : '';
  };

  // Fonction pour mettre à jour un document
  const updateDocument = (field: string, type: 'possede' | 'emplacement', value: boolean | string) => {
    const fieldName = `${field}${type === 'possede' ? 'Possede' : 'Emplacement'}`;
    const updated: any = { ...data };
    updated[fieldName] = value;
    setData(updated);
  };

  // Fonction pour rendre un document avec sa checkbox et son champ d'emplacement
  const renderDocument = (doc: { id: string, field: string }) => {
    const possede = getDocumentPossede(doc.field);
    const emplacement = getDocumentEmplacement(doc.field);

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
          <span>{t.emergencyPlanning.documents[doc.field]}</span>
        </label>
        
        {possede && (
          <input
            type="text"
            className="form-input"
            value={emplacement}
            onChange={(e) => updateDocument(doc.field, 'emplacement', e.target.value)}
            placeholder={t.emergencyPlanning.documents.documentLocation}
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
          {t.emergencyPlanning.documents.importantDocuments}
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

      {/* Informations complémentaires — Coffret de sûreté */}
      <div style={{ marginTop: '24px' }} className="item-card">
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '12px' }}>
          Coffret de sûreté (le cas échéant)
        </h3>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="coffretInstitution">Institution</label>
            <input
              id="coffretInstitution"
              type="text"
              className="form-input"
              title="Institution du coffret"
              value={data.coffretSurete?.institution || ''}
              onChange={(e) => setData({
                ...data,
                coffretSurete: { ...(data.coffretSurete || {}), institution: e.target.value }
              })}
              placeholder="Banque, caisse, etc."
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="coffretNumero">Numéro du coffret</label>
            <input
              id="coffretNumero"
              type="text"
              className="form-input"
              title="Numéro du coffret de sûreté"
              value={data.coffretSurete?.numeroCoffret || ''}
              onChange={(e) => setData({
                ...data,
                coffretSurete: { ...(data.coffretSurete || {}), numeroCoffret: e.target.value }
              })}
              placeholder="Numéro"
            />
          </div>
          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label" htmlFor="coffretCles">Emplacement des clés</label>
            <input
              id="coffretCles"
              type="text"
              className="form-input"
              title="Emplacement des clés du coffret"
              value={data.coffretSurete?.emplacementsCles || ''}
              onChange={(e) => setData({
                ...data,
                coffretSurete: { ...(data.coffretSurete || {}), emplacementsCles: e.target.value }
              })}
              placeholder="Lieu des clés du coffret"
            />
          </div>
          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label" htmlFor="coffretContenu">Contenu</label>
            <textarea
              id="coffretContenu"
              className="form-input"
              style={{ minHeight: '80px' }}
              title="Contenu du coffret de sûreté"
              value={data.coffretSurete?.contenu || ''}
              onChange={(e) => setData({
                ...data,
                coffretSurete: { ...(data.coffretSurete || {}), contenu: e.target.value }
              })}
              placeholder="Liste sommaire du contenu"
            />
          </div>
          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label" htmlFor="coffretCoti">Cocotitulaires</label>
            <input
              id="coffretCoti"
              type="text"
              className="form-input"
              title="Cocotitulaires du coffret"
              value={data.coffretSurete?.cotitulaires || ''}
              onChange={(e) => setData({
                ...data,
                coffretSurete: { ...(data.coffretSurete || {}), cotitulaires: e.target.value }
              })}
              placeholder="Nom(s) des cocotitulaires"
            />
          </div>
        </div>
      </div>

      {/* Arrangements funéraires */}
      <div style={{ marginTop: '24px' }} className="item-card">
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '12px' }}>
          Arrangements funéraires
        </h3>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="funDispositions">
              Dispositions indiquées (testament ou document)
            </label>
            <input
              id="funDispositions"
              type="checkbox"
              checked={!!data.funerailles?.dispositions}
              title="Dispositions indiquées"
              onChange={(e) => setData({
                ...data,
                funerailles: { ...(data.funerailles || {}), dispositions: e.target.checked }
              })}
              style={{ width: '18px', height: '18px' }}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="funDiscretion">À la discrétion des proches</label>
            <input
              id="funDiscretion"
              type="checkbox"
              checked={!!data.funerailles?.discretionProches}
              title="À la discrétion des proches"
              onChange={(e) => setData({
                ...data,
                funerailles: { ...(data.funerailles || {}), discretionProches: e.target.checked }
              })}
              style={{ width: '18px', height: '18px' }}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="funDepouille">Dépouille</label>
            <select
              id="funDepouille"
              className="form-input"
              title="Choisir l'option de dépouille"
              value={data.funerailles?.depouille || ''}
              onChange={(e) => setData({
                ...data,
                funerailles: { ...(data.funerailles || {}), depouille: e.target.value as any }
              })}
            >
              <option value="">—</option>
              <option value="exposee">Exposée</option>
              <option value="inhumee">Inhumée</option>
              <option value="incineree">Incinérée</option>
            </select>
          </div>
          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label" htmlFor="funPrecisions">Autres précisions</label>
            <textarea
              id="funPrecisions"
              className="form-input"
              style={{ minHeight: '80px' }}
              title="Autres précisions sur les arrangements"
              value={data.funerailles?.autresPrecisions || ''}
              onChange={(e) => setData({
                ...data,
                funerailles: { ...(data.funerailles || {}), autresPrecisions: e.target.value }
              })}
              placeholder="Détails supplémentaires"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="funContrat">Contrat préalable</label>
            <input
              id="funContrat"
              type="checkbox"
              checked={!!data.funerailles?.contratPrealable}
              title="Contrat préalable relatif aux funérailles"
              onChange={(e) => setData({
                ...data,
                funerailles: { ...(data.funerailles || {}), contratPrealable: e.target.checked }
              })}
              style={{ width: '18px', height: '18px' }}
            />
          </div>
          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">Entrepreneur (nom, téléphone, adresse)</label>
            <input
              type="text"
              className="form-input"
              value={
                data.funerailles?.entrepreneur
                  ? `${data.funerailles.entrepreneur.nom || ''} ${data.funerailles.entrepreneur.telephone || ''} ${data.funerailles.entrepreneur.adresse || ''}`.trim()
                  : ''
              }
              onChange={(e) => {
                // saisie libre; laisser l’utilisateur structurer; champs détaillés pourront être ajoutés plus tard
                setData({
                  ...data,
                  funerailles: {
                    ...(data.funerailles || {}),
                    entrepreneur: { nom: e.target.value, telephone: '', adresse: '' }
                  }
                });
              }}
              placeholder="Nom / téléphone / adresse"
            />
          </div>
          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">Emplacement des documents</label>
            <input
              type="text"
              className="form-input"
              value={data.funerailles?.emplacementDocuments || ''}
              onChange={(e) => setData({
                ...data,
                funerailles: { ...(data.funerailles || {}), emplacementDocuments: e.target.value }
              })}
              placeholder="Où se trouvent les documents relatifs aux funérailles"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsSection;
