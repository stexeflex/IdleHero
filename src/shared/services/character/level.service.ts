import { DELAYS, GAME_CONFIG } from '../../constants';
import { Injectable, signal } from '@angular/core';

import { ExperienceGainResult } from '../../models';
import { TimeoutUtils } from '../../utils';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  public UnspentSkillPoints = signal(0);
  public SpentSkillPoints = signal(0);
  public TotalSkillPoints = signal(0);

  public Current = signal(GAME_CONFIG.LEVEL.BASE_LEVEL);
  public Experience = signal(GAME_CONFIG.LEVEL.BASE_EXPERIENCE);
  public ExperienceToNextLevel = signal(GAME_CONFIG.LEVEL.BASE_EXPERIENCE_TO_NEXT_LEVEL);

  public async GainExperience(amount: number): Promise<ExperienceGainResult> {
    let leveledUp = false;
    let experienceOverflow = 0;

    this.Experience.set(this.Experience() + amount);

    if (this.Experience() >= this.ExperienceToNextLevel()) {
      leveledUp = true;
      experienceOverflow = this.Experience() - this.ExperienceToNextLevel();
      this.Experience.set(this.ExperienceToNextLevel());

      await TimeoutUtils.wait(DELAYS.LEVEL_UP_ANIMATION_MS);

      this.LevelUp();
      this.SetNextLevelExperience();

      await TimeoutUtils.wait(DELAYS.LEVEL_UP_ANIMATION_MS);
    }

    return {
      LeveledUp: leveledUp,
      ExperienceOverflow: experienceOverflow
    };
  }

  private LevelUp(): void {
    this.Current.update((current) => current + 1);
    this.UnspentSkillPoints.update((points) => points + GAME_CONFIG.LEVEL.SKILL_POINTS_PER_LEVEL);
    this.TotalSkillPoints.update((points) => points + GAME_CONFIG.LEVEL.SKILL_POINTS_PER_LEVEL);
  }

  private SetNextLevelExperience(): void {
    this.Experience.set(0);
    this.ExperienceToNextLevel.update((value) =>
      Math.round(value * GAME_CONFIG.LEVEL.EXPERIENCE_GROWTH_RATE)
    );
  }

  public Reset(): void {
    this.Current.set(GAME_CONFIG.LEVEL.BASE_LEVEL);
    this.Experience.set(GAME_CONFIG.LEVEL.BASE_EXPERIENCE);
    this.ExperienceToNextLevel.set(GAME_CONFIG.LEVEL.BASE_EXPERIENCE_TO_NEXT_LEVEL);
    this.UnspentSkillPoints.set(0);
    this.SpentSkillPoints.set(0);
    this.TotalSkillPoints.set(0);
  }

  public SpentSkillPoint() {
    if (this.UnspentSkillPoints() <= 0) {
      return;
    }

    this.UnspentSkillPoints.update((points) => points - 1);
    this.SpentSkillPoints.update((points) => points + 1);
  }

  public UnspentSkillPoint() {
    if (this.SpentSkillPoints() <= 0) {
      return;
    }

    this.UnspentSkillPoints.update((points) => points + 1);
    this.SpentSkillPoints.update((points) => points - 1);
  }
}
