import { Rune } from './rune';

export interface RuneInventoryState {
  /** Mapping of rune definition id to equipped rune or null if slot is empty. */
  Runes: Record<string, Rune | null>;
}

/**
 * Creates an empty rune inventory state with one slot per rune definition id.
 * @param runeDefinitionIds all supported rune definition ids
 * @returns initialized rune inventory state
 */
export function CreateEmptyRuneInventoryState(runeDefinitionIds: string[]): RuneInventoryState {
  const slotsByDefinitionId = runeDefinitionIds.reduce<Record<string, Rune | null>>(
    (accumulator, runeDefinitionId) => {
      accumulator[runeDefinitionId] = null;
      return accumulator;
    },
    {}
  );

  return {
    Runes: slotsByDefinitionId
  };
}

/**
 * Normalizes rune inventory slots against current rune definition ids.
 * Unknown ids are dropped, missing ids are added as empty slots.
 * @param state source state
 * @param runeDefinitionIds all supported rune definition ids
 * @returns normalized rune inventory state
 */
export function NormalizeRuneInventoryState(
  state: RuneInventoryState,
  runeDefinitionIds: string[]
): RuneInventoryState {
  const normalizedState = CreateEmptyRuneInventoryState(runeDefinitionIds);

  for (const runeDefinitionId of runeDefinitionIds) {
    normalizedState.Runes[runeDefinitionId] = state.Runes[runeDefinitionId] ?? null;
  }

  return normalizedState;
}
