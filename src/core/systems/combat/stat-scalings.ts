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
  const cap = STATS_CONFIG.LIMITS.DEX_TO_MULTI_HIT;
  const K = STATS_CONFIG.MAPPINGS.DEX_MULTI_HIT_K;
  return ClampUtils.clamp01(cap * (1 - Math.exp(-dex / K)));
}

export function MapDexterityToAccuracy(dex: number): number {
  const base = STATS_CONFIG.MAPPINGS.DEX_BASE_ACCURACY;
  const A = STATS_CONFIG.MAPPINGS.DEX_ACCURACY_A;
  return ClampUtils.clamp01(base + A * Math.log(1 + dex));
}

export function MapDexterityToEvasion(dex: number): number {
  const base = STATS_CONFIG.MAPPINGS.DEX_BASE_EVASION;
  const A = STATS_CONFIG.MAPPINGS.DEX_EVASION_A;
  return ClampUtils.clamp01(base + A * Math.log(1 + dex));
}

export function MapDexterityToChainFactor(dex: number): number {
  // Wertebereich [0.5 .. 0.8]
  const minF = STATS_CONFIG.MAPPINGS.DEX_CHAIN_FACTOR_MIN;
  const maxF = STATS_CONFIG.MAPPINGS.DEX_CHAIN_FACTOR_MAX;

  // Steuert, wie schnell die Kettenchance abfällt (höher => längere Ketten)
  const K = STATS_CONFIG.MAPPINGS.DEX_CHAIN_FACTOR_K;
  const t = 1 - Math.exp(-dex / K); // 0..1
  return Math.max(minF, Math.min(maxF, minF + (maxF - minF) * t));
}
