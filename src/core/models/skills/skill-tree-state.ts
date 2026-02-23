import { Skill } from './skill';

/**
 * Model representing the state of a character's skills and tiers.
 */
export interface SkillTreeState {
  // Tier ID : Unlocked (true/false)
  TierState: { [TierId: string]: boolean };

  // Unlocked Skills
  SkillState: Skill[];
}

export function CreateEmptySkillTreeState(): SkillTreeState {
  return {
    TierState: {},
    SkillState: []
  };
}
