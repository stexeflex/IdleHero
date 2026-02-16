import { ClampUtils } from '../../../shared/utils';
import { STATS_CONFIG } from '../../constants';

export function MapStrengthToBleedChance(str: number): number {
  const cap = STATS_CONFIG.LIMITS.STR_TO_BLEED_CHANCE;
  const K = STATS_CONFIG.MAPPINGS.STR_K;
  return ClampUtils.clamp01(cap * (1 - Math.exp(-str / K)));
}

export function MapStrengthToBleedDamage(str: number): number {
  const cap = STATS_CONFIG.LIMITS.STR_TO_BLEED_DAMAGE;
  const K = STATS_CONFIG.MAPPINGS.STR_K;
  return Math.max(0, cap * (1 - Math.exp(-str / K)));
}

export function MapIntelligenceToCritChance(int: number): number {
  const cap = STATS_CONFIG.LIMITS.INT_TO_CRIT_CHANCE;
  const K = STATS_CONFIG.MAPPINGS.INT_K;
  return ClampUtils.clamp01(cap * (1 - Math.exp(-int / K)));
}

export function MapIntelligenceToCritDamage(int: number): number {
  const cap = STATS_CONFIG.LIMITS.INT_TO_CRIT_DAMAGE;
  const K = STATS_CONFIG.MAPPINGS.INT_K;
  return Math.max(0, cap * (1 - Math.exp(-int / K)));
}

export function MapDexterityToMultiHitChance(dex: number): number {
  const cap = STATS_CONFIG.LIMITS.DEX_TO_MULTI_HIT_CHANCE;
  const K = STATS_CONFIG.MAPPINGS.DEX_MULTI_HIT_K;
  return ClampUtils.clamp01(cap * (1 - Math.exp(-dex / K)));
}

export function MapDexterityToChainFactor(dex: number): number {
  const cap = STATS_CONFIG.LIMITS.DEX_TO_CHAIN_FACTOR;
  const K = STATS_CONFIG.MAPPINGS.DEX_CHAIN_FACTOR_K;
  return ClampUtils.clamp01(cap * (1 - Math.exp(-dex / K)));
}

export function MapDexterityToMultiHitDamage(dex: number): number {
  const cap = STATS_CONFIG.LIMITS.DEX_TO_MULTI_HIT_DAMAGE;
  const K = STATS_CONFIG.MAPPINGS.DEX_MULTI_HIT_K;
  return Math.max(0, cap * (1 - Math.exp(-dex / K)));
}
