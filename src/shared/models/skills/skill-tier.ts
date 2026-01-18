import {
  Skill,
  SkillAttackPower,
  SkillAttackSpeed,
  SkillForTree2,
  SkillForTree3
} from '../skills/skill';

import { SKILL_TIER_CONFIG } from '../../constants';

export const SKILL_TIER_1_SKILLS: Skill[] = [new SkillAttackPower(), new SkillAttackSpeed()];
export const SKILL_TIER_2_SKILLS: Skill[] = [new SkillForTree2()];
export const SKILL_TIER_3_SKILLS: Skill[] = [new SkillForTree3()];

export abstract class SkillTier {
  constructor(
    public readonly Id: number,
    public readonly RequiredLevel: number,
    public readonly GoldCost: number,
    public readonly Skills: Skill[]
  ) {}
}

export class SkillTier1 extends SkillTier {
  constructor() {
    super(
      1,
      SKILL_TIER_CONFIG[1].REQUIRED_LEVEL,
      SKILL_TIER_CONFIG[1].GOLD_COST,
      SKILL_TIER_1_SKILLS
    );
  }
}

export class SkillTier2 extends SkillTier {
  constructor() {
    super(
      2,
      SKILL_TIER_CONFIG[2].REQUIRED_LEVEL,
      SKILL_TIER_CONFIG[2].GOLD_COST,
      SKILL_TIER_2_SKILLS
    );
  }
}

export class SkillTier3 extends SkillTier {
  constructor() {
    super(
      3,
      SKILL_TIER_CONFIG[3].REQUIRED_LEVEL,
      SKILL_TIER_CONFIG[3].GOLD_COST,
      SKILL_TIER_3_SKILLS
    );
  }
}

export const SKILL_TIERS: SkillTier[] = [new SkillTier1(), new SkillTier2(), new SkillTier3()];
