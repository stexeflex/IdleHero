import { DungeonKeysState, DungeonRoomKey, InitialDungeonKeysState } from '../models';
import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DungeonKeyService {
  private readonly KeysState = signal<DungeonKeysState>(InitialDungeonKeysState());

  public readonly Keys = computed<DungeonRoomKey[]>(() => Array.from(this.KeysState().Keys));

  public GetState(): DungeonKeysState {
    return this.KeysState();
  }

  public SetState(state: DungeonKeysState): void {
    this.KeysState.set({ ...state });
  }

  /**
   * Grants a key to the player.
   * @param key The dungeon key to add.
   * @returns True if the key was added; false if already owned.
   */
  public AddKey(key: DungeonRoomKey): boolean {
    if (!key) return false;

    const currentKeys = this.KeysState();
    if (currentKeys.Keys.includes(key)) return false;

    this.KeysState.set({ ...currentKeys, Keys: [...currentKeys.Keys, key] });
    return true;
  }

  /**
   * Checks if the player owns a specific key.
   * @param key The dungeon key to check.
   * @returns True if owned; false otherwise.
   */
  public HasKey(key: DungeonRoomKey): boolean {
    if (!key) return false;

    return this.KeysState().Keys.includes(key);
  }
}
