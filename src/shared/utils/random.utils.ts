export class RandomUtils {
  public static stableIndex(seed: string, length: number): number {
    let h = 2166136261;

    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }

    return Math.abs(h >>> 0) % length;
  }
}
