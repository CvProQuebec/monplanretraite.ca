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
        {t.emergencyPlanning.testament.title}
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
              {t.emergencyPlanning.testament.hasWill}
            </span>
          </label>
        </div>
      </div>

      {data.possedeTestament && (
        <>
          {/* Informations sur le testament */}
          <div className="item-card" style={{marginBottom: '20px'}}>
            <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px'}}>
              {t.emergencyPlanning.testament.willDetails}
            </h3>
            
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                  {t.emergencyPlanning.testament.willLocation}
                </label>
                <input
                  type="text"
                  className="form-input senior-form-input"
                  value={data.lieuTestament || ''}
                  onChange={(e) => setData({...data, lieuTestament: e.target.value})}
                  placeholder={t.emergencyPlanning.testament.willLocationPlaceholder}
                  style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
                />
              </div>

              <div className="form-field">
                <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                  {t.emergencyPlanning.testament.copyLocation}
                </label>
                <input
                  type="text"
                  className="form-input senior-form-input"
                  value={data.emplacementCopieTestament || ''}
                  onChange={(e) => setData({...data, emplacementCopieTestament: e.target.value})}
                  placeholder={t.emergencyPlanning.testament.copyLocationPlaceholder}
                  style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
                />
              </div>
            </div>
          </div>

          {/* Informations sur l'exécuteur testamentaire */}
          <div className="item-card" style={{marginBottom: '20px'}}>
            <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px'}}>
              {t.emergencyPlanning.testament.executorInfo}
            </h3>
            
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                  {t.emergencyPlanning.testament.executor}
                </label>
                <input
                  type="text"
                  className="form-input senior-form-input"
                  value={data.executeurTestamentaire || ''}
                  onChange={(e) => setData({...data, executeurTestamentaire: e.target.value})}
                  placeholder={t.emergencyPlanning.testament.executorPlaceholder}
                  style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
                />
              </div>

              <div className="form-field">
                <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                  {t.emergencyPlanning.testament.executorPhone}
                </label>
                <input
                  type="tel"
                  className="form-input senior-form-input"
                  value={data.executeurTelephone || ''}
                  onChange={(e) => setData({...data, executeurTelephone: e.target.value})}
                  placeholder={t.emergencyPlanning.testament.phonePlaceholder}
                  style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
                />
              </div>
            </div>
          </div>

          {/* Informations sur le notaire */}
          <div className="item-card" style={{marginBottom: '20px'}}>
            <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px'}}>
              {t.emergencyPlanning.testament.notaryInfo}
            </h3>
            
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                  {t.emergencyPlanning.testament.notaryName}
                </label>
                <input
                  type="text"
                  className="form-input senior-form-input"
                  value={data.notaire || ''}
                  onChange={(e) => setData({...data, notaire: e.target.value})}
                  placeholder={t.emergencyPlanning.testament.notaryNamePlaceholder}
                  style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
                />
              </div>

              <div className="form-field">
                <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                  {t.emergencyPlanning.testament.notaryPhone}
                </label>
                <input
                  type="tel"
                  className="form-input senior-form-input"
                  value={data.notaireTelephone || ''}
                  onChange={(e) => setData({...data, notaireTelephone: e.target.value})}
                  placeholder={t.emergencyPlanning.testament.phonePlaceholder}
                  style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
                />
              </div>

              <div className="form-field" style={{gridColumn: '1 / -1'}}>
                <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                  {t.emergencyPlanning.testament.notaryAddress}
                </label>
                <textarea
                  className="form-input senior-form-input"
                  style={{minHeight: '60px', resize: 'vertical', fontSize: '18px', padding: '12px 16px'}}
                  value={data.notaireAdresse || ''}
                  onChange={(e) => setData({...data, notaireAdresse: e.target.value})}
                  placeholder={t.emergencyPlanning.testament.notaryAddressPlaceholder}
                />
              </div>

              <div className="form-field">
                <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                  {t.emergencyPlanning.testament.minuteNumber}
                </label>
                <input
                  type="text"
                  className="form-input senior-form-input"
                  value={data.numeroMinuteTestament || ''}
                  onChange={(e) => setData({...data, numeroMinuteTestament: e.target.value})}
                  placeholder={t.emergencyPlanning.testament.minuteNumberPlaceholder}
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
          {t.emergencyPlanning.testament.endOfLifeWishes}
        </h3>
        
        <div className="form-grid">
          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">
              {t.emergencyPlanning.testament.livingWill}
            </label>
            <textarea
              className="form-input"
              style={{minHeight: '100px', resize: 'vertical'}}
              value={data.testamentVie || ''}
              onChange={(e) => setData({...data, testamentVie: e.target.value})}
              placeholder={t.emergencyPlanning.testament.livingWillPlaceholder}
            />
          </div>

          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">
              {t.emergencyPlanning.testament.organDonation}
            </label>
            <textarea
              className="form-input"
              style={{minHeight: '80px', resize: 'vertical'}}
              value={data.donOrganes || ''}
              onChange={(e) => setData({...data, donOrganes: e.target.value})}
              placeholder={t.emergencyPlanning.testament.organDonationPlaceholder}
            />
          </div>

          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">
              {t.emergencyPlanning.testament.funeralWishes}
            </label>
            <textarea
              className="form-input"
              style={{minHeight: '120px', resize: 'vertical'}}
              value={data.volontesFuneraires || ''}
              onChange={(e) => setData({...data, volontesFuneraires: e.target.value})}
              placeholder={t.emergencyPlanning.testament.funeralWishesPlaceholder}
            />
          </div>
        </div>
      </div>

      {/* Instructions spéciales supplémentaires */}
      <div className="item-card">
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px'}}>
          {t.emergencyPlanning.testament.specialInstructions}
        </h3>
        
        <div className="form-field">
          <label className="form-label">
            {t.emergencyPlanning.testament.additionalInstructions}
          </label>
          <textarea
            className="form-input"
            style={{minHeight: '120px', resize: 'vertical'}}
            value={data.instructionsSpeciales || ''}
            onChange={(e) => setData({...data, instructionsSpeciales: e.target.value})}
            placeholder={t.emergencyPlanning.testament.additionalInstructionsPlaceholder}
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
          <strong>{t.emergencyPlanning.testament.importantNote} :</strong>{' '}
          {t.emergencyPlanning.testament.importantNoteText}
        </p>
      </div>
    </div>
  );
};

export default TestamentSection;