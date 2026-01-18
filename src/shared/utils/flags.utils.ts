export class FlagsUtils {
  public static IsFlag(value: number, flag: number): boolean {
    return value === flag;
  }

  public static HasFlag(value: number, flag: number): boolean {
    return (value & flag) === flag;
  }

  public static AddFlag(value: number, flag: number): number {
    return (value |= flag);
  }
}
