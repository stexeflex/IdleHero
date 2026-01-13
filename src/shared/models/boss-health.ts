import { GAME_CONFIG } from '../constants';

export class BossHealth {
  public static CalculateForStage(stage: number): number {
    // Formula: HEALTH_BASE * (HEALTH_GROWTH_RATE)^(Stage - 1)
    return Math.floor(
      GAME_CONFIG.BOSS.BASE_HEALTH * Math.pow(GAME_CONFIG.BOSS.HEALTH_EXP_GROWTH_RATE, stage - 1)
    );
  }
}
