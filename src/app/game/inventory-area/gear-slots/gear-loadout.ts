import { Component, inject, output } from '@angular/core';
import { GearSlotIconName, IconComponent } from '../../../../shared/components';
import { ItemRarity, ItemSlot } from '../../../../core/models';

import { GearLoadoutService } from '../../../../core/services';

interface ItemSlotInfo {
  IsSelected: boolean;
  IsEquipped: boolean;
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
      { slot: 'Weapon', class: 'weapon gear-slot-large', icon: 'relicblade' },
      { slot: 'OffHand', class: 'offhand gear-slot-large', icon: 'dragonshield' },
      { slot: 'Head', class: 'head', icon: 'brutalhelm' },
      { slot: 'Chest', class: 'chest', icon: 'chestarmor' },
      { slot: 'Legs', class: 'legs', icon: 'metalskirt' },
      { slot: 'Boots', class: 'boots', icon: 'legarmor' }
    ];
  }

  protected ItemInfo(slot: ItemSlot): ItemSlotInfo {
    const rarity: ItemRarity | undefined = this.gearLoadoutService.Get(slot)?.Rarity ?? undefined;

    return {
      IsSelected: false,
      IsEquipped: this.gearLoadoutService.IsEquipped(slot),
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
