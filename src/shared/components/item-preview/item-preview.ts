import {
  AffixInfo,
  Item,
  ItemRarity,
  ItemVariantDefinition,
  LabelToString
} from '../../../core/models';
import { Component, LOCALE_ID, computed, inject, input } from '@angular/core';
import { GetAffixInfo, GetItemRarity } from '../../../core/systems/items';

import { DecimalPipe } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { Separator } from '../separator/separator';

@Component({
  selector: 'app-item-preview',
  imports: [IconComponent, Separator, DecimalPipe],
  templateUrl: './item-preview.html',
  styleUrl: './item-preview.scss'
})
export class ItemPreview {
  private readonly locale = inject(LOCALE_ID);
  private readonly decimalPipe: DecimalPipe;

  public readonly Item = input.required<Item>();
  public readonly Variant = input.required<ItemVariantDefinition>();

  constructor() {
    this.decimalPipe = new DecimalPipe(this.locale);
  }

  // UI
  protected readonly Rarity = computed<ItemRarity>(() => {
    return GetItemRarity(this.Item().Level);
  });
  protected readonly WeaponBaseDamage = computed<number | undefined>(() => {
    const damage = this.Variant().WeaponBaseDamage;
    if (!damage) return undefined;
    return damage[this.Item().Level];
  });
  protected readonly WeaponBaseAttackSpeed = computed<number | undefined>(() => {
    const aps = this.Variant().WeaponBaseAttackSpeed;
    return aps;
  });
  protected VariantLabel = computed<string>(() => {
    const innateValue = this.Variant().Innate.ValuesByLevel[this.Item().Level];
    const innateLabel = this.Variant().Innate.ToLabel(innateValue);
    return LabelToString(innateLabel, this.decimalPipe);
  });

  protected readonly AffixesInfo = computed<AffixInfo[]>(() => {
    return this.Item().Affixes.map((affix) => {
      return GetAffixInfo(affix, this.locale);
    });
  });
}
