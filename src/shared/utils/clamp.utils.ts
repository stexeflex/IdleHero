export class ClampUtils {
  /**
   * Clamps a number between a minimum and maximum value.
   * @param value The number to clamp.
   * @param min The minimum value.
   * @param max The maximum value.
   * @returns The clamped number.
   */
  public static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  public static clamp01(value: number): number {
    return ClampUtils.clamp(value, 0, 1);
  }
}
