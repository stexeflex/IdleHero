import { DUNGEON_CONFIG } from '../../constants';

export class Gold {
  public static GetForStage(room: number, stage: number): number {
    let baseGold: number;
    let growthRate: number;

    switch (room) {
      case 1:
        baseGold = DUNGEON_CONFIG[1].REWARDS.BASE_GOLD_REWARD;
        growthRate = DUNGEON_CONFIG[1].REWARDS.GOLD_REWARD_PER_STAGE;
        break;
      case 2:
        baseGold = DUNGEON_CONFIG[2].REWARDS.BASE_GOLD_REWARD;
        growthRate = DUNGEON_CONFIG[2].REWARDS.GOLD_REWARD_PER_STAGE;
        break;
      case 3:
        baseGold = DUNGEON_CONFIG[3].REWARDS.BASE_GOLD_REWARD;
        growthRate = DUNGEON_CONFIG[3].REWARDS.GOLD_REWARD_PER_STAGE;
        break;
      default:
        baseGold = DUNGEON_CONFIG[1].REWARDS.BASE_GOLD_REWARD;
        growthRate = DUNGEON_CONFIG[1].REWARDS.GOLD_REWARD_PER_STAGE;
        break;
    }

    // Formula: Base + (Stage - 1) * GrowthRate
    return Math.round(baseGold + (stage - 1) * growthRate);
  }
}
