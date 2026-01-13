import { Component, ElementRef, HostListener, Input, OnInit, inject } from '@angular/core';
import { CurrencyService, EnchantingService, ItemPriceService } from '../../../shared/services';
import { EnchantmentSlot, Gear, GearType } from '../../../shared/models';
import {
  EnchantmentSlotIcon,
  GearSlotIconName,
  Gold,
  IconComponent,
  Separator
} from '../../../shared/components';

@Component({
  selector: 'app-enchanting',
  imports: [IconComponent, EnchantmentSlotIcon, Gold, Separator],
  templateUrl: './enchanting.html',
  styleUrl: './enchanting.scss'
})
export class Enchanting implements OnInit {
  private elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // if (!this.elementRef.nativeElement.contains(event.target)) {
    this.ResetSlotStates();
    // }
  }

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

  protected get SlotCost(): number {
    return this.itemPriceService.GetEnchantmentCost(this.Item);
  }

  protected get RerollCost(): number {
    return this.itemPriceService.GetRerollCost();
  }

  protected SlotStates: Map<number, 'Empty' | 'Enchanted' | 'Upgrading' | 'Rerolling'> = new Map();

  constructor(
    private enchantingService: EnchantingService,
    private currencyService: CurrencyService,
    private itemPriceService: ItemPriceService
  ) {}

  ngOnInit(): void {
    this.ResetSlotStates();
  }

  ngOnChanges(): void {
    this.ResetSlotStates();
  }

  private ResetSlotStates() {
    this.Item.Enchantments.forEach((slot, index) => {
      if (slot.IsEnchanted) {
        this.SlotStates.set(index, 'Enchanted');
      } else {
        this.SlotStates.set(index, 'Empty');
      }
    });
  }

  protected GetEnchantmentDescription(slot: EnchantmentSlot): string {
    return slot.Enchantment.DisplayName;
  }

  /* ENCHANT SECTION */
  protected ShowEnchantSlot(index: number): boolean {
    const enchantedSlots = this.Item.Enchantments.filter((e) => e.IsEnchanted).length;

    // Show all enchanted Slots and first non-enchanted Slot
    return index < enchantedSlots + 1;
  }

  protected CanEnchant(slot: EnchantmentSlot): boolean {
    return !slot.IsEnchanted && this.SlotCost <= this.currencyService.Gold();
  }

  protected Enchant($event: MouseEvent, index: number): void {
    $event.stopPropagation();
    this.SlotStates.set(index, 'Enchanted');
    this.enchantingService.Enchant(this.Item, index);
  }

  /* REROLL SECTION */
  protected ShowRerollAction(slot: EnchantmentSlot): boolean {
    return slot.IsEnchanted;
  }

  protected CanReroll(): boolean {
    return this.RerollCost <= this.currencyService.Gold();
  }

  protected StartReroll($event: MouseEvent, index: number) {
    $event.stopPropagation();
    this.SlotStates.set(index, 'Rerolling');
  }

  protected Reroll(index: number): void {
    this.enchantingService.Reroll(this.Item, index);
    this.SlotStates.set(index, 'Enchanted');
  }

  protected CancelReroll($event: MouseEvent, index: number): void {
    $event.stopPropagation();
    this.SlotStates.set(index, 'Enchanted');
  }

  /* UPGRADE SECTION */
  protected ShowUpgradeAction(slot: EnchantmentSlot): boolean {
    return slot.IsEnchanted;
  }

  protected CanStartUpgrade(slot: EnchantmentSlot): boolean {
    return slot.CanUpgrade;
  }

  protected CanUpgrade(slot: EnchantmentSlot): boolean {
    return slot.CanUpgrade && this.UpgradeCost(slot) <= this.currencyService.Gold();
  }

  protected UpgradeCost(slot: EnchantmentSlot): number {
    return this.itemPriceService.GetUpgradeCost(slot);
  }

  protected StartUpgrade($event: MouseEvent, index: number): void {
    $event.stopPropagation();
    this.SlotStates.set(index, 'Upgrading');
  }

  protected Upgrade($event: MouseEvent, index: number): void {
    $event.stopPropagation();
    this.enchantingService.Upgrade(this.Item, index);
    this.SlotStates.set(index, 'Enchanted');
  }

  protected CancelUpgrade($event: MouseEvent, index: number): void {
    $event.stopPropagation();
    this.SlotStates.set(index, 'Enchanted');
  }
}
