export interface AttackResult {
  Damage: number;
  AttackType: AttackType;
}

export enum AttackType {
  Normal = 0,
  Critical = 1 << 0,
  MultiHit = 1 << 1,
  Splash = 1 << 2
}
