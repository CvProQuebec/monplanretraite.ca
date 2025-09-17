import React from 'react';
import { FileCheck } from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { EmergencyData } from './types';

interface TestamentSectionProps {
  data: EmergencyData;
  setData: (data: EmergencyData) => void;
}

const TestamentSection: React.FC<TestamentSectionProps> = ({ data, setData }) => {
  const { t } = useLanguage();

  return (
    <div className="form-section">
      <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <FileCheck size={24} />
        {t.emergencyPlanning.testament?.title || 'Testament et succession'}
      </h2>

      {/* Possession de testament */}
      <div className="item-card" style={{marginBottom: '20px'}}>
        <div className="form-field">
          <label style={{display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'}}>
            <input
              type="checkbox"
              checked={data.possedeTestament || false}
              onChange={(e) => setData({...data, possedeTestament: e.target.checked})}
              style={{width: '18px', height: '18px'}}
            />
            <span style={{fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>
              {t.emergencyPlanning.testament?.hasWill || 'Je possède un testament'}
            </span>
          </label>
        </div>
      </div>

      {data.possedeTestament && (
        <>
          {/* Informations sur le testament */}
          <div className="item-card" style={{marginBottom: '20px'}}>
            <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px'}}>
              {t.emergencyPlanning.testament?.willDetails || 'Détails du testament'}
            </h3>
            
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                  {t.emergencyPlanning.testament?.willLocation || 'Emplacement du testament'}
                </label>
                <input
                  type="text"
                  className="form-input senior-form-input"
                  value={data.lieuTestament || ''}
                  onChange={(e) => setData({...data, lieuTestament: e.target.value})}
                  placeholder="Où se trouve votre testament"
                  style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
                />
              </div>

              <div className="form-field">
                <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                  {t.emergencyPlanning.testament?.copyLocation || 'Emplacement de votre copie du testament'}
                </label>
                <input
                  type="text"
                  className="form-input senior-form-input"
                  value={data.emplacementCopieTestament || ''}
                  onChange={(e) => setData({...data, emplacementCopieTestament: e.target.value})}
                  placeholder="Où se trouve votre copie personnelle"
                  style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
                />
              </div>
            </div>
          </div>

          {/* Informations sur l'exécuteur testamentaire */}
          <div className="item-card" style={{marginBottom: '20px'}}>
            <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px'}}>
              {t.emergencyPlanning.testament?.executorInfo || 'Informations de l\'exécuteur testamentaire'}
            </h3>
            
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                  {t.emergencyPlanning.testament?.executor || 'Nom de l\'exécuteur testamentaire'}
                </label>
                <input
                  type="text"
                  className="form-input senior-form-input"
                  value={data.executeurTestamentaire || ''}
                  onChange={(e) => setData({...data, executeurTestamentaire: e.target.value})}
                  placeholder="Nom complet de l'exécuteur"
                  style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
                />
              </div>

              <div className="form-field">
                <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                  {t.emergencyPlanning.testament?.executorPhone || 'Téléphone de l\'exécuteur'}
                </label>
                <input
                  type="tel"
                  className="form-input senior-form-input"
                  value={data.executeurTelephone || ''}
                  onChange={(e) => setData({...data, executeurTelephone: e.target.value})}
                  placeholder="(XXX) XXX-XXXX"
                  style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
                />
              </div>
            </div>
          </div>

          {/* Informations sur le notaire */}
          <div className="item-card" style={{marginBottom: '20px'}}>
            <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px'}}>
              {t.emergencyPlanning.testament?.notaryInfo || 'Informations du notaire'}
            </h3>
            
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                  {t.emergencyPlanning.testament?.notaryName || 'Nom du notaire'}
                </label>
                <input
                  type="text"
                  className="form-input senior-form-input"
                  value={data.notaire || ''}
                  onChange={(e) => setData({...data, notaire: e.target.value})}
                  placeholder="Nom complet du notaire"
                  style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
                />
              </div>

              <div className="form-field">
                <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                  {t.emergencyPlanning.testament?.notaryPhone || 'Téléphone'}
                </label>
                <input
                  type="tel"
                  className="form-input senior-form-input"
                  value={data.notaireTelephone || ''}
                  onChange={(e) => setData({...data, notaireTelephone: e.target.value})}
                  placeholder="(XXX) XXX-XXXX"
                  style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
                />
              </div>

              <div className="form-field" style={{gridColumn: '1 / -1'}}>
                <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                  {t.emergencyPlanning.testament?.notaryAddress || 'Adresse du notaire'}
                </label>
                <textarea
                  className="form-input senior-form-input"
                  style={{minHeight: '60px', resize: 'vertical', fontSize: '18px', padding: '12px 16px'}}
                  value={data.notaireAdresse || ''}
                  onChange={(e) => setData({...data, notaireAdresse: e.target.value})}
                  placeholder="Adresse complète du bureau du notaire"
                />
              </div>

              <div className="form-field">
                <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                  {t.emergencyPlanning.testament?.minuteNumber || 'Numéro de minute du testament'}
                </label>
                <input
                  type="text"
                  className="form-input senior-form-input"
                  value={data.numeroMinuteTestament || ''}
                  onChange={(e) => setData({...data, numeroMinuteTestament: e.target.value})}
                  placeholder="Numéro de référence du testament"
                  style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Volontés en fin de vie */}
      <div className="item-card" style={{marginBottom: '20px'}}>
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px'}}>
          {t.emergencyPlanning.testament?.endOfLifeWishes || 'Volontés en fin de vie'}
        </h3>
        
        <div className="form-grid">
          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">
              {t.emergencyPlanning.testament?.livingWill || 'Testament de vie / Directives médicales'}
            </label>
            <textarea
              className="form-input"
              style={{minHeight: '100px', resize: 'vertical'}}
              value={data.testamentVie || ''}
              onChange={(e) => setData({...data, testamentVie: e.target.value})}
              placeholder="Vos volontés concernant les soins médicaux en fin de vie"
            />
          </div>

          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">
              {t.emergencyPlanning.testament?.organDonation || 'Don d\'organes'}
            </label>
            <textarea
              className="form-input"
              style={{minHeight: '80px', resize: 'vertical'}}
              value={data.donOrganes || ''}
              onChange={(e) => setData({...data, donOrganes: e.target.value})}
              placeholder="Vos volontés concernant le don d'organes et de tissus"
            />
          </div>

          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">
              {t.emergencyPlanning.testament?.funeralWishes || 'Volontés funéraires'}
            </label>
            <textarea
              className="form-input"
              style={{minHeight: '120px', resize: 'vertical'}}
              value={data.volontesFuneraires || ''}
              onChange={(e) => setData({...data, volontesFuneraires: e.target.value})}
              placeholder="Vos volontés concernant les funérailles, crémation, inhumation, service religieux, etc."
            />
          </div>
        </div>
      </div>

      {/* Instructions spéciales supplémentaires */}
      <div className="item-card">
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px'}}>
          {t.emergencyPlanning.testament?.specialInstructions || 'Instructions spéciales'}
        </h3>
        
        <div className="form-field">
          <label className="form-label">
            {t.emergencyPlanning.testament?.additionalInstructions || 'Instructions supplémentaires pour vos proches'}
          </label>
          <textarea
            className="form-input"
            style={{minHeight: '120px', resize: 'vertical'}}
            value={data.instructionsSpeciales || ''}
            onChange={(e) => setData({...data, instructionsSpeciales: e.target.value})}
            placeholder="Toute autre instruction importante que vous souhaitez laisser à vos proches (messages personnels, souhaits particuliers, objets à léguer à des personnes spécifiques, etc.)"
          />
        </div>
      </div>

      {/* Note informative */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#eff6ff',
        borderRadius: '8px',
        borderLeft: '4px solid #3b82f6'
      }}>
        <p style={{margin: 0, fontSize: '14px', color: '#1e40af'}}>
          <strong>{t.emergencyPlanning.testament?.importantNote || 'Note importante'} :</strong>{' '}
          {t.emergencyPlanning.testament?.importantNoteText || 'Il est recommandé de réviser et mettre à jour votre testament régulièrement, surtout après des événements majeurs de la vie (mariage, divorce, naissance, décès, acquisition de biens importants).'}
        </p>
      </div>
    </div>
  );
};

export default TestamentSection;