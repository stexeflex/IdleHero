import { Label } from '../items/labels/label';
import { SkillTier } from './skill-tier.type';
import { SkillType } from './skill.type';
import { StatSource } from '../combat/stats/stat-source.type';

export interface SkillLevelSpec {
  Level: number;
  Value: number;
  Type: 'Flat' | 'Percent';
}

export interface SkillEffectMapping {
  /** Human-readable label */
  ToLabel: (value: number) => Label;

  /**
   * A function that maps a numeric value to a StatSource contribution.
   * Implementations will apply the numeric value to the appropriate StatSource fields.
   */
  MapToStatSource: (source: string, value: number) => StatSource;
}

export interface StatSkillDefinition extends SkillDefinition {
  /** Min/Max ranges per level for upgrading this skill. */
  Levels: SkillLevelSpec[];

  /** How to translate a skill into stat contributions */
  Effect: SkillEffectMapping;
}

export interface ActiveSkillDefinition extends SkillDefinition {}

export interface PassiveSkillDefinition extends SkillDefinition {}

export interface SkillDefinition {
  Id: string;
  Name: string;

  /** Description of the effect provided by this skill. */
  Description: string;

  /* The type of this skill, which determines how it behaves in the game and how it's upgraded. */
  Type: SkillType;

  /* The tier this skill belongs to, which determines its unlock requirements and costs. */
  Tier: SkillTier;
}

export interface Skill {
  /** References the SkillDefinition.Id this skill is based on. */
  DefinitionId: string;

  /** The level this skill is currently at. */
  Level: number;
}
