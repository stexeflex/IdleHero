import { Actor, Target } from './combat-event';

import { DamageResult } from '../../systems/combat';

export enum CombatLogType {
  Info = 'Info',
  Damage = 'Damage',
  Bleed = 'Bleed',
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

export interface DamageLogEntry extends BaseCombatLogEntry {
  Type: CombatLogType.Damage;
  Actor: Actor;
  Target: Target;
  Damage: DamageResult[];
  IsMultiHit: boolean;
}

export interface BleedLogEntry extends BaseCombatLogEntry {
  Type: CombatLogType.Bleed;
  Target: Target;
  Damage: DamageResult;
  Tick: number;
  TotalTicks: number;
}

export interface MissLogEntry extends BaseCombatLogEntry {
  Type: CombatLogType.Miss;
  Actor: Actor;
  Target: Target;
  HitChance: number;
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
  | DamageLogEntry
  | BleedLogEntry
  | MissLogEntry
  | HealLogEntry
  | DeathLogEntry;
