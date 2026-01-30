import { Component, computed, input, output } from '@angular/core';
import { Item, ItemRarity } from '../../../../core/models';

import { GetItemRarity } from '../../../../core/systems/items';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-list-item',
  imports: [IconComponent],
  templateUrl: './list-item.html',
  styleUrl: './list-item.scss'
})
export class ListItem {
  public readonly item = input.required<Item>();
  public readonly selected = input<boolean>(false);
  public readonly onSelect = output<Item>();

  protected SelectItem(): void {
    this.onSelect.emit(this.item());
  }

  protected readonly Rarity = computed<ItemRarity>(() => {
    const rarity = GetItemRarity(this.item().Level);
    return rarity;
  });
}
