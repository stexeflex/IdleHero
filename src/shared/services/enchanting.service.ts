import {
  BOOTS_ENCHANTMENT_POOL,
  CHEST_ENCHANTMENT_POOL,
  HEAD_ENCHANTMENT_POOL,
  LEGS_ENCHANTMENT_POOL,
  SHIELD_ENCHANTMENT_POOL,
  WEAPON_ENCHANTMENT_POOL
} from '../constants';
import { Enchantment, Gear, GearType } from '../models';

import { CurrencyService } from './character/currency.service';
import { GearSpecifications } from '../specifications';
import { Injectable } from '@angular/core';
import { InventoryService } from './character/inventory.service';
import { ItemPriceService } from './item-price.service';

@Injectable({
  providedIn: 'root'
})
export class EnchantingService {
  constructor(
    private inventoryService: InventoryService,
    private itemPriceService: ItemPriceService,
    private currencyService: CurrencyService,
    private gearSpecifications: GearSpecifications
  ) {}

  public UpgradeGear(item: Gear) {
    if (!this.gearSpecifications.CanUpgrade(item)) {
      return;
    }

    const gearUpgradeCost = this.itemPriceService.GetGearUpgradeCost(item);

    if (!this.currencyService.SpendGold(gearUpgradeCost)) {
      return;
    }

    item.Upgrade();
    this.itemPriceService.IncreaseSellValue(item, gearUpgradeCost);

    this.UpdateSlot(item);
  }

  public Enchant(item: Gear, slotIndex: number) {
    if (item.Slots[slotIndex].IsEnchanted) {
      return;
    }

    const enchantmentCost = this.itemPriceService.GetEnchantmentCost(item);

    if (!this.currencyService.SpendGold(enchantmentCost)) {
      return;
    }

    const enchantment: Enchantment = this.CreateEnchantment(item.Type);
    item.Slots[slotIndex].Enchant(enchantment, item.Level);
    this.itemPriceService.IncreaseSellValue(item, enchantmentCost);

    this.UpdateSlot(item);
  }

  public Reroll(item: Gear, slotIndex: number) {
    if (!item.Slots[slotIndex].IsEnchanted) {
      return;
    }

    const rerollCost = this.itemPriceService.GetRerollCost();

    if (!this.currencyService.SpendGold(rerollCost)) {
      return;
    }

    const enchantment: Enchantment = this.CreateEnchantment(item.Type);
    item.Slots[slotIndex].Reroll(enchantment, item.Level);
    this.UpdateSlot(item);
  }

  public Upgrade(item: Gear, slotIndex: number) {
    if (!item.Slots[slotIndex].CanUpgrade) {
      return;
    }

    const upgradeCost = this.itemPriceService.GetUpgradeCost(item.Slots[slotIndex]);

    if (!this.currencyService.SpendGold(upgradeCost)) {
      return;
    }

    item.Slots[slotIndex].Upgrade();
    this.itemPriceService.IncreaseSellValue(item, upgradeCost);
    this.UpdateSlot(item);
  }

  private UpdateSlot(item: Gear) {
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
