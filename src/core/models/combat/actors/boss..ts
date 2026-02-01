import { BossStats } from '../stats/stats';
import { CombatActor } from './combat-actor';
import { CreaturesIconName } from '../../../../shared/components';

/**
 * Bosses
 */
export interface Boss extends CombatActor {
  Id: string;
  Name: string;
  BossIcon: CreaturesIconName;
  Stats: BossStats;
}
