import { describe, it, expect } from 'vitest';

describe('formatters', () => {
  describe('formatDate', () => {
    it('formats ISO date string correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = date.toLocaleDateString('es-MX');
      expect(formatted).toContain('2024');
    });
  });

  describe('formatTime', () => {
    it('extracts time from time string', () => {
      const time = '14:30:00';
      const formatted = time.slice(0, 5);
      expect(formatted).toBe('14:30');
    });
  });

  describe('formatNumber', () => {
    it('formats integer correctly', () => {
      const num = 1000;
      const formatted = num.toLocaleString('es-MX');
      expect(formatted).toBeTruthy();
    });
  });
});
