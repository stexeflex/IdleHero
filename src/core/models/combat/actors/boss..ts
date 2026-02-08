import { BossStats } from '../stats/stats';
import { CombatActor } from './combat-actor';
import { CreaturesIconName } from '../../../../shared/components';

interface BossIcon {
  Icon: CreaturesIconName;
  Rotate: boolean;
}

/**
 * Bosses
 */
export interface Boss extends CombatActor {
  Id: string;
  Name: string;
  BossIcon: BossIcon;
  Stats: BossStats;
}

export function BossIcon(Icon: CreaturesIconName, Rotate: boolean = false): BossIcon {
  return { Icon, Rotate } as BossIcon;
}
