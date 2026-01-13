import {
  BOOTS_ENCHANTMENT_POOL,
  CHEST_ENCHANTMENT_POOL,
  Enchantment,
  Gear,
  GearType,
  HEAD_ENCHANTMENT_POOL,
  LEGS_ENCHANTMENT_POOL,
  SHIELD_ENCHANTMENT_POOL,
  WEAPON_ENCHANTMENT_POOL
} from '../models';

import { Injectable } from '@angular/core';
import { InventoryService } from './inventory.service';

@Injectable({
  providedIn: 'root'
})
export class EnchantingService {
  private readonly ENCHANTMENT_MODIFIER = 1.2;

  constructor(private inventoryService: InventoryService) {}

  public Enchant(item: Gear, slotIndex: number) {
    if (item.Enchantments[slotIndex].IsEnchanted) {
      return;
    }

    const enchantment: Enchantment = this.CreateEnchantment(item.Type);

    item.Enchantments[slotIndex].Enchantment = enchantment;
    item.Enchantments[slotIndex].Level = 1;

    this.inventoryService.SetGearForSlot(item.Type, item);
  }

  public Reroll(item: Gear, slotIndex: number) {
    if (!item.Enchantments[slotIndex].IsEnchanted) {
      return;
    }
    const enchantment: Enchantment = this.CreateEnchantment(item.Type);

    item.Enchantments[slotIndex].Enchantment = enchantment;
    item.Enchantments[slotIndex].Level = 1;

    this.inventoryService.SetGearForSlot(item.Type, item);
  }

  // public Disenchant(item: Gear, slotIndex: number) {
  //   if (!item.EnchantmentSlots[slotIndex].IsEnchanted) {
  //     return;
  //   }

  //   item.EnchantmentSlots[slotIndex].Enchantment = undefined!;
  //   item.EnchantmentSlots[slotIndex].Level = 0;

  //   this.inventoryService.SetGearForSlot(item.Type, item);
  // }

  public Upgrade(item: Gear, slotIndex: number) {
    if (!item.Enchantments[slotIndex].CanUpgrade) {
      return;
    }

    const enchantmentSlot = item.Enchantments[slotIndex];
    if (enchantmentSlot.Enchantment.Value < 1) {
      enchantmentSlot.Enchantment.Value =
        Math.ceil(enchantmentSlot.Enchantment.Value * this.ENCHANTMENT_MODIFIER * 100) / 100;
    } else {
      enchantmentSlot.Enchantment.Value = Math.ceil(
        enchantmentSlot.Enchantment.Value * this.ENCHANTMENT_MODIFIER
      );
    }
    enchantmentSlot.Level++;
    item.Enchantments[slotIndex] = enchantmentSlot;

    this.inventoryService.SetGearForSlot(item.Type, item);
  }

  private CreateEnchantment(type: GearType): Enchantment {
    switch (type) {
      case GearType.Weapon:
        return WEAPON_ENCHANTMENT_POOL.GetRandomEnchantment();
      case GearType.Shield:
        return SHIELD_ENCHANTMENT_POOL.GetRandomEnchantment();
      case GearType.Head:
        return HEAD_ENCHANTMENT_POOL.GetRandomEnchantment();
      case GearType.Chest:
        return CHEST_ENCHANTMENT_POOL.GetRandomEnchantment();
      case GearType.Legs:
        return LEGS_ENCHANTMENT_POOL.GetRandomEnchantment();
      case GearType.Boots:
        return BOOTS_ENCHANTMENT_POOL.GetRandomEnchantment();
    }
  }
}
