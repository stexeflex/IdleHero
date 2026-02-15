import { Boss } from './actors/boss.';
import { DamageResult } from '../../systems/combat';
import { Hero } from './actors/hero';

export type Actor = Hero | Boss;
export type Target = Hero | Boss;

export type EventType =
  | 'Attack'
  | 'Miss'
  | 'Damage'
  | 'DamageOverTime'
  | 'ClearDamageOverTime'
  | 'Charge'
  | 'Clear'
  | 'Heal'
  | 'Death'
  | 'StageAdvance';

export type AttackEvent = {
  Type: 'Attack';
  AtMs: number;
  Actor: Actor;
  Target: Target;
};

export type MissEvent = {
  Type: 'Miss';
  AtMs: number;
  Actor: Actor;
  Target: Target;
};

export type DamageEvent = {
  Type: 'Damage';
  AtMs: number;
  Actor: Actor;
  Target: Target;
  Damage: DamageResult[];
  IsMultiHit: boolean;
};

export type DamageOverTimeEvent = {
  Type: 'DamageOverTime';
  DotType: 'Bleed';
  AtMs: number;
  Target: Target;
  Damage: DamageResult;
  Tick: number;
  TotalTicks: number;
};

export type ChargeEvent = {
  Type: 'Charge';
  AtMs: number;
  Actor: Actor;
  Amount: number;
};

export type ClearEvent = {
  Type: 'Clear';
  AtMs: number;
  Target: Target;
  ClearingType: 'Charge' | 'Bleed';
};

export type HealEvent = {
  Type: 'Heal';
  AtMs: number;
  Actor: Actor;
  Target: Target;
  Amount: number;
};

export type DeathEvent = {
  Type: 'Death';
  AtMs: number;
  Actor: Actor;
};

export type StageAdvanceEvent = {
  Type: 'StageAdvance';
  AtMs: number;
};

export type CombatEvent =
  | AttackEvent
  | MissEvent
  | DamageEvent
  | DamageOverTimeEvent
  | ChargeEvent
  | ClearEvent
  | HealEvent
  | DeathEvent
  | StageAdvanceEvent;
