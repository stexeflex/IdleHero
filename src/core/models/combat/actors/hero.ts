import { CharactersIconName } from '../../../../shared/components';
import { CombatActor } from './combat-actor';
import { ComputedHeroStats } from '../stats/stats';

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
  Charge: ChargeState;
}

export function InitialHeroCharge(): ChargeState {
  return {
    Current: 0,
    Max: 100,
    Charged: false
  };
}
