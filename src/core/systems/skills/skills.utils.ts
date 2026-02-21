import { LabelToString, SkillDefinition, SkillTier, StatSkillDefinition } from '../../models';
import {
  SKILL_COST_CONFIG,
  SKILL_TIER_1_SKILLS,
  SKILL_TIER_2_SKILLS,
  SKILL_TIER_3_SKILLS,
  SKILL_TIER_CONFIG
} from '../../constants';

import { DecimalPipe } from '@angular/common';

export const TierOrder: SkillTier[] = ['I', 'II', 'III'];

export const SkillDefinitionsByTier: Record<SkillTier, SkillDefinition[]> = {
  I: [...SKILL_TIER_1_SKILLS],
  II: [...SKILL_TIER_2_SKILLS],
  III: [...SKILL_TIER_3_SKILLS]
};

export const SkillDefinitionsById = new Map<string, SkillDefinition>(
  [...SKILL_TIER_1_SKILLS, ...SKILL_TIER_2_SKILLS, ...SKILL_TIER_3_SKILLS].map((definition) => [
    definition.Id,
    definition
  ])
);

export function GetSkillUnlockCost(tier: SkillTier): number {
  const baseCost = SKILL_COST_CONFIG.SKILL_UNLOCK_COST;
  const multiplier = SKILL_COST_CONFIG.SKILL_UNLOCK_MULTIPLIER_PER_TIER;
  const index = GetTierIndex(tier);
  return Math.round(baseCost * Math.pow(multiplier, index - 1));
}

export function GetSkillUpgradeCost(tier: SkillTier, level: number): number {
  const baseCost = SKILL_COST_CONFIG.SKILL_UPGRADE_COST_PER_LEVEL;
  const multiplier = SKILL_COST_CONFIG.SKILL_UPGRADE_MULTIPLIER_PER_TIER;
  const index = GetTierIndex(tier);
  return Math.round(baseCost * Math.pow(multiplier, index - 1) * level);
}

export function GetTierMeta(tier: SkillTier): { REQUIRED_LEVEL: number; GOLD_COST: number } {
  const index = GetTierIndex(tier);
  return SKILL_TIER_CONFIG[index];
}

export function GetTierIndex(tier: SkillTier): 1 | 2 | 3 {
  const index = TierOrder.indexOf(tier) + 1;
  if (index < 1 || index > 3) {
    throw new Error(`Unknown skill tier: ${tier}`);
  }
  return index as 1 | 2 | 3;
}

export function GetPreviousTier(tier: SkillTier): SkillTier | null {
  const index = TierOrder.indexOf(tier);
  if (index <= 0) return null;
  return TierOrder[index - 1];
}

export function IsSkillMaxLevel(skillId: string, level: number): boolean {
  const maxLevel = GetSkillMaxLevel(skillId);
  return level >= maxLevel;
}

export function GetSkillMaxLevel(skillId: string): number {
  const definition = SkillDefinitionsById.get(skillId);
  if (!definition) return 0;

  if (IsStatSkillDefinition(definition)) {
    return definition.Levels.length;
  }

  return 1;
}

export function IsStatSkillDefinition(
  definition: SkillDefinition
): definition is StatSkillDefinition {
  return definition.Type === 'StatBoost';
}

export function GetSkillEffect(skillId: string, level: number, locale: string): string {
  const decimalPipe = new DecimalPipe(locale);
  const definition = SkillDefinitionsById.get(skillId);
  if (!definition) return '';

  switch (definition.Type) {
    case 'StatBoost':
      const statSkillDefinition = definition as StatSkillDefinition;
      const value = statSkillDefinition.Levels[level > 0 ? level - 1 : 0]?.Value;
      if (value === undefined) return '';
      const label = statSkillDefinition.Effect.ToLabel(value);
      return LabelToString(label, decimalPipe);
    default:
      return '';
  }
}
