import { Component, Input } from '@angular/core';
import {
  EnchantmentSlotIcon,
  GearSlotIconName,
  IconComponent,
  Separator
} from '../../../shared/components';
import { Gear, GearType } from '../../../shared/models';

@Component({
  selector: 'app-item-display',
  imports: [IconComponent, EnchantmentSlotIcon, Separator],
  templateUrl: './item-display.html',
  styleUrl: './item-display.scss'
})
export class ItemDisplay {
  @Input({ required: true }) Item!: Gear;

  protected get GearIcon(): GearSlotIconName {
    switch (this.Item.Type) {
      case GearType.Weapon:
        return 'sword';
      case GearType.Shield:
        return 'shield';
      case GearType.Head:
        return 'head';
      case GearType.Chest:
        return 'chest';
      case GearType.Legs:
        return 'legs';
      case GearType.Boots:
        return 'boots';
    }
  }

  protected get InnateDisplayName(): string {
    return this.Item.Innate.DisplayName;
  }
}
