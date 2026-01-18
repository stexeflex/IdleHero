import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() ItemType: GearType | null = null;
  @Input() Item: Gear | null = null;

  @Output() OnItemBought = new EventEmitter<GearType>();
  @Output() OnItemSold = new EventEmitter();

  protected get CanBuy(): boolean {
    if (!this.vendorSpecifications.CanBuy()) {
      return false;
    }

    return this.ItemType !== null && this.Item === null;
  }

  protected get EnoughGoldToBuy(): boolean {
    return this.vendorSpecifications.EnoughGold(this.ItemPrice);
  }

  protected get CanSell(): boolean {
    if (!this.vendorSpecifications.CanSell()) {
      return false;
    }

    return this.Item !== null;
  }

  protected get CanUpgrade(): boolean {
    if (this.Item && !this.gearSpecifications.CanUpgrade(this.Item)) {
      return false;
    }

    return this.Item !== null;
  }

  protected get EnoughGoldToUpgrade(): boolean {
    return this.vendorSpecifications.EnoughGold(this.UpgradeCost);
  }

  protected get ItemPrice(): number {
    return this.ItemType ? this.itemPriceService.GetBuyPrice(this.ItemType) : 0;
  }

  protected get SellValue(): number {
    return this.Item?.SellValue ?? 0;
  }

  protected get UpgradeCost(): number {
    return this.Item ? this.itemPriceService.GetGearUpgradeCost(this.Item) : 0;
  }

  constructor(
    private itemPriceService: ItemPriceService,
    private vendorService: VendorService,
    private enchantingService: EnchantingService,
    private gearSpecifications: GearSpecifications,
    private vendorSpecifications: VendorSpecifications
  ) {}

  protected BuyItem() {
    if (this.ItemType === null) {
      return;
    }

    this.vendorService.BuyItem(this.ItemType);
    this.OnItemBought.emit(this.ItemType);
  }

  protected SellItem() {
    if (this.ItemType === null) {
      return;
    }

    this.vendorService.SellItem(this.ItemType);
    this.OnItemSold.emit();
  }

  protected UpgradeItem() {
    if (this.Item === null) {
      return;
    }

    this.enchantingService.UpgradeGear(this.Item);
  }
}
