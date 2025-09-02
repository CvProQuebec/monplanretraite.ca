import React from 'react';

type InputType = 'text' | 'number' | 'currency';

interface SeniorsInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  help?: string;
  example?: string;
  required?: boolean;
  type?: InputType;
  id?: string;
  name?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function SeniorsFriendlyInput({
  label,
  value,
  onChange,
  help,
  example,
  required = false,
  type = 'text',
  id,
  name,
  placeholder,
  min,
  max,
  step
}: SeniorsInputProps) {
  const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // For 'currency', allow user to type naturally; leave formatting scope to parent if needed
    onChange(e.target.value);
  };

  const inputMode = type === 'number' || type === 'currency' ? 'decimal' : 'text';
  const ariaDescribedBy = help ? `${inputId}-help` : undefined;

  return (
    <div className="seniors-input-group my-4">
      <label className="seniors-label block mb-2 font-semibold" htmlFor={inputId}>
        <span className="button-text">{label}</span>
        {required && <span className="required text-red-600 ml-1" aria-hidden="true">*</span>}
      </label>

      <input
        id={inputId}
        name={name || inputId}
        className="seniors-input w-full border rounded-lg px-4 py-3 min-h-[48px]"
        type={type === 'currency' ? 'text' : type}
        value={String(value ?? '')}
        onChange={handleChange}
        inputMode={inputMode as any}
        aria-describedby={ariaDescribedBy}
        placeholder={placeholder || example}
        min={min}
        max={max}
        step={step}
      />

      {help && (
        <div id={`${inputId}-help`} className="seniors-help text-gray-700 mt-2">
          {help}
        </div>
      )}

      {example && !placeholder && (
        <div className="text-sm text-gray-600 mt-1">
          Exemple: {example}
        </div>
      )}
    </div>
  );
}

export default SeniorsFriendlyInput;
