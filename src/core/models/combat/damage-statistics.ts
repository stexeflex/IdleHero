export interface DamageStatistics {
  HighestSingleHit: number;
  HighestBleedingTick: number;
  HighestCriticalHit: number;
  HighestMultiHit: number;
  HighestMultiHitChain: number;
  HighestCriticalMultiHit: number;
  HighestTotalMultiHit: number;
  HighestSplashHit: number;
}

export function InitialDamageStatistics(): DamageStatistics {
  return {
    HighestSingleHit: 0,
    HighestBleedingTick: 0,
    HighestCriticalHit: 0,
    HighestMultiHit: 0,
    HighestMultiHitChain: 0,
    HighestCriticalMultiHit: 0,
    HighestTotalMultiHit: 0,
    HighestSplashHit: 0
  };
}
