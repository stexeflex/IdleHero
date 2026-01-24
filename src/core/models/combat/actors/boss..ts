import { Armor } from '../stats/armor';
import { CombatActor } from './combat-actor';
import { CombatStats } from '../stats/stats';

/**
 * Bosses
 */
export interface Boss extends CombatActor {
  Id: string;
  Name: string;

  Armor: Armor;
  Stats: CombatStats;
}
