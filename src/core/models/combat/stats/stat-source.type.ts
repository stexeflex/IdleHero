/**
 * Stat Sources
 * ==============
 * Definiert die Quellen der verschiedenen Stats.
 * Jede Quelle kann flache Werte und Multiplikatoren bereitstellen,
 * die zur Berechnung der endgültigen Stats verwendet werden.
 *
 * Beispiel: Ein Item könnte +10 Stärke (flatStr) und +5% Stärke (multStr) bieten.
 */
export type StatSource = {
  Id: string;

  Strength: StrengthStatSource;
  Intelligence: IntelligenceStatSource;
  Dexterity: DexterityStatSource;

  Damage: DamageStatSource;
  AttackSpeed: AttackSpeedStatSource;
  CriticalHit: CriticalHitStatSource;
  MultiHit: MultiHitStatSource;

  Accuracy: AccuracyStatSource;
  Evasion: EvasionStatSource;
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

  // Unklar ob mehrere Angriffe oder nur ein Angriff mit Multiplier
  FlatDamage: number;
  MultiplierDamage: number;
};

export type AccuracyStatSource = {
  Flat: number;
  Multiplier: number;
};

export type EvasionStatSource = {
  Flat: number;
  Multiplier: number;
};
