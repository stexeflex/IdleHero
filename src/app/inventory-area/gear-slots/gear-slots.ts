import { Component, EventEmitter, Output } from '@angular/core';
import { EnchantmentSlot, GearType } from '../../../shared/models';
import { EnchantmentSlotIcon, GearSlotIconName, IconComponent } from '../../../shared/components';
import { InventoryService, SelectedGearService } from '../../../shared/services';

@Component({
  selector: 'app-gear-slots',
  imports: [IconComponent, EnchantmentSlotIcon],
  templateUrl: './gear-slots.html',
  styleUrl: './gear-slots.scss'
})
export class GearSlots {
  protected get GearSlots(): { type: GearType; class: string; icon: GearSlotIconName }[] {
    return [
      { type: GearType.Weapon, class: 'weapon gear-slot-large', icon: 'sword' },
      { type: GearType.Shield, class: 'shield gear-slot-large', icon: 'shield' },
      { type: GearType.Head, class: 'head', icon: 'head' },
      { type: GearType.Chest, class: 'chest', icon: 'chest' },
      { type: GearType.Legs, class: 'legs', icon: 'legs' },
      { type: GearType.Boots, class: 'boots', icon: 'boots' }
    ];
  }

  @Output() GearSlotSelected = new EventEmitter<{ event: MouseEvent; slot: GearType }>();

  constructor(
    private selectedGearService: SelectedGearService,
    private inventoryService: InventoryService
  ) {}

  protected SelectGearSlot(event: MouseEvent, slot: GearType): void {
    this.GearSlotSelected.emit({ event, slot });
  }

  protected GetEnchantments(slot: GearType): EnchantmentSlot[] {
    switch (slot) {
      case GearType.Weapon:
        return this.inventoryService.Weapon()?.Enchantments ?? [];
      case GearType.Shield:
        return this.inventoryService.Shield()?.Enchantments ?? [];
      case GearType.Head:
        return this.inventoryService.Head()?.Enchantments ?? [];
      case GearType.Chest:
        return this.inventoryService.Chest()?.Enchantments ?? [];
      case GearType.Legs:
        return this.inventoryService.Legs()?.Enchantments ?? [];
      case GearType.Boots:
        return this.inventoryService.Boots()?.Enchantments ?? [];
      default:
        return [];
    }
  }

  protected IsSelected(slot: GearType): boolean {
    return this.selectedGearService.Type() === slot;
  }

  protected IsEquipped(slot: GearType): boolean {
    return !this.IsEmpty(slot);
  }

  protected IsEmpty(slot: GearType): boolean {
    switch (slot) {
      case GearType.Weapon:
        return !this.inventoryService.Weapon() && !this.IsSelected(slot);
      case GearType.Shield:
        return !this.inventoryService.Shield() && !this.IsSelected(slot);
      case GearType.Head:
        return !this.inventoryService.Head() && !this.IsSelected(slot);
      case GearType.Chest:
        return !this.inventoryService.Chest() && !this.IsSelected(slot);
      case GearType.Legs:
        return !this.inventoryService.Legs() && !this.IsSelected(slot);
      case GearType.Boots:
        return !this.inventoryService.Boots() && !this.IsSelected(slot);
      default:
        return false;
    }
  }

  protected GetGearLevel(slot: GearType): number {
    switch (slot) {
      case GearType.Weapon:
        return this.inventoryService.Weapon()?.Level ?? 0;
      case GearType.Shield:
        return this.inventoryService.Shield()?.Level ?? 0;
      case GearType.Head:
        return this.inventoryService.Head()?.Level ?? 0;
      case GearType.Chest:
        return this.inventoryService.Chest()?.Level ?? 0;
      case GearType.Legs:
        return this.inventoryService.Legs()?.Level ?? 0;
      case GearType.Boots:
        return this.inventoryService.Boots()?.Level ?? 0;
      default:
        return 0;
    }
  }
}
