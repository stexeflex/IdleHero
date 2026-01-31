import { Component, inject, input, output, signal } from '@angular/core';
import {
  GearLoadoutService,
  InventoryService,
  ItemManagementService
} from '../../../core/services';

import { IconComponent } from '../icon/icon.component';
import { Item } from '../../../core/models';
import { ListItem } from './list-item/list-item';

@Component({
  selector: 'app-inventory',
  imports: [ListItem, IconComponent],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss'
})
export class Inventory {
  public readonly ShowEquipped = input.required<boolean>();
  public readonly ItemSelected = output<{ item: Item; source: 'Inventory' | 'Equipped' }>();

  // Services
  private readonly loadout = inject(GearLoadoutService);
  private readonly inventory = inject(InventoryService);
  private readonly itemManagement = inject(ItemManagementService);

  // UI State
  protected readonly EquippedItems = this.loadout.EquippedItems;
  protected readonly InventoryItems = this.inventory.Items;
  protected readonly SelectedItem = signal<{ item: Item; source: 'Inventory' | 'Equipped' } | null>(
    null
  );

  protected SelectItemFromInventory(item: Item): void {
    this.SelectedItem.set({ item, source: 'Inventory' });
  }

  protected SelectItemFromEquipped(item: Item): void {
    this.SelectedItem.set({ item, source: 'Equipped' });
  }

  protected DeselectGear() {
    this.SelectedItem.set(null);
  }

  protected EquipSelected(item: Item): void {
    if (!item) return;
    if (this.itemManagement.EquipItem(item)) {
      // Refresh selection to the newly equipped item
      this.SelectedItem.set({ item, source: 'Equipped' });
    }
  }

  protected UnequipSelected(item: Item): void {
    if (!item) return;
    if (this.itemManagement.UnequipItem(item)) {
      this.SelectedItem.set({ item, source: 'Inventory' });
    }
  }
}
