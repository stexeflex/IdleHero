import { AffixInfo, AffixTier, Label, Item, ItemRarity, ItemVariantDefinition } from '../../../../core/models';
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
  GetAffixPool,
  ItemLevelService,
  MaxLevelForRarity,
  NextItemRarity
} from '../../../../core/systems/items';
import { Gold, IconComponent, ItemPreview } from '../../../../shared/components';

import { DecimalPipe } from '@angular/common';

type AutoRerollOption = {
  Id: string;
  Label: string;
};

@Component({
  selector: 'app-enchanting',
  imports: [ItemPreview, Gold, IconComponent],
  templateUrl: './enchanting.html',
  styleUrl: './enchanting.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Enchanting {
  private static readonly AUTO_REROLL_DELAY_MS = 25;
  private static readonly AUTO_REROLL_SAFETY_MAX_ROLLS = 5000;

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
    // If the user changes selection mid auto-reroll, stop immediately so we never reroll the wrong slot.
    if (this.AutoRerollRunning()) {
      this.StopAutoReroll();
    }

    this.SelectedAffixIndex.set(index);
    this.AutoRerollOpen.set(false);
    this.AutoRerollTargetId.set('');
    this.AutoRerollAttempts.set(0);
    this.AutoRerollStatus.set('');
  }

  private autoRerollToken = 0;
  protected readonly AutoRerollTargetId = signal<string>('');
  protected readonly AutoRerollRunning = signal<boolean>(false);
  protected readonly AutoRerollOpen = signal<boolean>(false);
  protected readonly AutoRerollAttempts = signal<number>(0);
  protected readonly AutoRerollStatus = signal<string>('');

  protected readonly AutoRerollOptions = computed<AutoRerollOption[]>(() => {
    const pool = GetAffixPool(this.Variant().Slot);

    const options: AutoRerollOption[] = pool.map((definition) => {
      // We only want the stat name/type for selection, not the actual rolled value.
      const label: Label = definition.Effect.ToLabel(1);
      const suffix = label.ValueType === 'Percentage' ? ' (%)' : '';
      return { Id: definition.Id, Label: `${label.Stat}${suffix}` };
    });

    options.sort((a, b) => a.Label.localeCompare(b.Label));
    return options;
  });

  protected SetAutoRerollTargetId(id: string): void {
    this.AutoRerollTargetId.set(id);
  }

  protected StopAutoReroll(message: string = 'Stopped by user.'): void {
    this.autoRerollToken++;
    this.AutoRerollRunning.set(false);
    this.AutoRerollStatus.set(message);
  }

  protected ToggleAutoRerollOpen(): void {
    if (this.AutoRerollRunning()) return;
    this.AutoRerollOpen.update((v) => !v);
  }

  protected CloseAutoRerollPanel(): void {
    if (this.AutoRerollRunning()) {
      this.StopAutoReroll();
    }
    this.AutoRerollOpen.set(false);
  }

  protected StartAutoReroll(): void {
    const slotIndex = this.SelectedAffixIndex();
    if (slotIndex === null) return;
    if (!this.HasAffix(slotIndex)) return;

    const targetId = this.AutoRerollTargetId();
    if (!targetId) {
      this.AutoRerollStatus.set('Pick a target stat first.');
      return;
    }

    this.autoRerollToken++;
    const token = this.autoRerollToken;

    this.AutoRerollOpen.set(true);
    this.AutoRerollRunning.set(true);
    this.AutoRerollAttempts.set(0);
    this.AutoRerollStatus.set('Auto reroll running...');

    void this.RunAutoReroll(token, slotIndex, targetId);
  }

  private async RunAutoReroll(token: number, slotIndex: number, targetId: string): Promise<void> {
    let item = this.Item();

    // Allow running even if it currently matches the target: we will reroll at least once and
    // stop as soon as it lands on the target again.

    while (token === this.autoRerollToken) {
      if (this.SelectedAffixIndex() !== slotIndex) {
        this.AutoRerollStatus.set('Stopped: selected slot changed.');
        break;
      }

      // Stop if slot disappeared (shouldn't happen, but prevents crashes).
      if (slotIndex < 0 || slotIndex >= item.Affixes.length) {
        this.AutoRerollStatus.set('Stopped: selected slot is no longer valid.');
        break;
      }

      if (this.AutoRerollAttempts() >= Enchanting.AUTO_REROLL_SAFETY_MAX_ROLLS) {
        this.AutoRerollStatus.set(
          `Stopped after ${Enchanting.AUTO_REROLL_SAFETY_MAX_ROLLS} rerolls (safety limit).`
        );
        break;
      }

      const cost = this.goldCostProvider.GetRerollAffixCost(item, slotIndex);
      if (!this.goldCostProvider.CanAfford(cost)) {
        this.AutoRerollStatus.set(`Stopped: not enough gold (after ${this.AutoRerollAttempts()} rerolls).`);
        break;
      }

      const result = this.craftingService.RerollAffix(item, slotIndex, this.goldCostProvider);
      if (!result.Success) {
        this.AutoRerollStatus.set('Stopped: reroll failed.');
        break;
      }

      item = result.Item;
      this.ItemChange.emit({ ...item });
      const nextAttempts = this.AutoRerollAttempts() + 1;
      this.AutoRerollAttempts.set(nextAttempts);

      if (item.Affixes[slotIndex]?.DefinitionId === targetId) {
        this.AutoRerollStatus.set(`Found after ${nextAttempts} rerolls.`);
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, Enchanting.AUTO_REROLL_DELAY_MS));
    }

    if (token === this.autoRerollToken) {
      this.AutoRerollRunning.set(false);
    }
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
    if (this.AutoRerollRunning()) return;

    let item = this.Item();
    const result = this.craftingService.RerollAffix(item, slotIndex, this.goldCostProvider);

    if (!result.Success) return;

    item = result.Item;
    this.ItemChange.emit({ ...item });
  }
}
