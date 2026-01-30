import { Component, inject, input, output, signal } from '@angular/core';

import { IconComponent } from '../icon/icon.component';
import { InventoryService } from '../../../core/services';
import { Item } from '../../../core/models';
import { ListItem } from './list-item/list-item';

@Component({
  selector: 'app-inventory',
  imports: [ListItem, IconComponent],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss'
})
export class Inventory {
  public readonly ShowEquipped = input.required<boolean>();
  public readonly ItemSelected = output<{ item: Item; source: 'Inventory' | 'Equipped' }>();

  // Services
  private readonly inventory = inject(InventoryService);

  // UI State
  protected readonly InventoryItems = this.inventory.Items;
  protected readonly SelectedItem = signal<{ item: Item; source: 'Inventory' | 'Equipped' } | null>(
    null
  );

  protected SelectItemFromInventory(item: Item): void {
    this.SelectedItem.set({ item, source: 'Inventory' });
  }

  protected SelectItemFromEquipped(item: Item): void {
    this.SelectedItem.set({ item, source: 'Equipped' });
  }

  DeselectGear() {
    this.SelectedItem.set(null);
  }
}
