import { Component, computed, inject, signal } from '@angular/core';
import {
  CraftingService,
  GoldCostProvider,
  GoldService,
  InventoryService,
  StatisticsService
} from '../../../../core/services';
import {
  CreaturesIconName,
  GearSlotIconName,
  Gold,
  IconComponent,
  ItemVariantPreview
} from '../../../../shared/components';
import { GetDungeonById, ICONS_CONFIG, ITEM_VARIANTS } from '../../../../core/constants';
import {
  ItemSlot,
  ItemTier,
  ItemVariantDefinition,
  OperationResult
} from '../../../../core/models';

import { MinRarityForTier } from '../../../../core/systems/items';

@Component({
  selector: 'app-crafting',
  imports: [Gold, IconComponent, ItemVariantPreview],
  templateUrl: './crafting.html',
  styleUrl: './crafting.scss'
})
export class Crafting {
  private readonly crafting = inject(CraftingService);
  private readonly cost = inject(GoldCostProvider);
  private readonly gold = inject(GoldService);
  private readonly inventory = inject(InventoryService);
  private readonly statistics = inject(StatisticsService);

  // UI State
  public readonly Slots: ItemSlot[] = ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Feet'];
  public readonly Tiers: ItemTier[] = ['I', 'II', 'III'];
  public readonly SlotIcons: Record<ItemSlot, GearSlotIconName> = {
    Weapon: ICONS_CONFIG['DEFAULT_WEAPON'],
    OffHand: ICONS_CONFIG['DEFAULT_OFFHAND'],
    Head: ICONS_CONFIG['DEFAULT_HEAD'],
    Chest: ICONS_CONFIG['DEFAULT_CHEST'],
    Legs: ICONS_CONFIG['DEFAULT_LEGS'],
    Feet: ICONS_CONFIG['DEFAULT_FEET']
  };

  public readonly SelectedSlot = signal<ItemSlot>('Weapon');
  public readonly SelectedTier = signal<ItemTier>('I');
  public readonly SelectedVariantId = signal<string | null>(null);
  public readonly SelectedVariant = computed<ItemVariantDefinition | null>(() => {
    const id = this.SelectedVariantId();
    const list: ItemVariantDefinition[] = this.VariantsForSlot();
    return id ? (list.find((v) => v.Id === id) ?? null) : null;
  });

  public readonly TierUnlockRequirements = computed<Record<ItemTier, TierCraftRequirement | null>>(
    () => {
      const dungeonStatistics = this.statistics.DungeonStatistics().Dungeon;
      return {
        I: null,
        II: this.CreateTierRequirement('II', 'D1', dungeonStatistics['D1'] ?? 0),
        III: this.CreateTierRequirement('III', 'D2', dungeonStatistics['D2'] ?? 0)
      };
    }
  );

  public readonly SelectedTierRequirement = computed<TierCraftRequirement | null>(
    () => this.TierUnlockRequirements()[this.SelectedTier()]
  );

  public readonly CanCraftSelectedTier = computed<boolean>(() => {
    const requirement = this.SelectedTierRequirement();
    return requirement ? requirement.IsUnlocked : true;
  });

  // Data
  public readonly GoldBalance = this.gold.Balance;
  public readonly VariantsForSlot = computed<ItemVariantDefinition[]>(() =>
    ITEM_VARIANTS.filter((v) => v.Slot === this.SelectedSlot() && v.Tier === this.SelectedTier())
  );
  public readonly CraftCost = computed<number>(() => {
    const variant: ItemVariantDefinition | null = this.SelectedVariant();
    if (!variant) return 0;
    return this.cost.GetCraftItemCost(variant, MinRarityForTier(variant.Tier));
  });

  // Actions
  public SelectSlot(slot: ItemSlot): void {
    this.SelectedSlot.set(slot);
    this.SelectedVariantId.set(null);
  }

  public SelectTier(tier: ItemTier): void {
    this.SelectedTier.set(tier);
    this.SelectedVariantId.set(null);
  }

  public IsTierUnlocked(tier: ItemTier): boolean {
    const requirement = this.TierUnlockRequirements()[tier];
    return requirement ? requirement.IsUnlocked : true;
  }

  public SelectVariant(id: string): void {
    this.SelectedVariantId.set(id);
  }

  public Craft(): void {
    const variant: ItemVariantDefinition | null = this.SelectedVariant();
    if (!variant || !this.CanCraftSelectedTier()) return;

    const result: OperationResult = this.crafting.CraftNewItem(variant, this.cost);
    if (!result.Success) return;

    this.inventory.Add(result.Item);
  }

  private CreateTierRequirement(
    tier: Extract<ItemTier, 'II' | 'III'>,
    dungeonId: 'D1' | 'D2',
    clearedStage: number
  ): TierCraftRequirement {
    const dungeon = GetDungeonById(dungeonId);
    const requiredStage = dungeon?.StagesMax ?? 0;

    return {
      Tier: tier,
      DungeonId: dungeonId,
      DungeonIcon: dungeon?.Icon ?? 'slime',
      RequiredStage: requiredStage,
      ClearedStage: Math.min(clearedStage, requiredStage),
      IsUnlocked: clearedStage >= requiredStage
    };
  }
}

interface TierCraftRequirement {
  Tier: Extract<ItemTier, 'II' | 'III'>;
  DungeonId: 'D1' | 'D2';
  DungeonIcon: CreaturesIconName;
  RequiredStage: number;
  ClearedStage: number;
  IsUnlocked: boolean;
}
