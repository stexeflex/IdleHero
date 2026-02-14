import { LEVELING_CONFIG } from '../../constants';
import { LevelState } from './level-state';

export interface PlayerLevelState extends LevelState {
  UnspentAttributePoints: number; // points awarded on level-up, available to allocate
}

export function InitialPlayerLevelState(
  level = LEVELING_CONFIG.BASE_LEVEL,
  totalExperience = 0,
  experienceInLevel = 0,
  unspentAttributePoints = 0
): PlayerLevelState {
  return {
    Level: level,
    TotalExperience: totalExperience,
    ExperienceInLevel: experienceInLevel,
    UnspentAttributePoints: unspentAttributePoints
  };
}
