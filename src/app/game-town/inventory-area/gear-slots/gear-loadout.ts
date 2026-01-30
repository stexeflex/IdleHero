import { Component, inject, output } from '@angular/core';
import { GearSlotIconName, IconComponent } from '../../../../shared/components';
import { ItemRarity, ItemSlot } from '../../../../core/models';

import { GearLoadoutService } from '../../../../core/services';
import { GetItemRarity } from '../../../../core/systems/items';
import { ICONS_CONFIG } from '../../../../core/constants';

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
  selector: 'app-gear-loadout',
  imports: [IconComponent],
  templateUrl: './gear-loadout.html',
  styleUrl: './gear-loadout.scss'
})
export class GearLoadout {
  private readonly gearLoadoutService = inject(GearLoadoutService);

  public readonly ItemSlotSelected = output<{ event: MouseEvent; slot: ItemSlot }>();

  protected get ItemSlots(): { slot: ItemSlot; class: string; icon: GearSlotIconName }[] {
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
  }
}
