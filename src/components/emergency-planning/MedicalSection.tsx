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
  
  // Liste des spécialités médicales par ordre alphabétique
  const getSpecialties = () => [
    { value: "", label: t.emergencyPlanning.medical.selectSpecialtyOption },
    { value: "Autre", label: t.emergencyPlanning.medical.other },
    { value: "Cardiologie", label: t.emergencyPlanning.medical.cardiology },
    { value: "Dermatologie", label: t.emergencyPlanning.medical.dermatology },
    { value: "Endocrinologie", label: t.emergencyPlanning.medical.endocrinology },
    { value: "Gynécologie", label: t.emergencyPlanning.medical.gynecology },
    { value: "Neurologie", label: t.emergencyPlanning.medical.neurology },
    { value: "Oncologie", label: t.emergencyPlanning.medical.oncology },
    { value: "Ophtalmologie", label: t.emergencyPlanning.medical.ophthalmology },
    { value: "Orthopédie", label: t.emergencyPlanning.medical.orthopedics },
    { value: "Pneumologie", label: t.emergencyPlanning.medical.pulmonology },
    { value: "Urologie", label: t.emergencyPlanning.medical.urology }
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
        {t.emergencyPlanning.medical.title}
      </h2>
      
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label" htmlFor="groupeSanguin">{t.emergencyPlanning.medical.bloodType}</label>
          <select
            id="groupeSanguin"
            title={t.emergencyPlanning.medical.bloodTypeSelectTitle}
            className="form-input"
            value={data.groupeSanguin}
            onChange={(e) => setData({...data, groupeSanguin: e.target.value})}
          >
            <option value="">{t.emergencyPlanning.medical.bloodTypeSelect}</option>
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
          <label className="form-label">{t.emergencyPlanning.medical.knownAllergies}</label>
          <textarea
            className="form-input"
            style={{minHeight: '60px'}}
            value={data.allergies}
            onChange={(e) => setData({...data, allergies: e.target.value})}
            placeholder={t.emergencyPlanning.medical.allergiesPlaceholder}
          />
        </div>
        <div className="form-field" style={{gridColumn: '1 / -1'}}>
          <label className="form-label">{t.emergencyPlanning.medical.currentMedicalConditions}</label>
          <textarea
            className="form-input"
            style={{minHeight: '60px'}}
            value={data.conditionsMedicales}
            onChange={(e) => setData({...data, conditionsMedicales: e.target.value})}
            placeholder={t.emergencyPlanning.medical.conditionsPlaceholder}
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
          title={t.emergencyPlanning.medical.medicalContactsTitle}
          onClick={() => toggleSection('contactsMedicaux')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSection('contactsMedicaux')}
        >
          <div className="section-title">
            <Stethoscope size={22} />
            <span>{t.emergencyPlanning.medical.medicalContacts}</span>
            <span className="collapsible-hint">{t.emergencyPlanning.medical.medicalContactsHint}</span>
          </div>
          <div className="collapsible-right">
            <span className="badge-info">{t.emergencyPlanning.medical.toComplete}</span>
            {expandedSections.contactsMedicaux ? <ChevronDown className="chev" size={24} /> : <ChevronRight className="chev" size={24} />}
          </div>
        </div>
        {expandedSections.contactsMedicaux && (
          <div id="section-contacts-medicaux" className="collapsible-content" aria-labelledby="contactsMedicauxHeader">
            <div className="form-grid">
              {/* Médecin de famille */}
              <div className="form-field" style={{gridColumn: '1 / -1'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px'}}>{t.emergencyPlanning.medical.familyDoctor}</h3>
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.medical.doctorName}</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.medecinFamilleNom}
                  onChange={(e) => setData({...data, medecinFamilleNom: e.target.value})}
                  placeholder={t.emergencyPlanning.medical.doctorNamePlaceholder}
                />
              </div>
              <div className="form-field" style={{gridColumn: 'span 2'}}>
                <label className="form-label">{t.emergencyPlanning.medical.address}</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.medecinFamilleAdresse}
                  onChange={(e) => setData({...data, medecinFamilleAdresse: e.target.value})}
                  placeholder={t.emergencyPlanning.medical.addressPlaceholder}
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.medical.phone}</label>
                <input
                  type="tel"
                  className="form-input"
                  value={data.medecinFamilleTelephone}
                  onChange={(e) => setData({...data, medecinFamilleTelephone: e.target.value})}
                  placeholder={t.emergencyPlanning.medical.phonePlaceholder}
                />
              </div>

              {/* Spécialiste 1 */}
              <div className="form-field" style={{gridColumn: '1 / -1'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '24px 0 16px 0'}}>{t.emergencyPlanning.medical.specialist} 1</h3>
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="specialite1">{t.emergencyPlanning.medical.specialty}</label>
                <select
                  id="specialite1"
                  title={t.emergencyPlanning.medical.selectSpecialtyTitle}
                  className="form-input"
                  value={data.specialiste1Specialite}
                  onChange={(e) => setData({...data, specialiste1Specialite: e.target.value})}
                >
                  {getSpecialties().map((spec, index) => (
                    <option key={index} value={spec.value}>
                      {spec.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.medical.specialistName}</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.specialiste1Nom}
                  onChange={(e) => setData({...data, specialiste1Nom: e.target.value})}
                  placeholder={t.emergencyPlanning.medical.specialistNamePlaceholder}
                />
              </div>
              <div className="form-field" style={{gridColumn: 'span 2'}}>
                <label className="form-label">{t.emergencyPlanning.medical.address}</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.specialiste1Adresse}
                  onChange={(e) => setData({...data, specialiste1Adresse: e.target.value})}
                  placeholder={t.emergencyPlanning.medical.specialistAddressPlaceholder}
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.medical.phone}</label>
                <input
                  type="tel"
                  className="form-input"
                  value={data.specialiste1Telephone}
                  onChange={(e) => setData({...data, specialiste1Telephone: e.target.value})}
                  placeholder={t.emergencyPlanning.medical.phonePlaceholder}
                />
              </div>

              {/* Spécialiste 2 */}
              <div className="form-field" style={{gridColumn: '1 / -1'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '24px 0 16px 0'}}>{t.emergencyPlanning.medical.specialist} 2</h3>
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="specialite2">{t.emergencyPlanning.medical.specialty}</label>
                <select
                  id="specialite2"
                  title={t.emergencyPlanning.medical.selectSpecialtyTitle}
                  className="form-input"
                  value={data.specialiste2Specialite}
                  onChange={(e) => setData({...data, specialiste2Specialite: e.target.value})}
                >
                  {getSpecialties().map((spec, index) => (
                    <option key={index} value={spec.value}>
                      {spec.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.medical.specialistName}</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.specialiste2Nom}
                  onChange={(e) => setData({...data, specialiste2Nom: e.target.value})}
                  placeholder={t.emergencyPlanning.medical.specialistNamePlaceholder}
                />
              </div>
              <div className="form-field" style={{gridColumn: 'span 2'}}>
                <label className="form-label">{t.emergencyPlanning.medical.address}</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.specialiste2Adresse}
                  onChange={(e) => setData({...data, specialiste2Adresse: e.target.value})}
                  placeholder={t.emergencyPlanning.medical.specialistAddressPlaceholder}
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.medical.phone}</label>
                <input
                  type="tel"
                  className="form-input"
                  value={data.specialiste2Telephone}
                  onChange={(e) => setData({...data, specialiste2Telephone: e.target.value})}
                  placeholder={t.emergencyPlanning.medical.phonePlaceholder}
                />
              </div>

              {/* Spécialiste 3 */}
              <div className="form-field" style={{gridColumn: '1 / -1'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '24px 0 16px 0'}}>{t.emergencyPlanning.medical.specialist} 3</h3>
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="specialite3">{t.emergencyPlanning.medical.specialty}</label>
                <select
                  id="specialite3"
                  title={t.emergencyPlanning.medical.selectSpecialtyTitle}
                  className="form-input"
                  value={data.specialiste3Specialite}
                  onChange={(e) => setData({...data, specialiste3Specialite: e.target.value})}
                >
                  {getSpecialties().map((spec, index) => (
                    <option key={index} value={spec.value}>
                      {spec.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.medical.specialistName}</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.specialiste3Nom}
                  onChange={(e) => setData({...data, specialiste3Nom: e.target.value})}
                  placeholder={t.emergencyPlanning.medical.specialistNamePlaceholder}
                />
              </div>
              <div className="form-field" style={{gridColumn: 'span 2'}}>
                <label className="form-label">{t.emergencyPlanning.medical.address}</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.specialiste3Adresse}
                  onChange={(e) => setData({...data, specialiste3Adresse: e.target.value})}
                  placeholder={t.emergencyPlanning.medical.specialistAddressPlaceholder}
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.medical.phone}</label>
                <input
                  type="tel"
                  className="form-input"
                  value={data.specialiste3Telephone}
                  onChange={(e) => setData({...data, specialiste3Telephone: e.target.value})}
                  placeholder={t.emergencyPlanning.medical.phonePlaceholder}
                />
              </div>

              {/* Dentiste */}
              <div className="form-field" style={{gridColumn: '1 / -1'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '24px 0 16px 0'}}>{t.emergencyPlanning.medical.dentist}</h3>
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.medical.dentistName}</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.dentisteNom}
                  onChange={(e) => setData({...data, dentisteNom: e.target.value})}
                  placeholder={t.emergencyPlanning.medical.dentistNamePlaceholder}
                />
              </div>
              <div className="form-field" style={{gridColumn: 'span 2'}}>
                <label className="form-label">{t.emergencyPlanning.medical.address}</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.dentisteAdresse}
                  onChange={(e) => setData({...data, dentisteAdresse: e.target.value})}
                  placeholder={t.emergencyPlanning.medical.dentistAddressPlaceholder}
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.medical.phone}</label>
                <input
                  type="tel"
                  className="form-input"
                  value={data.dentisteTelephone}
                  onChange={(e) => setData({...data, dentisteTelephone: e.target.value})}
                  placeholder={t.emergencyPlanning.medical.phonePlaceholder}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section Pharmacie - déplacée à la fin comme demandé */}
      <div style={{marginTop: '24px'}}>
        <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px'}}>{t.emergencyPlanning.medical.pharmacy}</h3>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">{t.emergencyPlanning.medical.usualPharmacy}</label>
            <input
              type="text"
              className="form-input"
              value={data.pharmacieNom}
              onChange={(e) => setData({...data, pharmacieNom: e.target.value})}
              placeholder={t.emergencyPlanning.medical.pharmacyName}
            />
          </div>
          <div className="form-field" style={{gridColumn: 'span 2'}}>
            <label className="form-label">{t.emergencyPlanning.medical.pharmacyAddress}</label>
            <input
              type="text"
              className="form-input"
              value={data.pharmacieAdresse}
              onChange={(e) => setData({...data, pharmacieAdresse: e.target.value})}
              placeholder={t.emergencyPlanning.medical.pharmacyAddressPlaceholder}
            />
          </div>
          <div className="form-field">
            <label className="form-label">{t.emergencyPlanning.medical.pharmacyPhone}</label>
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
          {t.emergencyPlanning.medical.medications}
        </h3>
        
        <button 
          className="add-button" 
          onClick={addMedicament}
          style={{marginBottom: '16px'}}
        >
          <Plus size={16} />
          {t.emergencyPlanning.medical.addMedication}
        </button>

        {data.medicaments.map((med) => (
          <div key={med.id} className="item-card">
            <div className="item-header">
              <h4 style={{margin: 0, fontSize: '16px', fontWeight: '600'}}>
                {med.nom || t.emergencyPlanning.medical.newMedication}
              </h4>
              <button
                className="delete-button"
                onClick={() => removeMedicament(med.id)}
                aria-label={t.emergencyPlanning.medical.deleteMedication}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.medical.medicationName}</label>
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
                  placeholder={t.emergencyPlanning.medical.medicationNamePlaceholder}
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.medical.dosage}</label>
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
                  placeholder={t.emergencyPlanning.medical.dosagePlaceholder}
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.medical.frequency}</label>
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
                  placeholder={t.emergencyPlanning.medical.frequencyPlaceholder}
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.medical.prescriber}</label>
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
                  placeholder={t.emergencyPlanning.medical.prescriberPlaceholder}
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