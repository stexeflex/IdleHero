import { Component, Input } from '@angular/core';
import { EnchantmentSlot, Gear, GearType } from '../../../shared/models';
import {
  EnchantmentSlotIcon,
  GearSlotIconName,
  Gold,
  IconComponent,
  Separator
} from '../../../shared/components';

import { EnchantingService } from '../../../shared/services';

@Component({
  selector: 'app-enchanting',
  imports: [IconComponent, EnchantmentSlotIcon, Gold, Separator],
  templateUrl: './enchanting.html',
  styleUrl: './enchanting.scss'
})
export class Enchanting {
  @Input({ required: true }) Item!: Gear;

  protected get GearIcon(): GearSlotIconName {
    switch (this.Item.Type) {
      case GearType.Weapon:
        return 'sword';
      case GearType.Shield:
        return 'shield';
      case GearType.Head:
        return 'head';
      case GearType.Chest:
        return 'chest';
      case GearType.Legs:
        return 'legs';
      case GearType.Boots:
        return 'boots';
    }
  }

  constructor(private enchantingService: EnchantingService) {}

  protected GetEnchantmentDescription(slot: EnchantmentSlot): string {
    return slot.Enchantment.DisplayName;
  }

  /* ENCHANT SECTION */
  protected CanEnchant(slot: EnchantmentSlot): boolean {
    return !slot.IsEnchanted;
  }

  protected CanEnchantSlot(slot: EnchantmentSlot): boolean {
    return !slot.IsEnchanted;
  }

  protected EnchantSlot(index: number): void {
    this.enchantingService.Enchant(this.Item, index);
  }

  /* REROLL SECTION */
  protected ShowRerollAction(slot: EnchantmentSlot): boolean {
    return slot.IsEnchanted;
  }

  protected CanReroll(): boolean {
    // TODO
    return true;
  }

  protected Reroll(index: number): void {
    this.enchantingService.Reroll(this.Item, index);
  }

  /* UPGRADE SECTION */
  protected ShowUpgradeAction(slot: EnchantmentSlot): boolean {
    return slot.IsEnchanted;
  }

  protected CanUpgrade(slot: EnchantmentSlot): boolean {
    return slot.CanUpgrade;
  }

  protected Upgrade(index: number): void {
    this.enchantingService.Upgrade(this.Item, index);
  }
}
