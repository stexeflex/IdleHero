export class BossHealth {
  public static HEALTH_BASE = 5;
  private static HEALTH_GROWTH_RATE = 1.25;

  public static CalculateForStage(stage: number): number {
    // Formula: HEALTH_BASE * (HEALTH_GROWTH_RATE)^(Stage - 1)
    return Math.floor(this.HEALTH_BASE * Math.pow(this.HEALTH_GROWTH_RATE, stage - 1));
  }
}
