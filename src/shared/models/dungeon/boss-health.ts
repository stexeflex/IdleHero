import { DUNGEON_CONFIG } from '../../constants';

export class BossHealth {
  public static CalculateForStage(room: number, stage: number): number {
    let baseHealth: number;
    let growthRate: number;

    switch (room) {
      case 1:
        baseHealth = DUNGEON_CONFIG[1].BOSS.BASE_HEALTH;
        growthRate = DUNGEON_CONFIG[1].BOSS.HEALTH_EXP_GROWTH_RATE;
        break;
      case 2:
        baseHealth = DUNGEON_CONFIG[2].BOSS.BASE_HEALTH;
        growthRate = DUNGEON_CONFIG[2].BOSS.HEALTH_EXP_GROWTH_RATE;
        break;
      case 3:
        baseHealth = DUNGEON_CONFIG[3].BOSS.BASE_HEALTH;
        growthRate = DUNGEON_CONFIG[3].BOSS.HEALTH_EXP_GROWTH_RATE;
        break;
      default:
        baseHealth = DUNGEON_CONFIG[1].BOSS.BASE_HEALTH;
        growthRate = DUNGEON_CONFIG[1].BOSS.HEALTH_EXP_GROWTH_RATE;
        break;
    }

    // Formula: HEALTH_BASE * (HEALTH_GROWTH_RATE)^(Stage - 1)
    return Math.floor(baseHealth * Math.pow(growthRate, stage - 1));
  }
}
