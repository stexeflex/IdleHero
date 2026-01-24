export interface LevelState {
  Level: number; // current level
  TotalExperience: number; // cumulative experience across all levels
  ExperienceInLevel: number; // experience accumulated within current level
  ExperienceToNext: number; // experience required to reach next level from current
}
