import { ATTRIBUTES_CONFIG, STATS_CONFIG } from '../../constants';
import { Attributes, BaseStats, ComputedStats, StatSource } from '../../models';
import {
  MapDexterityToAccuracy,
  MapDexterityToChainFactor,
  MapDexterityToEvasion,
  MapDexterityToHaste,
  MapDexterityToMultiHitChance,
  MapIntelligenceToCritChance,
  MapStrengthToBaseDamage
} from './stat-scalings';

import { ClampUtils } from '../../../shared/utils';

export function ComputeStats(
  attributes: Attributes,
  baseStats: BaseStats,
  statSources: StatSource[]
): ComputedStats {
  const sources: StatSource[] = statSources ?? [];

  // Attributes
  const {
    Strength: effectiveStr,
    Intelligence: effectiveInt,
    Dexterity: effectiveDex
  } = ComputeAttributes(attributes, sources);

  // Damage & Attack Speed
  const damage = ComputeDamage(sources, baseStats.Damage, effectiveStr);
  const attackSpeed = ComputeAttackSpeed(sources, baseStats.AttackSpeed, effectiveDex);

  // Crit Chance & Damage
  const { CriticalHitChance: critChance, CriticalHitDamage: critMultiplier } = ComputeCriticalHit(
    sources,
    baseStats.CriticalHitChance,
    baseStats.CriticalHitDamage,
    effectiveInt
  );

  // Multi-Hit Chance
  const { MultiHitChance: multiHitChance, MultiHitChainFactor: multiHitChainFactor } =
    ComputeMultiHit(sources, baseStats.MultiHitChance, effectiveDex);

  // Accuracy & Evasion
  const accuracy = ComputeAccuracy(sources, effectiveDex);
  const evasion = ComputeEvasion(sources, effectiveDex);

  const stats = {
    AttackSpeed: attackSpeed,
    Damage: damage,
    CriticalHitChance: critChance,
    CriticalHitDamage: critMultiplier,
    MultiHitChance: multiHitChance,
    MultiHitDamage: baseStats.MultiHitDamage,
    MultiHitChainFactor: multiHitChainFactor,
    Accuracy: accuracy,
    Evasion: evasion
  };

  console.log('Computed Stats:', stats);
  return stats;
}

//#region Computing Functions
function ComputeAttributes(
  attributes: Attributes,
  sources: StatSource[]
): { Strength: number; Intelligence: number; Dexterity: number } {
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

function ComputeDamage(sources: StatSource[], baseDamage: number, strength: number): number {
  const baseDamageFromStr = MapStrengthToBaseDamage(strength, baseDamage);

  const addDmg = sources.reduce((sum, s) => Flat(sum, s.Damage.Flat), 0);
  const multiplyDmg = sources.reduce((prod, s) => Multiplier(prod, s.Damage.Multiplier), 1);
  const effectiveDamage = Math.round(Effective(baseDamageFromStr, addDmg, multiplyDmg, 1));

  return effectiveDamage;
}

function ComputeAttackSpeed(sources: StatSource[], baseSpeed: number, dexterity: number): number {
  const baseAPS = baseSpeed * (1 + MapDexterityToHaste(dexterity));
  const addAPS = sources.reduce((sum, s) => Flat(sum, s.AttackSpeed.Flat), 0);
  const multiplyAPS = sources.reduce((prod, s) => Multiplier(prod, s.AttackSpeed.Multiplier), 1);

  const effectiveAttackSpeed = Effective(baseAPS, addAPS, multiplyAPS, 0.1);
  return effectiveAttackSpeed;
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
  dexterity: number
): { MultiHitChance: number; MultiHitChainFactor: number } {
  const baseMulti = Flat(baseChance ?? 0, MapDexterityToMultiHitChance(dexterity));
  const addMulti = sources.reduce((sum, s) => Flat(sum, s.MultiHit.FlatChance), 0);
  const mulMulti = sources.reduce((prod, s) => Multiplier(prod, s.MultiHit.MultiplierChance), 1);
  const multiHitChance = ClampUtils.clamp01((baseMulti + addMulti) * mulMulti);

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
    MultiHitChainFactor: multiHitChainFactor
  };
}

function ComputeAccuracy(sources: StatSource[], dexterity: number): number {
  const baseAcc = MapDexterityToAccuracy(dexterity);
  const addAcc = sources.reduce((sum, s) => Flat(sum, s.Accuracy.Flat), 0);
  const mulAcc = sources.reduce((prod, s) => Multiplier(prod, s.Accuracy.Multiplier), 1);
  const accuracy = ClampUtils.clamp01((baseAcc + addAcc) * mulAcc);

  return accuracy;
}

function ComputeEvasion(sources: StatSource[], dexterity: number): number {
  const baseEva = MapDexterityToEvasion(dexterity);
  const addEva = sources.reduce((sum, s) => Flat(sum, s.Evasion.Flat), 0);
  const mulEva = sources.reduce((prod, s) => Multiplier(prod, s.Evasion.Multiplier), 1);
  const evasion = ClampUtils.clamp01((baseEva + addEva) * mulEva);

  return evasion;
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
