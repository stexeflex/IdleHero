import { Label } from '../items/labels/label';
import { Passives } from '../combat/actors/hero';
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

interface TemporarySkillDefinition extends SkillDefinition {
  // Duration of the active skill effect in seconds
  Duration: number;

  // Cooldown of the active skill in seconds
  Cooldown: number;
}

export interface StatSkillDefinition extends SkillDefinition {
  /** Min/Max ranges per level for upgrading this skill. */
  Levels: SkillLevelSpec[];

  /** How to translate a skill into stat contributions */
  Effect: SkillEffectMapping;
}

export interface ActiveSkillDefinition extends TemporarySkillDefinition {
  /**
   * A function that maps a numeric value to a StatSource contribution.
   * Implementations will apply the numeric value to the appropriate StatSource fields.
   */
  MapToStatSource: (source: string) => StatSource;
}

export interface PassiveSkillDefinition extends SkillDefinition {
  /**
   * A function that maps a value to a Passives contribution.
   * This is used for skills that provide passive effects rather than direct stat boosts.
   */
  MapToPassiveEffect: (passives: Passives) => Passives;
}

export interface BuffSkillDefinition extends TemporarySkillDefinition, PassiveSkillDefinition {}

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
