import { ATTRIBUTES_CONFIG, STATS_CONFIG } from '../../constants';
import { Attributes, ComputedHeroStats, HeroStats, StatSource } from '../../models';
import {
  MapDexterityToChainFactor,
  MapDexterityToMultiHitDamage,
  MapDexterityToMultiHitChance,
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

  // Effektive Attribute: (base + sum(flat)) * product(1 + multiplier)
  const addStr = sources.reduce((sum, s) => Flat(sum, s.Strength.Flat), 0);
  const multiplyStr = sources.reduce((prod, s) => Multiplier(prod, s.Strength.Multiplier), 1);
  const effectiveStr = Effective(baseStrength, addStr, multiplyStr);

  const addInt = sources.reduce((sum, s) => Flat(sum, s.Intelligence.Flat), 0);
  const multiplyInt = sources.reduce((prod, s) => Multiplier(prod, s.Intelligence.Multiplier), 1);
  const effectiveInt = Effective(baseIntelligence, addInt, multiplyInt);

  const addDex = sources.reduce((sum, s) => Flat(sum, s.Dexterity.Flat), 0);
  const multiplyDex = sources.reduce((prod, s) => Multiplier(prod, s.Dexterity.Multiplier), 1);
  const effectiveDex = Effective(baseDexterity, addDex, multiplyDex);

  return { Strength: effectiveStr, Intelligence: effectiveInt, Dexterity: effectiveDex };
}

export function ComputeStats(
  attributes: Attributes,
  baseStats: HeroStats,
  statSources: StatSource[]
): ComputedHeroStats {
  const sources: StatSource[] = statSources ?? [];

  // Damage & Attack Speed
  const damage = ComputeDamage(sources, baseStats.Damage);
  const attackSpeed = ComputeAttackSpeed(sources, baseStats.AttackSpeed);

  // Bleeding Chance & Damage
  const { BleedingChance: bleedingChance, BleedingDamage: bleedingDamage } = ComputeBleeding(
    sources,
    baseStats.BleedingChance,
    baseStats.BleedingDamage,
    attributes.Strength
  );

  // Crit Chance & Damage
  const { CriticalHitChance: critChance, CriticalHitDamage: critMultiplier } = ComputeCriticalHit(
    sources,
    baseStats.CriticalHitChance,
    baseStats.CriticalHitDamage,
    attributes.Intelligence
  );

  // Multi-Hit Chance
  const {
    MultiHitChance: multiHitChance,
    MultiHitDamage: multiHitDamage,
    MultiHitChainFactor: multiHitChainFactor
  } = ComputeMultiHit(
    sources,
    baseStats.MultiHitChance,
    baseStats.MultiHitDamage,
    attributes.Dexterity
  );

  // Accuracy
  const accuracy = ComputeAccuracy(sources, baseStats.Accuracy);

  // Penetrations
  const armorPenetration = ComputeArmorPenetration(sources, baseStats.ArmorPenetration);
  const resistancePenetration = ComputeResistancePenetration(
    sources,
    baseStats.ResistancePenetration
  );

  // Charging Strike
  const chargeGain =
    baseStats.ChargeGain + sources.reduce((sum, s) => Flat(sum, s.ChargingStrike.ChargeGain), 0);
  const chargeDamage =
    baseStats.ChargeDamage +
    sources.reduce((sum, s) => Flat(sum, s.ChargingStrike.ChargeDamage), 0);
  const chargeDuration =
    baseStats.ChargeDuration +
    sources.reduce((sum, s) => Flat(sum, s.ChargingStrike.ChargeDuration), 0);

  const stats: ComputedHeroStats = {
    AttackSpeed: attackSpeed,
    Damage: damage,
    BleedingChance: bleedingChance,
    BleedingDamage: bleedingDamage,
    CriticalHitChance: critChance,
    CriticalHitDamage: critMultiplier,
    MultiHitChance: multiHitChance,
    MultiHitDamage: multiHitDamage,
    MultiHitChainFactor: multiHitChainFactor,
    Accuracy: accuracy,
    ArmorPenetration: armorPenetration,
    ResistancePenetration: resistancePenetration,
    ChargeGain: chargeGain,
    ChargeDamage: chargeDamage,
    ChargeDuration: chargeDuration
  };

  console.log('Computed Stats:', stats);
  return stats;
}

//#region Computing Functions
function ComputeDamage(sources: StatSource[], baseDamage: number): number {
  const addDmg = sources.reduce((sum, s) => Flat(sum, s.Damage.Flat), 0);
  const multiplyDmg = sources.reduce((prod, s) => Multiplier(prod, s.Damage.Multiplier), 1);
  const effectiveDamage = Math.round(Effective(baseDamage ?? 0, addDmg, multiplyDmg, 1));

  return effectiveDamage;
}

function ComputeAttackSpeed(sources: StatSource[], baseSpeed: number): number {
  const baseAPS = baseSpeed ?? STATS_CONFIG.BASE.ATTACK_SPEED;
  const addAPS = sources.reduce((sum, s) => Flat(sum, s.AttackSpeed.Flat), 0);
  const multiplyAPS = sources.reduce((prod, s) => Multiplier(prod, s.AttackSpeed.Multiplier), 1);

  const effectiveAttackSpeed = Effective(baseAPS, addAPS, multiplyAPS, 0.1);
  return effectiveAttackSpeed;
}

function ComputeBleeding(
  sources: StatSource[],
  baseChance: number,
  baseMultiplier: number,
  strength: number
): { BleedingChance: number; BleedingDamage: number } {
  // Bleeding Chance
  const baseBleedChance = Flat(baseChance ?? 0, MapStrengthToBleedChance(strength));
  const addBleedChance = sources.reduce((sum, s) => Flat(sum, s.Bleeding.FlatChance), 0);
  const multiplyBleedChance = sources.reduce(
    (prod, s) => Multiplier(prod, s.Bleeding.MultiplierChance),
    1
  );
  const bleedChanceBase = ClampUtils.clamp(
    baseBleedChance + addBleedChance,
    0,
    STATS_CONFIG.CAPS.MAX_BLEEDING_CHANCE
  );
  const bleedChance = ApplyIncreasedChanceSoftCap(
    bleedChanceBase,
    multiplyBleedChance,
    STATS_CONFIG.CAPS.MAX_BLEEDING_CHANCE
  );

  // Bleeding Damage
  const baseBleedDamage = Flat(baseMultiplier ?? STATS_CONFIG.BASE.BLEEDING_DAMAGE, MapStrengthToBleedDamage(strength));
  const addBleedDamage = sources.reduce((sum, s) => Flat(sum, s.Bleeding.FlatDamage), 0);
  const multiplyBleedDamage = sources.reduce(
    (prod, s) => Multiplier(prod, s.Bleeding.MultiplierDamage),
    1
  );
  const bleedMultiplier = Effective(baseBleedDamage, addBleedDamage, multiplyBleedDamage, 0);

  return {
    BleedingChance: bleedChance,
    BleedingDamage: bleedMultiplier
  };
}

function ComputeCriticalHit(
  sources: StatSource[],
  baseChance: number,
  baseMultiplier: number,
  intelligence: number
): { CriticalHitChance: number; CriticalHitDamage: number } {
  // Crit Chance
  const baseCritChance = Flat(baseChance ?? 0, MapIntelligenceToCritChance(intelligence));
  const addCritChance = sources.reduce((sum, s) => Flat(sum, s.CriticalHit.FlatChance), 0);
  const multiplyCritChance = sources.reduce(
    (prod, s) => Multiplier(prod, s.CriticalHit.MultiplierChance),
    1
  );
  const critChanceBase = ClampUtils.clamp(
    baseCritChance + addCritChance,
    0,
    STATS_CONFIG.CAPS.MAX_CRIT_CHANCE
  );
  const critChance = ApplyIncreasedChanceSoftCap(
    critChanceBase,
    multiplyCritChance,
    STATS_CONFIG.CAPS.MAX_CRIT_CHANCE
  );

  // Crit Damage
  const baseCritDamage = Flat(baseMultiplier ?? STATS_CONFIG.BASE.CRIT_DAMAGE, MapIntelligenceToCritDamage(intelligence));
  const addCritDamage = sources.reduce((sum, s) => Flat(sum, s.CriticalHit.FlatDamage), 0);
  const multiplyCritDamage = sources.reduce(
    (prod, s) => Multiplier(prod, s.CriticalHit.MultiplierDamage),
    1
  );
  const critMultiplier = Effective(baseCritDamage, addCritDamage, multiplyCritDamage, 1);

  return {
    CriticalHitChance: critChance,
    CriticalHitDamage: critMultiplier
  };
}

function ComputeMultiHit(
  sources: StatSource[],
  baseChance: number,
  baseMultiplier: number,
  dexterity: number
): { MultiHitChance: number; MultiHitChainFactor: number; MultiHitDamage: number } {
  // Multi-Hit Chance
  const baseMulti = Flat(baseChance ?? 0, MapDexterityToMultiHitChance(dexterity));
  const addMulti = sources.reduce((sum, s) => Flat(sum, s.MultiHit.FlatChance), 0);
  const mulMulti = sources.reduce((prod, s) => Multiplier(prod, s.MultiHit.MultiplierChance), 1);
  const multiHitChanceBase = ClampUtils.clamp(
    baseMulti + addMulti,
    0,
    STATS_CONFIG.CAPS.MAX_MULTI_HIT_CHANCE
  );
  const multiHitChance = ApplyIncreasedChanceSoftCap(
    multiHitChanceBase,
    mulMulti,
    STATS_CONFIG.CAPS.MAX_MULTI_HIT_CHANCE
  );

  // Multi-Hit Damage
  const baseMultiHitDamage = MapDexterityToMultiHitDamage(
    dexterity,
    baseMultiplier ?? STATS_CONFIG.BASE.MULTI_HIT_DAMAGE
  );
  const addMultiHitDamage = sources.reduce((sum, s) => Flat(sum, s.MultiHit.FlatDamage), 0);
  const mulMultiHitDamage = sources.reduce(
    (prod, s) => Multiplier(prod, s.MultiHit.MultiplierDamage),
    1
  );
  const multiHitDamage = Effective(baseMultiHitDamage, addMultiHitDamage, mulMultiHitDamage, 0);

  // Multi-Hit Chain Factor
  const baseChainFactor = MapDexterityToChainFactor(dexterity);
  const addChainFactor = sources.reduce((sum, s) => Flat(sum, s.MultiHit.FlatChainFactor), 0);
  const mulChainFactor = sources.reduce(
    (prod, s) => Multiplier(prod, s.MultiHit.MultiplierChainFactor),
    1
  );
  const multiHitChainFactor = ClampUtils.clamp(
    (baseChainFactor + addChainFactor) * mulChainFactor,
    STATS_CONFIG.BASE.MULTI_HIT_CHAIN_FACTOR,
    STATS_CONFIG.CAPS.MAX_MULTI_HIT_CHAIN_FACTOR
  );

  return {
    MultiHitChance: multiHitChance,
    MultiHitChainFactor: multiHitChainFactor,
    MultiHitDamage: multiHitDamage
  };
}

function ComputeAccuracy(sources: StatSource[], baseAccuracy: number): number {
  const baseAcc = baseAccuracy ?? STATS_CONFIG.BASE.ACCURACY;
  const addAcc = sources.reduce((sum, s) => Flat(sum, s.Accuracy.Flat), 0);
  const mulAcc = sources.reduce((prod, s) => Multiplier(prod, s.Accuracy.Multiplier), 1);
  const accuracy = ClampUtils.clamp01((baseAcc + addAcc) * mulAcc);

  return accuracy;
}

function ComputeArmorPenetration(sources: StatSource[], baseArmorPenetration: number): number {
  const baseAcc = baseArmorPenetration ?? STATS_CONFIG.BASE.ARMOR_PENETRATION;
  const addAcc = sources.reduce((sum, s) => Flat(sum, s.ArmorPenetration.Flat), 0);
  const mulAcc = sources.reduce((prod, s) => Multiplier(prod, s.ArmorPenetration.Multiplier), 1);
  const armorPenetration = ClampUtils.clamp01((baseAcc + addAcc) * mulAcc);

  return armorPenetration;
}

function ComputeResistancePenetration(
  sources: StatSource[],
  baseResistancePenetration: number
): number {
  const baseAcc = baseResistancePenetration ?? STATS_CONFIG.BASE.RESISTANCE_PENETRATION;
  const addAcc = sources.reduce((sum, s) => Flat(sum, s.ResistancePenetration.Flat), 0);
  const mulAcc = sources.reduce(
    (prod, s) => Multiplier(prod, s.ResistancePenetration.Multiplier),
    1
  );
  const resistancePenetration = ClampUtils.clamp01((baseAcc + addAcc) * mulAcc);

  return resistancePenetration;
}
//#endregion

//#region Chance Helpers
function ApplyIncreasedChanceSoftCap(
  baseChance: number,
  increasedChanceMultiplier: number,
  cap: number
): number {
  const clampedBase = ClampUtils.clamp(baseChance ?? 0, 0, cap);
  const increased = Math.max(0, (increasedChanceMultiplier ?? 1) - 1);

  if (increased <= 0) {
    return clampedBase;
  }

  const K = STATS_CONFIG.MAPPINGS.CHANCE_INCREASE_K;
  const effect = 1 - Math.exp(-increased / K); // 0..1
  return ClampUtils.clamp(clampedBase + (cap - clampedBase) * effect, 0, cap);
}
//#endregion

//#region Helpers
function Flat(currentFlat: number, additionalFlat: number): number {
  return currentFlat + (additionalFlat ?? 0);
}

function Multiplier(currentMultiplier: number, additionalMultiplier: number): number {
  return currentMultiplier * (1 + (additionalMultiplier ?? 0));
}

function Effective(base: number, flat: number, multiplier: number, max: number = 0): number {
  return Math.max(max, (base + flat) * multiplier);
}
//#endregion
