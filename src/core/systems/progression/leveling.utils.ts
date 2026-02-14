import { LEVELING_CONFIG } from '../../constants';
import { LevelProgress } from '../../models';
import { XpToNextLevel } from './level-scaling';

export function ComputeProgressFromTotalXP(totalXP: number): LevelProgress {
  const cap = LEVELING_CONFIG.LEVEL_CAP;

  let level = 1;
  let remaining = Math.max(0, Math.floor(totalXP));
  let xpToNext = XpToNextLevel(level);

  while (remaining >= xpToNext && level < cap) {
    remaining -= xpToNext;
    level += 1;
  }

  return {
    Level: level,
    ExperienceInLevel: remaining
  };
}

export function ClampLevel(level: number): number {
  return Math.max(1, Math.min(LEVELING_CONFIG.LEVEL_CAP, Math.floor(level)));
}
