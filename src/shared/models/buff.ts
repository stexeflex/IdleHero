export class Buff {
  public IsActive: boolean;
  public IsOnCooldown: boolean;

  constructor(
    public readonly Icon: string,
    public readonly Name: string,
    public readonly Description: string,
    public readonly DurationInSeconds: number,
    public readonly CooldownInSeconds: number,
    public readonly Modifier?: number
  ) {
    this.IsActive = false;
    this.IsOnCooldown = false;
  }

  static FromObject(init: Partial<Buff>): Buff {
    return new Buff(
      init.Icon ?? '',
      init.Name ?? '',
      init.Description ?? '',
      init.DurationInSeconds ?? 0,
      init.CooldownInSeconds ?? 0,
      init.Modifier
    );
  }
}
