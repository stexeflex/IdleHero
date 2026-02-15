import { LEVELING_CONFIG } from '../../constants';

export interface LevelState {
  Level: number; // current level
  TotalExperience: number; // cumulative experience across all levels
  ExperienceInLevel: number; // experience accumulated within current level
  ExperienceToNext: number; // experience required to reach next level
}

export function InitialLevelState(): LevelState {
  return {
    Level: LEVELING_CONFIG.BASE_LEVEL,
    TotalExperience: 0,
    ExperienceInLevel: 0,
    ExperienceToNext: LEVELING_CONFIG.BASE_XP_TO_NEXT
  };
}
