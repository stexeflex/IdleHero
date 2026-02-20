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
