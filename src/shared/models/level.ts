export class Level {
  private static readonly BASE_EXPERIENCE_TO_NEXT_LEVEL = 100;
  private static readonly EXPERIENCE_GROWTH_RATE = 1.15;
  private static readonly SKILL_POINTS_PER_LEVEL = 5;

  public Current: number = 1;
  public Experience: number = 0;
  public ExperienceToNextLevel: number = Level.BASE_EXPERIENCE_TO_NEXT_LEVEL;

  public UnspentSkillPoints: number = 0;

  public GainExperience(amount: number): void {
    this.Experience += amount;

    while (this.Experience >= this.ExperienceToNextLevel) {
      this.Experience -= this.ExperienceToNextLevel;
      this.LevelUp();
    }
  }

  private LevelUp(): void {
    this.Current += 1;
    this.UnspentSkillPoints += Level.SKILL_POINTS_PER_LEVEL;

    this.ExperienceToNextLevel = Math.round(
      this.ExperienceToNextLevel * Level.EXPERIENCE_GROWTH_RATE
    );
  }
}
