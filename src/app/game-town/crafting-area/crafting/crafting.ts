import { Component, LOCALE_ID, computed, inject, signal } from '@angular/core';
import {
  CraftingService,
  GoldCostProvider,
  GoldService,
  InventoryService
} from '../../../../core/services';
import { GearSlotIconName, Gold, IconComponent } from '../../../../shared/components';
import { ICONS_CONFIG, ITEM_VARIANTS } from '../../../../core/constants';
import {
  ItemRarity,
  ItemSlot,
  ItemTier,
  ItemVariantDefinition,
  LabelToString,
  OperationResult
} from '../../../../core/models';

import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-crafting',
  imports: [Gold, IconComponent],
  templateUrl: './crafting.html',
  styleUrl: './crafting.scss'
})
export class Crafting {
  private static readonly CRAFT_DEFAULT_RARITY: ItemRarity = 'Common';

  private readonly locale = inject(LOCALE_ID);
  private readonly crafting = inject(CraftingService);
  private readonly cost = inject(GoldCostProvider);
  private readonly gold = inject(GoldService);
  private readonly inventory = inject(InventoryService);

  private readonly decimalPipe: DecimalPipe;

  constructor() {
    this.decimalPipe = new DecimalPipe(this.locale);
  }

  // UI State
  public readonly Slots: ItemSlot[] = ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Boots'];
  public readonly Tiers: ItemTier[] = ['I', 'II', 'III'];
  public readonly SlotIcons: Record<ItemSlot, GearSlotIconName> = {
    Weapon: ICONS_CONFIG['DEFAULT_WEAPON'],
    OffHand: ICONS_CONFIG['DEFAULT_OFFHAND'],
    Head: ICONS_CONFIG['DEFAULT_HEAD'],
    Chest: ICONS_CONFIG['DEFAULT_CHEST'],
    Legs: ICONS_CONFIG['DEFAULT_LEGS'],
    Boots: ICONS_CONFIG['DEFAULT_BOOTS']
  };

  public readonly SelectedSlot = signal<ItemSlot>('Weapon');
  public readonly SelectedTier = signal<ItemTier>('I');
  public readonly SelectedVariantId = signal<string | null>(null);
  public readonly SelectedVariant = computed<ItemVariantDefinition | null>(() => {
    const id = this.SelectedVariantId();
    const list: ItemVariantDefinition[] = this.VariantsForSlot();
    return id ? (list.find((v) => v.Id === id) ?? list[0] ?? null) : (list[0] ?? null);
  });

  // Data
  public readonly GoldBalance = this.gold.Balance;
  public readonly VariantsForSlot = computed<ItemVariantDefinition[]>(() =>
    ITEM_VARIANTS.filter((v) => v.Slot === this.SelectedSlot() && v.Tier === this.SelectedTier())
  );
  public readonly CraftCost = computed<number>(() => {
    const variant: ItemVariantDefinition | null = this.SelectedVariant();
    if (!variant) return 0;
    return this.cost.GetCraftItemCost(variant, Crafting.CRAFT_DEFAULT_RARITY);
  });

  public SelectSlot(slot: ItemSlot): void {
    this.SelectedSlot.set(slot);
    this.SelectedVariantId.set(null);
  }

  public SelectTier(tier: ItemTier): void {
    this.SelectedTier.set(tier);
  }

  public SelectVariant(id: string): void {
    this.SelectedVariantId.set(id);
  }

  public Craft(): void {
    const variant: ItemVariantDefinition | null = this.SelectedVariant();
    if (!variant) return;

    const result: OperationResult = this.crafting.CraftNewItem(
      variant,
      Crafting.CRAFT_DEFAULT_RARITY,
      this.cost
    );
    if (!result.Success) return;

    this.inventory.Add(result.Item);
  }

  // UI
  protected VariantLabel(variant: ItemVariantDefinition): string {
    const innateValue = variant.Innate.ValuesByLevel[1];
    const innateLabel = variant.Innate.ToLabel(innateValue);
    return LabelToString(innateLabel, this.decimalPipe);
  }
}
