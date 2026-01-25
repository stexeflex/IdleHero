import { Component, ElementRef, HostListener, inject } from '@angular/core';

import { GearLoadout } from './gear-slots/gear-loadout';
import { ItemSlot } from '../../../core/models';

@Component({
  selector: 'app-inventory-area',
  imports: [GearLoadout],
  templateUrl: './inventory-area.html',
  styleUrl: './inventory-area.scss'
})
export class InventoryArea {
  private elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
    }
  }

  protected OnItemSlotSelected(event: MouseEvent, slot: ItemSlot) {
    event.stopPropagation();
  }
}
