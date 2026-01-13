import {
  Boots,
  Chest,
  EnchantmentSlot,
  Gear,
  GearType,
  Head,
  Legs,
  Shield,
  Weapon
} from '../models';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ItemPriceService {
  public GetBuyPrice(itemSlot: GearType): number {
    switch (itemSlot) {
      case GearType.Weapon:
        return Weapon.BuyPrice;
      case GearType.Shield:
        return Shield.BuyPrice;
      case GearType.Head:
        return Head.BuyPrice;
      case GearType.Chest:
        return Chest.BuyPrice;
      case GearType.Legs:
        return Legs.BuyPrice;
      case GearType.Boots:
        return Boots.BuyPrice;
      default:
        return 0;
    }
  }

  public GetEnchantmentCost(item: Gear): number {
    return (
      (item.SlotAmount - item.Enchantments.filter((e) => !e.IsEnchanted).length + 1) *
      EnchantmentSlot.COST_PER_SLOT
    );
  }

  public GetRerollCost(): number {
    return EnchantmentSlot.REROLL_COST;
  }

  public GetUpgradeCost(slot: EnchantmentSlot): number {
    return slot.Level * EnchantmentSlot.COST_PER_UPGRADE_LEVEL;
  }
}
