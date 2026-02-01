import { STATS_CONFIG } from '../../../constants';

/**
 * Combat Stats
 * ================
 * Definition der Combat-Stats, die für Berechnungen im Kampf verwendet werden.
 * Diese Stats enthalten Basiswerte und berechnete Gesamtwerte,
 * abgeleitet nach Attributen und weiteren Quellen.
 */
export interface ComputedHeroStats extends HeroStats {}

export interface HeroStats extends CombatStats {
  BleedingChance: number; // 0..1
  BleedingDamage: number; // >= 0

  CriticalHitChance: number; // 0..1
  CriticalHitDamage: number; // >= 1

  MultiHitChance: number; // 0..1
  MultiHitDamage: number; // >= 1
  MultiHitChainFactor: number; // 0..1

  Accuracy: number; // 0..1
  ArmorPenetration: number; // 0..1
  ResistancePenetration: number; // 0..1
}

export interface BossStats extends CombatStats {
  Evasion: number; // 0..1
}

export interface CombatStats {
  AttackSpeed: number; // APS
  Damage: number; // Base Damage
}

export function InitialHeroStats(): HeroStats {
  return {
    AttackSpeed: STATS_CONFIG.BASE.ATTACK_SPEED,
    Damage: STATS_CONFIG.BASE.DAMAGE,
    BleedingChance: STATS_CONFIG.BASE.BLEEDING_CHANCE,
    BleedingDamage: STATS_CONFIG.BASE.BLEEDING_DAMAGE,
    CriticalHitChance: STATS_CONFIG.BASE.CRIT_CHANCE,
    CriticalHitDamage: STATS_CONFIG.BASE.CRIT_DAMAGE,
    MultiHitChance: STATS_CONFIG.BASE.MULTI_HIT_CHANCE,
    MultiHitDamage: STATS_CONFIG.BASE.MULTI_HIT_DAMAGE,
    MultiHitChainFactor: STATS_CONFIG.BASE.MULTI_HIT_CHAIN_FACTOR,
    Accuracy: STATS_CONFIG.BASE.ACCURACY,
    ArmorPenetration: STATS_CONFIG.BASE.ARMOR_PENETRATION,
    ResistancePenetration: STATS_CONFIG.BASE.RESISTANCE_PENETRATION
  };
}

export function InitialBossStats(attackSpeed: number, damage: number, evasion: number): BossStats {
  return {
    AttackSpeed: attackSpeed,
    Damage: damage,
    Evasion: evasion
  };
}
