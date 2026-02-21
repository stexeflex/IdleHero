import { AffixInfo, Item, ItemRarity, ItemVariantDefinition } from '../../../../core/models';
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
  GetAffixInfo,
  GetItemRarity,
  GetItemRarityRule,
  GetItemVariant,
  IsMaxTier,
  ItemAffixService,
  ItemLevelService,
  MaxLevelForRarity,
  NextItemRarity
} from '../../../../core/systems/items';
import { Gold, IconComponent, ItemPreview } from '../../../../shared/components';

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
  private readonly itemLevel = inject(ItemLevelService);
  private readonly itemAffix = inject(ItemAffixService);

  public readonly Item = input.required<Item>();
  public readonly ItemChange = output<Item>();

  protected readonly Variant = computed<ItemVariantDefinition>(() =>
    GetItemVariant(this.Item().DefinitionId)
  );

  protected readonly Rarity = computed<ItemRarity>(() => GetItemRarity(this.Item().Level));
  protected readonly Rules = computed(() => GetItemRarityRule(this.Rarity()));

  protected readonly MaxItemLevel = computed<number>(() => MaxLevelForRarity(this.Rarity()));
  protected readonly EnchantedAffixes = computed<number>(
    () => this.Item().Affixes.filter((a) => a.Improved).length
  );
  protected readonly MaxAffixSlots = computed<number>(() => this.Rules().MaxAffixes);
  protected readonly NextItemRarity = computed<ItemRarity>(() => NextItemRarity(this.Item()));

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
    return this.goldCostProvider.GetAddAffixCost(this.Item());
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
    return GetAffixInfo(affix, this.locale);
  }

  protected CanUpgradeItem(): boolean {
    const item = this.Item();
    return this.itemLevel.CanLevelUp(item);
  }

  protected EnoughGoldForUpgrade(): boolean {
    const cost = this.UpgradeCost();
    return this.goldCostProvider.CanAfford(cost);
  }

  protected UpgradeItem(): void {
    const item = this.Item();
    const result = this.craftingService.LevelUp(item, this.goldCostProvider);

    if (result.Success) {
      this.ItemChange.emit(result.Item);
    }
  }

  protected CanAddAffixSlot(): boolean {
    const item = this.Item();
    return this.itemAffix.CanAddAffix(item) && this.EnoughGoldForAddingAffix();
  }

  protected EnoughGoldForAddingAffix(): boolean {
    const cost = this.AddAffixCost();
    return this.goldCostProvider.CanAfford(cost);
  }

  public AddAffixSlot(): void {
    if (!this.CanAddAffixSlot()) return;

    const item = this.Item();
    const result = this.craftingService.AddAffix(item, this.goldCostProvider);

    if (!result.Success) return;

    const next = result.Item;
    this.ItemChange.emit({ ...next });
  }

  protected IsMaxedSlot(slotIndex: number): boolean {
    if (!this.HasAffix(slotIndex)) return false;
    const item = this.Item();
    return IsMaxTier(item, slotIndex);
  }

  protected EnoughGoldForEnchant(slotIndex: number): boolean {
    const cost = this.EnchantCost(slotIndex);
    return this.goldCostProvider.CanAfford(cost);
  }

  protected CanUpgradeSlot(slotIndex: number): boolean {
    if (!this.HasAffix(slotIndex)) return false;
    return (
      this.itemAffix.CanEnchant(this.Item(), slotIndex) && this.EnoughGoldForEnchant(slotIndex)
    );
  }

  public UpgradeSlot(slotIndex: number): void {
    if (!this.CanUpgradeSlot(slotIndex)) return;

    const item = this.Item();
    const result = this.craftingService.EnchantAffix(item, slotIndex, this.goldCostProvider);

    if (!result.Success) return;

    const next = result.Item;
    this.ItemChange.emit({ ...next });
  }

  public EnoughGoldForReroll(slotIndex: number): boolean {
    const cost = this.RerollCost(slotIndex);
    return this.goldCostProvider.CanAfford(cost);
  }

  public RerollSlot(slotIndex: number): void {
    if (!this.HasAffix(slotIndex)) return;

    let item = this.Item();
    const result = this.craftingService.RerollAffix(item, slotIndex, this.goldCostProvider);

    if (!result.Success) return;

    item = result.Item;
    this.ItemChange.emit({ ...item });
  }
}
