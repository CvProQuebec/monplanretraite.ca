import React, { useState, useEffect } from 'react';
import { CashflowSection } from '@/features/retirement/sections/CashflowSection';
import { UserData } from '@/features/retirement/types';

// Données de démonstration pour le composant CashflowSection
const demoUserData: UserData = {
  personal: {
    prenom1: 'Jean',
    prenom2: 'Marie',
    naissance1: '1980-01-01',
    naissance2: '1982-01-01',
    sexe1: 'M' as const,
    sexe2: 'F' as const,
    salaire1: 60000,
    salaire2: 55000,
    statutProfessionnel1: 'actif',
    statutProfessionnel2: 'actif',
    ageRetraiteSouhaite1: 65,
    ageRetraiteSouhaite2: 65,
    depensesRetraite: 4000
  },
  retirement: {
    rrqAgeActuel1: 45,
    rrqMontantActuel1: 800,
    rrqMontant70_1: 1200,
    esperanceVie1: 85,
    rrqAgeActuel2: 43,
    rrqMontantActuel2: 750,
    rrqMontant70_2: 1100,
    esperanceVie2: 87,
    rregopMembre1: 'non',
    rregopAnnees1: 0,
    pensionPrivee1: 0,
    pensionPrivee2: 0
  },
  savings: {
    reer1: 50000,
    reer2: 45000,
    celi1: 15000,
    celi2: 12000,
    placements1: 25000,
    placements2: 20000,
    epargne1: 10000,
    epargne2: 8000,
    cri1: 5000,
    cri2: 4000,
    residenceValeur: 400000,
    residenceHypotheque: 250000
  },
  cashflow: {
    logement: 1200,
    servicesPublics: 300,
    assurances: 200,
    telecom: 150,
    alimentation: 600,
    transport: 400,
    sante: 150,
    loisirs: 300,
    // Ventilation des dépenses
    logementBreakdown: {
      loyer: 1200,
      hypotheque: 0,
      taxesMunicipales: 0,
      assuranceHabitation: 0,
      entretien: 0
    },
    servicesPublicsBreakdown: {
      electricite: 150,
      eau: 50,
      gazNaturel: 0,
      chauffage: 100,
      dechets: 0
    },
    assurancesBreakdown: {
      habitation: 100,
      auto: 100,
      vie: 0,
      invalidite: 0,
      maladie: 0
    },
    transportBreakdown: {
      location: 0,
      essence: 200,
      maintenance: 100,
      reparation: 0,
      transportCommun: 100
    },
    santeBreakdown: {
      medecinePrivee: 0,
      medicaments: 50,
      dentiste: 50,
      lunettes: 0,
      autresSoins: 50
    },
    telecomBreakdown: {
      internet: 80,
      telephone: 0,
      cellulaire: 50,
      tv: 20,
      streaming: 0
    }
  }
};

export const ExpensesPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData>(demoUserData);

  const handleUpdate = (section: keyof UserData, updates: any) => {
    setUserData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates
      }
    }));
  };

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem('expenses_user_data', JSON.stringify(userData));
  }, [userData]);

  // Charger depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('expenses_user_data');
    if (saved) {
      try {
        setUserData(JSON.parse(saved));
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Gestion des dépenses mensuelles
          </h1>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            Planifiez et suivez vos dépenses mensuelles pour optimiser votre budget de retraite
          </p>
        </div>

        {/* Composant CashflowSection existant */}
        <CashflowSection 
          data={userData} 
          onUpdate={handleUpdate} 
        />
      </div>
    </div>
  );
};

export default ExpensesPage;
