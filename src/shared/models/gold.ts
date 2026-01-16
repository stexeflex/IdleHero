import { BATTLE_CONFIG } from '../constants';

export class Gold {
  public static GetForStage(stage: number): number {
    // Formula: Base + (Stage - 1) * GrowthRate
    return Math.round(
      BATTLE_CONFIG.REWARDS.BASE_GOLD_REWARD +
        (stage - 1) * BATTLE_CONFIG.REWARDS.GOLD_REWARD_PER_STAGE
    );
  }
}
