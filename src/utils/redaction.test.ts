import { redact } from './redaction';

describe('redact utility', () => {
  it('returns empty string for empty input', () => {
    expect(redact('', false)).toBe('');
    // Cast to any to simulate unexpected inputs
    expect((redact as any)(undefined, false)).toBe('');
    expect((redact as any)(null, false)).toBe('');
  });

  it('returns full value when showFull is true', () => {
    expect(redact('123456789', true)).toBe('123456789');
  });

  it('masks all but last 4 characters by default', () => {
    expect(redact('123456789', false)).toBe('•••• 6789');
    expect(redact('1234', false)).toBe('•••• 1234');
    expect(redact('1', false)).toBe('•••• 1');
  });

  it('respects custom keepLast parameter', () => {
    expect(redact('ABCDEFGH', false, 2)).toBe('•••• GH');
    expect(redact('ABCDEFGH', false, 0)).toBe('••••');
  });
});
