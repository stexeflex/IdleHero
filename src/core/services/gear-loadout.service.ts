import { GearLoadout, createEmptyLoadout } from '../models/items/gear-loadout';
import { Injectable, computed, signal } from '@angular/core';

import { Item } from '../models/items/item';
import { ItemSlot } from '../models/items/item-slot.enum';
import { StatSource } from '../models';

@Injectable({ providedIn: 'root' })
export class GearLoadoutService {
  private readonly equipped = signal<GearLoadout>(createEmptyLoadout());

  // All equipped items as array
  public readonly EquippedItems = computed<Item[]>(() => {
    return Object.values(this.equipped()).filter((i): i is Item => !!i);
  });

  // Stat sources aggregated from equipped items
  public readonly StatSources = computed<StatSource[]>(() => {
    return this.EquippedItems().map((i) => i);
  });

  /**
   * Gets the item equipped in the specified slot
   * @param slot the item slot
   * @returns the item equipped in that slot, or null if none
   */
  public Get(slot: ItemSlot): Item | null {
    return this.equipped()[slot];
  }

  /**
   * Equips an item, replacing any existing item in that slot
   * @param item the item to equip
   * @returns the previously equipped item in that slot, or null if none
   */
  public Equip(item: Item): Item | null {
    const previous = this.equipped()[item.Slot] ?? null;
    this.equipped.update((eq) => ({ ...eq, [item.Slot]: item }));
    return previous;
  }

  /**
   * Unequips the item in the specified slot
   * @param slot the item slot
   * @returns the previously equipped item in that slot, or null if none
   */
  public Unequip(slot: ItemSlot): Item | null {
    const previous = this.equipped()[slot] ?? null;
    this.equipped.update((eq) => ({ ...eq, [slot]: null }));
    return previous;
  }

  /**
   * Checks if the specified item can be equipped (meets requirements)
   * @param item the item to check
   * @returns true if the item can be equipped, false otherwise
   */
  public CanEquip(item: Item): boolean {
    return true;
  }

  /**
   * Clears all equipped items
   */
  public Clear(): void {
    this.equipped.set(createEmptyLoadout());
  }

  /**
   * Replace entire loadout at once
   * @param loadout the new loadout to set
   */
  public SetLoadout(loadout: GearLoadout): void {
    this.equipped.set({ ...loadout });
  }

  /**
   * Snapshot current loadout
   * @returns the current gear loadout
   */
  public ToLoadout(): GearLoadout {
    return { ...this.equipped() };
  }
}
