import { InitialInventoryState, InventoryState } from '../models/items/inventory-state';
import { Injectable, computed, signal } from '@angular/core';
import { Item, Rune } from '../models';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly State = signal<InventoryState>(InitialInventoryState());

  public readonly Capacity = computed<number>(() => this.State().Capacity);

  public readonly Items = computed<Item[]>(() => this.State().Items);
  public readonly Runes = computed<Rune[]>(() => this.State().Runes);

  public readonly SlotsUsed = computed<number>(() => {
    const state = this.State();
    return state.Items.length + state.Runes.length;
  });
  public readonly SlotsFree = computed<number>(() =>
    Math.max(0, this.State().Capacity - this.SlotsUsed())
  );
  public readonly IsFull = computed<boolean>(() => this.SlotsFree() <= 0);

  /**
   * Sets the inventory capacity.
   * @param capacity The new capacity value; negative values clamp to 0.
   */
  public SetCapacity(capacity: number): void {
    if (!Number.isFinite(capacity)) return;
    const cap = Math.max(0, Math.floor(capacity));
    this.State.update((state) => ({
      ...state,
      Capacity: cap
    }));
  }

  /**
   * Adds a single item to the inventory if space is available.
   * @param item The item to add.
   * @returns True if the item was added; false if inventory is full.
   */
  public Add(item: Item): boolean {
    if (!item) return false;
    if (this.IsFull()) return false;

    this.State.update((state) => ({
      ...state,
      Items: [...state.Items, item]
    }));

    return true;
  }

  /**
   * Adds multiple items to the inventory; stops when full.
   * @param items The items to add.
   * @returns The number of items successfully added.
   */
  public AddMany(items: Item[]): number {
    if (!Array.isArray(items) || items.length === 0) return 0;

    let added = 0;

    this.State.update((state) => {
      const free = Math.max(0, state.Capacity - state.Items.length);
      const toAdd = items.slice(0, free);
      added = toAdd.length;

      return {
        ...state,
        Items: [...state.Items, ...toAdd]
      };
    });

    return added;
  }

  /**
   * Updates an existing item in the inventory by Id match.
   * @param updated The updated item.
   * @returns True if the item was found and updated; false otherwise.
   */
  public Update(updated: Item): boolean {
    if (!updated) return false;
    let found = false;

    this.State.update((state) => {
      const idx = state.Items.findIndex((i) => i.Id === updated.Id);
      if (idx < 0) return state;
      found = true;

      const nextItems = state.Items.slice();
      nextItems[idx] = updated;
      return {
        ...state,
        Items: nextItems
      };
    });

    return found;
  }

  /**
   * Removes the first item with the specified Id.
   * @param itemId The Id of the item to remove.
   * @returns The removed item, or null if not found.
   */
  public RemoveById(itemId: string): Item | null {
    if (typeof itemId !== 'string' || !itemId) return null;

    let removed: Item | null = null;

    this.State.update((state) => {
      const idx = state.Items.findIndex((i) => i.Id === itemId);

      if (idx < 0) return state;

      removed = state.Items[idx];
      const next = state.Items.slice();
      next.splice(idx, 1);

      return {
        ...state,
        Items: next
      };
    });
    return removed;
  }

  /**
   * Removes an item instance by Id match.
   * @param item The item to remove.
   * @returns True if an item was removed; false otherwise.
   */
  public RemoveItem(item: Item): boolean {
    if (!item) return false;
    const removedItem = this.RemoveById(item.Id);
    return !!removedItem;
  }

  /**
   * Checks if the inventory contains an item with the given Id.
   * @param itemId The item Id to check.
   * @returns True if found; false otherwise.
   */
  public HasItemId(itemId: string): boolean {
    if (typeof itemId !== 'string' || !itemId) return false;
    return this.State().Items.some((i) => i.Id === itemId);
  }

  /**
   * Clears all items from the inventory.
   */
  public Clear(): void {
    this.State.update((s) => ({ ...s, Items: [], Runes: [] }));
  }

  /**
   * Gets a snapshot of all items.
   * @returns A copy of the items array.
   */
  public GetItems(): Item[] {
    return [...this.State().Items];
  }

  /**
   * Adds a rune to the inventory if there is space.
   * @param rune The rune to add.
   * @returns True if added; false if full or invalid.
   */
  public AddRune(rune: Rune): boolean {
    if (!rune) return false;
    if (this.IsFull()) return false;
    this.State.update((state) => ({ ...state, Runes: [...state.Runes, rune] }));
    return true;
  }

  /**
   * Removes the first rune matching DefinitionId and Quality (and optionally RolledValue) from inventory.
   * @param rune The rune to remove.
   * @returns True if removed; false otherwise.
   */
  public RemoveRune(rune: Rune): boolean {
    if (!rune) return false;
    let removed = false;

    this.State.update((state) => {
      const idx = state.Runes.findIndex((r) => r.Id === rune.Id);

      if (idx < 0) return state;

      const nextRunes = state.Runes.slice();
      nextRunes.splice(idx, 1);
      removed = true;

      return { ...state, Runes: nextRunes };
    });

    return removed;
  }

  /**
   * Removes a rune by index.
   * @param index The index to remove.
   * @returns The removed rune or null.
   */
  public RemoveRuneAt(index: number): Rune | null {
    let removed: Rune | null = null;

    this.State.update((state) => {
      if (index < 0 || index >= state.Runes.length) return state;

      const nextRunes = state.Runes.slice();
      removed = nextRunes.splice(index, 1)[0] ?? null;

      return { ...state, Runes: nextRunes };
    });

    return removed;
  }

  /**
   * Snapshot of runes.
   * @returns A copy of the rune list.
   */
  public GetRunes(): Rune[] {
    return [...this.State().Runes];
  }
}
