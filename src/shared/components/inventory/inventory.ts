import { Component, computed, inject, input, output, signal } from '@angular/core';
import {
  GearLoadoutService,
  InventoryService,
  ItemManagementService
} from '../../../core/services';

import { IconComponent } from '../icon/icon.component';
import { Item } from '../../../core/models';
import { ListItem } from './list-item/list-item';

interface SelectedItemContext {
  itemId: string;
  source: 'Inventory' | 'Equipped';
}

@Component({
  selector: 'app-inventory',
  imports: [ListItem, IconComponent],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss'
})
export class Inventory {
  public readonly ShowEquipped = input.required<boolean>();
  public readonly ItemSelected = output<SelectedItemContext>();

  // Services
  private readonly loadout = inject(GearLoadoutService);
  private readonly inventory = inject(InventoryService);
  private readonly itemManagement = inject(ItemManagementService);

  // UI State
  protected readonly EquippedItems = this.loadout.EquippedItems;
  protected readonly InventoryItems = this.inventory.Items;
  protected readonly SelectedItemContext = signal<SelectedItemContext | null>(null);
  protected readonly SelectedItem = computed<Item | null>(() => {
    const sel = this.SelectedItemContext();
    if (!sel) return null;
    if (sel.source === 'Inventory') {
      return this.inventory.Items().find((i) => i.Id === sel.itemId) || null;
    } else {
      return this.loadout.EquippedItems().find((i) => i.Id === sel.itemId) || null;
    }
  });

  protected SelectItemFromInventory(item: Item): void {
    event?.stopPropagation();
    this.SelectedItemContext.set({ itemId: item.Id, source: 'Inventory' });
    this.ItemSelected.emit({ itemId: item.Id, source: 'Inventory' });
  }

  protected SelectItemFromEquipped(item: Item): void {
    event?.stopPropagation();
    this.SelectedItemContext.set({ itemId: item.Id, source: 'Equipped' });
    this.ItemSelected.emit({ itemId: item.Id, source: 'Equipped' });
  }

  protected DeselectGear() {
    const current = this.SelectedItemContext()!;
    this.SelectedItemContext.set(null);
    this.ItemSelected.emit({ itemId: '', source: current.source });
  }

  protected EquipSelected(event: Event, item: Item): void {
    event?.stopPropagation();
    if (!item) return;
    if (this.itemManagement.EquipItem(item.Id)) {
      // Refresh selection to the newly equipped item
      this.SelectItemFromEquipped(item);
    }
  }

  protected UnequipSelected(event: Event, item: Item): void {
    event?.stopPropagation();
    if (!item) return;
    if (this.itemManagement.UnequipItem(item.Id)) {
      this.SelectItemFromInventory(item);
    }
  }
}
