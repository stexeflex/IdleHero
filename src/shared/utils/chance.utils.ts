export class ChanceUtils {
  /**
   * Determines if an action is successful based on the given chance.
   * @param chance A number between 0 and 1 representing the success chance.
   * @returns True if the action is successful, false otherwise.
   */
  public static success(chance: number): boolean {
    if (chance <= 0) {
      return false;
    }

    const roll = Math.random();
    return roll <= chance;
  }
}
