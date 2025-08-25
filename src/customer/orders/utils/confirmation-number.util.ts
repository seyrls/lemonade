/**
 * Utility functions for order management
 */

/**
 * Generates a random order confirmation number
 * @returns A random number between 1000 and 999999
 */
export function generateConfirmationNumber(): number {
  return Math.floor(Math.random() * 900000) + 100000;
}

/**
 * Generates a random order confirmation number with custom range
 * @param min - Minimum value (default: 1000)
 * @param max - Maximum value (default: 999999)
 * @returns A random number between min and max
 */
export function generateConfirmationNumberInRange(
  min: number = 1000,
  max: number = 999999,
): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
