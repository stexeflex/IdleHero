import { CreateEmptyLoadout, GearLoadout } from '../models/items/gear-loadout';
import { Injectable, computed, signal } from '@angular/core';
import { Item, ItemSlot, StatSource } from '../models';

import { MapItemToStatSources } from '../systems/stats/statsource.utils';

@Injectable({ providedIn: 'root' })
export class GearLoadoutService {
  private readonly equipped = signal<GearLoadout>(CreateEmptyLoadout());

  // All equipped items as array
  public readonly EquippedItems = computed<Item[]>(() => {
    return Object.values(this.equipped()).filter((i): i is Item => !!i);
  });

  // Stat sources aggregated from equipped items
  public readonly StatSources = computed<StatSource[]>(() => {
    return this.EquippedItems().flatMap((i) => MapItemToStatSources(i));
  });

  public SetStarterWeapon(weapon: Item): void {
    this.Equip(weapon);
  }

  public GetState(): GearLoadout {
    return { ...this.equipped() };
  }

  public SetState(loadout: GearLoadout): void {
    this.equipped.set({ ...loadout });
  }

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
   * Checks if an item is currently equipped in the specified slot
   * @param slot the item slot
   * @returns true if an item is equipped, false otherwise
   */
  public IsEquipped(slot: ItemSlot): boolean {
    return this.equipped()[slot] != null;
  }

  /**
   * Clears all equipped items
   */
  public Clear(): void {
    this.equipped.set(CreateEmptyLoadout());
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
