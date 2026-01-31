import { Component, computed, inject, output, signal } from '@angular/core';
import {
  GearSlotIconName,
  IconComponent,
  ItemPreview,
  Separator
} from '../../../shared/components';
import { GetItemRarity, GetItemVariant } from '../../../core/systems/items';
import { Item, ItemSlot } from '../../../core/models';

import { GearLoadoutService } from '../../../core/services';
import { ICONS_CONFIG } from '../../../core/constants';

interface ItemSlotDefinition {
  slot: ItemSlot;
  class: string;
  icon: GearSlotIconName;
}

interface ItemSlotInfo {
  IsSelected: boolean;
  IsEquipped: boolean;
  Icon: GearSlotIconName;
  IsCommon: boolean;
  IsMagic: boolean;
  IsRare: boolean;
  IsEpic: boolean;
  IsLegendary: boolean;
}

@Component({
  selector: 'app-character-loadout',
  imports: [IconComponent, ItemPreview, Separator],
  templateUrl: './character-loadout.html',
  styleUrl: './character-loadout.scss'
})
export class CharacterLoadout {
  private readonly gearLoadoutService = inject(GearLoadoutService);

  public readonly ItemSlotSelected = output<{ event: MouseEvent; slot: ItemSlot }>();

  protected get ItemSlots(): ItemSlotDefinition[] {
    return [
      { slot: 'Weapon', class: 'weapon gear-slot-large', icon: ICONS_CONFIG['DEFAULT_WEAPON'] },
      { slot: 'OffHand', class: 'offhand gear-slot-large', icon: ICONS_CONFIG['DEFAULT_OFFHAND'] },
      { slot: 'Head', class: 'head', icon: ICONS_CONFIG['DEFAULT_HEAD'] },
      { slot: 'Chest', class: 'chest', icon: ICONS_CONFIG['DEFAULT_CHEST'] },
      { slot: 'Legs', class: 'legs', icon: ICONS_CONFIG['DEFAULT_LEGS'] },
      { slot: 'Boots', class: 'boots', icon: ICONS_CONFIG['DEFAULT_BOOTS'] }
    ];
  }

  protected ItemInfo(slot: ItemSlot): ItemSlotInfo {
    const item = this.gearLoadoutService.Get(slot);
    const rarity = item?.Level ? GetItemRarity(item.Level) : undefined;

    return {
      IsSelected: false,
      IsEquipped: this.gearLoadoutService.IsEquipped(slot),
      Icon: item ? item.Icon : this.ItemSlots.find((s) => s.slot === slot)!.icon,
      IsCommon: rarity === 'Common',
      IsMagic: rarity === 'Magic',
      IsRare: rarity === 'Rare',
      IsEpic: rarity === 'Epic',
      IsLegendary: rarity === 'Legendary'
    };
  }

  protected SelectItemSlot(event: MouseEvent, slot: ItemSlot): void {
    this.ItemSlotSelected.emit({ event, slot });
    this.SelectedItem.set(this.gearLoadoutService.Get(slot));
  }

  // Selected Item
  protected SelectedItem = signal<Item | null>(null);
  protected SelectedVariant = computed(() => {
    const item = this.SelectedItem();
    if (!item) return null;
    return GetItemVariant(item.DefinitionId);
  });
}
