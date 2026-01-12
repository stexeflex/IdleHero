import { Enchantment } from './enchantment';

export class EnchantmentSlot {
  public static readonly MAX_ENCHANTMENT_LEVEL = 5;

  public get IsEnchanted(): boolean {
    return this.Enchantment !== undefined;
  }

  public get CanUpgrade(): boolean {
    return this.IsEnchanted && this.Level < EnchantmentSlot.MAX_ENCHANTMENT_LEVEL;
  }

  public readonly Name: string;
  public Level: number = 0;
  public Enchantment!: Enchantment;

  constructor(public Id: number) {
    this.Name = `Slot ${Id}`;
  }
}
