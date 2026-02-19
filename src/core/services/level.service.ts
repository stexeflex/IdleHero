import {
  AttributePointsForGainedLevels,
  ClampLevel,
  ComputeProgressFromTotalXP,
  MaxPlayerLevel,
  XpToNextLevel
} from '../systems/progression';
import { InitialLevelState, LevelProgress, LevelState } from '../models';
import { Injectable, computed, inject, signal } from '@angular/core';

import { AttributesService } from './attributes.service';
import { ClampUtils } from '../../shared/utils';

@Injectable({ providedIn: 'root' })
export class LevelService {
  private readonly Attributes = inject(AttributesService);

  private readonly State = signal<LevelState>(InitialLevelState());

  public readonly Level = computed(() => this.State().Level);
  public readonly TotalExperience = computed(() => this.State().TotalExperience);
  public readonly ExperienceInLevel = computed(() => this.State().ExperienceInLevel);
  public readonly ExperienceToNext = computed(() => this.State().ExperienceToNext);
  public readonly ProgressRatio = computed(() => {
    const s = this.State();
    return s.ExperienceToNext > 0 ? s.ExperienceInLevel / s.ExperienceToNext : 0;
  });
  public readonly IsMaxLevel = computed(() => this.State().Level === MaxPlayerLevel());

  /**
   * Increments XP, handles multi-level ups, awards points
   * @param amount the amount of experience to add
   */
  public AddExperience(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) return;

    this.State.update((s) => {
      let totalXP = s.TotalExperience + Math.floor(amount);
      const levelProgress: LevelProgress = ComputeProgressFromTotalXP(totalXP);

      // Award points for each level gained compared to previous
      const gainedLevels = Math.max(0, levelProgress.Level - s.Level);
      const awardedPoints = AttributePointsForGainedLevels(gainedLevels);
      this.Attributes.AddAttributePoints(awardedPoints);

      return {
        ...s,
        Level: levelProgress.Level,
        TotalExperience: totalXP,
        ExperienceInLevel: levelProgress.ExperienceInLevel,
        ExperienceToNext: levelProgress.ExperienceToNext
      };
    });
  }

  /**
   * Sets a specific level and XP (within level)
   * @param level the target level
   * @param experienceInLevel the experience within that level
   */
  public SetLevel(level: number, experienceInLevel = 0): void {
    const clamped = ClampLevel(level);
    const toNext = XpToNextLevel(clamped);
    const expInLevel = ClampUtils.clamp(toNext - 1, 0, experienceInLevel);

    // recompute total from level and exp in level
    let total = 0;
    for (let l = 1; l < clamped; l++) {
      total += XpToNextLevel(l);
    }

    total += expInLevel;

    this.State.update((_) => ({
      Level: clamped,
      TotalExperience: total,
      ExperienceInLevel: expInLevel,
      ExperienceToNext: toNext
    }));
  }

  public GetState(): { Level: number; ExperienceInLevel: number } {
    const { Level, ExperienceInLevel } = this.State();
    return { Level, ExperienceInLevel };
  }
}
