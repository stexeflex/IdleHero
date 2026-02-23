export interface WarCryEffect {
  /** Whether the War Cry effect is currently active. */
  Active: boolean;

  /* The percentage increase in damage while the War Cry effect is active. */
  DamageIncreasePercent: number;
}

export interface StrickenEffect {
  /** Whether the Stricken effect is currently active. */
  Active: boolean;

  /**
   * The percentage increase in damage while the Stricken effect is active.
   * [0.008 - 0.016] per stack, depending on the skill level.
   */
  DamageIncreasePerHit: number;

  /** The number of stacks of the Stricken effect currently applied to the target. */
  Stacks: number;

  /** The total percentage increase in damage from all stacks of the Stricken effect. */
  TotalIncreasedDamagePercent: number;
}

export interface SkillEffects {
  WarCry: WarCryEffect;
  Stricken: StrickenEffect;
}

export function InitialSkillEffects(): SkillEffects {
  return {
    WarCry: {
      Active: false,
      DamageIncreasePercent: 0
    },
    Stricken: {
      Active: false,
      DamageIncreasePerHit: 0,
      Stacks: 0,
      TotalIncreasedDamagePercent: 0
    }
  };
}
