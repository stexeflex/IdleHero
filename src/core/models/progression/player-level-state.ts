import { LEVELING_CONFIG } from '../../constants';
import { LevelState } from './level-state';

export interface PlayerLevelState extends LevelState {
  UnspentAttributePoints: number; // points awarded on level-up, available to allocate
}

export function InitialLevelState(
  level = LEVELING_CONFIG.BASE_LEVEL,
  totalExperience = 0,
  experienceInLevel = 0,
  experienceToNext = LEVELING_CONFIG.BASE_XP_TO_NEXT,
  unspentAttributePoints = 0
): PlayerLevelState {
  return {
    Level: level,
    TotalExperience: totalExperience,
    ExperienceInLevel: experienceInLevel,
    ExperienceToNext: experienceToNext,
    UnspentAttributePoints: unspentAttributePoints
  };
}
