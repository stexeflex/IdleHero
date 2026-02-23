import { DamageResult } from './engine/models/damage-result';

export function GetRawDamages(damageResults: DamageResult[]): DamageResult[] {
  const rawDamages = damageResults.filter((d) => !d.IsBleeding && !d.IsSplash);
  return rawDamages;
}

export function GetDirectDamages(damageResults: DamageResult[]): DamageResult[] {
  const directDamages = damageResults.filter((d) => !d.IsSplash);
  return directDamages;
}

export function GetDirectDamageAmount(damageResults: DamageResult[]): number {
  const directDamages = GetDirectDamages(damageResults);
  return GetTotalDamageAmount(directDamages);
}

export function GetTotalDamageAmount(damageResults: DamageResult[]): number {
  const totalDamage = damageResults.reduce((sum, d) => sum + d.Amount, 0);
  return totalDamage;
}

export function GetHitCount(damageResults: DamageResult[]): number {
  const rawDamages = GetRawDamages(damageResults);
  return rawDamages.length ?? 0;
}

export function HasBleedingHit(damageResults: DamageResult[]): boolean {
  return damageResults.some((d) => d.IsBleeding);
}

export function HasCriticalHit(damageResults: DamageResult[]): boolean {
  return damageResults.some((d) => d.IsCritical);
}

export function HasMultiHits(damageResults: DamageResult[]): boolean {
  const multiHitCount = GetHitCount(damageResults);
  return multiHitCount > 1;
}

// Hit Type Checks
export function IsSingleHit(damageResults: DamageResult[]): boolean {
  return !HasMultiHits(damageResults);
}

export function IsBleedingHit(damageResults: DamageResult[]): boolean {
  const hasBleeding = HasBleedingHit(damageResults);
  const hasCritical = HasCriticalHit(damageResults);
  const hasMultiHits = HasMultiHits(damageResults);
  const isSplash = IsSplashHit(damageResults);
  return hasBleeding && !hasCritical && !hasMultiHits && !isSplash;
}

export function IsCriticalHit(damageResults: DamageResult[]): boolean {
  return HasCriticalHit(damageResults) && !HasMultiHits(damageResults);
}

export function IsMultiHit(damageResults: DamageResult[]): boolean {
  return HasMultiHits(damageResults) && !HasCriticalHit(damageResults);
}

export function IsChargeHit(damageResults: DamageResult[]): boolean {
  return damageResults.some((d) => d.IsCharged);
}

export function IsSplashHit(damageResults: DamageResult[]): boolean {
  return damageResults.some((d) => d.IsSplash);
}

// Multi Hit Checks
export function IsChargedCriticalMultiHit(damageResults: DamageResult[]): boolean {
  return IsChargeHit(damageResults) && IsCriticalMultiHit(damageResults);
}

export function IsChargedMultiHit(damageResults: DamageResult[]): boolean {
  return IsChargeHit(damageResults) && IsMultiHit(damageResults);
}

export function IsCriticalMultiHit(damageResults: DamageResult[]): boolean {
  return HasCriticalHit(damageResults) && HasMultiHits(damageResults);
}

// Charged Single Hit Checks
export function IsChargedCriticalSingleHit(damageResult: DamageResult): boolean {
  return damageResult.IsCharged && damageResult.IsCritical;
}

export function IsChargedSingleHit(damageResult: DamageResult): boolean {
  return damageResult.IsCharged && !damageResult.IsCritical;
}

export function IsCriticalSingleHit(damageResult: DamageResult): boolean {
  return damageResult.IsCritical && !damageResult.IsCharged;
}
