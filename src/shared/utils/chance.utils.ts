export class ChanceUtils {
  public static success(chance: number): boolean {
    const roll = Math.random();
    return roll <= chance;
  }
}
