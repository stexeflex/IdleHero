import { CHARACTER_CONFIG, DELAYS } from '../../constants';
import { Injectable, signal } from '@angular/core';

import { ExperienceGainResult } from '../../models';
import { LevelSchema } from '../../../persistence';
import { TimeoutUtils } from '../../utils';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  public UnspentSkillPoints = signal(0);
  public SpentSkillPoints = signal(0);
  public TotalSkillPoints = signal(0);

  public Current = signal(CHARACTER_CONFIG.LEVEL.BASE_LEVEL);
  public Experience = signal(CHARACTER_CONFIG.EXPERIENCE.BASE_EXPERIENCE);
  public ExperienceToNextLevel = signal(CHARACTER_CONFIG.EXPERIENCE.BASE_EXPERIENCE_TO_NEXT_LEVEL);

  public Init(levelSchema: LevelSchema) {
    this.Current.set(levelSchema.Level);
    this.Experience.set(levelSchema.Experience);
    this.ExperienceToNextLevel.set(levelSchema.ExperienceToNextLevel);
    this.UnspentSkillPoints.set(levelSchema.UnspentSkillPoints);
    this.SpentSkillPoints.set(levelSchema.SpentSkillPoints);
    this.TotalSkillPoints.set(levelSchema.TotalSkillPoints);
  }

  public CollectSchema(): LevelSchema {
    const schema = new LevelSchema();
    schema.Level = this.Current();
    schema.Experience = this.Experience();
    schema.ExperienceToNextLevel = this.ExperienceToNextLevel();
    schema.UnspentSkillPoints = this.UnspentSkillPoints();
    schema.SpentSkillPoints = this.SpentSkillPoints();
    schema.TotalSkillPoints = this.TotalSkillPoints();
    return schema;
  }

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
    this.UnspentSkillPoints.update(
      (points) => points + CHARACTER_CONFIG.LEVEL.SKILL_POINTS_PER_LEVEL
    );
    this.TotalSkillPoints.update(
      (points) => points + CHARACTER_CONFIG.LEVEL.SKILL_POINTS_PER_LEVEL
    );
  }

  private SetNextLevelExperience(): void {
    this.Experience.set(0);
    this.ExperienceToNextLevel.update((value) =>
      Math.round(value * CHARACTER_CONFIG.EXPERIENCE.EXPERIENCE_GROWTH_RATE)
    );
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
