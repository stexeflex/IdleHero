import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  CraftingService,
  GearLoadoutService,
  GoldCostProvider,
  GoldService,
  InventoryService
} from '../../../core/services';
import { Inventory, TabDefinition, TabStrip } from '../../../shared/components';
import { Item, ItemRarity, ItemSlot } from '../../../core/models';

import { Crafting } from './crafting/crafting';
import { Enchanting } from './enchanting/enchanting';

interface SelectedItemContext {
  itemId: string;
  source: 'Inventory' | 'Equipped';
}

@Component({
  selector: 'app-crafting-area',
  imports: [TabStrip, Crafting, Enchanting, Inventory],
  templateUrl: './crafting-area.html',
  styleUrl: './crafting-area.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CraftingArea {
  public readonly cost = inject(GoldCostProvider);
  private readonly inventory = inject(InventoryService);
  private readonly gear = inject(GearLoadoutService);
  private readonly gold = inject(GoldService);

  protected get Tabs(): TabDefinition[] {
    return [
      { id: 'crafting', label: 'CRAFTING', disabled: false },
      { id: 'enchanting', label: 'ENCHANTING', disabled: false },
      { id: 'socketing', label: 'SOCKETING', disabled: true }
    ];
  }

  protected SelectedTab = signal<TabDefinition['id']>('crafting');

  protected onTabSelected(tabId: TabDefinition['id']): void {
    this.SelectedTab.set(tabId);
  }

  protected SelectedItemContext = signal<SelectedItemContext | null>(null);
  protected onInventoryItemSelected(sel: SelectedItemContext): void {
    this.SelectedItemContext.set(sel);
  }

  // UI State
  public readonly Slots = ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Feet'] as ItemSlot[];
  public readonly Rarities = ['Common', 'Magic', 'Rare', 'Epic', 'Legendary'] as ItemRarity[];

  public readonly SelectedSlot = signal<ItemSlot>('Weapon');
  public readonly SelectedRarity = signal<ItemRarity>('Magic');
  public readonly SelectedVariantId = signal<string | null>(null);

  public readonly SelectedItem = computed<Item | null>(() => {
    const sel = this.SelectedItemContext();
    if (!sel) return null;
    if (sel.source === 'Inventory') {
      const item = this.InventoryItems().find((i) => i.Id === sel.itemId);
      return item || null;
    } else {
      const item = this.EquippedItems().find((i) => i.Id === sel.itemId);
      return item || null;
    }
  });
  public readonly SelectedAffixIndex = signal<number | null>(null);
  public readonly SelectedAffixDefinitionId = signal<string | null>(null);
  public readonly SelectedRuneIndex = signal<number | null>(null);

  // Data
  public readonly GoldBalance = this.gold.Balance;
  public readonly InventoryItems = this.inventory.Items;
  public readonly InventoryRunes = this.inventory.Runes;
  public readonly EquippedItems = this.gear.EquippedItems;

  public OnEnchantingItemChange(next: Item): void {
    const SelectedItemContext = this.SelectedItemContext();
    if (!SelectedItemContext) return;

    if (SelectedItemContext.source === 'Inventory') {
      this.inventory.Update(next);
      this.SelectedItemContext.set({ itemId: next.Id, source: 'Inventory' });
    } else {
      this.gear.Equip(next);
      this.SelectedItemContext.set({ itemId: next.Id, source: 'Equipped' });
    }
  }
}
