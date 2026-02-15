export const REWARDS_CONFIG = {
  STAGE_LINEAR_FACTOR: 0.1, // 10% increase per stage
  MID_BOSS_MULTIPLIER: 3, // 3x rewards for mid-boss
  COMPLETION_MULTIPLIER: 5, // 5x rewards for dungeon completion

  /**
   * Experience damping for farming below gear-check stages.
   * Activates once the player has reached the corresponding mid-stage in that dungeon (tracked via statistics).
   */
  EXPERIENCE_DAMPING: {
    ENABLED: true,
    BELOW_FIRST_MIDSTAGE_MULTIPLIER: 0.25,
    BELOW_SECOND_MIDSTAGE_MULTIPLIER: 0.1,
    MIN_EXPERIENCE_PER_BOSS: 1
  }
};
