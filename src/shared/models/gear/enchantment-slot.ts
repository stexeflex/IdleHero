import { ENCHANTING_CONFIG } from '../../constants';
import { Enchantment } from './enchantment';

export class EnchantmentSlot {
  public readonly Name: string;
  public Level: number = ENCHANTING_CONFIG.LEVEL.BASE;
  public Enchantment: Enchantment | undefined = undefined;

  constructor(public Id: number) {
    this.Name = `Slot ${Id}`;
  }

  public get IsEnchanted(): boolean {
    return this.Enchantment !== undefined;
  }

  public get CanUpgrade(): boolean {
    return this.IsEnchanted && this.Level < ENCHANTING_CONFIG.LEVEL.MAX;
  }
}
