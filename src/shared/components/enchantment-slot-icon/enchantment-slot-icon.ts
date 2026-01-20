import { Component, input } from '@angular/core';

import { EnchantmentSlot } from '../../models';

@Component({
  selector: 'app-enchantment-slot-icon',
  imports: [],
  templateUrl: './enchantment-slot-icon.html',
  styleUrl: './enchantment-slot-icon.scss'
})
export class EnchantmentSlotIcon {
  readonly enchantments = input<EnchantmentSlot[]>([]);
  readonly size = input<string>('20px');
}
