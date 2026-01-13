import { GAME_CONFIG } from '../constants';

export class Gold {
  public static GetForStage(stage: number): number {
    // Formula: Base + (Stage - 1) * GrowthRate
    return Math.round(
      GAME_CONFIG.REWARDS.BASE_GOLD_REWARD + (stage - 1) * GAME_CONFIG.REWARDS.GOLD_REWARD_PER_STAGE
    );
  }
}
