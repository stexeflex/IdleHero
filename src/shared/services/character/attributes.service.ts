import { Injectable, computed, signal } from '@angular/core';

import { AttributesSchema } from '../../../persistence';
import { InventoryService } from './inventory.service';
import { LevelService } from './level.service';
import { STATS_CONFIG } from '../../constants';

@Injectable({ providedIn: 'root' })
export class AttributesService {
  /* STRENGTH */
  private _strengthStat = signal(STATS_CONFIG.ATTRIBUTES.STRENGTH_BASE);
  public StrengthStat = this._strengthStat.asReadonly();
  public Strength = computed(() => {
    const bonus: number = this.inventoryService.GetBonusStatFromGear('Strength');
    return this.StrengthStat() + bonus;
  });

  /* INTELLIGENCE */
  private _intelligenceStat = signal(STATS_CONFIG.ATTRIBUTES.INTELLIGENCE_BASE);
  public IntelligenceStat = this._intelligenceStat.asReadonly();
  public Intelligence = computed(() => {
    const bonus: number = this.inventoryService.GetBonusStatFromGear('Intelligence');
    return this.IntelligenceStat() + bonus;
  });

  /* DEXTERITY */
  private _dexterityStat = signal(STATS_CONFIG.ATTRIBUTES.DEXTERITY_BASE);
  public DexterityStat = this._dexterityStat.asReadonly();
  public Dexterity = computed(() => {
    const bonus: number = this.inventoryService.GetBonusStatFromGear('Dexterity');
    return this.DexterityStat() + bonus;
  });

  constructor(
    private inventoryService: InventoryService,
    private levelService: LevelService
  ) {}

  public Init(statsSchema: AttributesSchema) {
    this._strengthStat.set(statsSchema.Strength);
    this._intelligenceStat.set(statsSchema.Intelligence);
    this._dexterityStat.set(statsSchema.Dexterity);
  }

  public CollectSchema(schema: AttributesSchema): AttributesSchema {
    schema.Strength = this.StrengthStat();
    schema.Intelligence = this.IntelligenceStat();
    schema.Dexterity = this.DexterityStat();
    return schema;
  }

  public IncreaseAttribute(attribute: 'Strength' | 'Intelligence' | 'Dexterity'): void {
    if (this.levelService.UnspentAttributePoints() <= 0) {
      return;
    }

    switch (attribute) {
      case 'Strength':
        this._strengthStat.set(this._strengthStat() + 1);
        break;
      case 'Intelligence':
        this._intelligenceStat.set(this._intelligenceStat() + 1);
        break;
      case 'Dexterity':
        this._dexterityStat.set(this._dexterityStat() + 1);
        break;
    }

    this.levelService.SpentSkillPoint();
  }

  public DecreaseAttribute(attribute: 'Strength' | 'Intelligence' | 'Dexterity'): void {
    if (this.levelService.SpentAttributePoints() <= 0) {
      return;
    }

    switch (attribute) {
      case 'Strength':
        if (this.Strength() <= 1) return;
        this._strengthStat.set(this._strengthStat() - 1);
        break;

      case 'Intelligence':
        if (this.Intelligence() <= 1) return;
        this._intelligenceStat.set(this._intelligenceStat() - 1);
        break;

      case 'Dexterity':
        if (this.Dexterity() <= 1) return;
        this._dexterityStat.set(this._dexterityStat() - 1);
        break;
    }

    this.levelService.UnspentSkillPoint();
  }
}
