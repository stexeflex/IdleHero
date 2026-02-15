import { LevelState } from './level-state';

export interface AscensionLevelState extends LevelState {
  AscensionCount: number; // number of times the character has ascended
  UnspentAscensionCrystals: number; // crystals awarded on ascension, available to allocate
}

export function InitialAscensionLevelState(
  level = 1,
  totalExperience = 0,
  experienceInLevel = 0,
  ascensionCount = 0,
  unspentAscensionCrystals = 0
): AscensionLevelState {
  return {
    Level: level,
    TotalExperience: totalExperience,
    ExperienceInLevel: experienceInLevel,
    ExperienceToNext: 0,
    AscensionCount: ascensionCount,
    UnspentAscensionCrystals: unspentAscensionCrystals
  };
}
