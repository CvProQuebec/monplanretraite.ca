import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  DollarSign, 
  Info, 
  AlertTriangle,
  TrendingDown,
  Shield,
  Calculator,
  Edit3,
  CheckCircle
} from 'lucide-react';
import { formatCurrency } from '@/features/retirement/utils/formatters';
import MoneyInput from '@/components/ui/MoneyInput';

interface SVBiannualData {
  annee: number;
  periode1: {
    dateDebut: string; // "01-01"
    dateFin: string;   // "06-30"
    montant: number;
  };
  periode2: {
    dateDebut: string; // "07-01"
    dateFin: string;   // "12-31"
    montant: number;
  };
  raisonAjustement?: string;
  revenus_annee_precedente?: number;
}

interface SVBiannualManagerProps {
  personNumber: 1 | 2;
  personName: string;
  data?: SVBiannualData;
  onDataChange: (data: SVBiannualData) => void;
  isFrench: boolean;
}

const SVBiannualManager: React.FC<SVBiannualManagerProps> = ({
  personNumber,
  personName,
  data,
  onDataChange,
  isFrench
}) => {
  const currentYear = new Date().getFullYear();
  const [isEditing, setIsEditing] = useState(!data);
  const [editData, setEditData] = useState<SVBiannualData>(data || {
    annee: currentYear,
    periode1: {
      dateDebut: "01-01",
      dateFin: "06-30",
      montant: 713.34 // Montant maximum SV 2025
    },
    periode2: {
      dateDebut: "07-01",
      dateFin: "12-31",
      montant: 713.34
    },
    raisonAjustement: '',
    revenus_annee_precedente: 0
  });

  const montantMaximumSV = 713.34; // Juillet-septembre 2025
  const seuilRecuperation = 90997; // Seuil de récupération 2024

  const calculateClawback = (revenus: number, montantBase: number) => {
    if (revenus <= seuilRecuperation) return montantBase;
    
    const exces = revenus - seuilRecuperation;
    const reduction = exces * 0.15; // 15% de récupération
    const reductionMensuelle = reduction / 12;
    
    return Math.max(0, montantBase - reductionMensuelle);
  };

  const handleSave = () => {
    onDataChange(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (data) {
      setEditData(data);
    }
    setIsEditing(false);
  };

  const calculateAnnualTotal = () => {
    return (editData.periode1.montant * 6) + (editData.periode2.montant * 6);
  };

  const calculateMonthlyAverage = () => {
    return calculateAnnualTotal() / 12;
  };

  const suggestClawbackAmount = () => {
    if (editData.revenus_annee_precedente && editData.revenus_annee_precedente > seuilRecuperation) {
      return calculateClawback(editData.revenus_annee_precedente, montantMaximumSV);
    }
    return montantMaximumSV;
  };

  // Synchroniser les données quand elles changent
  useEffect(() => {
    if (data) {
      setEditData(data);
      setIsEditing(false);
    }
  }, [data]);

  return (
    <Card className="bg-white border-4 border-gray-300 shadow-lg">
      <CardHeader className="border-b-4 border-gray-300 bg-gray-50">
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-4">
          <div className={`w-10 h-10 ${personNumber === 1 ? 'bg-blue-600' : 'bg-green-600'} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
            {personNumber}
          </div>
          {isFrench ? 'Sécurité de la vieillesse' : 'Old Age Security'} - {personName}
        </CardTitle>
        <CardDescription className="text-lg text-gray-700">
          {isFrench 
            ? 'Gérez vos montants SV par période (récupération fiscale en juillet)'
            : 'Manage your OAS amounts by period (tax clawback in July)'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Information sur la récupération fiscale */}
        <Alert className="border-4 border-orange-500 bg-orange-50">
          <AlertTriangle className="h-6 w-6 text-orange-600" />
          <AlertDescription className="text-lg text-gray-900">
            <strong>{isFrench ? 'Important :' : 'Important:'}</strong> {
              isFrench 
                ? `La récupération fiscale s'applique à partir de juillet selon les revenus de l'année précédente. Seuil 2024 : ${formatCurrency(seuilRecuperation)}`
                : `Tax clawback applies from July based on previous year's income. 2024 threshold: ${formatCurrency(seuilRecuperation)}`
            }
          </AlertDescription>
        </Alert>

        {isEditing ? (
          <div className="space-y-6">
            {/* Année */}
            <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4">
              <Label className="text-gray-900 font-bold text-xl">
                {isFrench ? 'Année de référence' : 'Reference Year'}: {editData.annee}
              </Label>
            </div>

            {/* Revenus de l'année précédente */}
            <div className="senior-result-card">
              <div className="senior-form-row-single">
                <div className="senior-form-field">
                  <label className="senior-form-label flex items-center gap-3">
                    <Calculator className="w-6 h-6 text-blue-600" />
                    {isFrench ? `Revenus de ${editData.annee - 1} (optionnel)` : `${editData.annee - 1} Income (optional)`}
                  </label>
                  <MoneyInput
                    value={editData.revenus_annee_precedente || 0}
                    onChange={(value) => setEditData(prev => ({ ...prev, revenus_annee_precedente: value }))}
                    className="senior-form-input"
                    placeholder={isFrench ? "Ex: 95 000" : "Ex: 95,000"}
                    allowDecimals={true}
                  />
                </div>
              </div>
              <p className="text-lg text-gray-700">
                {isFrench 
                  ? 'Utilisé pour calculer automatiquement la récupération fiscale à partir de juillet'
                  : 'Used to automatically calculate tax clawback from July'
                }
              </p>
              {editData.revenus_annee_precedente && editData.revenus_annee_precedente > seuilRecuperation && (
                <div className="text-xl text-orange-600 bg-orange-100 border-2 border-orange-300 p-4 rounded-lg">
                  {isFrench ? 'Montant suggéré pour juillet-décembre : ' : 'Suggested amount for July-December: '}
                  <strong className="text-2xl">{formatCurrency(suggestClawbackAmount())}</strong>
                </div>
              )}
            </div>

            {/* Période 1 : Janvier à Juin */}
            <div className="bg-green-50 border-4 border-green-300 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8 text-green-600" />
                <h4 className="text-2xl font-bold text-green-800">
                  {isFrench ? 'Période 1 : janvier à juin' : 'Period 1: January to June'}
                </h4>
              </div>
              
              <div className="senior-form-row-triple">
                <div className="senior-form-field">
                  <label className="senior-form-label">
                    {isFrench ? 'Du' : 'From'}
                  </label>
                  <div className="senior-form-input bg-gray-100 text-gray-900 font-bold">
                    {editData.annee}-01-01
                  </div>
                </div>
                <div className="senior-form-field">
                  <label className="senior-form-label">
                    {isFrench ? 'Au' : 'To'}
                  </label>
                  <div className="senior-form-input bg-gray-100 text-gray-900 font-bold">
                    {editData.annee}-06-30
                  </div>
                </div>
                <div className="senior-form-field">
                  <label className="senior-form-label">
                    {isFrench ? 'Montant mensuel' : 'Monthly Amount'}
                  </label>
                  <MoneyInput
                    value={editData.periode1.montant}
                    onChange={(value) => setEditData(prev => ({
                      ...prev,
                      periode1: { ...prev.periode1, montant: value }
                    }))}
                    className="senior-form-input"
                    placeholder={isFrench ? "Ex: 713,34" : "Ex: 713.34"}
                    allowDecimals={true}
                  />
                </div>
              </div>
              
              <div className="text-xl text-gray-900 bg-white border-2 border-gray-300 rounded-lg p-4">
                <strong>{isFrench ? 'Total période 1 : ' : 'Period 1 total: '}</strong>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(editData.periode1.montant * 6)}
                </span>
              </div>
            </div>

            {/* Période 2 : Juillet à Décembre */}
            <div className="bg-orange-50 border-4 border-orange-300 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8 text-orange-600" />
                <h4 className="text-2xl font-bold text-orange-800">
                  {isFrench ? 'Période 2 : juillet à décembre' : 'Period 2: July to December'}
                </h4>
                <span className="text-lg bg-orange-600 px-4 py-2 rounded-lg text-white font-bold">
                  {isFrench ? 'Récupération fiscale' : 'Tax clawback'}
                </span>
              </div>
              
              <div className="senior-form-row-triple">
                <div className="senior-form-field">
                  <label className="senior-form-label">
                    {isFrench ? 'Du' : 'From'}
                  </label>
                  <div className="senior-form-input bg-gray-100 text-gray-900 font-bold">
                    {editData.annee}-07-01
                  </div>
                </div>
                <div className="senior-form-field">
                  <label className="senior-form-label">
                    {isFrench ? 'Au' : 'To'}
                  </label>
                  <div className="senior-form-input bg-gray-100 text-gray-900 font-bold">
                    {editData.annee}-12-31
                  </div>
                </div>
                <div className="senior-form-field">
                  <label className="senior-form-label">
                    {isFrench ? 'Montant mensuel' : 'Monthly Amount'}
                  </label>
                  {personNumber === 1 ? (
                    <MoneyInput
                      value={editData.periode2.montant}
                      onChange={(value) => setEditData(prev => ({
                        ...prev,
                        periode2: { ...prev.periode2, montant: value }
                      }))}
                      className="senior-form-input"
                      placeholder={isFrench ? "Ex: 500,00" : "Ex: 500.00"}
                      allowDecimals={true}
                    />
                  ) : (
                    <div className="flex gap-2">
                      <MoneyInput
                        value={editData.periode2.montant}
                        onChange={(value) => setEditData(prev => ({
                          ...prev,
                          periode2: { ...prev.periode2, montant: value }
                        }))}
                        className="senior-form-input flex-1"
                        placeholder={isFrench ? "Ex: 500,00" : "Ex: 500.00"}
                        allowDecimals={true}
                      />
                      {editData.revenus_annee_precedente && editData.revenus_annee_precedente > seuilRecuperation && (
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => setEditData(prev => ({
                            ...prev,
                            periode2: { ...prev.periode2, montant: suggestClawbackAmount() }
                          }))}
                          className="border-2 border-orange-500 text-orange-600 hover:bg-orange-100 h-12 px-4"
                          title={isFrench ? 'Utiliser le montant calculé' : 'Use calculated amount'}
                        >
                          <Calculator className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-xl text-gray-900 bg-white border-2 border-gray-300 rounded-lg p-4">
                <strong>{isFrench ? 'Total période 2 : ' : 'Period 2 total: '}</strong>
                <span className="text-2xl font-bold text-orange-600">
                  {formatCurrency(editData.periode2.montant * 6)}
                </span>
              </div>
            </div>

            {/* Raison de l'ajustement */}
            <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-6 space-y-4">
              <Label className="text-gray-900 font-bold text-xl">
                {isFrench ? 'Raison de l\'ajustement (optionnel)' : 'Reason for adjustment (optional)'}
              </Label>
              <textarea
                value={editData.raisonAjustement || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, raisonAjustement: e.target.value }))}
                className="w-full bg-white border-4 border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg p-4 min-h-[100px] text-lg"
                placeholder={isFrench 
                  ? 'Ex: Récupération fiscale basée sur les revenus de 2023...'
                  : 'Ex: Tax clawback based on 2023 income...'
                }
              />
            </div>

            {/* Résumé */}
            <div className="bg-blue-50 border-4 border-blue-300 rounded-lg p-6">
              <h4 className="text-2xl font-bold text-blue-800 mb-6">
                {isFrench ? 'Résumé annuel' : 'Annual Summary'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(calculateAnnualTotal())}
                  </div>
                  <div className="text-lg text-gray-700 font-semibold">
                    {isFrench ? 'Total annuel' : 'Annual total'}
                  </div>
                </div>
                <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(calculateMonthlyAverage())}
                  </div>
                  <div className="text-lg text-gray-700 font-semibold">
                    {isFrench ? 'Moyenne mensuelle' : 'Monthly average'}
                  </div>
                </div>
                <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
                  <div className="text-3xl font-bold text-orange-600">
                    {formatCurrency(Math.abs(editData.periode1.montant - editData.periode2.montant))}
                  </div>
                  <div className="text-lg text-gray-700 font-semibold">
                    {isFrench ? 'Différence périodes' : 'Period difference'}
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-6">
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white text-xl font-bold h-16 px-8"
              >
                <CheckCircle className="w-6 h-6 mr-3" />
                {isFrench ? 'Sauvegarder' : 'Save'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-4 border-gray-500 text-gray-700 text-xl font-bold h-16 px-8"
              >
                {isFrench ? 'Annuler' : 'Cancel'}
              </Button>
            </div>
          </div>
        ) : (
          // Mode affichage
          <div className="space-y-6">
            {/* Résumé des montants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Période 1 */}
              <div className="bg-green-50 border-4 border-green-300 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <span className="text-xl text-green-800 font-bold">
                    {isFrench ? 'Jan - Juin' : 'Jan - June'} {data?.annee}
                  </span>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(data?.periode1.montant || 0)}
                </div>
                <div className="text-lg text-gray-700 font-semibold">
                  {isFrench ? 'par mois' : 'per month'}
                </div>
              </div>

              {/* Période 2 */}
              <div className="bg-orange-50 border-4 border-orange-300 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-orange-600" />
                  <span className="text-xl text-orange-800 font-bold">
                    {isFrench ? 'Juil - Déc' : 'Jul - Dec'} {data?.annee}
                  </span>
                </div>
                <div className="text-3xl font-bold text-orange-600">
                  {formatCurrency(data?.periode2.montant || 0)}
                </div>
                <div className="text-lg text-gray-700 font-semibold">
                  {isFrench ? 'par mois' : 'per month'}
                </div>
              </div>
            </div>

            {/* Total annuel */}
            <div className="bg-blue-50 border-4 border-blue-300 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-blue-800">
                    {isFrench ? 'Total annuel' : 'Annual Total'}
                  </h4>
                  <p className="text-lg text-gray-700">
                    {isFrench ? 'Sécurité de la vieillesse' : 'Old Age Security'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(calculateAnnualTotal())}
                  </div>
                  <div className="text-lg text-gray-700 font-semibold">
                    {isFrench ? 'Moyenne : ' : 'Average: '}{formatCurrency(calculateMonthlyAverage())}/mois
                  </div>
                </div>
              </div>
            </div>

            {/* Raison de l'ajustement */}
            {data?.raisonAjustement && (
              <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-6">
                <h5 className="text-xl font-bold text-gray-900 mb-3">
                  {isFrench ? 'Raison de l\'ajustement :' : 'Reason for adjustment:'}
                </h5>
                <p className="text-lg text-gray-700">{data.raisonAjustement}</p>
              </div>
            )}

            {/* Bouton d'édition */}
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full border-4 border-blue-500 text-blue-700 hover:bg-blue-100 text-xl font-bold h-16"
            >
              <Edit3 className="w-6 h-6 mr-3" />
              {isFrench ? 'Modifier les montants' : 'Edit amounts'}
            </Button>
          </div>
        )}

        {/* Information sur le montant maximum */}
        <Alert className="border-4 border-blue-500 bg-blue-50">
          <Info className="h-6 w-6 text-blue-600" />
          <AlertDescription className="text-lg text-gray-900">
            <strong>{isFrench ? 'Montant maximum SV 2025 :' : 'Maximum OAS 2025:'}</strong> {formatCurrency(montantMaximumSV)}/mois
            <br />
            {isFrench 
              ? 'La récupération fiscale s\'applique si vos revenus dépassent le seuil.'
              : 'Tax clawback applies if your income exceeds the threshold.'
            }
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default SVBiannualManager;
