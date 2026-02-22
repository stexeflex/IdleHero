import { CharactersIconName } from '../../../../shared/components';
import { ChargeState } from './charge-state';
import { CombatActor } from './combat-actor';
import { ComputedHeroStats } from '../stats/stats';
import { Passives } from './skill-passives';
import { SkillEffects } from './skill-effects';

/**
 * Hero
 */
export interface Hero extends CombatActor {
  Name: string;
  HeroIcon: CharactersIconName;
  Stats: ComputedHeroStats;
  Passives: Passives;
  Effects: SkillEffects;
  Charge: ChargeState;
  SplashDamage: number;
}
