/**
 * Combat Stats
 * ================
 * Definition der Combat-Stats, die für Berechnungen im Kampf verwendet werden.
 * Diese Stats enthalten Basiswerte und berechnete Gesamtwerte,
 * abgeleitet nach Attributen und weiteren Quellen.
 */
export interface ComputedStats extends BaseStats {}

export interface BaseStats extends CombatStats {
  CriticalHitChance: number; // 0..1
  CriticalHitDamage: number; // >= 1

  MultiHitChance: number; // 0..1
  MultiHitMultiplier: number; // >= 1
  MultiHitChainFactor: number; // 0..1
}

export interface CombatStats {
  AttackSpeed: number; // APS
  Damage: number; // Base Damage

  Accuracy: number; // 0..1
  Evasion: number; // 0..1
}

export function InitialBaseStats(): BaseStats {
  return {
    AttackSpeed: 1,
    Damage: 10,
    CriticalHitChance: 0.1,
    CriticalHitDamage: 1.5,
    MultiHitChance: 0.0,
    MultiHitMultiplier: 2.0,
    MultiHitChainFactor: 0.5,
    Accuracy: 0.9,
    Evasion: 0.05
  };
}

export function InitialCombatStats(
  attackSpeed: number,
  damage: number,
  accuracy: number,
  evasion: number
): CombatStats {
  return {
    AttackSpeed: attackSpeed,
    Damage: damage,
    Accuracy: accuracy,
    Evasion: evasion
  };
}
