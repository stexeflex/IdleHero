import { Component, computed, input, output } from '@angular/core';
import { GetItemRarity, GetItemVariant } from '../../../../core/systems/items';
import { Item, ItemRarity, ItemVariantDefinition } from '../../../../core/models';

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

  protected readonly Variant = computed<ItemVariantDefinition>(() => {
    const definition = GetItemVariant(this.item().DefinitionId);
    return definition;
  });

  protected readonly Rarity = computed<ItemRarity>(() => {
    const rarity = GetItemRarity(this.item().Level);
    return rarity;
  });
}
