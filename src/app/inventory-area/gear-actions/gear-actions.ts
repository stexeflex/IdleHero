import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CurrencyService,
  EnchantingService,
  GameService,
  ItemPriceService,
  VendorService
} from '../../../shared/services';
import { Gear, GearType } from '../../../shared/models';
import { Gold, IconComponent } from '../../../shared/components';

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
    if (this.gameService.InProgress()) {
      return false;
    }

    return this.ItemType !== null && this.Item === null;
  }

  protected get EnoughGoldToBuy(): boolean {
    return this.currencyService.Gold() >= this.ItemPrice;
  }

  protected get CanSell(): boolean {
    if (this.gameService.InProgress()) {
      return false;
    }

    return this.Item !== null;
  }

  protected get CanUpgrade(): boolean {
    if (this.gameService.InProgress()) {
      return false;
    }

    return this.Item !== null && this.Item.CanUpgrade;
  }

  protected get EnoughGoldToUpgrade(): boolean {
    return this.currencyService.Gold() >= this.UpgradeCost;
  }

  protected get ItemPrice(): number {
    if (this.ItemType === null) {
      return 0;
    }
    return this.itemPriceService.GetBuyPrice(this.ItemType);
  }

  protected get SellValue(): number {
    if (this.Item === null) {
      return 0;
    }
    return this.Item.SellValue;
  }

  protected get UpgradeCost(): number {
    if (this.Item === null) {
      return 0;
    }
    return this.itemPriceService.GetGearUpgradeCost(this.Item);
  }

  constructor(
    private gameService: GameService,
    private currencyService: CurrencyService,
    private itemPriceService: ItemPriceService,
    private vendorService: VendorService,
    private enchantingService: EnchantingService
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
