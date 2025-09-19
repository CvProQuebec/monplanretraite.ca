import React from 'react';

type InputType = 'text' | 'number' | 'currency';

interface SeniorsInputProps {
  label?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  help?: string;
  helpText?: string;
  example?: string;
  required?: boolean;
  type?: InputType;
  id?: string;
  name?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export function SeniorsFriendlyInput({
  label,
  value = '',
  onChange,
  help,
  helpText,
  example,
  required = false,
  type = 'text',
  id,
  name,
  placeholder,
  min,
  max,
  step,
  className = '',
  disabled,
  readOnly
}: SeniorsInputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const helpContent = help || helpText;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  const inputMode = type === 'number' || type === 'currency' ? 'decimal' : 'text';
  const ariaDescribedBy = helpContent ? `${inputId}-help` : undefined;

  return (
    <div className={`seniors-input-group my-4 ${className}`}>
      {label && (
        <label className="seniors-label block mb-2 font-semibold" htmlFor={inputId}>
          <span className="button-text">{label}</span>
          {required && <span className="required text-red-600 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <input
        id={inputId}
        name={name || inputId}
        className={`seniors-input w-full border rounded-lg px-4 py-3 min-h-[48px] ${className}`}
        type={type === 'currency' ? 'text' : type}
        value={String(value ?? '')}
        onChange={handleChange}
        inputMode={inputMode as any}
        aria-describedby={ariaDescribedBy}
        placeholder={placeholder || example}
        min={min}
        max={max}
        step={step}
        disabled={!!disabled}
        readOnly={!!readOnly}
        aria-disabled={disabled ? 'true' : undefined}
      />

      {helpContent && (
        <div id={`${inputId}-help`} className="seniors-help text-gray-700 mt-2 text-sm">
          {helpContent}
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
