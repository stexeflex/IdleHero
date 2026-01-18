import { Injectable, signal } from '@angular/core';
import {
  AttackResult,
  AttackType,
  DamageStatistics,
  DungeonRoomId,
  StageStatistics
} from '../../models';
import { StatisticsSchema } from '../../../persistence';
import { FlagsUtils } from '../../utils';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  public readonly Prestiges = signal(0);
  public readonly StageStatistics = signal(<StageStatistics>{});

  public readonly DamageStatistics = signal(<DamageStatistics>{
    HighestSingleHit: 0,
    HighestCriticalHit: 0,
    HighestMultiHit: 0,
    HighestCriticalMultiHit: 0,
    HighestSplashHit: 0
  });

  public Init(schema: StatisticsSchema) {
    this.Prestiges.set(schema.Prestiges);
    this.DamageStatistics.set(schema.DamageStatistics);
    this.StageStatistics.set(schema.StageStatistics);
  }

  public CollectSchema(schema: StatisticsSchema): StatisticsSchema {
    schema.Prestiges = this.Prestiges();
    schema.DamageStatistics = this.DamageStatistics();
    schema.StageStatistics = this.StageStatistics();
    return schema;
  }

  public RecordPrestige(inRoom: DungeonRoomId, atStage: number) {
    this.Prestiges.update((level) => level + 1);
    this.StageStatistics.update((stats) => {
      const currentHighest = stats.HighestStageReached[inRoom] || 0;
      stats.HighestStageReached[inRoom] = Math.max(currentHighest, atStage);
      return stats;
    });
  }

  public RecordDamageDealt(attackResult: AttackResult) {
    this.DamageStatistics.update((stats) => {
      // Normal Hit
      if (FlagsUtils.IsFlag(attackResult.AttackType, AttackType.Normal)) {
        stats.HighestSingleHit = Math.max(stats.HighestSingleHit, attackResult.Damage);
      }
      // Splash Hit
      else if (FlagsUtils.HasFlag(attackResult.AttackType, AttackType.Splash)) {
        stats.HighestSplashHit = Math.max(stats.HighestSplashHit, attackResult.Damage);
      }
      // Critical Multi Hit
      else if (
        FlagsUtils.HasFlag(attackResult.AttackType, AttackType.Critical | AttackType.MultiHit)
      ) {
        stats.HighestCriticalMultiHit = Math.max(
          stats.HighestCriticalMultiHit,
          attackResult.Damage
        );
      }
      // Critical Hit
      else if (FlagsUtils.HasFlag(attackResult.AttackType, AttackType.Critical)) {
        stats.HighestCriticalHit = Math.max(stats.HighestCriticalHit, attackResult.Damage);
      }
      // Multi Hit
      else if (FlagsUtils.HasFlag(attackResult.AttackType, AttackType.MultiHit)) {
        stats.HighestMultiHit = Math.max(stats.HighestMultiHit, attackResult.Damage);
      }

      return stats;
    });
  }
}
