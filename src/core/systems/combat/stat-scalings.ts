import { ClampUtils } from '../../../shared/utils';
import { STATS_CONFIG } from '../../constants';

export function MapStrengthToBaseDamage(str: number, baseWeapon: number): number {
  // Linear mit leichter DR
  const a = STATS_CONFIG.MAPPINGS.STR_A;
  const b = STATS_CONFIG.MAPPINGS.STR_B;
  const scaled = (baseWeapon * (1 + a * str)) / (1 + b * str);
  return Math.max(1, Math.round(scaled));
}

export function MapIntelligenceToCritChance(int: number): number {
  const cap = STATS_CONFIG.LIMITS.INT_TO_CRIT_CHANCE;
  const K = STATS_CONFIG.MAPPINGS.INT_K;
  return ClampUtils.clamp01(cap * (1 - Math.exp(-int / K)));
}

export function MapDexterityToHaste(dex: number): number {
  const cap = STATS_CONFIG.LIMITS.DEX_TO_HASTE;
  const K = STATS_CONFIG.MAPPINGS.DEX_HASTE_K;
  return ClampUtils.clamp01(cap * (1 - Math.exp(-dex / K)));
}

export function MapDexterityToMultiHitChance(dex: number): number {
  const cap = STATS_CONFIG.LIMITS.DEX_TO_MULTI_HIT_CHANCE;
  const K = STATS_CONFIG.MAPPINGS.DEX_MULTI_HIT_K;
  return ClampUtils.clamp01(cap * (1 - Math.exp(-dex / K)));
}

export function MapDexterityToChainFactor(dex: number): number {
  // Wertebereich [0.X .. 0.X]
  const minF = STATS_CONFIG.BASE.MULTI_HIT_CHAIN_FACTOR;
  const maxF = STATS_CONFIG.LIMITS.DEX_TO_CHAIN_FACTOR;

  // Steuert, wie schnell die Kettenchance abfällt (höher => längere Ketten)
  const K = STATS_CONFIG.MAPPINGS.DEX_CHAIN_FACTOR_K;
  const t = 1 - Math.exp(-dex / K); // 0..1
  return ClampUtils.clamp(minF + (maxF - minF) * t, minF, maxF);
}

export function MapDexterityToMultiHitDamage(dex: number): number {
  // Linear skalierend von 1.X bis X.X
  const minDmg = STATS_CONFIG.BASE.MULTI_HIT_DAMAGE;
  const maxDmg = STATS_CONFIG.LIMITS.DEX_TO_MULTI_HIT_DAMAGE;
  const K = STATS_CONFIG.MAPPINGS.DEX_MULTI_HIT_K;

  const t = 1 - Math.exp(-dex / K); // 0..1
  return ClampUtils.clamp(minDmg + (maxDmg - minDmg) * t, minDmg, maxDmg);
}

export function MapDexterityToAccuracy(dex: number): number {
  const base = STATS_CONFIG.BASE.ACCURACY;
  const A = STATS_CONFIG.MAPPINGS.DEX_ACCURACY_A;
  return ClampUtils.clamp01(base + A * Math.log(1 + dex));
}

export function MapStrengthToArmorPenetration(str: number): number {
  const base = STATS_CONFIG.BASE.ARMOR_PENETRATION;
  const K = STATS_CONFIG.MAPPINGS.STR_ARMOR_PENETRATION_K;
  return ClampUtils.clamp01(base + (1 - Math.exp(-str / K)));
}

export function MapIntelligenceToResistancePenetration(int: number): number {
  const base = STATS_CONFIG.BASE.RESISTANCE_PENETRATION;
  const K = STATS_CONFIG.MAPPINGS.INT_RESISTANCE_PENETRATION_K;
  return ClampUtils.clamp01(base + (1 - Math.exp(-int / K)));
}
