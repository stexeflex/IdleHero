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
    attributes.Strength
  );

  // Crit Chance & Damage
  const { CriticalHitChance: critChance, CriticalHitDamage: critMultiplier } = ComputeCriticalHit(
    sources,
    attributes.Intelligence
  );

  // Multi-Hit Chance
  const {
    MultiHitChance: multiHitChance,
    MultiHitDamage: multiHitDamage,
    MultiHitChainFactor: multiHitChainFactor
  } = ComputeMultiHit(sources, attributes.Dexterity);

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
  strength: number
): { BleedingChance: number; BleedingDamage: number } {
  // Bleeding Chance
  const baseBleedChance = STATS_CONFIG.BASE.BLEEDING_CHANCE;
  const maxBleedChance = STATS_CONFIG.CAPS.MAX_BLEEDING_CHANCE;
  const strBleedChance = MapStrengthToBleedChance(strength);
  const addBleedChance = sources.reduce((sum, s) => Flat(sum, s.Bleeding.Chance), 0);
  const bleedChance = ClampUtils.clamp(
    baseBleedChance + strBleedChance + addBleedChance,
    baseBleedChance,
    maxBleedChance
  );

  // Bleeding Damage
  const baseBleedDamage = STATS_CONFIG.BASE.BLEEDING_DAMAGE;
  const strengthBleedDamage = MapStrengthToBleedDamage(strength);
  const increasedBleedDamage = sources.reduce((sum, s) => Sum(sum, s.Bleeding.MultiplierDamage), 0);
  const bleedMultiplier = Math.max(
    baseBleedDamage,
    baseBleedDamage + strengthBleedDamage + increasedBleedDamage
  );

  return {
    BleedingChance: bleedChance,
    BleedingDamage: bleedMultiplier
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
  const addCritChance = sources.reduce((sum, s) => Flat(sum, s.CriticalHit.Chance), 0);
  const critChance = ClampUtils.clamp(
    baseCritChance + intelligenceCritChance + addCritChance,
    baseCritChance,
    maxCritChance
  );

  // Crit Damage
  const baseCritDamage = STATS_CONFIG.BASE.CRIT_DAMAGE;
  const intelligenceCritDamage = MapIntelligenceToCritDamage(intelligence);
  const increasedCritDamage = sources.reduce(
    (sum, s) => Sum(sum, s.CriticalHit.MultiplierDamage),
    0
  );
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
): { MultiHitChance: number; MultiHitChainFactor: number; MultiHitDamage: number } {
  // Multi-Hit Chance
  const baseMultiHitChance = STATS_CONFIG.BASE.MULTI_HIT_CHANCE;
  const maxMultiHitChance = STATS_CONFIG.CAPS.MAX_MULTI_HIT_CHANCE;
  const dexMultiHitChance = MapDexterityToMultiHitChance(dexterity);
  const addMulti = sources.reduce((sum, s) => Flat(sum, s.MultiHit.Chance), 0);
  const multiHitChance = ClampUtils.clamp(
    baseMultiHitChance + dexMultiHitChance + addMulti,
    baseMultiHitChance,
    maxMultiHitChance
  );

  // Multi-Hit Damage
  const baseMultiHitDamage = STATS_CONFIG.BASE.MULTI_HIT_DAMAGE;
  const dexterityMultiHitDamage = MapDexterityToMultiHitDamage(dexterity);
  const increaseMultiHitDamage = sources.reduce(
    (sum, s) => Sum(sum, s.MultiHit.MultiplierDamage),
    0
  );
  const multiHitDamage = Math.max(
    baseMultiHitDamage,
    baseMultiHitDamage + dexterityMultiHitDamage + increaseMultiHitDamage
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

//#region Helpers
function Flat(currentFlat: number, additionalFlat: number): number {
  return currentFlat + (additionalFlat ?? 0);
}

function Sum(currentSum: number, additionalValue: number): number {
  return currentSum + (additionalValue ?? 0);
}

function Multiplier(currentMultiplier: number, additionalMultiplier: number): number {
  return currentMultiplier * (1 + (additionalMultiplier ?? 0));
}

function Effective(base: number, flat: number, multiplier: number, max: number = 0): number {
  return Math.max(max, (base + flat) * multiplier);
}
//#endregion
