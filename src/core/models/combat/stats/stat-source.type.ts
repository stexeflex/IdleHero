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
  ArmorPenetration: ArmorPenetrationStatSource;
  ResistancePenetration: ResistancePenetrationStatSource;

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
  Multiplier: number;
};

export type IntelligenceStatSource = {
  Flat: number;
  Multiplier: number;
};

export type DexterityStatSource = {
  Flat: number;
  Multiplier: number;
};

export type DamageStatSource = {
  Flat: number;
  Multiplier: number;
};

export type AttackSpeedStatSource = {
  Flat: number;
  Multiplier: number;
};

export type BleedingStatSource = {
  FlatChance: number;
  MultiplierChance: number;

  FlatDamage: number;
  MultiplierDamage: number;
};

export type CriticalHitStatSource = {
  FlatChance: number;
  MultiplierChance: number;

  FlatDamage: number;
  MultiplierDamage: number;
};

export type MultiHitStatSource = {
  FlatChance: number;
  MultiplierChance: number;

  FlatChainFactor: number;
  MultiplierChainFactor: number;

  FlatDamage: number;
  MultiplierDamage: number;
};

export type AccuracyStatSource = {
  Flat: number;
  Multiplier: number;
};

export type ArmorPenetrationStatSource = {
  Flat: number;
  Multiplier: number;
};

export type ResistancePenetrationStatSource = {
  Flat: number;
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
    Strength: { Flat: 0, Multiplier: 0 },
    Intelligence: { Flat: 0, Multiplier: 0 },
    Dexterity: { Flat: 0, Multiplier: 0 },
    Damage: { Flat: 0, Multiplier: 0 },
    AttackSpeed: { Flat: 0, Multiplier: 0 },
    Bleeding: {
      FlatChance: 0,
      MultiplierChance: 0,
      FlatDamage: 0,
      MultiplierDamage: 0
    },
    CriticalHit: {
      FlatChance: 0,
      MultiplierChance: 0,
      FlatDamage: 0,
      MultiplierDamage: 0
    },
    MultiHit: {
      FlatChance: 0,
      MultiplierChance: 0,
      FlatChainFactor: 0,
      MultiplierChainFactor: 0,
      FlatDamage: 0,
      MultiplierDamage: 0
    },
    Accuracy: { Flat: 0, Multiplier: 0 },
    ArmorPenetration: { Flat: 0, Multiplier: 0 },
    ResistancePenetration: { Flat: 0, Multiplier: 0 },
    ChargingStrike: { ChargeGain: 0, ChargeDamage: 0, ChargeDuration: 0 }
  };
}
