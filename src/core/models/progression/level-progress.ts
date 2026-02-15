import { LEVELING_CONFIG } from '../../constants';

export interface LevelProgress {
  Level: number;
  ExperienceInLevel: number;
  ExperienceToNext: number;
}

export function InitialLevelProgressState(): LevelProgress {
  return {
    Level: LEVELING_CONFIG.BASE_LEVEL,
    ExperienceInLevel: 0,
    ExperienceToNext: LEVELING_CONFIG.BASE_XP_TO_NEXT
  };
}
