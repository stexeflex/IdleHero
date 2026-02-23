import { ATTRIBUTES_CONFIG, STATS_CONFIG } from '../../constants';
import { Attributes, ComputedHeroStats, HeroStats, StatSource } from '../../models';
import {
  MapDexterityToChainFactor,
  MapDexterityToMultiHitChance,
  MapDexterityToMultiHitDamage,
  MapIntelligenceToCritChance,
  MapIntelligenceToCritDamage,
  MapStrengthToBleedChance,
  MapStrengthToBleedDamage
} from './stat-scalings';

import { ClampUtils } from '../../../shared/utils';

export function ComputeAttributes(attributes: Attributes, statSources: StatSource[]): Attributes {
  const sources: StatSource[] = statSources ?? [];

  // Basis-Attribute ohne Baseline
  const baseStrength = attributes.Strength - ATTRIBUTES_CONFIG.BASE.STRENGTH;
  const baseIntelligence = attributes.Intelligence - ATTRIBUTES_CONFIG.BASE.INTELLIGENCE;
  const baseDexterity = attributes.Dexterity - ATTRIBUTES_CONFIG.BASE.DEXTERITY;

  // Effektive Attribute
  const addStr = sources.reduce((sum, s) => Sum(sum, s.Strength.Value), 0);
  const effectiveStr = Math.max(0, baseStrength + addStr);

  const addInt = sources.reduce((sum, s) => Sum(sum, s.Intelligence.Value), 0);
  const effectiveInt = Math.max(0, baseIntelligence + addInt);

  const addDex = sources.reduce((sum, s) => Sum(sum, s.Dexterity.Value), 0);
  const effectiveDex = Math.max(0, baseDexterity + addDex);

  return { Strength: effectiveStr, Intelligence: effectiveInt, Dexterity: effectiveDex };
}

export function ComputeStats(
  attributes: Attributes,
  baseStats: HeroStats,
  statSources: StatSource[]
): ComputedHeroStats {
  const sources: StatSource[] = statSources ?? [];

  // Damage & Attack Speed
  const damage = ComputeDamage(sources);
  const attackSpeed = ComputeAttackSpeed(sources);

  // Bleeding Chance & Damage
  const {
    BleedingChance: bleedingChance,
    BleedingDamage: bleedingDamage,
    BleedingTicks: bleedingTicks
  } = ComputeBleeding(sources, attributes.Strength);

  // Crit Chance & Damage
  const { CriticalHitChance: critChance, CriticalHitDamage: critMultiplier } = ComputeCriticalHit(
    sources,
    attributes.Intelligence
  );

  // Multi-Hit Chance
  const {
    MultiHitChance: multiHitChance,
    MultiHitChain: multiHitChain,
    MultiHitChainFactor: multiHitChainFactor,
    MultiHitDamage: multiHitDamage
  } = ComputeMultiHit(sources, attributes.Dexterity);

  // Accuracy
  const accuracy = ComputeAccuracy(sources);

  // Charging Strike
  const {
    ChargeGain: chargeGain,
    ChargeLoss: chargeLoss,
    ChargeDamage: chargeDamage,
    ChargeDuration: chargeDuration
  } = ComputeChargingStrike(sources, baseStats);

  const stats: ComputedHeroStats = {
    AttackSpeed: attackSpeed,
    Damage: damage,
    BleedingChance: bleedingChance,
    BleedingDamage: bleedingDamage,
    BleedingTicks: bleedingTicks,
    CriticalHitChance: critChance,
    CriticalHitDamage: critMultiplier,
    MultiHitChance: multiHitChance,
    MultiHitDamage: multiHitDamage,
    MultiHitChain: multiHitChain,
    MultiHitChainFactor: multiHitChainFactor,
    Accuracy: accuracy,
    ChargeGain: chargeGain,
    ChargeLoss: chargeLoss,
    ChargeDamage: chargeDamage,
    ChargeDuration: chargeDuration
  };

  console.log('Computed Stats:', stats);
  return stats;
}

//#region Computing Functions
function ComputeDamage(sources: StatSource[]): number {
  const addDmg = sources.reduce((sum, s) => Sum(sum, s.Damage.Value), 0);
  const effectiveDamage = ClampUtils.clamp(
    addDmg,
    STATS_CONFIG.BASE.DAMAGE,
    Number.POSITIVE_INFINITY
  );

  return effectiveDamage;
}

function ComputeAttackSpeed(sources: StatSource[]): number {
  const addIAS = sources.reduce((prod, s) => Sum(prod, s.AttackSpeed.Value), 1);
  const effectiveAttackSpeed = ClampUtils.clamp(addIAS, 0, STATS_CONFIG.CAPS.MAX_ATTACK_SPEED);
  return effectiveAttackSpeed;
}

function ComputeBleeding(
  sources: StatSource[],
  strength: number
): { BleedingChance: number; BleedingDamage: number; BleedingTicks: number } {
  // Bleeding Chance
  const baseBleedChance = STATS_CONFIG.BASE.BLEEDING_CHANCE;
  const maxBleedChance = STATS_CONFIG.CAPS.MAX_BLEEDING_CHANCE;
  const strBleedChance = MapStrengthToBleedChance(strength);
  const addBleedChance = sources.reduce((sum, s) => Sum(sum, s.Bleeding.Chance), 0);
  const bleedChance = ClampUtils.clamp(
    baseBleedChance + strBleedChance + addBleedChance,
    baseBleedChance,
    maxBleedChance
  );

  // Bleeding Damage
  const baseBleedDamage = STATS_CONFIG.BASE.BLEEDING_DAMAGE;
  const strengthBleedDamage = MapStrengthToBleedDamage(strength);
  const increasedBleedDamage = sources.reduce((sum, s) => Sum(sum, s.Bleeding.Damage), 0);
  const bleedMultiplier = Math.max(
    baseBleedDamage,
    baseBleedDamage + strengthBleedDamage + increasedBleedDamage
  );

  // Bleeding Ticks
  const baseBleedTicks = STATS_CONFIG.BASE.BLEEDING_TICKS;
  const maxBleedTicks = STATS_CONFIG.CAPS.MAX_BLEEDING_TICKS;
  const addBleedTicks = sources.reduce((sum, s) => Sum(sum, s.Bleeding.Ticks), 0);
  const bleedTicks = ClampUtils.clamp(
    baseBleedTicks + addBleedTicks,
    baseBleedTicks,
    maxBleedTicks
  );

  return {
    BleedingChance: bleedChance,
    BleedingDamage: bleedMultiplier,
    BleedingTicks: bleedTicks
  };
}

function ComputeCriticalHit(
  sources: StatSource[],
  intelligence: number
): { CriticalHitChance: number; CriticalHitDamage: number } {
  // Crit Chance
  const baseCritChance = STATS_CONFIG.BASE.CRIT_CHANCE;
  const maxCritChance = STATS_CONFIG.CAPS.MAX_CRIT_CHANCE;
  const intelligenceCritChance = MapIntelligenceToCritChance(intelligence);
  const addCritChance = sources.reduce((sum, s) => Sum(sum, s.CriticalHit.Chance), 0);
  const critChance = ClampUtils.clamp(
    baseCritChance + intelligenceCritChance + addCritChance,
    baseCritChance,
    maxCritChance
  );

  // Crit Damage
  const baseCritDamage = STATS_CONFIG.BASE.CRIT_DAMAGE;
  const intelligenceCritDamage = MapIntelligenceToCritDamage(intelligence);
  const increasedCritDamage = sources.reduce((sum, s) => Sum(sum, s.CriticalHit.Damage), 0);
  const critDamage = Math.max(
    baseCritDamage,
    baseCritDamage + intelligenceCritDamage + increasedCritDamage
  );

  return {
    CriticalHitChance: critChance,
    CriticalHitDamage: critDamage
  };
}

function ComputeMultiHit(
  sources: StatSource[],
  dexterity: number
): {
  MultiHitChance: number;
  MultiHitChain: number;
  MultiHitChainFactor: number;
  MultiHitDamage: number;
} {
  // Multi-Hit Chance
  const baseMultiHitChance = STATS_CONFIG.BASE.MULTI_HIT_CHANCE;
  const maxMultiHitChance = STATS_CONFIG.CAPS.MAX_MULTI_HIT_CHANCE;
  const dexMultiHitChance = MapDexterityToMultiHitChance(dexterity);
  const addMulti = sources.reduce((sum, s) => Sum(sum, s.MultiHit.Chance), 0);
  const multiHitChance = ClampUtils.clamp(
    baseMultiHitChance + dexMultiHitChance + addMulti,
    baseMultiHitChance,
    maxMultiHitChance
  );

  // Multi-Hit Damage
  const baseMultiHitDamage = STATS_CONFIG.BASE.MULTI_HIT_DAMAGE;
  const dexterityMultiHitDamage = MapDexterityToMultiHitDamage(dexterity);
  const increaseMultiHitDamage = sources.reduce((sum, s) => Sum(sum, s.MultiHit.Damage), 0);
  const multiHitDamage = Math.max(
    baseMultiHitDamage,
    baseMultiHitDamage + dexterityMultiHitDamage + increaseMultiHitDamage
  );

  // Multi-Hit Chain
  const baseMultiHitChain = STATS_CONFIG.BASE.MULTI_HIT_CHAIN;
  const maxMultiHitChain = STATS_CONFIG.CAPS.MAX_CHAIN_HITS;
  const addMultiHitChain = sources.reduce((sum, s) => Sum(sum, s.MultiHit.Chain), 0);
  const multiHitChain = ClampUtils.clamp(
    baseMultiHitChain + addMultiHitChain,
    baseMultiHitChain,
    maxMultiHitChain
  );

  // Multi-Hit Chain Factor
  const baseMultiHitChainFactor = STATS_CONFIG.BASE.MULTI_HIT_CHAIN_FACTOR;
  const maxMultiHitChainFactor = STATS_CONFIG.CAPS.MAX_MULTI_HIT_CHAIN_FACTOR;
  const dexterityChainFactor = MapDexterityToChainFactor(dexterity);
  const increaseMultiHitChainFactor = sources.reduce(
    (sum, s) => Sum(sum, s.MultiHit.ChainFactor),
    0
  );
  const multiHitChainFactor = ClampUtils.clamp(
    baseMultiHitChainFactor + dexterityChainFactor + increaseMultiHitChainFactor,
    baseMultiHitChainFactor,
    maxMultiHitChainFactor
  );

  return {
    MultiHitChance: multiHitChance,
    MultiHitChain: multiHitChain,
    MultiHitChainFactor: multiHitChainFactor,
    MultiHitDamage: multiHitDamage
  };
}

function ComputeAccuracy(sources: StatSource[]): number {
  const minAcc = STATS_CONFIG.BASE.ACCURACY;
  const maxAcc = STATS_CONFIG.CAPS.MAX_ACCURACY;
  const addedAcc = sources.reduce((prod, s) => Sum(prod, s.Accuracy.Value), 0);
  const accuracy = ClampUtils.clamp(minAcc + addedAcc, minAcc, maxAcc);
  return accuracy;
}

function ComputeChargingStrike(
  sources: StatSource[],
  baseStats: HeroStats
): { ChargeGain: number; ChargeLoss: number; ChargeDamage: number; ChargeDuration: number } {
  const chargeGain =
    baseStats.ChargeGain + sources.reduce((sum, s) => Sum(sum, s.ChargingStrike.ChargeGain), 0);

  const chargeLoss =
    baseStats.ChargeLoss +
    sources.reduce((sum, s) => Sum(sum, s.ChargingStrike.ChargeLossPercentage), 0);
  const decreasedChargeLoss = ClampUtils.clamp(chargeLoss, 0, 1);

  const chargeDamage =
    baseStats.ChargeDamage + sources.reduce((sum, s) => Sum(sum, s.ChargingStrike.ChargeDamage), 0);

  const chargeDuration =
    baseStats.ChargeDuration +
    sources.reduce((sum, s) => Sum(sum, s.ChargingStrike.ChargeDuration), 0);

  return {
    ChargeGain: chargeGain,
    ChargeLoss: decreasedChargeLoss,
    ChargeDamage: chargeDamage,
    ChargeDuration: chargeDuration
  };
}
//#endregion

//#region Helpers
function Sum(currentSum: number, additionalValue: number): number {
  return currentSum + (additionalValue ?? 0);
}
//#endregion
