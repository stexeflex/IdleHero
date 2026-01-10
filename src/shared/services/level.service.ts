import { ExperienceGainResult } from '../models/results/experience-gain-result';
import { Injectable } from '@angular/core';
import { TimeoutUtils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private readonly BASE_EXPERIENCE_TO_NEXT_LEVEL = 100;
  private readonly EXPERIENCE_GROWTH_RATE = 1.15;

  private readonly LEVEL_UP_DELAY_MS = 700;

  public Current: number = 1;
  public Experience: number = 0;
  public ExperienceToNextLevel: number = this.BASE_EXPERIENCE_TO_NEXT_LEVEL;

  public async GainExperience(amount: number): Promise<ExperienceGainResult> {
    let leveledUp = false;
    let experienceOverflow = 0;

    this.Experience += amount;

    if (this.Experience >= this.ExperienceToNextLevel) {
      leveledUp = true;
      experienceOverflow = this.Experience - this.ExperienceToNextLevel;
      this.Experience = this.ExperienceToNextLevel;

      await TimeoutUtils.wait(this.LEVEL_UP_DELAY_MS);

      this.LevelUp();
      this.SetNextLevelExperience();

      await TimeoutUtils.wait(this.LEVEL_UP_DELAY_MS);
    }

    return {
      LeveledUp: leveledUp,
      ExperienceOverflow: experienceOverflow
    };
  }

  private LevelUp(): void {
    this.Current += 1;
  }

  private SetNextLevelExperience(): void {
    this.Experience = 0;
    this.ExperienceToNextLevel = Math.round(
      this.ExperienceToNextLevel * this.EXPERIENCE_GROWTH_RATE
    );
  }
}
