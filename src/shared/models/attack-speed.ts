export class AttackSpeed {
  private static readonly BASE_ATTACK_SPEED: number = 1;
  private static readonly ATTACK_SPEED_PER_DEXTERITY: number = 0.01;

  public static Calculate(dexterity: number): number {
    // Formula: Base + (Faktor * (Dexterity - 1))
    return AttackSpeed.BASE_ATTACK_SPEED + AttackSpeed.ATTACK_SPEED_PER_DEXTERITY * (dexterity - 1);
  }
}
