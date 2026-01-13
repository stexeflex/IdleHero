import { GAME_CONFIG } from '../constants';

export class Experience {
  public static GetForStage(stage: number): number {
    // Formula: Base + (Stage - 1) * GrowthRate
    return Math.round(
      GAME_CONFIG.REWARDS.BASE_EXPERIENCE_REWARD +
        (stage - 1) * GAME_CONFIG.REWARDS.EXPERIENCE_REWARD_PER_STAGE
    );
  }
}
