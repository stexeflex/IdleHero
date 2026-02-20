import { ClampUtils } from '../../../shared/utils';

export function ComputeRolledValue(
  min: number,
  max: number,
  percentage: number,
  type: 'Flat' | 'Percent'
): number {
  const result = min + (max - min) * ClampUtils.clamp(percentage, 0, 1);
  return type === 'Flat' ? Math.round(result) : result;
}

/**
 * Generates a random integer within the specified range [min, max].
 * @param min the minimum value (inclusive).
 * @param max the maximum value (inclusive).
 * @returns The percentage rolled within the tier range, as a number between 0 and 1.
 */
export function RandomInRange(min: number, max: number, type: 'Flat' | 'Percent'): number {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);

  let rolled: number;

  switch (type) {
    case 'Flat':
      rolled = Math.floor(lo + Math.random() * (hi - lo + 1));
      break;

    case 'Percent':
      rolled = lo + Math.random() * (hi - lo);
      rolled = Math.round(rolled * 100) / 100;
      break;
  }

  const percentage = (rolled - min) / (max - min);
  return percentage;
}
