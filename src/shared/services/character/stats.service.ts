import {
  AttackPower,
  AttackResult,
  AttackSpeed,
  AttackType,
  CriticalHitChance,
  CriticalHitDamage,
  MultiHitChance,
  MultiHitDamage
} from '../../models';
import { Injectable, computed, signal } from '@angular/core';

import { BuffsService } from '../buffs-service';
import { ChanceUtils } from '../../utils';
import { InventoryService } from './inventory.service';
import { LevelService } from './level.service';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  /* Attributes */
  private _strengthStat = signal(1);
  public StrengthStat = this._strengthStat.asReadonly();
  public Strength = computed(() => {
    const bonus: number = this.inventoryService.GetBonusStatFromGear('Strength');
    return this.StrengthStat() + bonus;
  });

  private _intelligenceStat = signal(1);
  public IntelligenceStat = this._intelligenceStat.asReadonly();
  public Intelligence = computed(() => {
    const bonus: number = this.inventoryService.GetBonusStatFromGear('Intelligence');
    return this.IntelligenceStat() + bonus;
  });

  private _dexterityStat = signal(1);
  public DexterityStat = this._dexterityStat.asReadonly();
  public Dexterity = computed(() => {
    const bonus: number = this.inventoryService.GetBonusStatFromGear('Dexterity');
    return this.DexterityStat() + bonus;
  });

  /* Combat Stats */
  public AttackPower = computed(() => {
    const modifier: number = this.GetModifierFromBuffs(['Attack Boost']);
    return AttackPower.Calculate(this.Strength(), modifier);
  });

  public AttackSpeed = computed(() => {
    const bonus: number = this.inventoryService.GetBonusStatFromGear('AttackSpeed');
    const modifier: number = this.GetModifierFromBuffs(['Speed Boost']);
    return AttackSpeed.Calculate(this.Dexterity(), bonus, modifier);
  });

  public CriticalHitChance = computed(() => {
    const bonus = this.inventoryService.GetBonusStatFromGear('CriticalHitChance');
    const modifier: number = this.GetModifierFromBuffs(['Critical Focus']);
    return CriticalHitChance.Calculate(this.Intelligence(), bonus, modifier);
  });

  private _criticalHitDamageStat = signal(1.5);
  public CriticalHitDamage = computed(() => {
    const bonus: number = this.inventoryService.GetBonusStatFromGear('CriticalHitDamage');
    return this._criticalHitDamageStat() + bonus;
  });

  public MultiHitChance = computed(() => {
    const bonus: number = this.inventoryService.GetBonusStatFromGear('MultiHitChance');
    const modifier: number = this.GetModifierFromBuffs(['Multi-Hit Frenzy']);
    return MultiHitChance.Calculate(this.Dexterity(), bonus, modifier);
  });

  public MultiHitDamage = signal(2);

  constructor(
    private levelService: LevelService,
    private inventoryService: InventoryService,
    private buffsService: BuffsService
  ) {}

  public Attack(): AttackResult {
    let damage: number = this.AttackPower();
    let attackType: AttackType = AttackType.Normal;

    /* Critical Hit Calculation */
    if (ChanceUtils.success(this.CriticalHitChance())) {
      damage = CriticalHitDamage.Calculate(damage, this.CriticalHitDamage());
      attackType |= AttackType.Critical;
    }

    /* Multi Hit Calculation */
    if (ChanceUtils.success(this.MultiHitChance())) {
      damage = MultiHitDamage.Calculate(damage, this.MultiHitDamage());
      attackType |= AttackType.MultiHit;
    }

    return {
      Damage: damage,
      AttackType: attackType
    } as AttackResult;
  }

  public IncreaseAttribute(attribute: 'Strength' | 'Intelligence' | 'Dexterity'): void {
    if (this.levelService.UnspentSkillPoints() <= 0) {
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
    if (this.levelService.SpentSkillPoints() <= 0) {
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

  private GetModifierFromBuffs(buffs: string[]): number {
    let modifier: number = 1;

    this.buffsService
      .Buffs()
      .filter((buff) => buff.IsActive && buffs.includes(buff.Name))
      .forEach((buff) => {
        if (buff.Modifier) {
          modifier += buff.Modifier;
        }
      });

    return modifier;
  }
}
