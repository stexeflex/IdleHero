import { ATTRIBUTES_CONFIG, STATS_CONFIG } from '../../constants';
import { Attributes, ComputedHeroStats, HeroStats, StatSource } from '../../models';
import {
  MapDexterityToAccuracy,
  MapDexterityToChainFactor,
  MapDexterityToHaste,
  MapDexterityToMultiHitChance,
  MapIntelligenceToCritChance,
  MapIntelligenceToResistancePenetration,
  MapStrengthToArmorPenetration,
  MapStrengthToBleedChance
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
  const damage = ComputeDamage(sources, baseStats.Damage, attributes.Strength);
  const attackSpeed = ComputeAttackSpeed(sources, baseStats.AttackSpeed, attributes.Dexterity);

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
  const accuracy = ComputeAccuracy(sources, attributes.Dexterity);

  // Penetrations
  const armorPenetration = ComputeArmorPenetration(sources, attributes.Strength);
  const resistancePenetration = ComputeResistancePenetration(sources, attributes.Intelligence);

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
function ComputeDamage(sources: StatSource[], baseDamage: number, strength: number): number {
  // const baseDamageFromStr = MapStrengthToBaseDamage(strength, baseDamage);

  const addDmg = sources.reduce((sum, s) => Flat(sum, s.Damage.Flat), 0);
  const multiplyDmg = sources.reduce((prod, s) => Multiplier(prod, s.Damage.Multiplier), 1);
  const effectiveDamage = Math.round(Effective(0, addDmg, multiplyDmg, 1));

  return effectiveDamage;
}

function ComputeAttackSpeed(sources: StatSource[], baseSpeed: number, dexterity: number): number {
  const baseAPS = baseSpeed * (1 + MapDexterityToHaste(dexterity));
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
  const bleedChance = ClampUtils.clamp01((baseBleedChance + addBleedChance) * multiplyBleedChance);

  // Bleeding Damage
  const baseBleedDamage = baseMultiplier ?? STATS_CONFIG.BASE.BLEEDING_DAMAGE;
  const addBleedDamage = sources.reduce((sum, s) => Flat(sum, s.Bleeding.FlatDamage), 0);
  const multiplyBleedDamage = sources.reduce(
    (prod, s) => Multiplier(prod, s.Bleeding.MultiplierDamage),
    1
  );
  const bleedMultiplier = Effective(baseBleedDamage, addBleedDamage, multiplyBleedDamage, 0);

  return {
    BleedingChance: Math.min(bleedChance, STATS_CONFIG.CAPS.MAX_BLEEDING_CHANCE),
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
  const critChance = ClampUtils.clamp01((baseCritChance + addCritChance) * multiplyCritChance);

  // Crit Damage
  const baseCritDamage = baseMultiplier ?? STATS_CONFIG.BASE.CRIT_DAMAGE;
  const addCritDamage = sources.reduce((sum, s) => Flat(sum, s.CriticalHit.FlatDamage), 0);
  const multiplyCritDamage = sources.reduce(
    (prod, s) => Multiplier(prod, s.CriticalHit.MultiplierDamage),
    1
  );
  const critMultiplier = Effective(baseCritDamage, addCritDamage, multiplyCritDamage, 1);

  return {
    CriticalHitChance: Math.min(critChance, STATS_CONFIG.CAPS.MAX_CRIT_CHANCE),
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
  const multiHitChance = ClampUtils.clamp01((baseMulti + addMulti) * mulMulti);

  // Multi-Hit Damage
  const baseMultiHitDamage = baseMultiplier ?? STATS_CONFIG.BASE.MULTI_HIT_DAMAGE;
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
    MultiHitChance: Math.min(multiHitChance, STATS_CONFIG.CAPS.MAX_MULTI_HIT_CHANCE),
    MultiHitChainFactor: multiHitChainFactor,
    MultiHitDamage: multiHitDamage
  };
}

function ComputeAccuracy(sources: StatSource[], dexterity: number): number {
  const baseAcc = MapDexterityToAccuracy(dexterity);
  const addAcc = sources.reduce((sum, s) => Flat(sum, s.Accuracy.Flat), 0);
  const mulAcc = sources.reduce((prod, s) => Multiplier(prod, s.Accuracy.Multiplier), 1);
  const accuracy = ClampUtils.clamp01((baseAcc + addAcc) * mulAcc);

  return accuracy;
}

function ComputeArmorPenetration(sources: StatSource[], strength: number): number {
  const baseAcc = MapStrengthToArmorPenetration(strength);
  const addAcc = sources.reduce((sum, s) => Flat(sum, s.ArmorPenetration.Flat), 0);
  const mulAcc = sources.reduce((prod, s) => Multiplier(prod, s.ArmorPenetration.Multiplier), 1);
  const armorPenetration = ClampUtils.clamp01((baseAcc + addAcc) * mulAcc);

  return armorPenetration;
}

function ComputeResistancePenetration(sources: StatSource[], intelligence: number): number {
  const baseAcc = MapIntelligenceToResistancePenetration(intelligence);
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

function Multiplier(currentMultiplier: number, additionalMultiplier: number): number {
  return currentMultiplier * (1 + (additionalMultiplier ?? 0));
}

function Effective(base: number, flat: number, multiplier: number, max: number = 0): number {
  return Math.max(max, (base + flat) * multiplier);
}
//#endregion
