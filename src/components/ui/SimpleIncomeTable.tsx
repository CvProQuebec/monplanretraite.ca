import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';

type Frequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'one-time';

const freqOptions: { value: Frequency; label: string }[] = [
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'biweekly', label: 'Aux 2 semaines' },
  { value: 'monthly', label: 'Mensuel' },
  { value: 'quarterly', label: 'Trimestriel' },
  { value: 'semi-annual', label: 'Semestriel' },
  { value: 'annual', label: 'Annuel' },
  { value: 'one-time', label: 'Ponctuel' },
];

const typeOptions = [
  { value: 'salaire', label: 'Salaire' },
  { value: 'assurance-emploi', label: 'Assurance emploi' },
  { value: 'rentes', label: 'Rentes privées' },
  { value: 'dividendes', label: 'Dividendes' },
  { value: 'revenus-location', label: 'Revenus de location' },
  { value: 'travail-autonome', label: 'Travail autonome' },
  { value: 'autres', label: 'Autres' },
];

export const SimpleIncomeTable: React.FC = () => {
  const { userData, updateUserData } = useRetirementData();
  const items = useMemo(() => userData.personal?.unifiedIncome1 || [], [userData.personal?.unifiedIncome1]);

  const [type, setType] = useState<string>('salaire');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  // Assurance-emploi (AE)
  const [aeWeeklyGross, setAeWeeklyGross] = useState<number>(0);
  const [aeFederalTaxWeekly, setAeFederalTaxWeekly] = useState<number>(0);
  const [aeProvTaxWeekly, setAeProvTaxWeekly] = useState<number>(0);
  const [aeWeeksUsed, setAeWeeksUsed] = useState<number>(0);
  const [aeMaxWeeks, setAeMaxWeeks] = useState<number>(0);

  const addRow = () => {
    if (!description || !amount || amount < 0) return;
    const id = `inc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    // Map vers la structure IncomeEntry existante
    const entry: any = {
      id,
      type: type as any,
      description,
      isActive: true,
      // Champs génériques
      amount,
      frequency,
      startDate,
      endDate,
    };

    // Renseigner aussi les champs existants pour compatibilité
    switch (frequency) {
      case 'weekly':
        entry.weeklyAmount = amount;
        entry.salaryFrequency = 'weekly';
        break;
      case 'biweekly':
        entry.weeklyAmount = amount; // biweekly not directly represented
        entry.salaryFrequency = 'biweekly';
        break;
      case 'monthly':
        entry.monthlyAmount = amount;
        entry.salaryFrequency = 'monthly';
        break;
      case 'annual':
        entry.annualAmount = amount;
        break;
      default:
        entry.monthlyAmount = amount;
        break;
    }
    if (startDate) entry.salaryStartDate = startDate;
    if (endDate) entry.salaryEndDate = endDate;

    // Champs spécifiques AE (assurance-emploi)
    if (type === 'assurance-emploi') {
      if (aeWeeklyGross) entry.weeklyGross = aeWeeklyGross;
      if (aeFederalTaxWeekly) entry.eiFederalTaxWeekly = aeFederalTaxWeekly;
      if (aeProvTaxWeekly) entry.eiProvincialTaxWeekly = aeProvTaxWeekly;
      if (aeWeeksUsed) entry.weeksUsed = aeWeeksUsed;
      if (aeMaxWeeks) entry.maxWeeks = aeMaxWeeks;
      entry.eiPaymentFrequency = 'weekly';
      entry.eiStartDate = startDate || undefined;
    }

    const next = [...items, entry];
    updateUserData('personal', { unifiedIncome1: next });

    // Reset form
    setDescription('');
    setAmount(0);
    setFrequency('monthly');
    setStartDate('');
    setEndDate('');
    setAeWeeklyGross(0);
    setAeFederalTaxWeekly(0);
    setAeProvTaxWeekly(0);
    setAeWeeksUsed(0);
    setAeMaxWeeks(0);
  };

  const removeRow = (id: string) => {
    const next = items.filter((i: any) => i.id !== id);
    updateUserData('personal', { unifiedIncome1: next });
  };

  return (
    <Card className="bg-white border-2 border-gray-200 rounded-xl">
      <CardHeader>
        <CardTitle>Tableau des revenus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
          <div>
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          </div>
          <div>
            <Label>Montant</Label>
            <Input type="number" value={amount || ''} onChange={(e) => setAmount(Number(e.target.value || 0))} placeholder="0" />
          </div>
          <div>
            <Label>Fréquence</Label>
            <Select value={frequency} onValueChange={(v) => setFrequency(v as Frequency)}>
              <SelectTrigger>
                <SelectValue placeholder="Fréquence" />
              </SelectTrigger>
              <SelectContent>
                {freqOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date de début</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <Label>Date de fin</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        {type === 'assurance-emploi' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
            <div>
              <Label>Montant hebdomadaire brut</Label>
              <Input type="number" value={aeWeeklyGross || ''} onChange={(e)=>setAeWeeklyGross(Number(e.target.value||0))} placeholder="0" />
            </div>
            <div>
              <Label>Impôt fédéral (hebdo)</Label>
              <Input type="number" value={aeFederalTaxWeekly || ''} onChange={(e)=>setAeFederalTaxWeekly(Number(e.target.value||0))} placeholder="0" />
            </div>
            <div>
              <Label>Impôt provincial (hebdo)</Label>
              <Input type="number" value={aeProvTaxWeekly || ''} onChange={(e)=>setAeProvTaxWeekly(Number(e.target.value||0))} placeholder="0" />
            </div>
            <div>
              <Label>Semaines utilisées</Label>
              <Input type="number" value={aeWeeksUsed || ''} onChange={(e)=>setAeWeeksUsed(Number(e.target.value||0))} placeholder="0" />
            </div>
            <div>
              <Label>Semaines maximum</Label>
              <Input type="number" value={aeMaxWeeks || ''} onChange={(e)=>setAeMaxWeeks(Number(e.target.value||0))} placeholder="0" />
            </div>
          </div>
        )}
        <div className="flex justify-end mb-4">
          <Button onClick={addRow} className="px-6">Ajouter</Button>
        </div>

        {items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Montant</th>
                  <th className="p-2 text-left">Fréquence</th>
                  <th className="p-2 text-left">Début</th>
                  <th className="p-2 text-left">Fin</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i: any) => (
                  <tr key={i.id} className="border-t">
                    <td className="p-2">{i.type}</td>
                    <td className="p-2">{i.description}</td>
                    <td className="p-2">{i.amount ?? i.monthlyAmount ?? i.weeklyAmount ?? i.annualAmount ?? 0}</td>
                    <td className="p-2">{i.frequency ?? i.salaryFrequency ?? ''}</td>
                    <td className="p-2">{i.startDate ?? i.salaryStartDate ?? ''}</td>
                    <td className="p-2">{i.endDate ?? i.salaryEndDate ?? ''}</td>
                    <td className="p-2">
                      <Button variant="outline" onClick={() => removeRow(i.id)}>Supprimer</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleIncomeTable;
