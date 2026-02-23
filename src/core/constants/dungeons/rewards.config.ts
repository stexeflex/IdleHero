export const REWARDS_CONFIG = {
  STAGE_LINEAR_FACTOR: 0.1, // 10% increase per stage
  GOLD: {
    MID_BOSS_MULTIPLIER: 10,
    COMPLETION_MULTIPLIER: 25
  },
  EXPERIENCE: {
    MID_BOSS_MULTIPLIER: 5,
    COMPLETION_MULTIPLIER: 10
  },
  /**
   * Experience damping for farming below gear-check stages.
   * Activates once the player has reached the corresponding mid-stage in that dungeon (tracked via statistics).
   */
  EXPERIENCE_DAMPING: {
    ENABLED: true,
    BELOW_FIRST_MIDSTAGE_MULTIPLIER: 0.9,
    BELOW_SECOND_MIDSTAGE_MULTIPLIER: 0.8,
    BELOW_THIRD_MIDSTAGE_MULTIPLIER: 0.7,
    MIN_EXPERIENCE_PER_BOSS: 1
  }
};
