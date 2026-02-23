import {
  AmuletQuality,
  AmuletState,
  CreateLockedAmuletState,
  CreateUnlockedAmuletState,
  Rune,
  StatSource
} from '../models';
import {
  GetAmuletSocketCost,
  GetAmuletUnlockCost,
  GetAmuletUnsocketCost,
  GetAmuletUpgradeCost,
  GetNextAmuletQuality,
  GetSlotAmountForQuality
} from '../systems/runes';
import { Injectable, computed, inject, signal } from '@angular/core';

import { GoldService } from './gold.service';
import { MapRuneToStatSources } from '../systems/stats';

@Injectable({ providedIn: 'root' })
export class AmuletService {
  private readonly GoldService = inject(GoldService);
  private readonly State = signal<AmuletState>(CreateLockedAmuletState());

  public readonly IsUnlocked = computed<boolean>(() => this.State().IsUnlocked);
  public readonly Quality = computed<AmuletQuality>(() => this.State().Quality);
  public readonly Slots = computed<Array<Rune | null>>(() => this.State().Slots);
  public readonly SlotAmount = computed<number>(() => this.Slots().length);
  public readonly SocketedRunes = computed<Rune[]>(() => {
    return this.Slots().filter((rune): rune is Rune => rune != null);
  });

  /**
   * Returns a snapshot of the current amulet state.
   * @returns current amulet state
   */
  public GetState(): AmuletState {
    const currentState = this.State();
    return {
      ...currentState,
      Slots: [...currentState.Slots]
    };
  }

  /**
   * Replaces the amulet state and normalizes slot length to quality rules.
   * @param state state to set
   */
  public SetState(state: AmuletState): void {
    if (!state?.IsUnlocked) {
      this.State.set(CreateLockedAmuletState());
      return;
    }

    const slotAmount = GetSlotAmountForQuality(state.Quality);
    this.State.set(CreateUnlockedAmuletState(state.Quality, slotAmount, state.Slots));
  }

  /**
   * The stat sources provided by socketed runes.
   */
  public readonly StatSources = computed<StatSource[]>(() => {
    return this.SocketedRunes().flatMap((rune) => MapRuneToStatSources(rune));
  });

  /**
   * Gets the gold cost for unlocking the amulet.
   * @returns unlock cost
   */
  public GetUnlockCost(): number {
    return GetAmuletUnlockCost();
  }

  /**
   * Gets the gold cost for one amulet quality upgrade.
   * @returns upgrade cost
   */
  public GetUpgradeCost(): number {
    return GetAmuletUpgradeCost(this.Quality());
  }

  /**
   * Gets the gold cost for socketing a rune.
   * @returns socket cost
   */
  public GetSocketCost(): number {
    return GetAmuletSocketCost(this.Quality());
  }

  /**
   * Gets the gold cost for unsocketing a rune.
   * @returns unsocket cost
   */
  public GetUnsocketCost(): number {
    return GetAmuletUnsocketCost(this.Quality());
  }

  /**
   * Checks whether the amulet can be unlocked.
   * @returns true when locked and enough gold is available
   */
  public CanUnlock(): boolean {
    return !this.IsUnlocked() && this.GoldService.CanAfford(this.GetUnlockCost());
  }

  /**
   * Unlocks the amulet as Common quality with one slot.
   * @returns true if unlocked successfully; otherwise false
   */
  public Unlock(): boolean {
    if (!this.CanUnlock()) return false;

    const didSpend = this.GoldService.Spend(this.GetUnlockCost());
    if (!didSpend) return false;

    const quality: AmuletQuality = 'Common';
    const slotAmount = GetSlotAmountForQuality(quality);
    this.State.set(CreateUnlockedAmuletState(quality, slotAmount));
    return true;
  }

  /**
   * Checks whether the amulet can be upgraded to the next quality.
   * @returns true when unlocked, not max quality, and enough gold is available
   */
  public CanUpgrade(): boolean {
    if (!this.IsUnlocked()) return false;
    if (GetNextAmuletQuality(this.Quality()) == null) return false;
    return this.GoldService.CanAfford(this.GetUpgradeCost());
  }

  /**
   * Upgrades amulet quality by one step and increases slot amount according to rules.
   * @returns true if upgraded successfully; otherwise false
   */
  public Upgrade(): boolean {
    if (!this.CanUpgrade()) return false;

    const nextQuality = GetNextAmuletQuality(this.Quality());
    if (nextQuality == null) return false;

    const didSpend = this.GoldService.Spend(this.GetUpgradeCost());
    if (!didSpend) return false;

    const currentState = this.State();
    const nextSlotAmount = GetSlotAmountForQuality(nextQuality);

    this.State.set(CreateUnlockedAmuletState(nextQuality, nextSlotAmount, currentState.Slots));
    return true;
  }

  /**
   * Returns the rune in a slot.
   * @param slotIndex zero-based slot index
   * @returns socketed rune or null
   */
  public GetRune(slotIndex: number): Rune | null {
    if (!this.IsValidSlotIndex(slotIndex)) return null;
    return this.State().Slots[slotIndex] ?? null;
  }

  /**
   * Returns the socketed rune with the provided definition id, or null if no such rune is socketed.
   * @param definitionId rune definition id to look for
   * @returns socketed rune with the provided definition id, or null if no such rune is socketed
   */
  public GetRuneByDefinitionId(definitionId: string): Rune | null {
    return this.SocketedRunes().find((rune) => rune.DefinitionId === definitionId) ?? null;
  }

  /**
   * Returns the index of the slot where a rune with the provided definition id is socketed, or null if no such rune is socketed.
   * @param definitionId rune definition id to look for
   * @returns zero-based index of the slot where a rune with the provided definition id is socketed, or null if no such rune is socketed
   */
  public GetRuneSlotIndex(definitionId: string): number | null {
    if (!this.HasRuneEquipped(definitionId)) return null;

    const slotIndex = this.SocketedRunes().findIndex(
      (slot) => slot != null && slot.DefinitionId === definitionId
    );
    return slotIndex !== -1 ? slotIndex : null;
  }

  /**
   * Checks whether a rune with the same definition id is already socketed.
   * @param definitionId rune definition id to check
   * @returns true if a socketed rune has the same definition id; otherwise false
   */
  public HasRuneEquipped(definitionId: string): boolean {
    return this.SocketedRunes().some((rune) => rune.DefinitionId === definitionId);
  }

  /**
   * Checks whether a rune can be socketed into the selected slot.
   * @param slotIndex zero-based slot index
   * @param rune rune to socket
   * @returns true when slot is valid, empty, and enough gold is available
   */
  public CanSocket(slotIndex: number, rune: Rune): boolean {
    if (!this.IsUnlocked()) return false;
    if (!rune) return false;
    if (!this.IsValidSlotIndex(slotIndex)) return false;

    const targetSlotRune = this.State().Slots[slotIndex];

    if (targetSlotRune == null) {
      // Slot is empty, check if the same rune is not already socketed
      if (this.HasRuneEquipped(rune.DefinitionId)) return false;
    } else {
      // Slot is occupied, check if the new rune has the same id as the currently socketed rune
      if (targetSlotRune.DefinitionId === rune.DefinitionId) return true;
    }

    return this.GoldService.CanAfford(this.GetSocketCost());
  }

  /**
   * Sockets a rune into the selected slot and spends socket cost.
   * @param slotIndex zero-based slot index
   * @param rune rune to socket
   * @returns true if socketing succeeded; otherwise false
   */
  public Socket(slotIndex: number, rune: Rune): boolean {
    if (!this.CanSocket(slotIndex, rune)) return false;

    const didSpend = this.GoldService.Spend(this.GetSocketCost());
    if (!didSpend) return false;

    this.State.update((currentState) => {
      const nextSlots = [...currentState.Slots];
      nextSlots[slotIndex] = rune;
      return {
        ...currentState,
        Slots: nextSlots
      };
    });

    return true;
  }

  /**
   * Checks whether a rune can be unsocketed from a slot.
   * @param slotIndex zero-based slot index
   * @returns true when slot is valid, occupied, and enough gold is available
   */
  public CanUnsocket(slotIndex: number): boolean {
    if (!this.IsUnlocked()) return false;
    if (!this.IsValidSlotIndex(slotIndex)) return false;
    if (this.State().Slots[slotIndex] == null) return false;
    return this.GoldService.CanAfford(this.GetUnsocketCost());
  }

  /**
   * Unsockets a rune from the selected slot and spends unsocket cost.
   * @param slotIndex zero-based slot index
   * @returns removed rune; null if operation failed
   */
  public Unsocket(slotIndex: number): Rune | null {
    if (!this.CanUnsocket(slotIndex)) return null;

    const didSpend = this.GoldService.Spend(this.GetUnsocketCost());
    if (!didSpend) return null;

    let removedRune: Rune | null = null;

    this.State.update((currentState) => {
      const nextSlots = [...currentState.Slots];
      removedRune = nextSlots[slotIndex] ?? null;
      nextSlots[slotIndex] = null;
      return {
        ...currentState,
        Slots: nextSlots
      };
    });

    return removedRune;
  }

  /**
   * Gets the index of the next free slot, or null if no free slot is available.
   * @returns zero-based index of next free slot; null if no free slot is available or amulet is locked
   */
  public GetNextFreeSlotIndex(): number | null {
    if (!this.IsUnlocked()) return null;
    const freeIndex = this.State().Slots.findIndex((slot) => slot == null);
    return freeIndex !== -1 ? freeIndex : null;
  }

  /**
   * Resets the amulet back to locked state.
   */
  public Clear(): void {
    this.State.set(CreateLockedAmuletState());
  }

  private IsValidSlotIndex(slotIndex: number): boolean {
    if (!Number.isInteger(slotIndex)) return false;
    const slotAmount = this.State().Slots.length;
    return slotIndex >= 0 && slotIndex < slotAmount;
  }
}
