import { Gear, GearType } from '../models';

import { CurrencyService } from './character/currency.service';
import { Injectable, inject } from '@angular/core';
import { InventoryService } from './character/inventory.service';
import { ItemPriceService } from './item-price.service';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private readonly currencyService = inject(CurrencyService);
  private readonly inventoryService = inject(InventoryService);
  private readonly itemPriceService = inject(ItemPriceService);

  public BuyItem(slot: GearType) {
    const price = this.itemPriceService.GetBuyPrice(slot);

    if (this.currencyService.SpendGold(price)) {
      const item = Gear.Create(slot);
      this.inventoryService.SetGearForSlot(slot, item);
    }
  }

  public SellItem(slot: GearType) {
    const gear = this.inventoryService.GetGearForSlot(slot);

    if (gear !== null) {
      this.currencyService.AddGold(gear.SellValue);
      this.inventoryService.RemoveGearFromSlot(slot);
    }
  }
}
