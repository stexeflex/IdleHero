import { LEVELING_CONFIG } from '../../constants';

export function XpToNextLevel(level: number): number {
  if (level === 1) {
    return LEVELING_CONFIG.BASE_XP_TO_NEXT;
  }

  const { BASE_XP_TO_NEXT, GROWTH_EXPONENT, LINEAR_TERM } = LEVELING_CONFIG;
  const scaled = BASE_XP_TO_NEXT * Math.pow(level, GROWTH_EXPONENT);
  const linear = LINEAR_TERM * level;
  return Math.max(1, Math.round(scaled + linear));
}
