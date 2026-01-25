import { CharactersIconName } from '../../../../shared/components';
import { CombatActor } from './combat-actor';
import { ComputedStats } from '../stats/stats';

/**
 * Hero
 */
export interface Hero extends CombatActor {
  Name: string;
  HeroIcon: CharactersIconName;
  Stats: ComputedStats;
}
