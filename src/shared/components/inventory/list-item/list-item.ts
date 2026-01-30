import { Component, input, output } from '@angular/core';

import { IconComponent } from '../../icon/icon.component';
import { Item } from '../../../../core/models';

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
}
