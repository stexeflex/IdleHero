import {
  Affix,
  AmuletState,
  Item,
  ItemSlot,
  ItemTier,
  ItemVariantDefinition,
  Rune
} from '../../../core/models';
import {
  AffixSlotIcon,
  AmuletPreview,
  GearSlotIconName,
  IconComponent,
  ItemPreview,
  Separator,
  SocketedRunesIcon
} from '../../../shared/components';
import { AmuletService, GearLoadoutService } from '../../../core/services';
import { Component, computed, inject, signal } from '@angular/core';
import { GetItemRarity, GetItemVariant } from '../../../core/systems/items';

import { ICONS_CONFIG } from '../../../core/constants';

interface ItemSlotDefinition {
  slot: ItemSlot | 'Amulet';
  class: string;
  icon: GearSlotIconName;
}

interface ItemSlotInfo {
  IsSelected: boolean;
  IsEquipped: boolean;
  Icon: GearSlotIconName;
  Tier: ItemTier | undefined;
  IsCommon: boolean;
  IsMagic: boolean;
  IsRare: boolean;
  IsEpic: boolean;
  IsLegendary: boolean;
}

interface AmuletInfo {
  IsSelected: boolean;
  IsUnlocked: boolean;
  IsCommon: boolean;
  IsMagic: boolean;
  IsRare: boolean;
  IsEpic: boolean;
  IsLegendary: boolean;
}

@Component({
  selector: 'app-character-loadout',
  imports: [IconComponent, ItemPreview, Separator, AffixSlotIcon, AmuletPreview, SocketedRunesIcon],
  templateUrl: './character-loadout.html',
  styleUrl: './character-loadout.scss'
})
export class CharacterLoadout {
  private readonly gearLoadoutService = inject(GearLoadoutService);
  private readonly amuletService = inject(AmuletService);

  protected get ItemSlots(): ItemSlotDefinition[] {
    return [
      { slot: 'Weapon', class: 'weapon gear-slot-large', icon: ICONS_CONFIG['DEFAULT_WEAPON'] },
      { slot: 'OffHand', class: 'offhand gear-slot-large', icon: ICONS_CONFIG['DEFAULT_OFFHAND'] },
      { slot: 'Head', class: 'head', icon: ICONS_CONFIG['DEFAULT_HEAD'] },
      { slot: 'Chest', class: 'chest', icon: ICONS_CONFIG['DEFAULT_CHEST'] },
      { slot: 'Legs', class: 'legs', icon: ICONS_CONFIG['DEFAULT_LEGS'] },
      { slot: 'Feet', class: 'feet', icon: ICONS_CONFIG['DEFAULT_FEET'] },
      { slot: 'Amulet', class: 'amulet gear-slot-wide', icon: ICONS_CONFIG['DEFAULT_AMULET'] }
    ];
  }

  protected ItemInfo(slot: ItemSlot): ItemSlotInfo {
    const item = this.gearLoadoutService.Get(slot as ItemSlot);
    const definition = item ? GetItemVariant(item.DefinitionId) : null;
    const rarity = item?.Level ? GetItemRarity(item.Level) : undefined;

    return {
      IsSelected: false,
      IsEquipped: this.gearLoadoutService.IsEquipped(slot),
      Icon: definition ? definition.Icon : this.ItemSlots.find((s) => s.slot === slot)!.icon,
      Tier: definition?.Tier || undefined,
      IsCommon: rarity === 'Common',
      IsMagic: rarity === 'Magic',
      IsRare: rarity === 'Rare',
      IsEpic: rarity === 'Epic',
      IsLegendary: rarity === 'Legendary'
    };
  }

  protected AmuletInfo(): AmuletInfo {
    const amulet = this.amuletService.GetState();

    return {
      IsSelected: false,
      IsUnlocked: this.amuletService.IsUnlocked(),
      IsCommon: amulet.Quality === 'Common',
      IsMagic: amulet.Quality === 'Magic',
      IsRare: amulet.Quality === 'Rare',
      IsEpic: amulet.Quality === 'Epic',
      IsLegendary: amulet.Quality === 'Legendary'
    };
  }

  protected Runes(): Array<Rune | null> {
    const amulet = this.amuletService.GetState();
    return amulet?.Slots || [];
  }

  protected AffixInfo(slot: ItemSlot): Affix[] {
    const item = this.gearLoadoutService.Get(slot);
    return item ? item.Affixes : [];
  }

  // Item Selection
  protected SelectedSlot = signal<ItemSlot | null>(null);
  protected SelectedItem = computed<Item | null>(() => {
    const slot = this.SelectedSlot();
    if (!slot) return null;
    return this.gearLoadoutService.Get(slot);
  });
  protected SelectedVariant = computed<ItemVariantDefinition | null>(() => {
    const item = this.SelectedItem();
    if (!item) return null;
    return GetItemVariant(item.DefinitionId);
  });

  protected SelectItemSlot(slot: ItemSlot): void {
    this.SelectedSlot.set(slot);
    this.SelectedAmulet.set(null);
  }

  // Amulet Selection
  protected SelectedAmulet = signal<AmuletState | null>(null);

  protected SelectAmulet(): void {
    this.SelectedSlot.set(null);
    if (!this.amuletService.IsUnlocked()) return;
    this.SelectedAmulet.set(this.amuletService.GetState());
  }
}
