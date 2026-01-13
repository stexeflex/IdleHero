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

import { CurrencyService } from './character/currency.service';
import { Injectable } from '@angular/core';
import { InventoryService } from './character/inventory.service';
import { ItemPriceService } from './item-price.service';

@Injectable({
  providedIn: 'root'
})
export class EnchantingService {
  private readonly ENCHANTMENT_MODIFIER = 1.2;

  constructor(
    private inventoryService: InventoryService,
    private itemPriceService: ItemPriceService,
    private currencyService: CurrencyService
  ) {}

  public Enchant(item: Gear, slotIndex: number) {
    if (item.Enchantments[slotIndex].IsEnchanted) {
      return;
    }

    const enchantmentCost = this.itemPriceService.GetEnchantmentCost(item);

    if (!this.currencyService.SpendGold(enchantmentCost)) {
      return;
    }

    const enchantment: Enchantment = this.CreateEnchantment(item.Type);

    item.Enchantments[slotIndex].Enchantment = enchantment;
    item.Enchantments[slotIndex].Level = 1;

    item.SellValue += Math.floor(enchantmentCost * Gear.DEFAULT_SELLVALUE_MULTIPLIER);

    this.inventoryService.SetGearForSlot(item.Type, item);
  }

  public Reroll(item: Gear, slotIndex: number) {
    if (!item.Enchantments[slotIndex].IsEnchanted) {
      return;
    }

    const rerollCost = this.itemPriceService.GetRerollCost();

    if (!this.currencyService.SpendGold(rerollCost)) {
      return;
    }

    const enchantment: Enchantment = this.CreateEnchantment(item.Type);

    item.Enchantments[slotIndex].Enchantment = enchantment;
    item.Enchantments[slotIndex].Level = 1;

    item.SellValue += Math.floor(rerollCost * Gear.DEFAULT_SELLVALUE_MULTIPLIER);

    this.inventoryService.SetGearForSlot(item.Type, item);
  }

  public Upgrade(item: Gear, slotIndex: number) {
    if (!item.Enchantments[slotIndex].CanUpgrade) {
      return;
    }

    const upgradeCost = this.itemPriceService.GetUpgradeCost(item.Enchantments[slotIndex]);

    if (!this.currencyService.SpendGold(upgradeCost)) {
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

    item.SellValue += Math.floor(upgradeCost * Gear.DEFAULT_SELLVALUE_MULTIPLIER);

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
