import { Component, inject, input, output, signal } from '@angular/core';
import { GearLoadoutService, InventoryService } from '../../../core/services';

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
    if (!this.loadout.CanEquip(item)) return;

    const previous = this.loadout.Equip(item);
    // If we equipped from inventory, remove that instance from inventory
    this.inventory.RemoveItem(item);
    // Put previously equipped back to inventory if any
    if (previous) this.inventory.Add(previous);
    // Refresh selection to the newly equipped item
    this.SelectedItem.set({ item, source: 'Equipped' });
  }

  protected UnequipSelected(item: Item): void {
    if (!item) return;
    const unequipped = this.loadout.Unequip(item.Slot);
    if (!unequipped) return;
    this.inventory.Add(unequipped);
    this.SelectedItem.set({ item: unequipped, source: 'Inventory' });
  }
}
