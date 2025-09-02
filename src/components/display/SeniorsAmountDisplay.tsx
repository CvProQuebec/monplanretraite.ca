import React from 'react';

interface AmountDisplayProps {
  amount: number;
  label: string;
  positive?: boolean;
  highlighted?: boolean;
  currency?: string; // default CAD
  minimumFractionDigits?: number; // default 0 for readability
}

export function SeniorsAmountDisplay({
  amount,
  label,
  positive = true,
  highlighted = false,
  currency = 'CAD',
  minimumFractionDigits = 0
}: AmountDisplayProps) {
  const formattedAmount = new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency,
    minimumFractionDigits
  }).format(amount);

  return (
    <div className={`amount-card ${highlighted ? 'highlighted' : ''}`}>
      <div className="amount-display rounded-lg">
        <div className="amount-label text-base text-gray-700 mb-1">{label}</div>
        <div className={`amount-value financial-amount ${positive ? 'positive' : 'negative-amount'}`}>
          {formattedAmount}
        </div>
      </div>
    </div>
  );
}

export default SeniorsAmountDisplay;
