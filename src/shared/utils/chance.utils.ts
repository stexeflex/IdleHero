export class ChanceUtils {
  /**
   * Determines if an action is successful based on the given chance.
   * @param chance A number between 0 and 1 representing the success chance.
   * @returns True if the action is successful, false otherwise.
   */
  public static success(chance: number): boolean {
    if (chance <= 0) return false;
    if (chance >= 1) return true;

    const roll = Math.random();
    return roll < chance;
  }

  /**
   * Determines if an action is successful based on the given chance and a provided roll.
   * @param chance A number between 0 and 1 representing the success chance.
   * @param roll A number between 0 and 1 representing the rolled value (e.g., from a random generator).
   * @returns True if the action is successful, false otherwise.
   */
  public static isSuccess(chance: number, roll: number): boolean {
    if (chance <= 0) return false;
    if (chance >= 1) return true;

    return roll < chance;
  }

  /**
   * Rolls a random number between 0 (inclusive) and 1 (exclusive) [0..1].
   * @returns A random number between 0 and 1.
   */
  public static Roll(): number {
    return Math.random();
  }
}
