import { Component, input } from '@angular/core';
import {
  EnchantmentSlotIcon,
  GearSlotIconName,
  IconComponent,
  Separator
} from '../../../../shared/components';
import { Gear, GearType } from '../../../../shared/models';

@Component({
  selector: 'app-item-display',
  imports: [IconComponent, EnchantmentSlotIcon, Separator],
  templateUrl: './item-display.html',
  styleUrl: './item-display.scss'
})
export class ItemDisplay {
  readonly Item = input.required<Gear>();

  protected get GearIcon(): GearSlotIconName {
    switch (this.Item().Type) {
      case GearType.Weapon:
        return 'relicblade';
      case GearType.Shield:
        return 'dragonshield';
      case GearType.Head:
        return 'brutalhelm';
      case GearType.Chest:
        return 'chestarmor';
      case GearType.Legs:
        return 'metalskirt';
      case GearType.Boots:
        return 'legarmor';
    }
  }

  protected get InnateDisplayName(): string {
    return this.Item().Innate.DisplayName;
  }
}
