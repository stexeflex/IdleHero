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
  Stats: CombatStats;
}
