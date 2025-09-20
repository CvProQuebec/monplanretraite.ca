/**
 * Redaction utility for sensitive fields (e.g., NAS, account numbers).
 * Default behavior: hide all but the last `keepLast` characters using bullet dots.
 */
export function redact(value: string, showFull: boolean, keepLast: number = 4): string {
  if (showFull) return value || '';
  if (!value) return '';
  const str = String(value);
  if (keepLast <= 0) return '••••';
  const visible = str.slice(-keepLast);
  return '•••• ' + visible;
}
