import React from 'react';
import { Heart, Plus, Trash2, Pill, Stethoscope, ChevronDown, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { EmergencyData, Medicament, ContactMedical } from './types';

interface MedicalSectionProps {
  data: EmergencyData;
  setData: (data: EmergencyData) => void;
  expandedSections?: {[key: string]: boolean};
  toggleSection?: (section: string) => void;
}

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

const MedicalSection: React.FC<MedicalSectionProps> = ({ data, setData, expandedSections = {}, toggleSection = () => {} }) => {
  const { t } = useLanguage();
  
  // Liste des spécialités médicales par ordre alphabétique (récupérée du fichier de sauvegarde)
  const specialites = [
    "Sélectionner une spécialité",
    "Autre",
    "Cardiologie",
    "Dermatologie", 
    "Endocrinologie",
    "Gynécologie",
    "Neurologie",
    "Oncologie",
    "Ophtalmologie",
    "Orthopédie",
    "Pneumologie",
    "Urologie"
  ];

  const addMedicament = () => {
    const newMedicament: Medicament = {
      id: generateId(),
      nom: '',
      dosage: '',
      frequence: '',
      prescripteur: ''
    };
    setData({...data, medicaments: [...data.medicaments, newMedicament]});
  };

  const removeMedicament = (id: string) => {
    setData({...data, medicaments: data.medicaments.filter(m => m.id !== id)});
  };

  const addContactMedical = () => {
    const newContact: ContactMedical = {
      id: generateId(),
      nom: '',
      specialite: '',
      telephone: '',
      courriel: ''
    };
    setData({...data, contactsMedicaux: [...data.contactsMedicaux, newContact]});
  };

  const removeContactMedical = (id: string) => {
    setData({...data, contactsMedicaux: data.contactsMedicaux.filter(c => c.id !== id)});
  };

  return (
    <div className="form-section">
      <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <Heart size={24} />
        Informations médicales
      </h2>
      
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label" htmlFor="groupeSanguin">Groupe sanguin</label>
          <select
            id="groupeSanguin"
            title="Sélectionner votre groupe sanguin"
            className="form-input"
            value={data.groupeSanguin}
            onChange={(e) => setData({...data, groupeSanguin: e.target.value})}
          >
            <option value="">Sélectionner</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div className="form-field" style={{gridColumn: '1 / -1'}}>
          <label className="form-label">Allergies connues</label>
          <textarea
            className="form-input"
            style={{minHeight: '60px'}}
            value={data.allergies}
            onChange={(e) => setData({...data, allergies: e.target.value})}
            placeholder="Médicaments, aliments, substances auxquels vous êtes allergique"
          />
        </div>
        <div className="form-field" style={{gridColumn: '1 / -1'}}>
          <label className="form-label">Conditions médicales actuelles</label>
          <textarea
            className="form-input"
            style={{minHeight: '60px'}}
            value={data.conditionsMedicales}
            onChange={(e) => setData({...data, conditionsMedicales: e.target.value})}
            placeholder="Maladies chroniques, conditions médicales importantes"
          />
        </div>
      </div>

      {/* Section Contacts médicaux */}
      <div className="collapsible-section">
        <div
          className="collapsible-header"
          id="contactsMedicauxHeader"
          role="button"
          tabIndex={0}
          aria-expanded={!!expandedSections.contactsMedicaux}
          aria-controls="section-contacts-medicaux"
          title="Ouvrir la section Contacts médicaux"
          onClick={() => toggleSection('contactsMedicaux')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSection('contactsMedicaux')}
        >
          <div className="section-title">
            <Stethoscope size={22} />
            <span>Contacts médicaux</span>
            <span className="collapsible-hint">Cliquez pour compléter</span>
          </div>
          <div className="collapsible-right">
            <span className="badge-info">À compléter</span>
            {expandedSections.contactsMedicaux ? <ChevronDown className="chev" size={24} /> : <ChevronRight className="chev" size={24} />}
          </div>
        </div>
        {expandedSections.contactsMedicaux && (
          <div id="section-contacts-medicaux" className="collapsible-content" aria-labelledby="contactsMedicauxHeader">
            <div className="form-grid">
              {/* Médecin de famille */}
              <div className="form-field" style={{gridColumn: '1 / -1'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px'}}>Médecin de famille</h3>
              </div>
              <div className="form-field">
                <label className="form-label">Nom du médecin</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.medecinFamilleNom}
                  onChange={(e) => setData({...data, medecinFamilleNom: e.target.value})}
                  placeholder="Dr. Dupont"
                />
              </div>
              <div className="form-field" style={{gridColumn: 'span 2'}}>
                <label className="form-label">Adresse</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.medecinFamilleAdresse}
                  onChange={(e) => setData({...data, medecinFamilleAdresse: e.target.value})}
                  placeholder="123 rue de la Santé, Ville, QC"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={data.medecinFamilleTelephone}
                  onChange={(e) => setData({...data, medecinFamilleTelephone: e.target.value})}
                  placeholder="(XXX) XXX-XXXX"
                />
              </div>

              {/* Spécialiste 1 */}
              <div className="form-field" style={{gridColumn: '1 / -1'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '24px 0 16px 0'}}>Spécialiste 1</h3>
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="specialite1">Spécialité</label>
                <select
                  id="specialite1"
                  title="Sélectionner une spécialité"
                  className="form-input"
                  value={data.specialiste1Specialite}
                  onChange={(e) => setData({...data, specialiste1Specialite: e.target.value})}
                >
                  {specialites.map((spec, index) => (
                    <option key={index} value={index === 0 ? "" : spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Nom du spécialiste</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.specialiste1Nom}
                  onChange={(e) => setData({...data, specialiste1Nom: e.target.value})}
                  placeholder="Dr. Martin"
                />
              </div>
              <div className="form-field" style={{gridColumn: 'span 2'}}>
                <label className="form-label">Adresse</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.specialiste1Adresse}
                  onChange={(e) => setData({...data, specialiste1Adresse: e.target.value})}
                  placeholder="456 avenue des Spécialistes, Ville, QC"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={data.specialiste1Telephone}
                  onChange={(e) => setData({...data, specialiste1Telephone: e.target.value})}
                  placeholder="(XXX) XXX-XXXX"
                />
              </div>

              {/* Spécialiste 2 */}
              <div className="form-field" style={{gridColumn: '1 / -1'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '24px 0 16px 0'}}>Spécialiste 2</h3>
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="specialite2">Spécialité</label>
                <select
                  id="specialite2"
                  title="Sélectionner une spécialité"
                  className="form-input"
                  value={data.specialiste2Specialite}
                  onChange={(e) => setData({...data, specialiste2Specialite: e.target.value})}
                >
                  {specialites.map((spec, index) => (
                    <option key={index} value={index === 0 ? "" : spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Nom du spécialiste</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.specialiste2Nom}
                  onChange={(e) => setData({...data, specialiste2Nom: e.target.value})}
                  placeholder="Dr. Bernard"
                />
              </div>
              <div className="form-field" style={{gridColumn: 'span 2'}}>
                <label className="form-label">Adresse</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.specialiste2Adresse}
                  onChange={(e) => setData({...data, specialiste2Adresse: e.target.value})}
                  placeholder="789 boulevard Médical, Ville, QC"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={data.specialiste2Telephone}
                  onChange={(e) => setData({...data, specialiste2Telephone: e.target.value})}
                  placeholder="(XXX) XXX-XXXX"
                />
              </div>

              {/* Spécialiste 3 */}
              <div className="form-field" style={{gridColumn: '1 / -1'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '24px 0 16px 0'}}>Spécialiste 3</h3>
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="specialite3">Spécialité</label>
                <select
                  id="specialite3"
                  title="Sélectionner une spécialité"
                  className="form-input"
                  value={data.specialiste3Specialite}
                  onChange={(e) => setData({...data, specialiste3Specialite: e.target.value})}
                >
                  {specialites.map((spec, index) => (
                    <option key={index} value={index === 0 ? "" : spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Nom du spécialiste</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.specialiste3Nom}
                  onChange={(e) => setData({...data, specialiste3Nom: e.target.value})}
                  placeholder="Dr. Dubois"
                />
              </div>
              <div className="form-field" style={{gridColumn: 'span 2'}}>
                <label className="form-label">Adresse</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.specialiste3Adresse}
                  onChange={(e) => setData({...data, specialiste3Adresse: e.target.value})}
                  placeholder="321 rue des Cliniques, Ville, QC"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={data.specialiste3Telephone}
                  onChange={(e) => setData({...data, specialiste3Telephone: e.target.value})}
                  placeholder="(XXX) XXX-XXXX"
                />
              </div>

              {/* Dentiste */}
              <div className="form-field" style={{gridColumn: '1 / -1'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '24px 0 16px 0'}}>Dentiste</h3>
              </div>
              <div className="form-field">
                <label className="form-label">Nom du dentiste</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.dentisteNom}
                  onChange={(e) => setData({...data, dentisteNom: e.target.value})}
                  placeholder="Dr. Tremblay"
                />
              </div>
              <div className="form-field" style={{gridColumn: 'span 2'}}>
                <label className="form-label">Adresse</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.dentisteAdresse}
                  onChange={(e) => setData({...data, dentisteAdresse: e.target.value})}
                  placeholder="159 rue Dentaire, Ville, QC"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={data.dentisteTelephone}
                  onChange={(e) => setData({...data, dentisteTelephone: e.target.value})}
                  placeholder="(XXX) XXX-XXXX"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section Pharmacie - déplacée à la fin comme demandé */}
      <div style={{marginTop: '24px'}}>
        <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px'}}>Pharmacie</h3>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Pharmacie habituelle</label>
            <input
              type="text"
              className="form-input"
              value={data.pharmacieNom}
              onChange={(e) => setData({...data, pharmacieNom: e.target.value})}
              placeholder="Nom de votre pharmacie"
            />
          </div>
          <div className="form-field" style={{gridColumn: 'span 2'}}>
            <label className="form-label">Adresse pharmacie</label>
            <input
              type="text"
              className="form-input"
              value={data.pharmacieAdresse}
              onChange={(e) => setData({...data, pharmacieAdresse: e.target.value})}
              placeholder="Adresse complète de la pharmacie"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Téléphone pharmacie</label>
            <input
              type="tel"
              className="form-input"
              value={data.pharmacieTelephone}
              onChange={(e) => setData({...data, pharmacieTelephone: e.target.value})}
              placeholder="(XXX) XXX-XXXX"
            />
          </div>
        </div>
      </div>

      {/* Section Médicaments */}
      <div style={{marginTop: '32px'}}>
        <h3 style={{fontSize: '20px', fontWeight: '600', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'}}>
          <Pill size={20} />
          Médicaments
        </h3>
        
        <button 
          className="add-button" 
          onClick={addMedicament}
          style={{marginBottom: '16px'}}
        >
          <Plus size={16} />
          Ajouter un médicament
        </button>

        {data.medicaments.map((med) => (
          <div key={med.id} className="item-card">
            <div className="item-header">
              <h4 style={{margin: 0, fontSize: '16px', fontWeight: '600'}}>
                {med.nom || 'Nouveau médicament'}
              </h4>
              <button
                className="delete-button"
                onClick={() => removeMedicament(med.id)}
                aria-label="Supprimer ce médicament"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Nom du médicament</label>
                <input
                  type="text"
                  className="form-input"
                  value={med.nom}
                  onChange={(e) => setData({
                    ...data,
                    medicaments: data.medicaments.map(m =>
                      m.id === med.id ? {...m, nom: e.target.value} : m
                    )
                  })}
                  placeholder="Nom du médicament"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Dosage</label>
                <input
                  type="text"
                  className="form-input"
                  value={med.dosage}
                  onChange={(e) => setData({
                    ...data,
                    medicaments: data.medicaments.map(m =>
                      m.id === med.id ? {...m, dosage: e.target.value} : m
                    )
                  })}
                  placeholder="Ex: 10mg, 2 comprimés"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Fréquence</label>
                <input
                  type="text"
                  className="form-input"
                  value={med.frequence}
                  onChange={(e) => setData({
                    ...data,
                    medicaments: data.medicaments.map(m =>
                      m.id === med.id ? {...m, frequence: e.target.value} : m
                    )
                  })}
                  placeholder="Ex: 2x par jour, au besoin"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Prescripteur</label>
                <input
                  type="text"
                  className="form-input"
                  value={med.prescripteur || ''}
                  onChange={(e) => setData({
                    ...data,
                    medicaments: data.medicaments.map(m =>
                      m.id === med.id ? {...m, prescripteur: e.target.value} : m
                    )
                  })}
                  placeholder="Nom du médecin prescripteur"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalSection;