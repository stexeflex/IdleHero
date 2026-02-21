import {
  ACTIVE_SKILL_DEFINITIONS,
  PASSIVE_SKILL_DEFINITIONS,
  STAT_SKILL_DEFINITIONS
} from './skills.config';

import { SkillDefinition } from '../../models';

export const SKILL_TIER_CONFIG = {
  1: {
    REQUIRED_LEVEL: 5,
    GOLD_COST: 2500
  },
  2: {
    REQUIRED_LEVEL: 15,
    GOLD_COST: 7500
  },
  3: {
    REQUIRED_LEVEL: 25,
    GOLD_COST: 10_000
  }
};

export const SKILL_TIER_1_SKILLS: SkillDefinition[] = [
  ...STAT_SKILL_DEFINITIONS.filter((s) => s.Tier === 'I'),
  ...ACTIVE_SKILL_DEFINITIONS.filter((s) => s.Tier === 'I'),
  ...PASSIVE_SKILL_DEFINITIONS.filter((s) => s.Tier === 'I')
];
export const SKILL_TIER_2_SKILLS: SkillDefinition[] = [
  ...STAT_SKILL_DEFINITIONS.filter((s) => s.Tier === 'II'),
  ...ACTIVE_SKILL_DEFINITIONS.filter((s) => s.Tier === 'II'),
  ...PASSIVE_SKILL_DEFINITIONS.filter((s) => s.Tier === 'II')
];
export const SKILL_TIER_3_SKILLS: SkillDefinition[] = [
  ...STAT_SKILL_DEFINITIONS.filter((s) => s.Tier === 'III'),
  ...ACTIVE_SKILL_DEFINITIONS.filter((s) => s.Tier === 'III'),
  ...PASSIVE_SKILL_DEFINITIONS.filter((s) => s.Tier === 'III')
];
