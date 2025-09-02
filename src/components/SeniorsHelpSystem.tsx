import React, { useState } from 'react';

interface HelpTooltipProps {
  content: string;
  example?: string;
  trigger?: 'click' | 'hover'; // Préférer 'click' pour seniors
  ariaLabel?: string;
  className?: string;
}

export function SeniorsHelpTooltip({
  content,
  example,
  trigger = 'click',
  ariaLabel = "Obtenir de l'aide",
  className = ''
}: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);
  const toggle = () => setIsVisible(v => !v);

  const buttonHandlers =
    trigger === 'hover'
      ? { onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide }
      : { onClick: toggle };

  return (
    <div className={`help-tooltip-container relative inline-block ${className}`}>
      <button
        className="help-button button-primary rounded-full px-3 py-2 min-h-[44px]"
        aria-label={ariaLabel}
        {...buttonHandlers}
      >
        <span className="help-icon text-xl" aria-hidden="true">?</span>
      </button>

      {isVisible && (
        <div
          role="dialog"
          aria-modal="true"
          className="help-content absolute z-50 mt-2 w-80 max-w-[90vw] bg-white border-2 border-blue-200 rounded-lg shadow-xl p-4"
        >
          <div className="help-text text-base text-gray-800 mb-3">
            {content}
          </div>

          {example && (
            <div className="help-example bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-900 mb-3">
              <strong>Exemple :</strong> {example}
            </div>
          )}

          <div className="flex justify-end">
            <button
              className="help-close button-primary px-4 py-2 rounded-md"
              onClick={hide}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SeniorsHelpTooltip;
