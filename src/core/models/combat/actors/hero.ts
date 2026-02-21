import { CharactersIconName } from '../../../../shared/components';
import { CombatActor } from './combat-actor';
import { ComputedHeroStats } from '../stats/stats';
import { STATS_CONFIG } from '../../../constants';

export interface Passives {
  /** Whether the hero's multi hit attacks can trigger critical hits. */
  CriticalMultiHit: boolean;

  /** Whether the hero's attacks can deal splash damage. */
  SplashDamage: boolean;

  /** Whether the hero's War Cry skill is currently active. */
  WarCry: boolean;
}

export interface ChargeState {
  Current: number;
  Max: number;
  Charged: boolean;
}

/**
 * Hero
 */
export interface Hero extends CombatActor {
  Name: string;
  HeroIcon: CharactersIconName;
  Stats: ComputedHeroStats;
  Passives: Passives;
  Charge: ChargeState;
  SplashDamage: number;
}

export function InitialPassives(): Passives {
  return {
    CriticalMultiHit: false,
    SplashDamage: false,
    WarCry: false
  };
}

export function InitialHeroCharge(): ChargeState {
  return {
    Current: 0,
    Max: STATS_CONFIG.BASE.CHARGE_MAX,
    Charged: false
  };
}
