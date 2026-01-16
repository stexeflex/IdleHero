import { Enchantment } from './enchantment';
import { StatType } from '../stats/stat-type';

export interface EnchantmentPoolEntry {
  Stat: StatType;
  Min: number;
  Max: number;
  Probability: number;
}

export class EnchantmentPool extends Array<EnchantmentPoolEntry> {
  constructor(entries: EnchantmentPoolEntry[]) {
    super(...entries);
  }

  public GetRandomEnchantment(): Enchantment {
    const random: number = Math.random();
    let cumulativeProbability: number = 0;

    for (const enchantment of this) {
      cumulativeProbability += enchantment.Probability;

      if (random <= cumulativeProbability) {
        const value: number = this.GetRandomValue(enchantment.Min, enchantment.Max);
        return new Enchantment(enchantment.Stat as StatType, value);
      }
    }

    // Fallback in case probabilities don't sum to 1
    const fallback = this.GetFallback();
    return new Enchantment(fallback.Stat, fallback.Min);
  }

  private GetRandomValue(min: number, max: number): number {
    if (min < 1 && max <= 1) {
      // For decimal values
      const factor = 100;
      const scaledMin = Math.floor(min * factor);
      const scaledMax = Math.floor(max * factor);
      const randomScaledValue = Math.floor(Math.random() * (scaledMax - scaledMin + 1)) + scaledMin;
      return randomScaledValue / factor;
    } else {
      // Inclusive of min and max
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }

  private GetFallback(): EnchantmentPoolEntry {
    // Get stat with highest probability
    return this.reduce((prev, current) =>
      prev.Probability > current.Probability ? prev : current
    );
  }
}
