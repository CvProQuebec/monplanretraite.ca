import React from 'react';
import { 
  DollarSign, Globe, Key, PiggyBank, ChevronRight, ChevronDown
} from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { EmergencyData, CompteBancaire, CreditCard, PretPersonnel, AutreDette, InvestmentAccount, BrokerAccount } from './types';

interface FinancesSectionProps {
  data: EmergencyData;
  setData: (data: EmergencyData) => void;
  expandedSections: any;
  toggleSection: (section: string) => void;
}

const FinancesSection: React.FC<FinancesSectionProps> = ({ data, setData, expandedSections, toggleSection }) => {
  const { t } = useLanguage();

  // Helpers d'affichage (remplissage minimum requis)
  function padArray<T>(arr: T[], count: number, filler: () => T): T[] {
    return arr.length >= count ? arr.slice(0, count) : [...arr, ...Array(count - arr.length).fill(null).map(filler)];
  }

  const comptes = padArray(data.comptesBancaires, 3, () => ({
    id: `compte-${Date.now()}-${Math.random()}`,
    type: '',
    institution: '',
    numeroCompte: '',
    adresseSuccursale: '',
    coTitulaire: '',
    soldeApproximatif: ''
  }));

  const cartes = padArray(data.cartesCredit || [], 4, () => ({
    id: `carte-${Date.now()}-${Math.random()}`,
    emetteur: '',
    numero4: '',
    soldeApproximatif: ''
  }));

  const prets = (data.pretsPersonnels && data.pretsPersonnels.length
    ? data.pretsPersonnels
    : [{ id: 'pret-1', creancier: '', montant: '', echeance: '' }]) as PretPersonnel[];

  const autresDettes = padArray(data.autresDettes || [], 2, () => ({
    id: `adette-${Date.now()}-${Math.random()}`,
    nom: '',
    contact: '',
    montant: '',
    echeance: ''
  }));

  const padInv = (arr: InvestmentAccount[] | undefined, count: number, prefix: string) =>
    padArray(arr || [], count, () => ({
      id: `${prefix}-${Date.now()}-${Math.random()}`,
      institution: '',
      typeInvestissement: '',
      numeroCompte: '',
      representantNom: '',
      representantContact: ''
    }));

  const reers = padInv(data.reers, 2, 'reer');
  const celis = padInv(data.celis, 2, 'celi');
  const cris = padInv(data.cris, 2, 'cri');
  const ferrs = padInv(data.ferrs, 2, 'ferr');

  const brokers = (data.brokerAccounts && data.brokerAccounts.length
    ? data.brokerAccounts
    : [{ id: 'broker-1', courtier: '', numeroCompte: '', contact: '' }]) as BrokerAccount[];

  return (
    <div className="form-section">
      <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <DollarSign size={24} />
        {t.emergencyPlanning.finances.title}
      </h2>

      {/* Comptes bancaires */}
      <div style={{marginBottom: '16px'}}>
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '12px'}}>
          {t.emergencyPlanning.finances.bankAccounts}
        </h3>
        {comptes.map((c, index) => (
          <div key={c.id || index} className="item-card">
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label" htmlFor={`compteType${index}`}>
                  {t.emergencyPlanning.finances.accountType}
                </label>
                <select
                  id={`compteType${index}`}
                  title={t.emergencyPlanning.finances.accountType}
                  className="form-input"
                  value={c.type}
                  onChange={(e) => {
                    const updated = [...data.comptesBancaires];
                    updated[index] = { ...(updated[index] || { id: c.id }), ...c, type: e.target.value };
                    setData({ ...data, comptesBancaires: updated });
                  }}
                >
                  <option value="">{t.emergencyPlanning.finances.accountTypeSelect}</option>
                  <option value="Chèque">{t.emergencyPlanning.finances.accountTypeChecking}</option>
                  <option value="Épargne">{t.emergencyPlanning.finances.accountTypeSavings}</option>
                  <option value="Entreprise">{t.emergencyPlanning.finances.accountTypeBusiness}</option>
                  <option value="Autre">{t.emergencyPlanning.finances.accountTypeOther}</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.finances.accountNumber}</label>
                <input
                  type="text"
                  className="form-input"
                  value={c.numeroCompte}
                  onChange={(e) => {
                    const updated = [...data.comptesBancaires];
                    updated[index] = { ...(updated[index] || { id: c.id }), ...c, numeroCompte: e.target.value };
                    setData({ ...data, comptesBancaires: updated });
                  }}
                  placeholder="XXXXXXXXXX"
                />
              </div>

              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.finances.institution}</label>
                <input
                  type="text"
                  className="form-input"
                  value={c.institution}
                  onChange={(e) => {
                    const updated = [...data.comptesBancaires];
                    updated[index] = { ...(updated[index] || { id: c.id }), ...c, institution: e.target.value };
                    setData({ ...data, comptesBancaires: updated });
                  }}
                  placeholder={t.emergencyPlanning.finances.institution}
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.finances.branchAddress}</label>
                <input
                  type="text"
                  className="form-input"
                  value={c.adresseSuccursale || ''}
                  onChange={(e) => {
                    const updated = [...data.comptesBancaires];
                    updated[index] = { ...(updated[index] || { id: c.id }), ...c, adresseSuccursale: e.target.value };
                    setData({ ...data, comptesBancaires: updated });
                  }}
                  placeholder={t.emergencyPlanning.finances.branchAddress}
                />
              </div>

              <div className="form-field" style={{gridColumn: '1 / -1'}}>
                <label className="form-label">{t.emergencyPlanning.finances.coHolder}</label>
                <input
                  type="text"
                  className="form-input"
                  value={c.coTitulaire || ''}
                  onChange={(e) => {
                    const updated = [...data.comptesBancaires];
                    updated[index] = { ...(updated[index] || { id: c.id }), ...c, coTitulaire: e.target.value };
                    setData({ ...data, comptesBancaires: updated });
                  }}
                  placeholder={t.emergencyPlanning.finances.coHolder}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cartes de crédit */}
      <div style={{marginBottom: '16px'}}>
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '12px'}}>
          {t.emergencyPlanning.finances.creditCards}
        </h3>
        {cartes.map((carte, index) => (
          <div key={carte.id || index} className="item-card">
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.finances.cardIssuer}</label>
                <input
                  type="text"
                  className="form-input"
                  value={carte.emetteur}
                  onChange={(e) => {
                    const updated = [...(data.cartesCredit || [])];
                    updated[index] = { ...(updated[index] || { id: carte.id }), ...carte, emetteur: e.target.value };
                    setData({ ...data, cartesCredit: updated });
                  }}
                  placeholder={t.emergencyPlanning.finances.cardIssuer}
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.finances.cardLastFour}</label>
                <input
                  type="text"
                  className="form-input"
                  value={carte.numero4}
                  onChange={(e) => {
                    const updated = [...(data.cartesCredit || [])];
                    updated[index] = { ...(updated[index] || { id: carte.id }), ...carte, numero4: e.target.value };
                    setData({ ...data, cartesCredit: updated });
                  }}
                  placeholder="1234"
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.finances.balance}</label>
                <input
                  type="text"
                  className="form-input"
                  value={carte.soldeApproximatif || ''}
                  onChange={(e) => {
                    const updated = [...(data.cartesCredit || [])];
                    updated[index] = { ...(updated[index] || { id: carte.id }), ...carte, soldeApproximatif: e.target.value };
                    setData({ ...data, cartesCredit: updated });
                  }}
                  placeholder="0,00 $"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comptes à l'étranger (collapsible) */}
      <div className="collapsible-section">
        <div
          className="collapsible-header"
          id="etrangerHeader"
          role="button"
          tabIndex={0}
          aria-expanded={!!expandedSections.financesEtranger}
          aria-controls="section-etranger"
          title="Ouvrir la section Comptes à l'étranger"
          onClick={() => toggleSection('financesEtranger')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSection('financesEtranger')}
        >
          <div className="section-title">
            <Globe size={22} />
            <span>{t.emergencyPlanning.finances.foreignAccounts}</span>
            <span className="collapsible-hint">Cliquez pour compléter</span>
          </div>
          <div className="collapsible-right">
            <span className="badge-info">Info</span>
            {expandedSections.financesEtranger ? <ChevronDown className="chev" size={24} /> : <ChevronRight className="chev" size={24} />}
          </div>
        </div>
        {expandedSections.financesEtranger && (
          <div id="section-etranger" className="collapsible-content" aria-labelledby="etrangerHeader">
            <div className="form-field">
              <label className="form-label">{t.emergencyPlanning.finances.informationLabel}</label>
              <textarea
                className="form-input"
                style={{minHeight: '80px'}}
                value={data.comptesEtrangerInfo}
                onChange={(e) => setData({ ...data, comptesEtrangerInfo: e.target.value })}
                placeholder="Relevant information on foreign accounts held"
              />
            </div>
          </div>
        )}
      </div>

      {/* Cryptomonnaies (collapsible) */}
      <div className="collapsible-section">
        <div
          className="collapsible-header"
          id="cryptoHeader"
          role="button"
          tabIndex={0}
          aria-expanded={!!expandedSections.financesCrypto}
          aria-controls="section-crypto"
          title="Ouvrir la section Cryptomonnaies"
          onClick={() => toggleSection('financesCrypto')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSection('financesCrypto')}
        >
          <div className="section-title">
            <Key size={22} />
            <span>{t.emergencyPlanning.finances.cryptoCurrencies}</span>
            <span className="collapsible-hint">Cliquez pour compléter</span>
          </div>
          <div className="collapsible-right">
            <span className="badge-info">Info</span>
            {expandedSections.financesCrypto ? <ChevronDown className="chev" size={24} /> : <ChevronRight className="chev" size={24} />}
          </div>
        </div>
        {expandedSections.financesCrypto && (
          <div id="section-crypto" className="collapsible-content" aria-labelledby="cryptoHeader">
            <div className="form-field">
              <label className="form-label">{t.emergencyPlanning.finances.informationLabel}</label>
              <textarea
                className="form-input"
                style={{minHeight: '80px'}}
                value={data.cryptomonnaiesInfo}
                onChange={(e) => setData({ ...data, cryptomonnaiesInfo: e.target.value })}
                placeholder="Platforms, wallets, secure access, etc."
              />
            </div>
          </div>
        )}
      </div>

      {/* Dettes et obligations */}
      <div style={{margin: '16px 0'}}>
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '12px'}}>
          {t.emergencyPlanning.finances.debtsLoans}
        </h3>

        {/* Prêts personnels */}
        <div className="item-card">
          <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>{t.emergencyPlanning.finances.personalLoans}</h4>
          {prets.map((p, index) => (
            <div key={p.id || index} className="form-grid" style={{marginBottom: '12px'}}>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.finances.creditor}</label>
                <input
                  type="text"
                  className="form-input"
                  value={p.creancier}
                  onChange={(e) => {
                    const updated = [...prets];
                    updated[index] = { ...(updated[index] || { id: p.id }), ...p, creancier: e.target.value };
                    setData({ ...data, pretsPersonnels: updated });
                  }}
                  placeholder={t.emergencyPlanning.finances.creditor}
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.finances.amount}</label>
                <input
                  type="text"
                  className="form-input"
                  value={p.montant}
                  onChange={(e) => {
                    const updated = [...prets];
                    updated[index] = { ...(updated[index] || { id: p.id }), ...p, montant: e.target.value };
                    setData({ ...data, pretsPersonnels: updated });
                  }}
                  placeholder="0,00 $"
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.finances.dueDate}</label>
                <input
                  type="text"
                  className="form-input"
                  value={p.echeance}
                  onChange={(e) => {
                    const updated = [...prets];
                    updated[index] = { ...(updated[index] || { id: p.id }), ...p, echeance: e.target.value };
                    setData({ ...data, pretsPersonnels: updated });
                  }}
                  placeholder="YYYY-MM-DD or text"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Autres dettes (famille, amis) */}
        <div className="item-card" style={{marginTop: '12px'}}>
          <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>{t.emergencyPlanning.finances.otherDebts}</h4>
          {autresDettes.map((d, index) => (
            <div key={d.id || index} className="form-grid" style={{marginBottom: '12px'}}>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.finances.name}</label>
                <input
                  type="text"
                  className="form-input"
                  value={d.nom}
                  onChange={(e) => {
                    const updated = [...autresDettes];
                    updated[index] = { ...(updated[index] || { id: d.id }), ...d, nom: e.target.value };
                    setData({ ...data, autresDettes: updated });
                  }}
                  placeholder={t.emergencyPlanning.finances.name}
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.finances.phoneOrEmail}</label>
                <input
                  type="text"
                  className="form-input"
                  value={d.contact}
                  onChange={(e) => {
                    const updated = [...autresDettes];
                    updated[index] = { ...(updated[index] || { id: d.id }), ...d, contact: e.target.value };
                    setData({ ...data, autresDettes: updated });
                  }}
                  placeholder="(XXX) XXX-XXXX or email"
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.finances.amount}</label>
                <input
                  type="text"
                  className="form-input"
                  value={d.montant}
                  onChange={(e) => {
                    const updated = [...autresDettes];
                    updated[index] = { ...(updated[index] || { id: d.id }), ...d, montant: e.target.value };
                    setData({ ...data, autresDettes: updated });
                  }}
                  placeholder="0,00 $"
                />
              </div>
              <div className="form-field">
                <label className="form-label">{t.emergencyPlanning.finances.dueDate}</label>
                <input
                  type="text"
                  className="form-input"
                  value={d.echeance}
                  onChange={(e) => {
                    const updated = [...autresDettes];
                    updated[index] = { ...(updated[index] || { id: d.id }), ...d, echeance: e.target.value };
                    setData({ ...data, autresDettes: updated });
                  }}
                  placeholder="YYYY-MM-DD or text"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Investissements (collapsible) */}
      <div className="collapsible-section">
        <div
          className="collapsible-header"
          id="investHeader"
          role="button"
          tabIndex={0}
          aria-expanded={!!expandedSections.investissements}
          aria-controls="section-investissements"
          title="Ouvrir la section Investissements"
          onClick={() => toggleSection('investissements')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSection('investissements')}
        >
          <div className="section-title">
            <PiggyBank size={22} />
            <span>{t.emergencyPlanning.finances.investments}</span>
            <span className="collapsible-hint">Cliquez pour compléter</span>
          </div>
          <div className="collapsible-right">
            <span className="badge-info">Info</span>
            {expandedSections.investissements ? <ChevronDown className="chev" size={24} /> : <ChevronRight className="chev" size={24} />}
          </div>
        </div>

        {expandedSections.investissements && (
          <div id="section-investissements" className="collapsible-content" aria-labelledby="investHeader">
            {/* Immobilier */}
            <div className="form-field" style={{gridColumn: '1 / -1'}}>
              <label className="form-label">{t.emergencyPlanning.finances.realEstateInvestments}</label>
              <textarea
                className="form-input"
                style={{minHeight: '80px'}}
                value={data.investissementsImmobiliersInfo}
                onChange={(e) => setData({ ...data, investissementsImmobiliersInfo: e.target.value })}
                placeholder="Details on shares held, companies, contact information, etc."
              />
            </div>

            {/* REER */}
            <h4 style={{fontSize: '16px', fontWeight: 700, color: '#1f2937', marginTop: '16px'}}>REER</h4>
            {reers.map((acc, index) => (
              <div key={acc.id || index} className="item-card">
                <div className="form-grid">
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.institution}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.institution}
                      onChange={(e) => {
                        const updated = [...reers];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, institution: e.target.value };
                        setData({ ...data, reers: updated });
                      }}
                      placeholder={t.emergencyPlanning.finances.institution}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.investmentType}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.typeInvestissement}
                      onChange={(e) => {
                        const updated = [...reers];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, typeInvestissement: e.target.value };
                        setData({ ...data, reers: updated });
                      }}
                      placeholder="ETF, funds, stocks, etc."
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.accountNumber}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.numeroCompte}
                      onChange={(e) => {
                        const updated = [...reers];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, numeroCompte: e.target.value };
                        setData({ ...data, reers: updated });
                      }}
                      placeholder="XXXXXXXXXX"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.representativeName}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.representantNom}
                      onChange={(e) => {
                        const updated = [...reers];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, representantNom: e.target.value };
                        setData({ ...data, reers: updated });
                      }}
                      placeholder={t.emergencyPlanning.finances.representativeName}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.representativeContact}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.representantContact}
                      onChange={(e) => {
                        const updated = [...reers];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, representantContact: e.target.value };
                        setData({ ...data, reers: updated });
                      }}
                      placeholder="(XXX) XXX-XXXX / email"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* CELI */}
            <h4 style={{fontSize: '16px', fontWeight: 700, color: '#1f2937', marginTop: '16px'}}>CELI</h4>
            {celis.map((acc, index) => (
              <div key={acc.id || index} className="item-card">
                <div className="form-grid">
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.institution}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.institution}
                      onChange={(e) => {
                        const updated = [...celis];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, institution: e.target.value };
                        setData({ ...data, celis: updated });
                      }}
                      placeholder={t.emergencyPlanning.finances.institution}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.investmentType}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.typeInvestissement}
                      onChange={(e) => {
                        const updated = [...celis];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, typeInvestissement: e.target.value };
                        setData({ ...data, celis: updated });
                      }}
                      placeholder="ETF, funds, stocks, etc."
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.accountNumber}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.numeroCompte}
                      onChange={(e) => {
                        const updated = [...celis];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, numeroCompte: e.target.value };
                        setData({ ...data, celis: updated });
                      }}
                      placeholder="XXXXXXXXXX"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.representativeName}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.representantNom}
                      onChange={(e) => {
                        const updated = [...celis];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, representantNom: e.target.value };
                        setData({ ...data, celis: updated });
                      }}
                      placeholder={t.emergencyPlanning.finances.representativeName}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.representativeContact}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.representantContact}
                      onChange={(e) => {
                        const updated = [...celis];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, representantContact: e.target.value };
                        setData({ ...data, celis: updated });
                      }}
                      placeholder="(XXX) XXX-XXXX / email"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* CRI */}
            <h4 style={{fontSize: '16px', fontWeight: 700, color: '#1f2937', marginTop: '16px'}}>CRI</h4>
            {cris.map((acc, index) => (
              <div key={acc.id || index} className="item-card">
                <div className="form-grid">
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.institution}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.institution}
                      onChange={(e) => {
                        const updated = [...cris];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, institution: e.target.value };
                        setData({ ...data, cris: updated });
                      }}
                      placeholder={t.emergencyPlanning.finances.institution}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.investmentType}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.typeInvestissement}
                      onChange={(e) => {
                        const updated = [...cris];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, typeInvestissement: e.target.value };
                        setData({ ...data, cris: updated });
                      }}
                      placeholder="ETF, funds, stocks, etc."
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.accountNumber}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.numeroCompte}
                      onChange={(e) => {
                        const updated = [...cris];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, numeroCompte: e.target.value };
                        setData({ ...data, cris: updated });
                      }}
                      placeholder="XXXXXXXXXX"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.representativeName}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.representantNom}
                      onChange={(e) => {
                        const updated = [...cris];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, representantNom: e.target.value };
                        setData({ ...data, cris: updated });
                      }}
                      placeholder={t.emergencyPlanning.finances.representativeName}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.representativeContact}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.representantContact}
                      onChange={(e) => {
                        const updated = [...cris];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, representantContact: e.target.value };
                        setData({ ...data, cris: updated });
                      }}
                      placeholder="(XXX) XXX-XXXX / email"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* FERR */}
            <h4 style={{fontSize: '16px', fontWeight: 700, color: '#1f2937', marginTop: '16px'}}>FERR</h4>
            {ferrs.map((acc, index) => (
              <div key={acc.id || index} className="item-card">
                <div className="form-grid">
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.institution}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.institution}
                      onChange={(e) => {
                        const updated = [...ferrs];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, institution: e.target.value };
                        setData({ ...data, ferrs: updated });
                      }}
                      placeholder={t.emergencyPlanning.finances.institution}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.investmentType}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.typeInvestissement}
                      onChange={(e) => {
                        const updated = [...ferrs];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, typeInvestissement: e.target.value };
                        setData({ ...data, ferrs: updated });
                      }}
                      placeholder="ETF, funds, stocks, etc."
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.accountNumber}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.numeroCompte}
                      onChange={(e) => {
                        const updated = [...ferrs];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, numeroCompte: e.target.value };
                        setData({ ...data, ferrs: updated });
                      }}
                      placeholder="XXXXXXXXXX"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.representativeName}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.representantNom}
                      onChange={(e) => {
                        const updated = [...ferrs];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, representantNom: e.target.value };
                        setData({ ...data, ferrs: updated });
                      }}
                      placeholder={t.emergencyPlanning.finances.representativeName}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.representativeContact}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={acc.representantContact}
                      onChange={(e) => {
                        const updated = [...ferrs];
                        updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, representantContact: e.target.value };
                        setData({ ...data, ferrs: updated });
                      }}
                      placeholder="(XXX) XXX-XXXX / email"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Actions / obligations */}
            <h4 style={{fontSize: '16px', fontWeight: 700, color: '#1f2937', marginTop: '16px'}}>{t.emergencyPlanning.finances.stocksAndBonds}</h4>
            {brokers.map((b, index) => (
              <div key={b.id || index} className="item-card">
                <div className="form-grid">
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.broker}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={b.courtier}
                      onChange={(e) => {
                        const updated = [...brokers];
                        updated[index] = { ...(updated[index] || { id: b.id }), ...b, courtier: e.target.value };
                        setData({ ...data, brokerAccounts: updated });
                      }}
                      placeholder={t.emergencyPlanning.finances.broker}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.accountNumber}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={b.numeroCompte}
                      onChange={(e) => {
                        const updated = [...brokers];
                        updated[index] = { ...(updated[index] || { id: b.id }), ...b, numeroCompte: e.target.value };
                        setData({ ...data, brokerAccounts: updated });
                      }}
                      placeholder="XXXXXXXXXX"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">{t.emergencyPlanning.finances.contact}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={b.contact}
                      onChange={(e) => {
                        const updated = [...brokers];
                        updated[index] = { ...(updated[index] || { id: b.id }), ...b, contact: e.target.value };
                        setData({ ...data, brokerAccounts: updated });
                      }}
                      placeholder="(XXX) XXX-XXXX / email"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancesSection;