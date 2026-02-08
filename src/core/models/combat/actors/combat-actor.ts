import { ActorState } from './actor-state';
import { Armor } from '../stats/armor';
import { AttackInterval } from '../stats/attack-interval';
import { Life } from '../stats/life';

export interface CombatActor {
  Life: Life;
  Armor: Armor;
  AttackInterval: AttackInterval;
  State: ActorState;
}
