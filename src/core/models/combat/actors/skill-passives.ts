export interface SplashDamagePassive {
  Enabled: boolean;
  DamagePercent: number;
}

export interface Passives {
  /** Whether the hero's multi hit attacks can trigger critical hits. */
  CriticalMultiHit: boolean;

  /** Whether the hero's attacks can deal splash damage. */
  SplashDamage: SplashDamagePassive;
}

export function InitialPassives(): Passives {
  return {
    CriticalMultiHit: false,
    SplashDamage: {
      Enabled: false,
      DamagePercent: 0
    }
  };
}
