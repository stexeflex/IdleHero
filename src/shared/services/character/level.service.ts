import { Injectable, signal } from '@angular/core';

import { CHARACTER_CONFIG } from '../../constants';
import { ExperienceGainResult } from '../../models';
import { LevelSchema } from '../../../persistence';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  public UnspentAttributePoints = signal(0);
  public SpentAttributePoints = signal(0);
  public TotalAttributePoints = signal(0);

  public Current = signal(CHARACTER_CONFIG.LEVEL.BASE_LEVEL);
  public Experience = signal(CHARACTER_CONFIG.EXPERIENCE.BASE_EXPERIENCE);
  public ExperienceToNextLevel = signal(CHARACTER_CONFIG.EXPERIENCE.BASE_EXPERIENCE_TO_NEXT_LEVEL);

  public Init(levelSchema: LevelSchema) {
    this.Current.set(levelSchema.Level);
    this.Experience.set(levelSchema.Experience);
    this.ExperienceToNextLevel.set(levelSchema.ExperienceToNextLevel);
    this.UnspentAttributePoints.set(levelSchema.UnspentAttributePoints);
    this.SpentAttributePoints.set(levelSchema.SpentAttributePoints);
    this.TotalAttributePoints.set(levelSchema.TotalAttributePoints);
  }

  public CollectSchema(): LevelSchema {
    const schema = new LevelSchema();
    schema.Level = this.Current();
    schema.Experience = this.Experience();
    schema.ExperienceToNextLevel = this.ExperienceToNextLevel();
    schema.UnspentAttributePoints = this.UnspentAttributePoints();
    schema.SpentAttributePoints = this.SpentAttributePoints();
    schema.TotalAttributePoints = this.TotalAttributePoints();
    return schema;
  }

  public GainExperience(amount: number): ExperienceGainResult {
    let leveledUp = false;
    let experienceOverflow = 0;

    this.Experience.set(this.Experience() + amount);

    if (this.Experience() >= this.ExperienceToNextLevel()) {
      leveledUp = true;
      experienceOverflow = this.Experience() - this.ExperienceToNextLevel();
      this.Experience.set(this.ExperienceToNextLevel());

      this.LevelUp();
      this.SetNextLevelExperience();
    }

    return {
      LeveledUp: leveledUp,
      ExperienceOverflow: experienceOverflow
    };
  }

  private LevelUp(): void {
    this.Current.update((current) => current + 1);
    this.UnspentAttributePoints.update(
      (points) => points + CHARACTER_CONFIG.LEVEL.SKILL_POINTS_PER_LEVEL
    );
    this.TotalAttributePoints.update(
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
    if (this.UnspentAttributePoints() <= 0) {
      return;
    }

    this.UnspentAttributePoints.update((points) => points - 1);
    this.SpentAttributePoints.update((points) => points + 1);
  }

  public UnspentSkillPoint() {
    if (this.SpentAttributePoints() <= 0) {
      return;
    }

    this.UnspentAttributePoints.update((points) => points + 1);
    this.SpentAttributePoints.update((points) => points - 1);
  }
}
