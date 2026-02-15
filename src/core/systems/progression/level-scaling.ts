import { ClampUtils } from '../../../shared/utils';
import { LEVELING_CONFIG } from '../../constants';
import { LevelProgress } from '../../models';

export function ComputeProgressFromTotalXP(totalXP: number): LevelProgress {
  const cap = LEVELING_CONFIG.LEVEL_CAP;

  let level = 1;
  let remaining = Math.max(0, Math.floor(totalXP));
  let xpToNext = XpToNextLevel(level);

  while (remaining >= xpToNext && level < cap) {
    remaining -= xpToNext;
    level += 1;
    xpToNext = XpToNextLevel(level);
  }

  return {
    Level: level,
    ExperienceInLevel: remaining,
    ExperienceToNext: xpToNext
  };
}

export function ClampLevel(level: number): number {
  return ClampUtils.clamp(Math.floor(level), LEVELING_CONFIG.BASE_LEVEL, LEVELING_CONFIG.LEVEL_CAP);
}

export function XpToNextLevel(level: number): number {
  const clampedLevel = Math.max(1, Math.floor(level));

  // Total XP curve (power): T(L) = K * (L^p - 1)
  // Level-up cost: XPnext(L) = T(L+1) - T(L) = K * ((L+1)^p - L^p)
  // Calibrate K so that XPnext(1) === BASE_XP_TO_NEXT.
  const { BASE_XP_TO_NEXT, TOTAL_XP_EXPONENT } = LEVELING_CONFIG;
  const p = TOTAL_XP_EXPONENT;
  const k = BASE_XP_TO_NEXT / (Math.pow(2, p) - 1);

  const current = Math.pow(clampedLevel, p);
  const next = Math.pow(clampedLevel + 1, p);
  return Math.max(1, Math.round(k * (next - current)));
}
