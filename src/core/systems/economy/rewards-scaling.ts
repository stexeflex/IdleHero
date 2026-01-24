import { REWARDS_CONFIG } from '../../constants';

export function StageFactor(stageId: number): number {
  const s = Math.max(1, Math.floor(stageId));
  return 1 + REWARDS_CONFIG.STAGE_LINEAR_FACTOR * (s - 1);
}

export function MidBossFactor(): number {
  return REWARDS_CONFIG.MID_BOSS_MULTIPLIER;
}

export function CompletionFactor(): number {
  return REWARDS_CONFIG.COMPLETION_MULTIPLIER;
}
