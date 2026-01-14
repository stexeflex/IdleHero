import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { CurrencyService, InventoryService, SelectedGearService } from '../../shared/services';
import { Gear, GearType } from '../../shared/models';
import { Gold, IconComponent, PanelHeader, Separator } from '../../shared/components';

import { Enchanting } from './enchanting/enchanting';
import { GearActions } from './gear-actions/gear-actions';
import { GearSlots } from './gear-slots/gear-slots';
import { ItemDisplay } from './item-display/item-display';

@Component({
  selector: 'app-inventory-area',
  imports: [
    GearSlots,
    Gold,
    Enchanting,
    Separator,
    PanelHeader,
    IconComponent,
    ItemDisplay,
    GearActions
  ],
  templateUrl: './inventory-area.html',
  styleUrl: './inventory-area.scss'
})
export class InventoryArea {
  private elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.DeselectGear();
    }
  }

  protected get GoldAmount(): number {
    return this.currencyService.Gold();
  }

  protected get ShowItemDisplay(): boolean {
    return this.SelectedGear !== null || this.GearPreview !== null;
  }

  protected get ShowSlots(): boolean {
    return this.SelectedGear !== null && this.GearPreview === null;
  }

  protected get GearType(): string {
    return this.SelectedGear?.Type?.toUpperCase() ?? this.GearPreview?.Type?.toUpperCase() ?? '';
  }

  protected get SelectedGearSlot(): GearType | null {
    return this.selectedGearService.Type();
  }

  protected get SelectedGear(): Gear | null {
    return this.selectedGearService.Selected();
  }

  protected GearPreview: Gear | null = null;

  constructor(
    private selectedGearService: SelectedGearService,
    private currencyService: CurrencyService,
    private inventoryService: InventoryService
  ) {}

  protected OnGearSlotSelected(event: MouseEvent, slot: GearType) {
    event.stopPropagation();
    this.SelectGear(slot);
  }

  protected OnItemBought(slot: GearType) {
    this.SelectGear(slot);
  }

  protected OnItemSold() {
    this.DeselectGear();
  }

  protected DeselectGear() {
    this.selectedGearService.DeselectGear();
    this.GearPreview = null;
  }

  private SelectGear(slot: GearType) {
    const selected: Gear | null = this.inventoryService.GetGearForSlot(slot);

    if (selected === null) {
      this.GearPreview = Gear.Create(slot);
    } else {
      this.GearPreview = null;
    }

    this.selectedGearService.SetSelectedGear(selected);
    this.selectedGearService.SetSelectedGearType(slot);
  }
}
