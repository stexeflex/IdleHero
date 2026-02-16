import { DungeonRoom, DungeonStatistics, DungeonType } from '../../models';

import { REWARDS_CONFIG } from '../../constants';

export function StageFactor(stageId: number): number {
  const s = Math.max(1, Math.floor(stageId));
  return 1 + REWARDS_CONFIG.STAGE_LINEAR_FACTOR * (s - 1);
}

export function MidBossFactor(reward: 'GOLD' | 'EXPERIENCE'): number {
  return REWARDS_CONFIG[reward].MID_BOSS_MULTIPLIER;
}

export function CompletionFactor(reward: 'GOLD' | 'EXPERIENCE'): number {
  return REWARDS_CONFIG[reward].COMPLETION_MULTIPLIER;
}

export function ComputeDampedExperience(
  dungeon: DungeonRoom,
  stageId: number,
  statistics: DungeonStatistics
): number {
  const f = StageFactor(stageId);
  const rawExperience = Math.round(dungeon.XpBase * f);

  const config = REWARDS_CONFIG.EXPERIENCE_DAMPING;

  if (!config.ENABLED) {
    return rawExperience;
  }

  const midStages = [...dungeon.MidStages].sort((a, b) => a - b);
  const firstMidStage = midStages[0];
  const secondMidStage = midStages[1];
  const thirdMidStage = midStages[2];

  if (firstMidStage === undefined) {
    return rawExperience;
  }

  const category = dungeon.Type === DungeonType.Capstone ? statistics.Capstone : statistics.Dungeon;
  const highestStageReached = category[dungeon.Id] ?? 0;

  let multiplier = 1;

  // Third Mid Stage Check
  if (
    thirdMidStage !== undefined &&
    highestStageReached >= thirdMidStage &&
    stageId < thirdMidStage
  ) {
    multiplier = config.BELOW_THIRD_MIDSTAGE_MULTIPLIER;
  }
  // Second Mid Stage Check
  else if (
    secondMidStage !== undefined &&
    highestStageReached >= secondMidStage &&
    stageId < secondMidStage
  ) {
    multiplier = config.BELOW_SECOND_MIDSTAGE_MULTIPLIER;
  }
  // First Mid Stage Check
  else if (highestStageReached >= firstMidStage && stageId < firstMidStage) {
    multiplier = config.BELOW_FIRST_MIDSTAGE_MULTIPLIER;
  }

  return Math.max(config.MIN_EXPERIENCE_PER_BOSS, Math.round(rawExperience * multiplier));
}
