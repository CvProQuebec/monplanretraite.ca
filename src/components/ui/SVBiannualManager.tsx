import React, { useState } from 'react';
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

  return (
    <Card className="bg-gradient-to-br from-purple-800/90 to-pink-800/90 border-0 shadow-2xl backdrop-blur-sm">
      <CardHeader className="border-b border-purple-600 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
        <CardTitle className="text-xl font-bold text-purple-300 flex items-center gap-3">
          <div className={`w-6 h-6 bg-gradient-to-r ${personNumber === 1 ? 'from-purple-500 to-pink-500' : 'from-pink-500 to-purple-500'} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
            {personNumber}
          </div>
          {isFrench ? 'Sécurité de la vieillesse' : 'Old Age Security'} - {personName}
        </CardTitle>
        <CardDescription className="text-purple-200">
          {isFrench 
            ? 'Gérez vos montants SV par période (récupération fiscale en juillet)'
            : 'Manage your OAS amounts by period (tax clawback in July)'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Information sur la récupération fiscale */}
        <Alert className="border-orange-400 bg-orange-900/20 text-orange-200">
          <AlertTriangle className="h-5 w-5 text-orange-400" />
          <AlertDescription>
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
            <div className="bg-slate-700/50 rounded-lg p-4">
              <Label className="text-purple-300 font-semibold text-lg">
                {isFrench ? 'Année de référence' : 'Reference Year'}: {editData.annee}
              </Label>
            </div>

            {/* Revenus de l'année précédente */}
            <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
              <Label className="text-gray-200 font-semibold flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                {isFrench ? `Revenus de ${editData.annee - 1} (optionnel)` : `${editData.annee - 1} Income (optional)`}
              </Label>
              <MoneyInput
                value={editData.revenus_annee_precedente || 0}
                onChange={(value) => setEditData(prev => ({ ...prev, revenus_annee_precedente: value }))}
                className="bg-slate-600 border-slate-500 text-white"
                placeholder={isFrench ? "Ex: 95 000" : "Ex: 95,000"}
                allowDecimals={true}
              />
              <p className="text-xs text-gray-400">
                {isFrench 
                  ? 'Utilisé pour calculer automatiquement la récupération fiscale à partir de juillet'
                  : 'Used to automatically calculate tax clawback from July'
                }
              </p>
              {editData.revenus_annee_precedente && editData.revenus_annee_precedente > seuilRecuperation && (
                <div className="text-sm text-orange-300 bg-orange-900/30 p-2 rounded">
                  {isFrench ? 'Montant suggéré pour juillet-décembre : ' : 'Suggested amount for July-December: '}
                  <strong>{formatCurrency(suggestClawbackAmount())}</strong>
                </div>
              )}
            </div>

            {/* Période 1 : Janvier à Juin */}
            <div className="bg-slate-700/50 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-400" />
                <h4 className="text-lg font-semibold text-green-300">
                  {isFrench ? 'Période 1 : janvier à juin' : 'Period 1: January to June'}
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-200 text-sm">
                    {isFrench ? 'Du' : 'From'}
                  </Label>
                  <div className="bg-slate-600 border border-slate-500 rounded-md px-3 py-2 text-white">
                    {editData.annee}-01-01
                  </div>
                </div>
                <div>
                  <Label className="text-gray-200 text-sm">
                    {isFrench ? 'Au' : 'To'}
                  </Label>
                  <div className="bg-slate-600 border border-slate-500 rounded-md px-3 py-2 text-white">
                    {editData.annee}-06-30
                  </div>
                </div>
                <div>
                  <Label className="text-gray-200 text-sm">
                    {isFrench ? 'Montant mensuel' : 'Monthly Amount'}
                  </Label>
                  <MoneyInput
                    value={editData.periode1.montant}
                    onChange={(value) => setEditData(prev => ({
                      ...prev,
                      periode1: { ...prev.periode1, montant: value }
                    }))}
                    className="bg-slate-600 border-slate-500 text-white"
                    placeholder={isFrench ? "Ex: 713,34" : "Ex: 713.34"}
                    allowDecimals={true}
                  />
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                {isFrench ? 'Total période 1 : ' : 'Period 1 total: '}
                <span className="text-green-400 font-semibold">
                  {formatCurrency(editData.periode1.montant * 6)}
                </span>
              </div>
            </div>

            {/* Période 2 : Juillet à Décembre */}
            <div className="bg-slate-700/50 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-orange-400" />
                <h4 className="text-lg font-semibold text-orange-300">
                  {isFrench ? 'Période 2 : juillet à décembre' : 'Period 2: July to December'}
                </h4>
                <span className="text-xs bg-orange-600 px-2 py-1 rounded-full text-white">
                  {isFrench ? 'Récupération fiscale' : 'Tax clawback'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-200 text-sm">
                    {isFrench ? 'Du' : 'From'}
                  </Label>
                  <div className="bg-slate-600 border border-slate-500 rounded-md px-3 py-2 text-white">
                    {editData.annee}-07-01
                  </div>
                </div>
                <div>
                  <Label className="text-gray-200 text-sm">
                    {isFrench ? 'Au' : 'To'}
                  </Label>
                  <div className="bg-slate-600 border border-slate-500 rounded-md px-3 py-2 text-white">
                    {editData.annee}-12-31
                  </div>
                </div>
                <div>
                  <Label className="text-gray-200 text-sm">
                    {isFrench ? 'Montant mensuel' : 'Monthly Amount'}
                  </Label>
                  <div className="flex gap-2">
                    <MoneyInput
                      value={editData.periode2.montant}
                      onChange={(value) => setEditData(prev => ({
                        ...prev,
                        periode2: { ...prev.periode2, montant: value }
                      }))}
                      className="bg-slate-600 border-slate-500 text-white"
                      placeholder={isFrench ? "Ex: 500,00" : "Ex: 500.00"}
                      allowDecimals={true}
                    />
                    {editData.revenus_annee_precedente && editData.revenus_annee_precedente > seuilRecuperation && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditData(prev => ({
                          ...prev,
                          periode2: { ...prev.periode2, montant: suggestClawbackAmount() }
                        }))}
                        className="border-orange-500 text-orange-300 hover:bg-orange-600"
                        title={isFrench ? 'Utiliser le montant calculé' : 'Use calculated amount'}
                      >
                        <Calculator className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                {isFrench ? 'Total période 2 : ' : 'Period 2 total: '}
                <span className="text-orange-400 font-semibold">
                  {formatCurrency(editData.periode2.montant * 6)}
                </span>
              </div>
            </div>

            {/* Raison de l'ajustement */}
            <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
              <Label className="text-gray-200 font-semibold">
                {isFrench ? 'Raison de l\'ajustement (optionnel)' : 'Reason for adjustment (optional)'}
              </Label>
              <textarea
                value={editData.raisonAjustement || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, raisonAjustement: e.target.value }))}
                className="w-full bg-slate-600 border-slate-500 text-white rounded-md p-3 min-h-[80px]"
                placeholder={isFrench 
                  ? 'Ex: Récupération fiscale basée sur les revenus de 2023...'
                  : 'Ex: Tax clawback based on 2023 income...'
                }
              />
            </div>

            {/* Résumé */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-4 border border-purple-500/30">
              <h4 className="text-lg font-semibold text-purple-300 mb-3">
                {isFrench ? 'Résumé annuel' : 'Annual Summary'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {formatCurrency(calculateAnnualTotal())}
                  </div>
                  <div className="text-sm text-gray-300">
                    {isFrench ? 'Total annuel' : 'Annual total'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {formatCurrency(calculateMonthlyAverage())}
                  </div>
                  <div className="text-sm text-gray-300">
                    {isFrench ? 'Moyenne mensuelle' : 'Monthly average'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-400">
                    {formatCurrency(Math.abs(editData.periode1.montant - editData.periode2.montant))}
                  </div>
                  <div className="text-sm text-gray-300">
                    {isFrench ? 'Différence périodes' : 'Period difference'}
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isFrench ? 'Sauvegarder' : 'Save'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-gray-500 text-gray-300"
              >
                {isFrench ? 'Annuler' : 'Cancel'}
              </Button>
            </div>
          </div>
        ) : (
          // Mode affichage
          <div className="space-y-4">
            {/* Résumé des montants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Période 1 */}
              <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-300 font-semibold">
                    {isFrench ? 'Jan - Juin' : 'Jan - June'} {data?.annee}
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(data?.periode1.montant || 0)}
                </div>
                <div className="text-sm text-gray-400">
                  {isFrench ? 'par mois' : 'per month'}
                </div>
              </div>

              {/* Période 2 */}
              <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-orange-300 font-semibold">
                    {isFrench ? 'Juil - Déc' : 'Jul - Dec'} {data?.annee}
                  </span>
                </div>
                <div className="text-2xl font-bold text-orange-400">
                  {formatCurrency(data?.periode2.montant || 0)}
                </div>
                <div className="text-sm text-gray-400">
                  {isFrench ? 'par mois' : 'per month'}
                </div>
              </div>
            </div>

            {/* Total annuel */}
            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-purple-300">
                    {isFrench ? 'Total annuel' : 'Annual Total'}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {isFrench ? 'Sécurité de la vieillesse' : 'Old Age Security'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">
                    {formatCurrency(calculateAnnualTotal())}
                  </div>
                  <div className="text-sm text-gray-400">
                    {isFrench ? 'Moyenne : ' : 'Average: '}{formatCurrency(calculateMonthlyAverage())}/mois
                  </div>
                </div>
              </div>
            </div>

            {/* Raison de l'ajustement */}
            {data?.raisonAjustement && (
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-gray-300 mb-2">
                  {isFrench ? 'Raison de l\'ajustement :' : 'Reason for adjustment:'}
                </h5>
                <p className="text-gray-400 text-sm">{data.raisonAjustement}</p>
              </div>
            )}

            {/* Bouton d'édition */}
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full border-purple-500 text-purple-300 hover:bg-purple-600"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isFrench ? 'Modifier les montants' : 'Edit amounts'}
            </Button>
          </div>
        )}

        {/* Information sur le montant maximum */}
        <Alert className="border-blue-400 bg-blue-900/20 text-blue-200">
          <Info className="h-5 w-5 text-blue-400" />
          <AlertDescription className="text-sm">
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
