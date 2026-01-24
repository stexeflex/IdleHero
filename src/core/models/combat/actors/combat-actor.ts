import { AttackInterval } from '../stats/attack-interval';
import { Life } from '../stats/life';

export interface CombatActor {
  Life: Life;
  AttackInterval: AttackInterval;
}
