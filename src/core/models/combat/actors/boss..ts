import { Armor } from '../stats/armor';
import { CombatActor } from './combat-actor';
import { CombatStats } from '../stats/stats';
import { CreaturesIconName } from '../../../../shared/components';

/**
 * Bosses
 */
export interface Boss extends CombatActor {
  Id: string;
  Name: string;
  BossIcon: CreaturesIconName;

  Armor: Armor;
  Stats: CombatStats;
}
