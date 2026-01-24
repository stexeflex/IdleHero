import {
  AttributePointsForGainedLevels,
  ClampLevel,
  ComputeProgressFromTotalXP,
  XpToNextLevel
} from '../systems/progression';
import { InitialLevelState, LevelProgress, LevelState, PlayerLevelState } from '../models';
import { Injectable, computed, signal } from '@angular/core';

import { ClampUtils } from '../../shared/utils';

@Injectable({ providedIn: 'root' })
export class LevelService {
  private readonly State = signal<PlayerLevelState>(InitialLevelState());

  public readonly Level = computed(() => this.State().Level);
  public readonly TotalExperience = computed(() => this.State().TotalExperience);
  public readonly ExperienceInLevel = computed(() => this.State().ExperienceInLevel);
  public readonly ExperienceToNext = computed(() => this.State().ExperienceToNext);
  public readonly ProgressRatio = computed(() => {
    const s = this.State();
    return s.ExperienceToNext > 0 ? s.ExperienceInLevel / s.ExperienceToNext : 0;
  });

  public readonly UnspentAttributePoints = computed(() => this.State().UnspentAttributePoints);

  /**
   * Increments XP, handles multi-level ups, awards points
   * @param amount the amount of experience to add
   */
  public AddExperience(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) return;

    this.State.update((s) => {
      let totalXP = s.TotalExperience + Math.floor(amount);
      let { Level, ExperienceInLevel, ExperienceToNext }: LevelProgress =
        ComputeProgressFromTotalXP(totalXP);

      // Award points for each level gained compared to previous
      const gainedLevels = Math.max(0, Level - s.Level);
      const awardedPoints = AttributePointsForGainedLevels(gainedLevels);

      return {
        ...s,
        Level: Level,
        TotalExperience: totalXP,
        ExperienceInLevel: ExperienceInLevel,
        ExperienceToNext: ExperienceToNext,
        UnspentAttributePoints: s.UnspentAttributePoints + awardedPoints
      };
    });
  }

  /**
   * Deducts points if available
   * @param amount the amount of attribute points to spend
   * @returns true if points were successfully spent, false otherwise
   */
  public SpendAttributePoints(amount: number): boolean {
    if (!Number.isFinite(amount) || amount <= 0) return false;
    if (this.State().UnspentAttributePoints < amount) return false;

    this.State.update((current) => ({
      ...current,
      UnspentAttributePoints: current.UnspentAttributePoints - amount
    }));

    return true;
  }

  /**
   * Refunds attribute points back to the unspent pool
   * @param amount the amount of points to refund
   */
  public RefundAttributePoints(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) return;

    this.State.update((current) => ({
      ...current,
      UnspentAttributePoints: current.UnspentAttributePoints + Math.floor(amount)
    }));
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
      ExperienceToNext: toNext,
      UnspentAttributePoints: _.UnspentAttributePoints
    }));
  }

  /**
   * Resets level state to initial values
   */
  public Reset(): void {
    this.State.set(InitialLevelState());
  }

  /**
   * Gets a snapshot of the current level state
   * @returns the current LevelState
   */
  public GetState(): LevelState {
    return { ...this.State() };
  }
}
