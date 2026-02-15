import { Component, LOCALE_ID, computed, inject, input, output } from '@angular/core';
import { ItemLevel, ItemRarity, ItemVariantDefinition, LabelToString } from '../../../core/models';
import { MinLevelForTier, MinRarityForTier } from '../../../core/systems/items';

import { DecimalPipe } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { Separator } from '../separator/separator';

@Component({
  selector: 'app-item-variant-preview',
  imports: [IconComponent, Separator, DecimalPipe],
  templateUrl: './item-variant-preview.html',
  styleUrl: './item-preview.scss'
})
export class ItemVariantPreview {
  private readonly locale = inject(LOCALE_ID);
  private readonly decimalPipe: DecimalPipe;

  public readonly Variant = input.required<ItemVariantDefinition>();
  public readonly Selected = input.required<boolean>();
  public readonly OnSelectVariant = output<string>();

  constructor() {
    this.decimalPipe = new DecimalPipe(this.locale);
  }

  protected SelectVariant(id: string): void {
    this.OnSelectVariant.emit(id);
  }

  // UI
  protected readonly Level = computed<ItemLevel>(() => {
    const tier = this.Variant().Tier;
    return MinLevelForTier(tier);
  });
  protected readonly Rarity = computed<ItemRarity>(() => {
    const tier = this.Variant().Tier;
    return MinRarityForTier(tier);
  });
  protected readonly WeaponBaseDamage = computed<number | undefined>(() => {
    const minLevel = this.Level();
    const damage = this.Variant().WeaponBaseDamage;
    if (!damage) return undefined;
    return damage[minLevel];
  });
  protected readonly WeaponBaseAttackSpeed = computed<number | undefined>(() => {
    const minLevel = this.Level();
    const aps = this.Variant().WeaponBaseAttackSpeed;
    return aps;
  });
  protected VariantLabel = computed<string>(() => {
    const minLevel = this.Level();
    const innateValue = this.Variant().Innate.ValuesByLevel[minLevel];
    const innateLabel = this.Variant().Innate.ToLabel(innateValue);
    return LabelToString(innateLabel, this.decimalPipe);
  });
}
