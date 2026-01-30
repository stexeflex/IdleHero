import { AFFIX_DEFINITIONS, RUNE_DEFINITIONS } from '../../../../core/constants';
import {
  AffixDefinition,
  AffixTier,
  Item,
  ItemRarity,
  ItemSlot,
  Rune,
  RuneDefinition,
  RuneQuality
} from '../../../../core/models';
import { ClampAffixTier, GetItemRarity, GetItemRarityRule } from '../../../../core/systems/items';
import { Component, computed, inject, signal } from '@angular/core';
import {
  CraftingService,
  GearLoadoutService,
  GoldCostProvider,
  InventoryService
} from '../../../../core/services';

@Component({
  selector: 'app-enchanting',
  imports: [],
  templateUrl: './enchanting.html',
  styleUrl: './enchanting.scss'
})
export class Enchanting {
  private readonly crafting = inject(CraftingService);
  public readonly cost = inject(GoldCostProvider);
  private readonly inventory = inject(InventoryService);
  private readonly gear = inject(GearLoadoutService);

  // UI State
  public readonly SelectedSlot = signal<ItemSlot>('Weapon');
  public readonly SelectedRarity = signal<ItemRarity>('Magic');
  public readonly SelectedVariantId = signal<string | null>(null);

  public readonly SelectedItem = signal<{ item: Item; source: 'Inventory' | 'Equipped' } | null>(
    null
  );
  public readonly SelectedAffixIndex = signal<number | null>(null);
  public readonly SelectedAffixDefinitionId = signal<string | null>(null);
  public readonly SelectedRuneIndex = signal<number | null>(null);

  // Data
  public readonly InventoryItems = this.inventory.Items;
  public readonly InventoryRunes = this.inventory.Runes;
  public readonly EquippedItems = this.gear.EquippedItems;

  public readonly AllowedAffixDefinitions = computed<AffixDefinition[]>(() => {
    const sel = this.SelectedItem();
    if (!sel) return [];
    return AFFIX_DEFINITIONS.filter((d) => d.AllowedSlots.includes(sel.item.Slot));
  });

  public readonly EligibleRunesFromInventory = computed<
    { rune: Rune; index: number; definition: RuneDefinition | undefined }[]
  >(() => {
    const sel = this.SelectedItem();
    if (!sel) return [];
    const rarity = GetItemRarity(sel.item.Level);
    const rules = GetItemRarityRule(rarity);
    return this.InventoryRunes()
      .map((r, i) => ({
        rune: r,
        index: i,
        definition: RUNE_DEFINITIONS.find((d) => d.Id === r.DefinitionId)
      }))
      .filter(
        (x) =>
          !!x.definition &&
          x.definition!.AllowedSlots.includes(sel.item.Slot) &&
          rules.AllowedRuneQualities.includes(x.rune.Quality)
      );
  });

  // Lookup helpers for template
  public AffixDefById(id: string | null | undefined): AffixDefinition | undefined {
    if (!id) return undefined;
    return AFFIX_DEFINITIONS.find((d) => d.Id === id);
  }

  public RuneDefById(id: string | null | undefined): RuneDefinition | undefined {
    if (!id) return undefined;
    return RUNE_DEFINITIONS.find((d) => d.Id === id);
  }

  public SelectSlot(slot: ItemSlot): void {
    this.SelectedSlot.set(slot);
    this.SelectedVariantId.set(null);
  }

  public SelectVariant(id: string): void {
    this.SelectedVariantId.set(id);
  }

  public SelectItemFromInventory(item: Item): void {
    this.SelectedItem.set({ item, source: 'Inventory' });
    this.SelectedAffixIndex.set(null);
  }

  public SelectItemFromEquipped(item: Item): void {
    this.SelectedItem.set({ item, source: 'Equipped' });
    this.SelectedAffixIndex.set(null);
  }

  public LevelUpSelected(): void {
    const sel = this.SelectedItem();
    if (!sel) return;
    const outcome = this.crafting.LevelUp(sel.item, this.cost);
    if (!outcome.Success) return;
    this.ApplyItemUpdate(sel, outcome.Item);
  }

  public AddAffixToSelected(defId: string, desiredTier?: AffixTier): void {
    const sel = this.SelectedItem();
    if (!sel) return;
    const def = AFFIX_DEFINITIONS.find((d) => d.Id === defId);
    if (!def) return;
    const tier = desiredTier ? ClampAffixTier(sel.item.Level, desiredTier) : undefined;
    const outcome = this.crafting.AddAffix(sel.item, def, tier, this.cost);
    if (!outcome.Success) return;
    this.ApplyItemUpdate(sel, outcome.Item);
  }

  public RerollAffixOnSelected(index: number): void {
    const sel = this.SelectedItem();
    if (!sel) return;
    const affix = sel.item.Affixes[index];
    if (!affix) return;
    const def = AFFIX_DEFINITIONS.find((d) => d.Id === affix.DefinitionId);
    if (!def) return;
    const outcome = this.crafting.RerollAffix(sel.item, index, def, this.cost);
    if (!outcome.Success) return;
    this.ApplyItemUpdate(sel, outcome.Item);
  }

  public EnchantAffixOnSelected(index: number): void {
    const sel = this.SelectedItem();
    if (!sel) return;
    const affix = sel.item.Affixes[index];
    if (!affix) return;
    const def = AFFIX_DEFINITIONS.find((d) => d.Id === affix.DefinitionId);
    if (!def) return;
    const outcome = this.crafting.EnchantAffix(sel.item, index, def, this.cost);
    if (!outcome.Success) return;
    this.ApplyItemUpdate(sel, outcome.Item);
  }

  public SocketRuneFromInventory(index: number): void {
    const sel = this.SelectedItem();
    if (!sel) return;
    const rune = this.inventory.GetRunes()[index];
    if (!rune) return;
    const def = RUNE_DEFINITIONS.find((d) => d.Id === rune.DefinitionId);
    if (!def) return;
    const outcome = this.crafting.SocketRune(sel.item, def, rune.Quality as RuneQuality, this.cost);
    if (!outcome.Success) return;
    // Remove used rune from inventory
    this.inventory.RemoveRune(rune);
    this.ApplyItemUpdate(sel, outcome.Item);
  }

  public UnsocketRuneFromSelected(): void {
    const sel = this.SelectedItem();
    if (!sel || !sel.item.Rune) return;
    const outcome = this.crafting.UnsocketRune(sel.item, this.cost);
    if (!outcome.Success) return;
    // Note: current behavior does not return rune to inventory
    this.ApplyItemUpdate(sel, outcome.Item);
  }

  private ApplyItemUpdate(sel: { item: Item; source: 'Inventory' | 'Equipped' }, next: Item): void {
    if (sel.source === 'Inventory') {
      this.inventory.RemoveItem(sel.item);
      this.inventory.Add(next);
      this.SelectedItem.set({ item: next, source: 'Inventory' });
    } else {
      // Equipped: replace in loadout
      this.gear.Equip(next);
      this.SelectedItem.set({ item: next, source: 'Equipped' });
    }
  }
}
