import { AFFIX_DEFINITIONS, ITEM_VARIANTS, RUNE_DEFINITIONS } from '../../../core/constants';
import {
  AffixDefinition,
  AffixTier,
  Item,
  ItemRarity,
  ItemSlot,
  ItemVariantDefinition,
  Rune,
  RuneDefinition,
  RuneQuality
} from '../../../core/models';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ClampAffixTier, GetItemRarityRule } from '../../../core/systems/items';
import {
  CraftingService,
  GearLoadoutService,
  GoldCostProvider,
  GoldService,
  InventoryService
} from '../../../core/services';
import { Inventory, TabDefinition, TabStrip } from '../../../shared/components';

import { Crafting } from './crafting/crafting';
import { Enchanting } from './enchanting/enchanting';

@Component({
  selector: 'app-crafting-area',
  imports: [TabStrip, Crafting, Enchanting, Inventory],
  templateUrl: './crafting-area.html',
  styleUrl: './crafting-area.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CraftingArea {
  private readonly crafting = inject(CraftingService);
  public readonly cost = inject(GoldCostProvider);
  private readonly inventory = inject(InventoryService);
  private readonly gear = inject(GearLoadoutService);
  private readonly gold = inject(GoldService);

  protected get Tabs(): TabDefinition[] {
    return [
      { id: 'crafting', label: 'CRAFTING', disabled: false },
      { id: 'enchanting', label: 'ENCHANTING', disabled: false },
      { id: 'dismantling', label: 'DISMANTLING', disabled: false }
    ];
  }

  protected SelectedTab = signal<TabDefinition['id']>('crafting');

  protected onTabSelected(tabId: TabDefinition['id']): void {
    this.SelectedTab.set(tabId);
  }

  // UI State
  public readonly Slots = ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Boots'] as ItemSlot[];
  public readonly Rarities = ['Common', 'Magic', 'Rare', 'Epic', 'Legendary'] as ItemRarity[];

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
  public readonly GoldBalance = this.gold.Balance;
  public readonly InventoryItems = this.inventory.Items;
  public readonly InventoryRunes = this.inventory.Runes;
  public readonly EquippedItems = this.gear.EquippedItems;

  public readonly VariantsForSlot = computed<ItemVariantDefinition[]>(() =>
    ITEM_VARIANTS.filter((v) => v.Slot === this.SelectedSlot())
  );

  public readonly SelectedVariant = computed<ItemVariantDefinition | null>(() => {
    const id = this.SelectedVariantId();
    const list = this.VariantsForSlot();
    return id ? (list.find((v) => v.Id === id) ?? list[0] ?? null) : (list[0] ?? null);
  });

  public readonly CraftCost = computed<number>(() => {
    const variant = this.SelectedVariant();
    if (!variant) return 0;
    return this.cost.GetCraftItemCost(variant, this.SelectedRarity());
  });

  public readonly SelectedItemRules = computed(() => {
    const sel = this.SelectedItem();
    if (!sel) return null;
    return GetItemRarityRule(sel.item.Rarity);
  });

  public readonly AllowedAffixDefinitions = computed<AffixDefinition[]>(() => {
    const sel = this.SelectedItem();
    if (!sel) return [];
    return AFFIX_DEFINITIONS.filter((d) => d.AllowedSlots.includes(sel.item.Slot));
  });

  public readonly EligibleRunesFromInventory = computed<
    {
      rune: Rune;
      index: number;
      definition: RuneDefinition | undefined;
    }[]
  >(() => {
    const sel = this.SelectedItem();
    if (!sel) return [];
    const rules = GetItemRarityRule(sel.item.Rarity);
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

  public Craft(): void {
    const variant = this.SelectedVariant();
    if (!variant) return;
    const rarity = this.SelectedRarity();
    const result = this.crafting.CraftNewItem(variant, rarity, this.cost);
    if (!result.Success) return;
    this.inventory.Add(result.Item);
  }

  public EquipSelected(item: Item): void {
    if (!item) return;
    if (!this.gear.CanEquip(item)) return;
    const previous = this.gear.Equip(item);
    // If we equipped from inventory, remove that instance from inventory
    this.inventory.RemoveItem(item);
    // Put previously equipped back to inventory if any
    if (previous) this.inventory.Add(previous);
    // Refresh selection to the newly equipped item
    this.SelectedItem.set({ item, source: 'Equipped' });
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
