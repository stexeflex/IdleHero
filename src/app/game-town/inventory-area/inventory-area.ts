import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  GearSlotIconName,
  IconComponent,
  ItemPreview,
  Separator
} from '../../../shared/components';
import { InventoryService, ItemManagementService } from '../../../core/services';
import { Item, ItemSlot, ItemTier, ItemVariantDefinition } from '../../../core/models';

import { GetItemVariant } from '../../../core/systems/items';
import { ICONS_CONFIG } from '../../../core/constants';

interface ItemCard {
  Item: Item;
  Variant: ItemVariantDefinition;
}

@Component({
  selector: 'app-inventory-area',
  imports: [ItemPreview, IconComponent, Separator],
  templateUrl: './inventory-area.html',
  styleUrl: './inventory-area.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryArea {
  private readonly Inventory = inject(InventoryService);
  private readonly ItemManagement = inject(ItemManagementService);

  // Constants
  protected readonly AllSlots: ItemSlot[] = ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Feet'];
  protected readonly AllTiers: ItemTier[] = ['I', 'II', 'III'];
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

    return this.Inventory.Items()
      .map((item) => ({ Item: item, Variant: GetItemVariant(item.DefinitionId) }))
      .filter((card) => {
        let slotMatch = true;
        let tierMatch = true;

        if (selectedSlots.size > 0) {
          slotMatch = selectedSlots.has(card.Item.Slot);
        }

        if (selectedTiers.size > 0) {
          tierMatch = selectedTiers.has(card.Item.Tier);
        }

        return slotMatch && tierMatch;
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
    return this.FilteredSlots().size > 0 || this.FilteredTiers().size > 0;
  });

  protected IsSlotSelected(slot: ItemSlot): boolean {
    return this.FilteredSlots().has(slot);
  }

  protected IsTierSelected(tier: ItemTier): boolean {
    return this.FilteredTiers().has(tier);
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

  protected ResetFilters(): void {
    this.FilteredSlots.set(new Set());
    this.FilteredTiers.set(new Set());
  }

  // Item Actions
  protected EquipItem(item: Item): void {
    if (!item) return;
    this.ItemManagement.EquipItem(item);
  }
}
