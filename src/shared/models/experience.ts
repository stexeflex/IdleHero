export class Experience {
  private static BASE_EXPERIENCE = 100;
  private static EXPERIENCE_GROWTH_RATE = 10;

  public static GetForStage(stage: number): number {
    // Formula: Base + (Stage - 1) * GrowthRate
    return this.BASE_EXPERIENCE + (stage - 1) * this.EXPERIENCE_GROWTH_RATE;
  }
}
