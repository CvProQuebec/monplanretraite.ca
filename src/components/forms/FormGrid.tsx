import React from 'react';

/**
 * FormGrid + FormRow + Field
 * Objectif: centraliser la grille .mpr-form / .mpr-form-row / .mpr-field
 *  - Respect strict du pattern “1 ligne = 1 label + 1 champ”
 *  - Desktop: cols-3 / cols-2 / cols-1
 *  - Mobile: conserve label à gauche, champ à droite (via CSS existant)
 *
 * Usage basique:
 *  <FormGrid>
 *    <FormRow cols={3}>
 *      <Field label="Âge actuel" htmlFor="age"><input id="age" type="number" /></Field>
 *      <Field label="RRQ actuelle (mois)" htmlFor="rrqActuelle"><input id="rrqActuelle" type="text" /></Field>
 *      <Field label="RRQ à 70 ans (mois)" htmlFor="rrq70"><input id="rrq70" type="text" /></Field>
 *    </FormRow>
 *  </FormGrid>
 */

type FormRowCols = 1 | 2 | 3;

export interface FormGridProps {
  children: React.ReactNode;
  className?: string;
  'aria-labelledby'?: string;
  role?: string;
}

export const FormGrid: React.FC<FormGridProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <div className={`mpr-form ${className}`} {...rest}>
      {children}
    </div>
  );
};

export interface FormRowProps {
  children: React.ReactNode;
  cols?: FormRowCols;
  className?: string;
  'aria-label'?: string;
  role?: string;
}

export const FormRow: React.FC<FormRowProps> = ({
  children,
  cols = 2,
  className = '',
  ...rest
}) => {
  const colsClass =
    cols === 3 ? 'cols-3' : cols === 2 ? 'cols-2' : 'cols-1';
  return (
    <div className={`mpr-form-row ${colsClass} ${className}`} {...rest}>
      {children}
    </div>
  );
};

export interface FieldProps {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  span?: 1 | 2 | 3;
  className?: string;
  required?: boolean;
  tooltip?: string;
  labelWidthPx?: number; // optionnel pour override (sinon CSS minmax(160px,200px))
}

export const Field: React.FC<FieldProps> = ({
  label,
  htmlFor,
  children,
  span = 1,
  className = '',
  required = false,
  tooltip,
  labelWidthPx,
}) => {
  const spanClass =
    span === 3 ? 'span-3' : span === 2 ? 'span-2' : '';
  const style =
    typeof labelWidthPx === 'number'
      ? { gridTemplateColumns: `minmax(${Math.min(labelWidthPx, 240)}px, ${Math.max(labelWidthPx, 200)}px) 1fr` }
      : undefined;

  return (
    <div className={`mpr-field ${spanClass} ${className}`} style={style}>
      <label
        htmlFor={htmlFor}
        title={tooltip}
      >
        {label}{required ? ' *' : ''}
      </label>
      {children}
    </div>
  );
};

// HOC simple pour transformer rapidement des paires label+champ legacy vers .mpr-field
// Exemple d'usage: const InlineField = withField('Âge', 'age')(props => <input id="age" {...props} />);
export function withField(label: string, htmlFor?: string, options?: Pick<FieldProps, 'span' | 'required' | 'tooltip'>) {
  return function <P extends React.InputHTMLAttributes<HTMLInputElement>>(InputComponent: React.ComponentType<P>) {
    const Wrapped: React.FC<P & { className?: string }> = (props) => {
      const { className, ...rest } = props as any;
      return (
        <Field label={label} htmlFor={htmlFor} span={options?.span} required={options?.required} tooltip={options?.tooltip} className={className}>
          <InputComponent id={htmlFor} {...(rest as P)} />
        </Field>
      );
    };
    return Wrapped;
  };
}

export default FormGrid;
