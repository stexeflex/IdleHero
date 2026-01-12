import { Component, Input } from '@angular/core';

import { EnchantmentSlot } from '../../models';

@Component({
  selector: 'app-enchantment-slot-icon',
  imports: [],
  templateUrl: './enchantment-slot-icon.html',
  styleUrl: './enchantment-slot-icon.scss'
})
export class EnchantmentSlotIcon {
  @Input() enchantments: EnchantmentSlot[] = [];
  @Input() size: string = '20px';
}
