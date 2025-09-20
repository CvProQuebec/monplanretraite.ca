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

      {/* Fiducies */}
      <div className="item-card" style={{marginBottom: '20px'}}>
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px'}}>
          Fiducies (le cas échéant)
        </h3>
        <div className="form-grid">
          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">Description générale des fiducies</label>
            <textarea
              className="form-input"
              style={{minHeight: '100px', resize: 'vertical'}}
              value={(data.fiducies && data.fiducies.length)
                ? data.fiducies.map(f => `${f.type || ''} • ${f.valeur || ''} • Bénéficiaires: ${(f.beneficiaires || []).join(', ')} • Fiduciaires: ${(f.fiduciaires || []).join(', ')}`).join('\n')
                : ''}
              onChange={(e) => {
                const lines = e.target.value.split('\n').filter(Boolean);
                const parsed = lines.map((line, idx) => ({ type: line, valeur: '', beneficiaires: [], fiduciaires: [] }));
                setData({ ...data, fiducies: parsed });
              }}
              placeholder="Saisir une ligne par fiducie (type / valeur / bénéficiaires / fiduciaires)"
            />
          </div>
        </div>
      </div>

      {/* Stratégies successorales */}
      <div className="item-card" style={{marginBottom: '20px'}}>
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px'}}>
          Stratégies successorales (legs, dons planifiés, etc.)
        </h3>
        <div className="form-field">
          <label className="form-label">Liste (une stratégie par ligne)</label>
          <textarea
            className="form-input"
            style={{minHeight: '100px', resize: 'vertical'}}
            value={(data.strategiesSuccessorales || []).join('\n')}
            onChange={(e) => setData({ ...data, strategiesSuccessorales: e.target.value.split('\n').filter(Boolean) })}
            placeholder="Ex.: Legs à un organisme, don planifié CELI, etc."
          />
        </div>
      </div>

      {/* Contrats matrimoniaux / État civil */}
      <div className="item-card" style={{marginBottom: '20px'}}>
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px'}}>
          Contrat de mariage / État civil
        </h3>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="etatCivil">État civil</label>
            <select
              id="etatCivil"
              className="form-input"
              title="État civil"
              value={data.contratsMatrimoniauxEtatCivil?.etatCivil || ''}
              onChange={(e) => setData({
                ...data,
                contratsMatrimoniauxEtatCivil: { ...(data.contratsMatrimoniauxEtatCivil || {}), etatCivil: e.target.value as any }
              })}
            >
              <option value="">—</option>
              <option value="marie">Marié</option>
              <option value="uniCivilement">Uni civilement</option>
              <option value="uniDeFait">Uni de fait</option>
              <option value="celibataire">Célibataire</option>
              <option value="separe">Séparé</option>
              <option value="divorce">Divorcé</option>
              <option value="veuf">Veuf</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Date</label>
            <input
              type="text"
              className="form-input"
              value={data.contratsMatrimoniauxEtatCivil?.date || ''}
              onChange={(e) => setData({
                ...data,
                contratsMatrimoniauxEtatCivil: { ...(data.contratsMatrimoniauxEtatCivil || {}), date: e.target.value }
              })}
              placeholder="AAAA-MM-JJ"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Régime matrimonial</label>
            <input
              type="text"
              className="form-input"
              value={data.contratsMatrimoniauxEtatCivil?.regime || ''}
              onChange={(e) => setData({
                ...data,
                contratsMatrimoniauxEtatCivil: { ...(data.contratsMatrimoniauxEtatCivil || {}), regime: e.target.value }
              })}
              placeholder="Société d’acquêts, séparation de biens, etc."
            />
          </div>
          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">Emplacement du contrat</label>
            <input
              type="text"
              className="form-input"
              value={data.contratsMatrimoniauxEtatCivil?.emplacement || ''}
              onChange={(e) => setData({
                ...data,
                contratsMatrimoniauxEtatCivil: { ...(data.contratsMatrimoniauxEtatCivil || {}), emplacement: e.target.value }
              })}
              placeholder="Où se trouve le contrat"
            />
          </div>
        </div>
      </div>

      {/* Divorce */}
      <div className="item-card" style={{marginBottom: '20px'}}>
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px'}}>
          Divorce / Séparation
        </h3>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="divorceType">Type</label>
            <select
              id="divorceType"
              className="form-input"
              title="Type de séparation"
              value={data.divorce?.typeSeparation || ''}
              onChange={(e) => setData({ ...data, divorce: { ...(data.divorce || {}), typeSeparation: e.target.value as any } })}
            >
              <option value="">—</option>
              <option value="separeFait">Séparé de fait</option>
              <option value="separeLegalement">Séparé légalement</option>
              <option value="divorce">Divorcé</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Date</label>
            <input
              type="text"
              className="form-input"
              value={data.divorce?.date || ''}
              onChange={(e) => setData({ ...data, divorce: { ...(data.divorce || {}), date: e.target.value } })}
              placeholder="AAAA-MM-JJ"
            />
          </div>
          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">Emplacement du jugement</label>
            <input
              type="text"
              className="form-input"
              value={data.divorce?.emplacement || ''}
              onChange={(e) => setData({ ...data, divorce: { ...(data.divorce || {}), emplacement: e.target.value } })}
              placeholder="Où se trouve le jugement"
            />
          </div>
        </div>
      </div>

      {/* Veuvage */}
      <div className="item-card" style={{marginBottom: '20px'}}>
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px'}}>
          Veuvage (si applicable)
        </h3>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Date du décès du conjoint</label>
            <input
              type="text"
              className="form-input"
              value={data.veuvage?.dateDecesConjoint || ''}
              onChange={(e) => setData({ ...data, veuvage: { ...(data.veuvage || {}), dateDecesConjoint: e.target.value } })}
              placeholder="AAAA-MM-JJ"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="certDeces">Certificat de décès en mains</label>
            <input
              id="certDeces"
              type="checkbox"
              checked={!!data.veuvage?.certificatDecesEnMains}
              onChange={(e) => setData({ ...data, veuvage: { ...(data.veuvage || {}), certificatDecesEnMains: e.target.checked } })}
              style={{ width: '18px', height: '18px' }}
            />
          </div>
          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">Emplacement du certificat</label>
            <input
              type="text"
              className="form-input"
              value={data.veuvage?.emplacementCertificat || ''}
              onChange={(e) => setData({ ...data, veuvage: { ...(data.veuvage || {}), emplacementCertificat: e.target.value } })}
              placeholder="Où se trouve le certificat de décès"
            />
          </div>
        </div>
      </div>

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
