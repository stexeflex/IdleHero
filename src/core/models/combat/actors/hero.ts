import { CombatActor } from './combat-actor';
import { ComputedStats } from '../stats/stats';

/**
 * Hero
 */
export interface Hero extends CombatActor {
  Stats: ComputedStats;
}
