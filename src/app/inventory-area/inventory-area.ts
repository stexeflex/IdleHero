import { Component, ElementRef, HostListener, inject } from '@angular/core';
import {
  CurrencyService,
  InventoryService,
  ItemPriceService,
  SelectedGearService,
  VendorService
} from '../../shared/services';
import { Gear, GearType } from '../../shared/models';
import { Gold, IconComponent, PanelHeader, Separator } from '../../shared/components';

import { Enchanting } from './enchanting/enchanting';
import { GearSlots } from './gear-slots/gear-slots';

@Component({
  selector: 'app-inventory-area',
  imports: [GearSlots, Gold, Enchanting, Separator, PanelHeader, IconComponent],
  templateUrl: './inventory-area.html',
  styleUrl: './inventory-area.scss'
})
export class InventoryArea {
  private elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.selectedGearService.DeselectGear();
    }
  }

  protected get GoldAmount(): number {
    return this.currencyService.Gold();
  }

  protected get CanBuy(): boolean {
    return this.SelectedGearSlot !== null && this.SelectedGear === null;
  }

  protected get EnoughGoldToBuy(): boolean {
    return this.currencyService.Gold() >= this.ItemPrice;
  }

  protected get CanSell(): boolean {
    return this.SelectedGear !== null;
  }

  protected get CanEnchant(): boolean {
    return this.SelectedGear !== null;
  }

  protected get ItemPrice(): number {
    if (this.SelectedGearSlot === null) {
      return 0;
    }
    return this.itemPriceService.GetBuyPrice(this.SelectedGearSlot);
  }

  protected get SellValue(): number {
    if (this.SelectedGear === null) {
      return 0;
    }
    return this.SelectedGear.SellValue;
  }

  private get SelectedGearSlot(): GearType | null {
    return this.selectedGearService.Type();
  }

  protected get SelectedGear(): Gear | null {
    return this.selectedGearService.Selected();
  }

  constructor(
    protected selectedGearService: SelectedGearService,
    private currencyService: CurrencyService,
    private inventoryService: InventoryService,
    private itemPriceService: ItemPriceService,
    private vendorService: VendorService
  ) {}

  protected OnGearSlotSelected(event: MouseEvent, slot: GearType) {
    event.stopPropagation();
    this.SelectGear(slot);
  }

  private SelectGear(slot: GearType) {
    const selected: Gear | null = this.inventoryService.GetGearForSlot(slot);
    this.selectedGearService.SetSelectedGear(selected);
    this.selectedGearService.SetSelectedGearType(slot);
  }

  protected BuyItem(event: MouseEvent) {
    event.stopPropagation();

    if (this.SelectedGearSlot === null) {
      return;
    }

    this.vendorService.BuyItem(this.SelectedGearSlot);
    this.SelectGear(this.SelectedGearSlot);
  }

  protected SellItem(event: MouseEvent) {
    event.stopPropagation();

    if (this.SelectedGearSlot === null) {
      return;
    }

    this.vendorService.SellItem(this.SelectedGearSlot);
    this.selectedGearService.DeselectGear();
  }
}
