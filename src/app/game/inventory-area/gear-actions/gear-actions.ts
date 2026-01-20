import { Component, EventEmitter, Output, inject, input } from '@angular/core';
import { EnchantingService, ItemPriceService, VendorService } from '../../../../shared/services';
import { Gear, GearType } from '../../../../shared/models';
import { GearSpecifications, VendorSpecifications } from '../../../../shared/specifications';
import { Gold, IconComponent } from '../../../../shared/components';

@Component({
  selector: 'app-gear-actions',
  imports: [IconComponent, Gold],
  templateUrl: './gear-actions.html',
  styleUrl: './gear-actions.scss'
})
export class GearActions {
  private itemPriceService = inject(ItemPriceService);
  private vendorService = inject(VendorService);
  private enchantingService = inject(EnchantingService);
  private gearSpecifications = inject(GearSpecifications);
  private vendorSpecifications = inject(VendorSpecifications);

  readonly ItemType = input<GearType | null>(null);
  readonly Item = input<Gear | null>(null);

  @Output() OnItemBought = new EventEmitter<GearType>();
  @Output() OnItemSold = new EventEmitter();

  protected get CanBuy(): boolean {
    if (!this.vendorSpecifications.CanBuy()) {
      return false;
    }

    return this.ItemType() !== null && this.Item() === null;
  }

  protected get EnoughGoldToBuy(): boolean {
    return this.vendorSpecifications.EnoughGold(this.ItemPrice);
  }

  protected get CanSell(): boolean {
    if (!this.vendorSpecifications.CanSell()) {
      return false;
    }

    return this.Item() !== null;
  }

  protected get CanUpgrade(): boolean {
    const Item = this.Item();
    if (Item && !this.gearSpecifications.CanUpgrade(Item)) {
      return false;
    }

    return Item !== null;
  }

  protected get EnoughGoldToUpgrade(): boolean {
    return this.vendorSpecifications.EnoughGold(this.UpgradeCost);
  }

  protected get ItemPrice(): number {
    const ItemType = this.ItemType();
    return ItemType ? this.itemPriceService.GetBuyPrice(ItemType) : 0;
  }

  protected get SellValue(): number {
    return this.Item()?.SellValue ?? 0;
  }

  protected get UpgradeCost(): number {
    const Item = this.Item();
    return Item ? this.itemPriceService.GetGearUpgradeCost(Item) : 0;
  }

  protected BuyItem() {
    const ItemType = this.ItemType();
    if (ItemType === null) {
      return;
    }

    this.vendorService.BuyItem(ItemType);
    this.OnItemBought.emit(ItemType);
  }

  protected SellItem() {
    const ItemType = this.ItemType();
    if (ItemType === null) {
      return;
    }

    this.vendorService.SellItem(ItemType);
    this.OnItemSold.emit();
  }

  protected UpgradeItem() {
    const Item = this.Item();
    if (Item === null) {
      return;
    }

    this.enchantingService.UpgradeGear(Item);
  }
}
