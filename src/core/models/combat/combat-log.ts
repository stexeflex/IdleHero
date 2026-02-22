import { Actor, Target } from './combat-event';

import { DamageResult } from '../../systems/combat';
import { Rewards } from '../economy/rewards';

export enum CombatLogType {
  Info = 'Info',
  Rewards = 'Rewards',
  Damage = 'Damage',
  Miss = 'Miss',
  Heal = 'Heal',
  Death = 'Death'
}

export interface BaseCombatLogEntry {
  Type: CombatLogType;
  TimestampMs: number;
}

export interface InfoLogEntry extends BaseCombatLogEntry {
  Type: CombatLogType.Info;
  Message: string;
}

export interface RewardsLogEntry extends BaseCombatLogEntry {
  Type: CombatLogType.Rewards;
  Stage: number;
  Rewards: Rewards;
}

export interface DamageLogEntry extends BaseCombatLogEntry {
  Type: CombatLogType.Damage;
  Actor: Actor;
  Target: Target;
  Damage: DamageResult[];
  IsMultiHit: boolean;
}

export interface MissLogEntry extends BaseCombatLogEntry {
  Type: CombatLogType.Miss;
  Actor: Actor;
  Target: Target;
}

export interface HealLogEntry extends BaseCombatLogEntry {
  Type: CombatLogType.Heal;
  Actor: Actor;
  Target: Target;
  Amount: number;
}

export interface DeathLogEntry extends BaseCombatLogEntry {
  Type: CombatLogType.Death;
  Actor: Actor;
}

export type CombatLogEntry =
  | InfoLogEntry
  | RewardsLogEntry
  | DamageLogEntry
  | MissLogEntry
  | HealLogEntry
  | DeathLogEntry;
