import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  inject,
  signal
} from '@angular/core';
import {
  GearSlotIconName,
  IconComponent,
  ItemPreview,
  LoadingSpinner,
  Separator
} from '../../../shared/components';
import { GetItemRarity, GetItemVariant } from '../../../core/systems/items';
import { InventoryService, ItemManagementService } from '../../../core/services';
import { Item, ItemRarity, ItemSlot, ItemTier, ItemVariantDefinition } from '../../../core/models';

import { ICONS_CONFIG } from '../../../core/constants';

interface ItemCard {
  Item: Item;
  Variant: ItemVariantDefinition;
}

@Component({
  selector: 'app-inventory-area',
  imports: [ItemPreview, IconComponent, Separator, LoadingSpinner],
  templateUrl: './inventory-area.html',
  styleUrl: './inventory-area.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryArea implements OnDestroy {
  private readonly Inventory = inject(InventoryService);
  private readonly ItemManagement = inject(ItemManagementService);

  protected readonly IsDismantlingItem = signal<Item | undefined>(undefined);
  private timeout: number = 0;

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }

  // Constants
  protected readonly AllSlots: ItemSlot[] = ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Feet'];
  protected readonly AllTiers: ItemTier[] = ['I', 'II', 'III'];
  protected readonly AllRarities: ItemRarity[] = ['Common', 'Magic', 'Rare', 'Epic', 'Legendary'];
  protected readonly DefaultSlotIcons: Record<ItemSlot, GearSlotIconName> = {
    Weapon: ICONS_CONFIG['DEFAULT_WEAPON'],
    OffHand: ICONS_CONFIG['DEFAULT_OFFHAND'],
    Head: ICONS_CONFIG['DEFAULT_HEAD'],
    Chest: ICONS_CONFIG['DEFAULT_CHEST'],
    Legs: ICONS_CONFIG['DEFAULT_LEGS'],
    Feet: ICONS_CONFIG['DEFAULT_FEET']
  };

  // Inventory Properties
  protected readonly Capacity = this.Inventory.Capacity;
  protected readonly SlotsUsed = this.Inventory.SlotsUsed;
  protected readonly SlotsFree = this.Inventory.SlotsFree;

  // Filter State
  protected readonly FilteredSlots = signal<ReadonlySet<ItemSlot>>(new Set());
  protected readonly FilteredTiers = signal<ReadonlySet<ItemTier>>(new Set());
  protected readonly FilteredRarities = signal<ReadonlySet<ItemRarity>>(new Set());

  private readonly SlotOrder = new Map<ItemSlot, number>(
    this.AllSlots.map((slot, index) => [slot, index] as const)
  );
  private readonly TierOrder = new Map<ItemTier, number>(
    this.AllTiers.map((tier, index) => [tier, index] as const)
  );

  protected readonly TotalItems = computed<number>(() => this.Inventory.Items().length);

  protected readonly FilteredItemCards = computed<ItemCard[]>(() => {
    const selectedSlots = this.FilteredSlots();
    const selectedTiers = this.FilteredTiers();
    const selectedRarities = this.FilteredRarities();
    return this.Inventory.Items()
      .map((item) => ({ Item: item, Variant: GetItemVariant(item.DefinitionId) }))
      .filter((card) => {
        let slotMatch = true;
        let tierMatch = true;
        let rarityMatch = true;

        if (selectedSlots.size > 0) {
          slotMatch = selectedSlots.has(card.Item.Slot);
        }

        if (selectedTiers.size > 0) {
          tierMatch = selectedTiers.has(card.Item.Tier);
        }

        if (selectedRarities.size > 0) {
          const itemRarity = GetItemRarity(card.Item.Level);
          rarityMatch = selectedRarities.has(itemRarity);
        }

        return slotMatch && tierMatch && rarityMatch;
      })
      .sort((a, b) => {
        const slotA = this.SlotOrder.get(a.Item.Slot) ?? 999;
        const slotB = this.SlotOrder.get(b.Item.Slot) ?? 999;
        if (slotA !== slotB) return slotA - slotB;

        const tierA = this.TierOrder.get(a.Item.Tier) ?? 999;
        const tierB = this.TierOrder.get(b.Item.Tier) ?? 999;
        if (tierA !== tierB) return tierA - tierB;

        if (a.Item.Level !== b.Item.Level) return b.Item.Level - a.Item.Level;
        return a.Item.Name.localeCompare(b.Item.Name);
      });
  });

  protected readonly FilteredCount = computed<number>(() => this.FilteredItemCards().length);

  protected readonly HasActiveFilters = computed<boolean>(() => {
    return (
      this.FilteredSlots().size > 0 ||
      this.FilteredTiers().size > 0 ||
      this.FilteredRarities().size > 0
    );
  });

  protected IsSlotSelected(slot: ItemSlot): boolean {
    return this.FilteredSlots().has(slot);
  }

  protected IsTierSelected(tier: ItemTier): boolean {
    return this.FilteredTiers().has(tier);
  }

  protected IsRaritySelected(rarity: ItemRarity): boolean {
    return this.FilteredRarities().has(rarity);
  }

  protected ToggleSlot(slot: ItemSlot): void {
    const next = new Set(this.FilteredSlots());

    if (next.has(slot)) {
      next.delete(slot);
    } else {
      next.add(slot);
    }

    if (next.size === this.AllSlots.length) {
      this.FilteredSlots.set(new Set());
      return;
    }

    this.FilteredSlots.set(next);
  }

  protected ToggleTier(tier: ItemTier): void {
    const next = new Set(this.FilteredTiers());

    if (next.has(tier)) {
      next.delete(tier);
    } else {
      next.add(tier);
    }

    if (next.size === this.AllTiers.length) {
      this.FilteredTiers.set(new Set());
      return;
    }

    this.FilteredTiers.set(next);
  }

  protected ToggleRarity(rarity: ItemRarity): void {
    const next = new Set(this.FilteredRarities());

    if (next.has(rarity)) {
      next.delete(rarity);
    } else {
      next.add(rarity);
    }

    if (next.size === this.AllRarities.length) {
      this.FilteredRarities.set(new Set());
      return;
    }

    this.FilteredRarities.set(next);
  }

  protected ResetFilters(): void {
    this.FilteredSlots.set(new Set());
    this.FilteredTiers.set(new Set());
    this.FilteredRarities.set(new Set());
  }

  // Item Actions
  protected EquipItem(item: Item): void {
    if (!item) return;
    this.ItemManagement.EquipItem(item.Id);
  }

  protected DismantleItem(item: Item) {
    if (!item) return;
    this.ItemManagement.DismantleItem(item.Id);
  }

  protected StartDismantling(item: Item): void {
    clearTimeout(this.timeout);
    this.IsDismantlingItem.set(item);
    this.timeout = setTimeout(() => {
      this.IsDismantlingItem.set(undefined);
    }, 1500);
  }
}
