import { STATS_CONFIG } from '../../../constants';

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
  MultiHitDamage: number; // >= 1
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
    AttackSpeed: STATS_CONFIG.BASE.ATTACK_SPEED,
    Damage: STATS_CONFIG.BASE.DAMAGE,
    CriticalHitChance: STATS_CONFIG.BASE.CRIT_CHANCE,
    CriticalHitDamage: STATS_CONFIG.BASE.CRIT_DAMAGE,
    MultiHitChance: STATS_CONFIG.BASE.MULTI_HIT_CHANCE,
    MultiHitDamage: STATS_CONFIG.BASE.MULTI_HIT_DAMAGE,
    MultiHitChainFactor: STATS_CONFIG.BASE.MULTI_HIT_CHAIN_FACTOR,
    Accuracy: STATS_CONFIG.BASE.ACCURACY,
    Evasion: STATS_CONFIG.BASE.EVASION
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
