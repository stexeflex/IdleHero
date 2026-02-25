import { AffixInfo, AffixTier, Item, ItemRarity, ItemVariantDefinition, Label } from '../../../../core/models';
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
  GetAffixDefinition,
  GetAffixTierSpec,
  GetAffixMinMaxRoll,
  GetAffixValue,
  GetItemRarity,
  GetItemRarityRule,
  GetItemVariant,
  IsMaxTier,
  ItemAffixService,
  GetAffixPool,
  ItemLevelService,
  MaxLevelForRarity,
  NextItemRarity as ComputeNextItemRarity
} from '../../../../core/systems/items';
import { Gold, IconComponent, ItemPreview } from '../../../../shared/components';



type AutoRerollOption = {
  Id: string;
  Label: string;
};

type AutoRerollTargetSpec = {
  min: number;
  max: number;
  type: 'Flat' | 'Percent';
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
  protected readonly NextItemRarity = computed<ItemRarity>(() => ComputeNextItemRarity(this.Item()));

  protected readonly VisibleSlotIndices = computed<number[]>(() => {
    const item = this.Item();
    const maxSlots = this.MaxAffixSlots();
    const filled = item.Affixes.length;
    const visibleSlots = Math.min(filled + 1, maxSlots);
    return Array.from({ length: visibleSlots }, (_, index) => index);
  });

  protected readonly SelectedAffixIndex = signal<number | null>(null);
  protected SelectSlot(index: number): void {
    if (this.AutoRerollRunning()) {
      this.StopAutoReroll();
    }

    this.SelectedAffixIndex.set(index);
    this.resetAutoRerollUiState();
  }

  private autoRerollToken = 0;
  protected readonly AutoRerollTargetId = signal<string>('');
  protected readonly AutoRerollMinValueRaw = signal<string>('');
  protected readonly AutoRerollRunning = signal<boolean>(false);
  protected readonly AutoRerollOpen = signal<boolean>(false);
  protected readonly AutoRerollAttempts = signal<number>(0);
  protected readonly AutoRerollStatus = signal<string>('');

  private readonly autoRerollTargetSpec = computed<AutoRerollTargetSpec | null>(() => {
    const slotIndex = this.SelectedAffixIndex();
    if (slotIndex === null) return null;
    if (!this.HasAffix(slotIndex)) return null;

    const targetId = this.AutoRerollTargetId();
    if (!targetId) return null;

    return this.computeAutoRerollTargetSpec(slotIndex, targetId);
  });

  protected readonly AutoRerollOptions = computed<AutoRerollOption[]>(() => {
    const pool = GetAffixPool(this.Variant().Slot);

    const options: AutoRerollOption[] = pool.map((definition) => {
      const label: Label = definition.Effect.ToLabel(1);
      const suffix = label.ValueType === 'Percentage' ? ' (%)' : '';
      return { Id: definition.Id, Label: `${label.Stat}${suffix}` };
    });

    options.sort((a, b) => a.Label.localeCompare(b.Label));
    return options;
  });

  protected SetAutoRerollTargetId(id: string): void {
    this.AutoRerollTargetId.set(id);
    this.AutoRerollMinValueRaw.set('');
  }

  protected SetAutoRerollMinValueRaw(raw: string): void {
    // Enforce whole-number input even when the browser allows pasting "7.5" etc.
    const trimmed = raw.trim();
    if (!trimmed) {
      this.AutoRerollMinValueRaw.set('');
      return;
    }

    const digitsOnly = trimmed.replace(/[^\d]/g, '');
    this.AutoRerollMinValueRaw.set(digitsOnly);
  }

  protected ClampAutoRerollMinValueToRange(): void {
    const raw = this.AutoRerollMinValueRaw().trim();
    if (!raw) return;

    const n = this.parseWholeNumber(raw);
    this.AutoRerollMinValueRaw.set(n === null ? '' : String(n));
    if (n === null) return;

    const spec = this.autoRerollTargetSpec();
    if (!spec) return;

    const bounds = this.getAutoRerollUiBounds(spec);
    const clamped = Math.min(bounds.max, Math.max(bounds.min, n));
    this.AutoRerollMinValueRaw.set(String(clamped));
  }

  protected BlockNonNumericInNumberInput(event: KeyboardEvent): void {
    // Browsers allow e/E/+/- in type="number". This blocks them for nicer UX.
    // We also block "." and "," so users can only type whole numbers.
    if (
      event.key === 'e' ||
      event.key === 'E' ||
      event.key === '+' ||
      event.key === '-' ||
      event.key === '.' ||
      event.key === ','
    ) {
      event.preventDefault();
    }
  }

  protected readonly AutoRerollTargetValueType = computed<'Flat' | 'Percent' | null>(() => {
    return this.autoRerollTargetSpec()?.type ?? null;
  });

  protected readonly AutoRerollMinValueUiMin = computed<number | null>(() => {
    const spec = this.autoRerollTargetSpec();
    if (!spec) return null;
    return this.getAutoRerollUiBounds(spec).min;
  });

  protected readonly AutoRerollMinValueUiMax = computed<number | null>(() => {
    const spec = this.autoRerollTargetSpec();
    if (!spec) return null;
    return this.getAutoRerollUiBounds(spec).max;
  });

  protected readonly AutoRerollTargetRangeLabel = computed<string>(() => {
    const spec = this.autoRerollTargetSpec();
    if (!spec) return '';
    return this.formatAutoRerollRangeLabel(spec);
  });

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

    const minValue = this.parseAutoRerollMinValue();
    if (minValue === undefined) {
      this.AutoRerollStatus.set('Min value is invalid.');
      return;
    }

    this.autoRerollToken++;
    const token = this.autoRerollToken;

    this.AutoRerollOpen.set(true);
    this.AutoRerollRunning.set(true);
    this.AutoRerollAttempts.set(0);
    this.AutoRerollStatus.set('Auto reroll running...');

    void this.RunAutoReroll(token, slotIndex, targetId, minValue ?? null);
  }

  private async RunAutoReroll(
    token: number,
    slotIndex: number,
    targetId: string,
    minValue: number | null
  ): Promise<void> {
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

      const affix = item.Affixes[slotIndex];
      const matchesType = affix?.DefinitionId === targetId;
      const matchesValue =
        minValue === null || !affix ? true : GetAffixValue(affix) >= minValue;
      if (matchesType && matchesValue) {
        this.AutoRerollStatus.set(`Found after ${nextAttempts} rerolls.`);
        break;
      }

      await this.sleep(Enchanting.AUTO_REROLL_DELAY_MS);
    }

    if (token === this.autoRerollToken) {
      this.AutoRerollRunning.set(false);
    }
  }

  /**
   * Returns:
   * - null: no min value set (type-only target)
   * - number: parsed min value
   * - undefined: invalid input
   */
  private parseAutoRerollMinValue(): number | null | undefined {
    const raw = this.AutoRerollMinValueRaw().trim();
    if (!raw) return null;

    const n = this.parseWholeNumber(raw);
    this.AutoRerollMinValueRaw.set(n === null ? '' : String(n));
    if (n === null) return;

    const spec = this.autoRerollTargetSpec();
    if (!spec) return undefined;

    const bounds = this.getAutoRerollUiBounds(spec);
    if (n < bounds.min || n > bounds.max) return undefined;

    return this.autoRerollUiValueToInternalMinValue(n, spec);
  }

  private parseWholeNumber(raw: unknown): number | null {
    if (raw === null || raw === undefined) return null;

    if (typeof raw === 'number') {
      return Number.isSafeInteger(raw) ? raw : null;
    }

    if (typeof raw !== 'string') return null;

    const s = raw.trim();
    if (s === '') return null;
    if (!/^[+-]?\d+$/.test(s)) return null;

    const n = Number(s);
    return Number.isSafeInteger(n) ? n : null;
  }

  private computeAutoRerollTargetSpec(
    slotIndex: number,
    targetId: string
  ): AutoRerollTargetSpec | null {
    const item = this.Item();
    if (slotIndex < 0 || slotIndex >= item.Affixes.length) return null;

    const tier: AffixTier = item.Affixes[slotIndex].Tier;
    const definition = GetAffixDefinition(targetId);
    const tierSpec = GetAffixTierSpec(definition, tier);
    const minMax = GetAffixMinMaxRoll(tierSpec);

    return { min: minMax.min, max: minMax.max, type: tierSpec.Value.Type };
  }

  private getAutoRerollUiBounds(spec: AutoRerollTargetSpec): { min: number; max: number } {
    // Percent stats: UI uses percent points (e.g. 8 means 8%).
    if (spec.type === 'Percent') {
      return { min: Math.ceil(spec.min * 100), max: Math.floor(spec.max * 100) };
    }

    // Flat stats: UI uses whole numbers.
    return { min: Math.ceil(spec.min), max: Math.floor(spec.max) };
  }

  private autoRerollUiValueToInternalMinValue(uiValue: number, spec: AutoRerollTargetSpec): number {
    return spec.type === 'Percent' ? uiValue / 100 : uiValue;
  }

  private formatAutoRerollRangeLabel(spec: AutoRerollTargetSpec): string {
    if (spec.type === 'Percent') {
      const min = Math.round(spec.min * 100);
      const max = Math.round(spec.max * 100);
      return `${min}% - ${max}%`;
    }

    const min = Math.round(spec.min);
    const max = Math.round(spec.max);
    return `${min} - ${max}`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private resetAutoRerollUiState(): void {
    this.AutoRerollOpen.set(false);
    this.AutoRerollTargetId.set('');
    this.AutoRerollMinValueRaw.set('');
    this.AutoRerollAttempts.set(0);
    this.AutoRerollStatus.set('');
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
