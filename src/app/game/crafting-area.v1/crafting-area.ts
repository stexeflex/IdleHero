import { Component, inject } from '@angular/core';
import { Gear, GearType } from '../../../shared/models';
import { IconComponent, Separator } from '../../../shared/components';
import { InventoryService, SelectedGearService } from '../../../shared/services';

import { Enchanting } from './enchanting/enchanting';
import { GearActions } from './gear-actions/gear-actions';
import { ItemDisplay } from './item-display/item-display';

@Component({
  selector: 'app-crafting-area.v1',
  imports: [Enchanting, Separator, IconComponent, ItemDisplay, GearActions],
  templateUrl: './crafting-area.html',
  styleUrl: './crafting-area.scss'
})
export class CraftingAreaV1 {
  private selectedGearService = inject(SelectedGearService);
  private inventoryService = inject(InventoryService);

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

  protected OnItemBought(slot: GearType) {
    this.SelectGear(slot);
  }

  protected OnItemSold() {
    this.DeselectGear();
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

  protected DeselectGear() {
    this.selectedGearService.DeselectGear();
    this.GearPreview = null;
  }
}
