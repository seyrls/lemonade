import {
  generateConfirmationNumber,
  generateConfirmationNumberInRange,
} from '../../../../../src/customer/orders/utils';

describe('Confirmation Number Utils', () => {
  describe('generateConfirmationNumber', () => {
    it('should generate a number between 1000 and 999999', () => {
      const result = generateConfirmationNumber();

      expect(result).toBeGreaterThanOrEqual(1000);
      expect(result).toBeLessThanOrEqual(999999);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should generate different numbers on multiple calls', () => {
      const result1 = generateConfirmationNumber();
      const result2 = generateConfirmationNumber();

      expect(result1).not.toBe(result2);
    });
  });

  describe('generateConfirmationNumberInRange', () => {
    it('should generate a number within the specified range', () => {
      const min = 100;
      const max = 500;
      const result = generateConfirmationNumberInRange(min, max);

      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should use default range when no parameters provided', () => {
      const result = generateConfirmationNumberInRange();

      expect(result).toBeGreaterThanOrEqual(1000);
      expect(result).toBeLessThanOrEqual(999999);
    });

    it('should handle single number range', () => {
      const value = 42;
      const result = generateConfirmationNumberInRange(value, value);

      expect(result).toBe(value);
    });
  });
});
