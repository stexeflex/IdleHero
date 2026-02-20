import {
  CreateEmptyRuneInventoryState,
  NormalizeRuneInventoryState,
  Rune,
  RuneInventoryState
} from '../models';
import { GetRuneDefinitions, GetRuneValue, QualityIndex } from '../systems/runes';
import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RuneService {
  private readonly RuneDefinitionIds = GetRuneDefinitions().map(
    (runeDefinition) => runeDefinition.Id
  );
  private readonly State = signal<RuneInventoryState>(
    CreateEmptyRuneInventoryState(this.RuneDefinitionIds)
  );

  public readonly SlotsById = computed<Record<string, Rune | null>>(
    () => this.State().SlotsByDefinitionId
  );

  public readonly Runes = computed<Rune[]>(() => {
    return Object.values(this.SlotsById()).filter((rune): rune is Rune => rune != null);
  });

  /**
   * Returns the current rune inventory state snapshot.
   * @returns rune inventory state
   */
  public GetState(): RuneInventoryState {
    const currentState = this.State();
    return {
      SlotsByDefinitionId: { ...currentState.SlotsByDefinitionId }
    };
  }

  /**
   * Replaces rune inventory state and normalizes slots against known rune definitions.
   * @param state state to set
   */
  public SetState(state: RuneInventoryState): void {
    if (!state?.SlotsByDefinitionId) {
      this.Clear();
      return;
    }

    this.State.set(NormalizeRuneInventoryState(state, this.RuneDefinitionIds));
  }

  /**
   * Returns the current best rune for a definition id.
   * @param runeDefinitionId rune definition id
   * @returns stored rune or null
   */
  public GetRune(runeDefinitionId: string): Rune | null {
    if (!this.IsKnownRuneDefinition(runeDefinitionId)) return null;
    return this.State().SlotsByDefinitionId[runeDefinitionId] ?? null;
  }

  /**
   * Checks whether a rune exists for the provided definition id.
   * @param runeDefinitionId rune definition id
   * @returns true if a rune exists in that slot
   */
  public HasRune(runeDefinitionId: string): boolean {
    return this.GetRune(runeDefinitionId) != null;
  }

  /**
   * Adds a rune to its slot, or upgrades the existing rune if the new one is better.
   * "Better" means higher quality; for same quality it means higher rolled value.
   * @param rune dropped rune instance
   * @returns true if state changed; false if rune was ignored
   */
  public AddOrUpgradeRune(rune: Rune): boolean {
    if (!rune) return false;

    const runeDefinitionId = rune.DefinitionId;
    if (!this.IsKnownRuneDefinition(runeDefinitionId)) return false;

    const currentlyStoredRune = this.State().SlotsByDefinitionId[runeDefinitionId];
    if (currentlyStoredRune == null) {
      this.SetRuneForDefinition(runeDefinitionId, rune);
      return true;
    }

    if (!this.IsBetterRune(rune, currentlyStoredRune)) return false;

    this.SetRuneForDefinition(runeDefinitionId, rune);
    return true;
  }

  /**
   * Removes all runes and keeps one empty slot for each rune definition.
   */
  public Clear(): void {
    this.State.set(CreateEmptyRuneInventoryState(this.RuneDefinitionIds));
  }

  private IsKnownRuneDefinition(runeDefinitionId: string): boolean {
    return this.RuneDefinitionIds.includes(runeDefinitionId);
  }

  public IsBetterRune(candidateRune: Rune, currentRune: Rune): boolean {
    const candidateQualityIndex = QualityIndex(candidateRune.Quality);
    const currentQualityIndex = QualityIndex(currentRune.Quality);

    if (candidateQualityIndex > currentQualityIndex) return true;
    if (candidateQualityIndex < currentQualityIndex) return false;

    const candidateValue = GetRuneValue(candidateRune);
    const currentValue = GetRuneValue(currentRune);
    return candidateValue > currentValue;
  }

  private SetRuneForDefinition(runeDefinitionId: string, rune: Rune): void {
    this.State.update((currentState) => ({
      SlotsByDefinitionId: {
        ...currentState.SlotsByDefinitionId,
        [runeDefinitionId]: rune
      }
    }));
  }
}
