import { Injectable, computed, signal } from '@angular/core';

import { DungeonRoomKey } from '../models';

@Injectable({ providedIn: 'root' })
export class DungeonKeyService {
  private readonly KeysState = signal<Set<DungeonRoomKey>>(new Set<DungeonRoomKey>());

  public readonly Keys = computed<DungeonRoomKey[]>(() => Array.from(this.KeysState()));

  /**
   * Grants a key to the player.
   * @param key The dungeon key to add.
   * @returns True if the key was added; false if already owned.
   */
  public AddKey(key: DungeonRoomKey): boolean {
    if (!key) return false;

    let added = false;

    this.KeysState.update((set) => {
      const next = new Set(set);

      if (!next.has(key)) {
        next.add(key);
        added = true;
      }

      return next;
    });

    return added;
  }

  /**
   * Checks if the player owns a specific key.
   * @param key The dungeon key to check.
   * @returns True if owned; false otherwise.
   */
  public HasKey(key: DungeonRoomKey): boolean {
    if (!key) return false;

    return this.KeysState().has(key);
  }

  /**
   * Removes a key from the player.
   * @param key The dungeon key to remove.
   * @returns True if removed; false otherwise.
   */
  public RemoveKey(key: DungeonRoomKey): boolean {
    if (!key) return false;

    let removed = false;

    this.KeysState.update((set) => {
      const next = new Set(set);

      if (next.delete(key)) {
        removed = true;
      }

      return next;
    });

    return removed;
  }

  /**
   * Clears all dungeon keys.
   */
  public Clear(): void {
    this.KeysState.set(new Set<DungeonRoomKey>());
  }
}
