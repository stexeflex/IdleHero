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

export type LifeStatSource = {
  Flat: number;
  Multiplier: number;
};

export type ArmorStatSource = {
  Flat: number;
  Multiplier: number;
};

export type StrengthStatSource = {
  Flat: number;
};

export type IntelligenceStatSource = {
  Flat: number;
};

export type DexterityStatSource = {
  Flat: number;
};

export type DamageStatSource = {
  Flat: number;
};

export type AttackSpeedStatSource = {
  Multiplier: number;
};

export type BleedingStatSource = {
  Chance: number;

  FlatDamage: number;
  MultiplierDamage: number;
};

export type CriticalHitStatSource = {
  Chance: number;

  FlatDamage: number;
  MultiplierDamage: number;
};

export type MultiHitStatSource = {
  Chance: number;

  ChainFactor: number;

  FlatDamage: number;
  MultiplierDamage: number;
};

export type AccuracyStatSource = {
  Multiplier: number;
};

export type ChargingStrikeStatSource = {
  ChargeGain: number;
  ChargeDamage: number;
  ChargeDuration: number;
};

export function EmptyStatSource(id: string): StatSource {
  return {
    Id: id,
    Strength: { Flat: 0 },
    Intelligence: { Flat: 0 },
    Dexterity: { Flat: 0 },
    Damage: { Flat: 0 },
    AttackSpeed: { Multiplier: 0 },
    Bleeding: {
      Chance: 0,
      FlatDamage: 0,
      MultiplierDamage: 0
    },
    CriticalHit: {
      Chance: 0,
      FlatDamage: 0,
      MultiplierDamage: 0
    },
    MultiHit: {
      Chance: 0,
      ChainFactor: 0,
      FlatDamage: 0,
      MultiplierDamage: 0
    },
    Accuracy: { Multiplier: 0 },
    ChargingStrike: { ChargeGain: 0, ChargeDamage: 0, ChargeDuration: 0 }
  };
}
