/**
 * Model representing the state of a character's skills and tiers.
 */
export interface SkillTreeState {
  // Tier ID : Unlocked (true/false)
  TierState: { [TierId: number]: boolean };

  // Skill ID : Skill Level
  SkillState: { [SkillId: string]: number };
}
