/**
 * Stat Sources
 * ==============
 * Definiert die Quellen der verschiedenen Stats.
 * Jede Quelle kann flache Werte und Multiplikatoren bereitstellen,
 * die zur Berechnung der endgültigen Stats verwendet werden.
 */
export type StatSource = {
  Id: string;

  Strength: StrengthStatSource;
  Intelligence: IntelligenceStatSource;
  Dexterity: DexterityStatSource;

  Damage: DamageStatSource;
  AttackSpeed: AttackSpeedStatSource;

  Bleeding: BleedingStatSource;
  CriticalHit: CriticalHitStatSource;
  MultiHit: MultiHitStatSource;

  Accuracy: AccuracyStatSource;

  ChargingStrike: ChargingStrikeStatSource;
};

export type StrengthStatSource = {
  Value: number;
};

export type IntelligenceStatSource = {
  Value: number;
};

export type DexterityStatSource = {
  Value: number;
};

export type DamageStatSource = {
  Value: number;
};

export type AttackSpeedStatSource = {
  Value: number;
};

export type BleedingStatSource = {
  Chance: number;
  Damage: number;
  Ticks: number;
};

export type CriticalHitStatSource = {
  Chance: number;
  Damage: number;
};

export type MultiHitStatSource = {
  Chance: number;
  Damage: number;
  ChainFactor: number;
  Chain: number;
};

export type AccuracyStatSource = {
  Value: number;
};

export type ChargingStrikeStatSource = {
  ChargeGain: number;
  ChargeLossPercentage: number;
  ChargeDamage: number;
  ChargeDuration: number;
};

export function EmptyStatSource(id: string): StatSource {
  return {
    Id: id,
    Strength: { Value: 0 },
    Intelligence: { Value: 0 },
    Dexterity: { Value: 0 },
    Damage: { Value: 0 },
    AttackSpeed: { Value: 0 },
    Bleeding: {
      Chance: 0,
      Damage: 0,
      Ticks: 0
    },
    CriticalHit: {
      Chance: 0,
      Damage: 0
    },
    MultiHit: {
      Chance: 0,
      Damage: 0,
      ChainFactor: 0,
      Chain: 0
    },
    Accuracy: { Value: 0 },
    ChargingStrike: {
      ChargeGain: 0,
      ChargeLossPercentage: 100,
      ChargeDamage: 0,
      ChargeDuration: 0
    }
  };
}
