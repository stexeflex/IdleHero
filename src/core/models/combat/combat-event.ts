export type AttackEvent = {
  Type: 'Attack';
  AtMs: number;
  ActorId: string;
  TargetId: string;
};

export type MissEvent = {
  Type: 'Miss';
  AtMs: number;
  ActorId: string;
  TargetId: string;
  HitChance: number;
};

export type DamageEvent = {
  Type: 'Damage';
  AtMs: number;
  ActorId: string;
  TargetId: string;
  Amount: number;
  IsCritical?: boolean;
};

export type MultiHitEvent = {
  Type: 'MultiHit';
  AtMs: number;
  ActorId: string;
  TargetId: string;
  HitNumber: number;
  TotalHits: number;
  Amount: number;
  IsCritical?: boolean;
};

export type HealEvent = {
  Type: 'Heal';
  AtMs: number;
  ActorId: string;
  TargetId: string;
  Amount: number;
};

export type DeathEvent = {
  Type: 'Death';
  AtMs: number;
  ActorId: string;
};

export type CombatEvent =
  | AttackEvent
  | MissEvent
  | DamageEvent
  | MultiHitEvent
  | HealEvent
  | DeathEvent;
