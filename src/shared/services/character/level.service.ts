import { Injectable, computed, signal } from '@angular/core';

import { CHARACTER_CONFIG } from '../../constants';
import { ExperienceGainResult } from '../../models';
import { LevelSchema } from '../../../persistence';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  public UnspentAttributePoints = computed(() => {
    return this.TotalAttributePoints() - this.SpentAttributePoints();
  });

  public SpentAttributePoints = signal(0);

  public TotalAttributePoints = computed(() => {
    const base = 0;
    const perLevel = CHARACTER_CONFIG.LEVEL.SKILL_POINTS_PER_LEVEL;
    const level = this.Level() - CHARACTER_CONFIG.LEVEL.BASE_LEVEL;
    return base + perLevel * level;
  });

  public Level = signal(CHARACTER_CONFIG.LEVEL.BASE_LEVEL);
  public Experience = signal(CHARACTER_CONFIG.EXPERIENCE.BASE_EXPERIENCE);
  public ExperienceToNextLevel = computed(() => {
    const baseExperience = CHARACTER_CONFIG.EXPERIENCE.BASE_EXPERIENCE_TO_NEXT_LEVEL;
    const growthRate = CHARACTER_CONFIG.EXPERIENCE.EXPERIENCE_GROWTH_RATE;
    const level = this.Level() - CHARACTER_CONFIG.LEVEL.BASE_LEVEL;
    return Math.round(baseExperience * Math.pow(growthRate, level));
  });

  public Init(levelSchema: LevelSchema) {
    this.Level.set(levelSchema.Level);
    this.Experience.set(levelSchema.Experience);
    this.SpentAttributePoints.set(levelSchema.SpentAttributePoints);
  }

  public CollectSchema(schema: LevelSchema): LevelSchema {
    schema.Level = this.Level();
    schema.Experience = this.Experience();
    schema.SpentAttributePoints = this.SpentAttributePoints();
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
    this.Level.update((current) => current + 1);
  }

  private SetNextLevelExperience(): void {
    this.Experience.set(0);
  }

  public SpentSkillPoint() {
    if (this.UnspentAttributePoints() <= 0) {
      return;
    }

    this.SpentAttributePoints.update((points) => points + 1);
  }

  public UnspentSkillPoint() {
    if (this.SpentAttributePoints() <= 0) {
      return;
    }

    this.SpentAttributePoints.update((points) => points - 1);
  }
}
