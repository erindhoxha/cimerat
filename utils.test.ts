import { formatDate } from './utils';

describe('formatDate', () => {
  it('formats a date in Albanian locale', () => {
    const date = new Date(2024, 7, 10); // August 10, 2024 (month is 0-based)
    const result = formatDate(date);
    expect(result).toBe('10 gusht, 2024');
  });

  it('formats another date correctly', () => {
    const date = new Date(2025, 0, 1); // January 1, 2025
    const result = formatDate(date);
    expect(result).toBe('1 janar, 2025');
  });
});
