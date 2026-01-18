import { DUNGEON_CONFIG } from '../../constants';

export class Experience {
  public static GetForStage(room: number, stage: number): number {
    let baseExp: number;
    let growthRate: number;

    switch (room) {
      case 1:
        baseExp = DUNGEON_CONFIG[1].REWARDS.BASE_EXPERIENCE_REWARD;
        growthRate = DUNGEON_CONFIG[1].REWARDS.EXPERIENCE_REWARD_PER_STAGE;
        break;
      case 2:
        baseExp = DUNGEON_CONFIG[2].REWARDS.BASE_EXPERIENCE_REWARD;
        growthRate = DUNGEON_CONFIG[2].REWARDS.EXPERIENCE_REWARD_PER_STAGE;
        break;
      case 3:
        baseExp = DUNGEON_CONFIG[3].REWARDS.BASE_EXPERIENCE_REWARD;
        growthRate = DUNGEON_CONFIG[3].REWARDS.EXPERIENCE_REWARD_PER_STAGE;
        break;
      default:
        baseExp = DUNGEON_CONFIG[1].REWARDS.BASE_EXPERIENCE_REWARD;
        growthRate = DUNGEON_CONFIG[1].REWARDS.EXPERIENCE_REWARD_PER_STAGE;
        break;
    }

    // Formula: Base + (Stage - 1) * GrowthRate
    return Math.round(baseExp + (stage - 1) * growthRate);
  }
}
