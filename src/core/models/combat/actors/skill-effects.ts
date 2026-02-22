export interface WarCryEffect {
  /** Whether the War Cry effect is currently active. */
  Active: boolean;
}

export interface StrickenEffect {
  /** Whether the Stricken effect is currently active. */
  Active: boolean;
}

export interface SkillEffects {
  WarCry: WarCryEffect;
  Stricken: StrickenEffect;
}

export function InitialSkillEffects(): SkillEffects {
  return {
    WarCry: { Active: false },
    Stricken: { Active: false }
  };
}
