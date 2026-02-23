export interface Passives {
  /** Whether the hero's multi hit attacks can trigger critical hits. */
  CriticalMultiHit: boolean;

  /** Whether the hero's attacks can deal splash damage. */
  SplashDamage: boolean;
}

export function InitialPassives(): Passives {
  return {
    CriticalMultiHit: false,
    SplashDamage: false
  };
}
