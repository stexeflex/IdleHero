import { BATTLE_CONFIG } from '../constants';

export class Experience {
  public static GetForStage(stage: number): number {
    // Formula: Base + (Stage - 1) * GrowthRate
    return Math.round(
      BATTLE_CONFIG.REWARDS.BASE_EXPERIENCE_REWARD +
        (stage - 1) * BATTLE_CONFIG.REWARDS.EXPERIENCE_REWARD_PER_STAGE
    );
  }
}
