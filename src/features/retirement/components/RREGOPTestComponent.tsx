// src/features/retirement/components/RREGOPTestComponent.tsx
// Composant de test avec données réelles CARRA pour validation

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  TestTube, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Calculator,
  FileCheck,
  TrendingUp,
  Building2
} from 'lucide-react';

import { RREGOPService, RREGOPData, RREGOPCalculationResult } from '../services/RREGOPService';
import { CalculationService } from '../services/CalculationService';
import { UserDataRREGOPExtended } from '../types/rregop-types';

interface TestScenario {
  id: string;
  nom: string;
  description: string;
  userData: UserDataRREGOPExtended;
  expectedResults?: {
    pensionMensuelleMin: number;
    pensionMensuelleMax: number;
    tauxRemplacementMin: number;
    tauxRemplacementMax: number;
  };
}

export const RREGOPTestComponent: React.FC = () => {
  const [activeTest, setActiveTest] = useState<string>('');
  const [testResults, setTestResults] = useState<{[key: string]: any}>({});
  const [isRunning, setIsRunning] = useState(false);

  // Scénarios de test basés sur des profils réels CARRA
  const testScenarios: TestScenario[] = [
    {
      id: 'enseignant_primaire',
      nom: 'Enseignant primaire - 25 ans service',
      description: 'Enseignant au primaire, 25 années de service, salaire 75 000$',
      userData: {
        personal: {
          prenom1: 'Marie',
          nom1: 'Tremblay', 
          naissance1: '1973-08-15',
          salaire1: 75000,
          secteurPublic1: true,
          organismeEmployeur1: 'Commission scolaire de Montréal',
          statutSyndical1: 'syndique',
          typeNomination1: 'permanente'
        },
        retirement: {
          rregopMembre1: true,
          rregopAnneesService1: 25,
          rregopPension60_1: 2500,
          rregopCoordinationRRQ1: true
        },
        rregopData: {
          person1: {
            estMembreRREGOP: true,
            numeroMembre: 'TEST123456789',
            typeRegime: 'RREGOP',
            employeurActuel: 'Commission scolaire de Montréal',
            dateEmbauche: '1999-08-25',
            statutEmploi: 'actif',
            salaireAdmissibleActuel: 75000,
            historiqueSalaires: [
              { annee: 2020, salaire: 71000, heuresTravaillees: 1800 },
              { annee: 2021, salaire: 72500, heuresTravaillees: 1800 },
              { annee: 2022, salaire: 74000, heuresTravaillees: 1800 },
              { annee: 2023, salaire: 74500, heuresTravaillees: 1800 },
              { annee: 2024, salaire: 75000, heuresTravaillees: 1800 }
            ],
            anneesServiceTotal: 25,
            anneesServiceCreditees: 25,
            anneesRachetees: 0,
            cotisationsEmploye: 187500, // Estimé sur 25 ans
            cotisationsEmployeur: 348750,
            planRetraiteChoisi: 'normale',
            ageRetraitePrevu: 60,
            coordinationRRQActivée: true,
            optionRente: 'conjoint-60'
          }
        },
        savings: { reer1: 0, celi1: 0, other1: 0 },
        cashflow: { 
          fixedExpenses: 3000, 
          variableExpenses: 2000, 
          totalIncome: 6250 
        }
      },
      expectedResults: {
        pensionMensuelleMin: 2400,
        pensionMensuelleMax: 2600,
        tauxRemplacementMin: 0.65,
        tauxRemplacementMax: 0.75
      }
    },
    {
      id: 'infirmiere_hopital',
      nom: 'Infirmière hôpital - 18 ans service',
      description: 'Infirmière en centre hospitalier, 18 années, salaire 78 000$',
      userData: {
        personal: {
          prenom1: 'Sophie',
          nom1: 'Gagnon',
          naissance1: '1980-03-22',
          salaire1: 78000,
          secteurPublic1: true,
          organismeEmployeur1: 'CISSS Montérégie-Centre',
          statutSyndical1: 'syndique',
          typeNomination1: 'permanente'
        },
        retirement: {
          rregopMembre1: true,
          rregopAnneesService1: 18,
          rregopPension60_1: 1900,
          rregopCoordinationRRQ1: true
        },
        rregopData: {
          person1: {
            estMembreRREGOP: true,
            numeroMembre: 'TEST987654321',
            typeRegime: 'RREGOP',
            employeurActuel: 'CISSS Montérégie-Centre',
            dateEmbauche: '2006-05-15',
            statutEmploi: 'actif',
            salaireAdmissibleActuel: 78000,
            historiqueSalaires: [
              { annee: 2020, salaire: 74000, heuresTravaillees: 1950 },
              { annee: 2021, salaire: 75500, heuresTravaillees: 1950 },
              { annee: 2022, salaire: 76800, heuresTravaillees: 1950 },
              { annee: 2023, salaire: 77400, heuresTravaillees: 1950 },
              { annee: 2024, salaire: 78000, heuresTravaillees: 1950 }
            ],
            anneesServiceTotal: 18,
            anneesServiceCreditees: 20, // 2 ans rachetés
            anneesRachetees: 2,
            cotisationsEmploye: 142200,
            cotisationsEmployeur: 264480,
            planRetraiteChoisi: 'anticipee',
            ageRetraitePrevu: 58,
            coordinationRRQActivée: true,
            optionRente: 'garantie-5'
          }
        },
        savings: { reer1: 125000, celi1: 45000, other1: 25000 },
        cashflow: { 
          fixedExpenses: 3200, 
          variableExpenses: 2300, 
          totalIncome: 6500 
        }
      },
      expectedResults: {
        pensionMensuelleMin: 1750,
        pensionMensuelleMax: 2050,
        tauxRemplacementMin: 0.60,
        taux