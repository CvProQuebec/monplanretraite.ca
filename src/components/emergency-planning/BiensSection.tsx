import React from 'react';
import { Home } from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { EmergencyData } from './types';

interface BiensSectionProps {
  data: EmergencyData;
  setData: (data: EmergencyData) => void;
}

const BiensSection: React.FC<BiensSectionProps> = ({ data, setData }) => {
  const { t } = useLanguage();

  const autresProps = data.autresProprietes || [];
  const autresVeh = data.autresVehicules || [];

  return (
    <div className="form-section">
      <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <Home size={24} />
        {t.emergencyPlanning.assets.title}
      </h2>

      {/* Propriétés */}
      <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '12px'}}>
        {t.emergencyPlanning.assets.realEstate}
      </h3>

      {/* Résidence principale */}
      <div className="item-card">
        <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Résidence principale</h4>
        <div className="form-grid">
          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">Adresse</label>
            <textarea
              className="form-input"
              style={{minHeight: '60px'}}
              value={data.residencePrincipale.adresse}
              onChange={(e) => setData({...data, residencePrincipale: {...data.residencePrincipale, adresse: e.target.value}})}
              placeholder="Adresse complète"
            />
          </div>
          <div className="form-field" style={{gridColumn: 'span 2'}}>
            <label className="form-label">Titre de propriété (lieu de conservation)</label>
            <input
              type="text"
              className="form-input"
              value={data.residencePrincipale.titreProprieteLieu}
              onChange={(e) => setData({...data, residencePrincipale: {...data.residencePrincipale, titreProprieteLieu: e.target.value}})}
              placeholder="Lieu où se trouve le titre"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Numéro de lot cadastral</label>
            <input
              type="text"
              className="form-input"
              value={data.residencePrincipale.lotCadastral}
              onChange={(e) => setData({...data, residencePrincipale: {...data.residencePrincipale, lotCadastral: e.target.value}})}
              placeholder="Numéro de lot"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Hypothèque restante</label>
            <select
              className="form-input"
              title="Hypothèque restante"
              value={data.residencePrincipale.hypothequeRestante}
              onChange={(e) => setData({...data, residencePrincipale: {...data.residencePrincipale, hypothequeRestante: e.target.value}})}
            >
              <option value="">Sélectionner</option>
              <option value="Oui">Oui</option>
              <option value="Non">Non</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Institution financière</label>
            <input
              type="text"
              className="form-input"
              value={data.residencePrincipale.institutionFinanciere}
              onChange={(e) => setData({...data, residencePrincipale: {...data.residencePrincipale, institutionFinanciere: e.target.value}})}
              placeholder="Nom de l'institution"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Solde approximatif</label>
            <input
              type="text"
              className="form-input"
              value={data.residencePrincipale.soldeApproximatif}
              onChange={(e) => setData({...data, residencePrincipale: {...data.residencePrincipale, soldeApproximatif: e.target.value}})}
              placeholder="0,00 $"
            />
          </div>
        </div>
      </div>

      {/* Résidence secondaire / maison à revenu / chalet */}
      <div className="item-card">
        <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Résidence secondaire / maison à revenu / chalet</h4>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Titre de propriété</label>
            <input
              type="text"
              className="form-input"
              value={data.residenceSecondaire.titrePropriete}
              onChange={(e) => setData({...data, residenceSecondaire: {...data.residenceSecondaire, titrePropriete: e.target.value}})}
              placeholder="Lieu du titre"
            />
          </div>
          <div className="form-field" style={{gridColumn: 'span 2'}}>
            <label className="form-label">Adresse</label>
            <input
              type="text"
              className="form-input"
              value={data.residenceSecondaire.adresse}
              onChange={(e) => setData({...data, residenceSecondaire: {...data.residenceSecondaire, adresse: e.target.value}})}
              placeholder="Adresse complète"
            />
          </div>
          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">Détails particuliers</label>
            <textarea
              className="form-input"
              style={{minHeight: '60px'}}
              value={data.residenceSecondaire.detailsParticuliers}
              onChange={(e) => setData({...data, residenceSecondaire: {...data.residenceSecondaire, detailsParticuliers: e.target.value}})}
              placeholder="Informations pertinentes"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Hypothèque restante</label>
            <select
              className="form-input"
              title="Hypothèque restante"
              value={data.residenceSecondaire.hypothequeRestante}
              onChange={(e) => setData({...data, residenceSecondaire: {...data.residenceSecondaire, hypothequeRestante: e.target.value}})}
            >
              <option value="">Sélectionner</option>
              <option value="Oui">Oui</option>
              <option value="Non">Non</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Institution financière</label>
            <input
              type="text"
              className="form-input"
              value={data.residenceSecondaire.institutionFinanciere}
              onChange={(e) => setData({...data, residenceSecondaire: {...data.residenceSecondaire, institutionFinanciere: e.target.value}})}
              placeholder="Nom de l'institution"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Solde approximatif</label>
            <input
              type="text"
              className="form-input"
              value={data.residenceSecondaire.soldeApproximatif}
              onChange={(e) => setData({...data, residenceSecondaire: {...data.residenceSecondaire, soldeApproximatif: e.target.value}})}
              placeholder="0,00 $"
            />
          </div>
        </div>
      </div>

      {/* Autres propriétés */}
      <div className="item-card">
        <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Autres propriétés</h4>
        {autresProps.map((p, index) => (
          <div key={p.id || index} className="form-grid" style={{marginBottom: '12px'}}>
            <div className="form-field">
              <label className="form-label">Type de propriété</label>
              <input
                type="text"
                className="form-input"
                value={p.typePropriete}
                onChange={(e) => {
                  const updated = [...autresProps];
                  updated[index] = { ...(updated[index] || { id: p.id }), ...p, typePropriete: e.target.value };
                  setData({...data, autresProprietes: updated});
                }}
                placeholder="Ex: Terrain, Condo, Commerce"
              />
            </div>
            <div className="form-field" style={{gridColumn: 'span 2'}}>
              <label className="form-label">Adresse</label>
              <input
                type="text"
                className="form-input"
                value={p.adresse}
                onChange={(e) => {
                  const updated = [...autresProps];
                  updated[index] = { ...(updated[index] || { id: p.id }), ...p, adresse: e.target.value };
                  setData({...data, autresProprietes: updated});
                }}
                placeholder="Adresse complète"
              />
            </div>
            <div className="form-field" style={{gridColumn: '1 / -1'}}>
              <label className="form-label">Détails</label>
              <textarea
                className="form-input"
                style={{minHeight: '60px'}}
                value={p.details}
                onChange={(e) => {
                  const updated = [...autresProps];
                  updated[index] = { ...(updated[index] || { id: p.id }), ...p, details: e.target.value };
                  setData({...data, autresProprietes: updated});
                }}
                placeholder="Informations pertinentes"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Hypothèque restante</label>
              <select
                className="form-input"
                title="Hypothèque restante"
                value={p.hypothequeRestante}
                onChange={(e) => {
                  const updated = [...autresProps];
                  updated[index] = { ...(updated[index] || { id: p.id }), ...p, hypothequeRestante: e.target.value };
                  setData({...data, autresProprietes: updated});
                }}
              >
                <option value="">Sélectionner</option>
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Institution financière</label>
              <input
                type="text"
                className="form-input"
                value={p.institutionFinanciere}
                onChange={(e) => {
                  const updated = [...autresProps];
                  updated[index] = { ...(updated[index] || { id: p.id }), ...p, institutionFinanciere: e.target.value };
                  setData({...data, autresProprietes: updated});
                }}
                placeholder="Nom de l'institution"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Solde approximatif</label>
              <input
                type="text"
                className="form-input"
                value={p.soldeApproximatif}
                onChange={(e) => {
                  const updated = [...autresProps];
                  updated[index] = { ...(updated[index] || { id: p.id }), ...p, soldeApproximatif: e.target.value };
                  setData({...data, autresProprietes: updated});
                }}
                placeholder="0,00 $"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Biens entreposés - Entrepôt / garde-meuble */}
      <div className="item-card">
        <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Biens entreposés (Entrepôt / garde-meuble)</h4>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Nom de l'entreprise</label>
            <input
              type="text"
              className="form-input"
              value={data.gardeMeuble.nomEntreprise}
              onChange={(e) => setData({...data, gardeMeuble: {...data.gardeMeuble, nomEntreprise: e.target.value}})}
              placeholder="Nom de l'entreprise"
            />
          </div>
          <div className="form-field" style={{gridColumn: 'span 2'}}>
            <label className="form-label">Adresse</label>
            <input
              type="text"
              className="form-input"
              value={data.gardeMeuble.adresse}
              onChange={(e) => setData({...data, gardeMeuble: {...data.gardeMeuble, adresse: e.target.value}})}
              placeholder="Adresse complète"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Numéro du local / unité</label>
            <input
              type="text"
              className="form-input"
              value={data.gardeMeuble.numeroLocal}
              onChange={(e) => setData({...data, gardeMeuble: {...data.gardeMeuble, numeroLocal: e.target.value}})}
              placeholder="Numéro du local"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Code d'accès / lieu de la clé</label>
            <input
              type="text"
              className="form-input"
              value={data.gardeMeuble.codeAccesLieuCle}
              onChange={(e) => setData({...data, gardeMeuble: {...data.gardeMeuble, codeAccesLieuCle: e.target.value}})}
              placeholder="Code ou endroit de la clé"
            />
          </div>
          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">Liste du contenu principal</label>
            <textarea
              className="form-input"
              style={{minHeight: '80px'}}
              value={data.gardeMeuble.listeContenu}
              onChange={(e) => setData({...data, gardeMeuble: {...data.gardeMeuble, listeContenu: e.target.value}})}
              placeholder="Liste des biens entreposés"
            />
          </div>
        </div>
      </div>

      {/* Véhicules */}
      <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', margin: '16px 0 12px'}}>
        {t.emergencyPlanning.assets.vehicles}
      </h3>

      {/* Véhicule principal */}
      <div className="item-card">
        <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Véhicule principal</h4>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Marque / modèle / année</label>
            <input
              type="text"
              className="form-input"
              value={data.vehiculePrincipal.marqueModeleAnnee}
              onChange={(e) => setData({...data, vehiculePrincipal: {...data.vehiculePrincipal, marqueModeleAnnee: e.target.value}})}
              placeholder="Ex: Toyota RAV4 2020"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Numéro d'immatriculation</label>
            <input
              type="text"
              className="form-input"
              value={data.vehiculePrincipal.immatriculation}
              onChange={(e) => setData({...data, vehiculePrincipal: {...data.vehiculePrincipal, immatriculation: e.target.value}})}
              placeholder="Numéro d'immatriculation"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Certificat de propriété (lieu)</label>
            <input
              type="text"
              className="form-input"
              value={data.vehiculePrincipal.certificatLieu}
              onChange={(e) => setData({...data, vehiculePrincipal: {...data.vehiculePrincipal, certificatLieu: e.target.value}})}
              placeholder="Lieu du certificat"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Lieu des clés</label>
            <input
              type="text"
              className="form-input"
              value={data.vehiculePrincipal.lieuCles}
              onChange={(e) => setData({...data, vehiculePrincipal: {...data.vehiculePrincipal, lieuCles: e.target.value}})}
              placeholder="Où sont les clés"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Financement restant</label>
            <select
              className="form-input"
              title="Financement restant"
              value={data.vehiculePrincipal.financementRestant}
              onChange={(e) => setData({...data, vehiculePrincipal: {...data.vehiculePrincipal, financementRestant: e.target.value}})}
            >
              <option value="">Sélectionner</option>
              <option value="Oui">Oui</option>
              <option value="Non">Non</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Institution</label>
            <input
              type="text"
              className="form-input"
              value={data.vehiculePrincipal.institution}
              onChange={(e) => setData({...data, vehiculePrincipal: {...data.vehiculePrincipal, institution: e.target.value}})}
              placeholder="Nom de l'institution"
            />
          </div>
        </div>
      </div>

      {/* Autres véhicules (roulotte, bateau, …) */}
      <div className="item-card">
        <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Autres véhicules (roulotte, bateau, …)</h4>
        {autresVeh.map((v, index) => (
          <div key={v.id || index} className="form-grid" style={{marginBottom: '12px'}}>
            <div className="form-field">
              <label className="form-label">Marque / modèle / année</label>
              <input
                type="text"
                className="form-input"
                value={v.marqueModeleAnnee}
                onChange={(e) => {
                  const updated = [...autresVeh];
                  updated[index] = { ...(updated[index] || { id: v.id }), ...v, marqueModeleAnnee: e.target.value };
                  setData({...data, autresVehicules: updated});
                }}
                placeholder="Ex: Yamaha 242X 2019"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Numéro d'immatriculation</label>
              <input
                type="text"
                className="form-input"
                value={v.immatriculation}
                onChange={(e) => {
                  const updated = [...autresVeh];
                  updated[index] = { ...(updated[index] || { id: v.id }), ...v, immatriculation: e.target.value };
                  setData({...data, autresVehicules: updated});
                }}
                placeholder="Numéro d'immatriculation"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Certificat de propriété (lieu)</label>
              <input
                type="text"
                className="form-input"
                value={v.certificatLieu}
                onChange={(e) => {
                  const updated = [...autresVeh];
                  updated[index] = { ...(updated[index] || { id: v.id }), ...v, certificatLieu: e.target.value };
                  setData({...data, autresVehicules: updated});
                }}
                placeholder="Lieu du certificat"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Lieu des clés</label>
              <input
                type="text"
                className="form-input"
                value={v.lieuCles}
                onChange={(e) => {
                  const updated = [...autresVeh];
                  updated[index] = { ...(updated[index] || { id: v.id }), ...v, lieuCles: e.target.value };
                  setData({...data, autresVehicules: updated});
                }}
                placeholder="Où sont les clés"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Financement restant</label>
              <select
                className="form-input"
                title="Financement restant"
                value={v.financementRestant}
                onChange={(e) => {
                  const updated = [...autresVeh];
                  updated[index] = { ...(updated[index] || { id: v.id }), ...v, financementRestant: e.target.value };
                  setData({...data, autresVehicules: updated});
                }}
              >
                <option value="">Sélectionner</option>
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Institution</label>
              <input
                type="text"
                className="form-input"
                value={v.institution}
                onChange={(e) => {
                  const updated = [...autresVeh];
                  updated[index] = { ...(updated[index] || { id: v.id }), ...v, institution: e.target.value };
                  setData({...data, autresVehicules: updated});
                }}
                placeholder="Nom de l'institution"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BiensSection;