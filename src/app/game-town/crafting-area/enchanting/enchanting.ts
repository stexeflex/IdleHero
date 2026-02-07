import {
  Affix,
  AffixDefinition,
  AffixInfo,
  AffixTier,
  Item,
  ItemRarity,
  ItemVariantDefinition
} from '../../../../core/models';
import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  computed,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { CraftingService, GoldCostProvider } from '../../../../core/services';
import {
  ExceedsMaxTierForItemLevel,
  ExceedsMaximumEnchantableAffixes,
  GetAffixDefinition,
  GetAffixInfo,
  GetAffixPool,
  GetItemRarity,
  GetItemRarityRule,
  GetItemVariant,
  GetMaxAffixTier,
  IsMaxLevel,
  NextTier,
  RandomInRange
} from '../../../../core/systems/items';
import { Gold, IconComponent, ItemPreview } from '../../../../shared/components';

import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-enchanting',
  imports: [ItemPreview, Gold, IconComponent],
  templateUrl: './enchanting.html',
  styleUrl: './enchanting.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Enchanting {
  private readonly locale = inject(LOCALE_ID);
  private readonly craftingService = inject(CraftingService);
  private readonly goldCostProvider = inject(GoldCostProvider);
  private readonly decimalPipe = new DecimalPipe(this.locale);

  public readonly Item = input.required<Item>();
  public readonly ItemChange = output<Item>();

  protected readonly Variant = computed<ItemVariantDefinition>(() =>
    GetItemVariant(this.Item().DefinitionId)
  );

  protected readonly Rarity = computed<ItemRarity>(() => GetItemRarity(this.Item().Level));
  protected readonly Rules = computed(() => GetItemRarityRule(this.Rarity()));

  protected readonly EnchantedAffixes = computed<number>(
    () => this.Item().Affixes.filter((a) => a.Improved).length
  );
  protected readonly MaxEnchantedAffixes = computed<number>(
    () => this.Rules().MaxEnchantableAffixes
  );
  protected readonly MaxAffixSlots = computed<number>(() => this.Rules().MaxAffixes);
  protected readonly MaxAffixTier = computed<AffixTier>(() => GetMaxAffixTier(this.Item().Level));

  protected readonly VisibleSlotIndices = computed<number[]>(() => {
    const item = this.Item();
    const maxSlots = this.MaxAffixSlots();
    const filled = item.Affixes.length;
    const visibleSlots = Math.min(filled + 1, maxSlots);
    return Array.from({ length: visibleSlots }, (_, index) => index);
  });

  protected readonly SelectedAffixIndex = signal<number | null>(null);
  protected SelectSlot(index: number): void {
    this.SelectedAffixIndex.set(index);
  }

  protected UpgradeCost(): number {
    return this.goldCostProvider.GetLevelUpCost(this.Item());
  }

  protected AddAffixCost(): number {
    return this.goldCostProvider.GetAddAffixCost(this.Item(), {} as AffixDefinition);
  }

  protected EnchantCost(slotIndex: number): number {
    return this.goldCostProvider.GetEnchantAffixCost(this.Item(), slotIndex);
  }

  protected RerollCost(slotIndex: number): number {
    return this.goldCostProvider.GetRerollAffixCost(this.Item(), slotIndex);
  }

  protected HasAffix(slotIndex: number): boolean {
    return slotIndex >= 0 && slotIndex < this.Item().Affixes.length;
  }

  protected GetAffixInfo(slotIndex: number): AffixInfo {
    const affix = this.Item().Affixes[slotIndex];
    return GetAffixInfo(affix, this.decimalPipe);
  }

  protected CanUpgradeItem(): boolean {
    const item = this.Item();
    return !IsMaxLevel(item);
  }

  protected UpgradeItem(): void {
    const item = this.Item();
    const result = this.craftingService.LevelUp(item, this.goldCostProvider);

    if (result.Success) {
      this.ItemChange.emit(result.Item);
    }
  }

  protected CanEnchantSlot(slotIndex: number): boolean {
    const item = this.Item();
    return slotIndex === item.Affixes.length && slotIndex < this.MaxAffixSlots();
  }

  protected IsMaxedSlot(slotIndex: number): boolean {
    if (!this.HasAffix(slotIndex)) return false;
    const item = this.Item();
    const affix = item.Affixes[slotIndex];
    const maxTier = GetMaxAffixTier(item.Level);
    return affix.Tier === maxTier;
  }

  protected CanUpgradeSlot(slotIndex: number): boolean {
    if (!this.HasAffix(slotIndex)) return false;
    const item = this.Item();
    const affix = item.Affixes[slotIndex];
    const next = NextTier(affix.Tier);
    if (!next) return false;
    if (ExceedsMaxTierForItemLevel(next, item.Level)) return false;

    if (!affix.Improved) {
      if (ExceedsMaximumEnchantableAffixes(item)) return false;
    }

    return true;
  }

  public EnchantSlot(slotIndex: number): void {
    if (!this.CanEnchantSlot(slotIndex)) return;

    const item = this.Item();
    const pool = GetAffixPool(item.Slot);
    const definition = this.PickRandomDefinition(pool);
    const result = this.craftingService.AddAffix(item, definition!, this.goldCostProvider);

    if (!result.Success) return;

    const next = result.Item;
    this.ItemChange.emit({ ...next });
  }

  private PickRandomDefinition(pool: AffixDefinition[]): AffixDefinition | null {
    if (pool.length === 0) return null;
    const index = Math.floor(Math.random() * pool.length);
    return pool[index] ?? null;
  }

  public RerollSlot(slotIndex: number): void {
    if (!this.HasAffix(slotIndex)) return;

    let item = this.Item();
    const current = item.Affixes[slotIndex];
    const result = this.craftingService.RerollAffix(
      item,
      slotIndex,
      GetAffixDefinition(current.DefinitionId)!,
      this.goldCostProvider
    );

    if (!result.Success) return;

    item = result.Item;
    this.ItemChange.emit({ ...item });
  }

  public UpgradeSlot(slotIndex: number): void {
    if (!this.CanUpgradeSlot(slotIndex)) return;

    const item = this.Item();
    const current = item.Affixes[slotIndex];
    const result = this.craftingService.EnchantAffix(
      item,
      slotIndex,
      GetAffixDefinition(current.DefinitionId)!,
      this.goldCostProvider
    );

    if (!result.Success) return;

    const next = result.Item;
    this.ItemChange.emit({ ...next });
  }
}
