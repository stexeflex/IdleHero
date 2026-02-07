import { Injectable, inject } from '@angular/core';

import { GearLoadoutService } from './gear-loadout.service';
import { InventoryService } from './inventory.service';
import { Item } from '../models';

@Injectable({ providedIn: 'root' })
export class ItemManagementService {
  private readonly Loadout = inject(GearLoadoutService);
  private readonly Inventory = inject(InventoryService);

  public EquipItem(itemId: string): boolean {
    if (!itemId) return false;
    const item = this.Inventory.Items().find((i) => i.Id === itemId);
    if (!item) return false;
    if (!this.Loadout.CanEquip(item)) return false;

    const previous = this.Loadout.Equip(item);
    // If we equipped from inventory, remove that instance from inventory
    this.Inventory.RemoveItem(item);
    // Put previously equipped back to inventory if any
    if (previous) this.Inventory.Add(previous);

    return true;
  }

  public UnequipItem(itemId: string): boolean {
    if (!itemId) return false;
    const item = this.Loadout.EquippedItems().find((i) => i.Id === itemId);
    if (!item) return false;

    const unequipped = this.Loadout.Unequip(item.Slot);
    // If an item was unequipped, add it back to inventory
    if (unequipped) this.Inventory.Add(unequipped);
    return true;
  }

  public DismantleItem(itemId: string): boolean {
    if (!itemId) return false;
    const item = this.Inventory.Items().find((i) => i.Id === itemId);
    if (!item) return false;
    this.Inventory.RemoveItem(item);
    return true;
  }
}
