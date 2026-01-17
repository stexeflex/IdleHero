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
import { ChanceUtils, FlagsUtils } from '../../utils';
import { Injectable, computed, signal } from '@angular/core';

import { AttributesService } from './attributes.service';
import { BuffsService } from '../buffs-service';
import { InventoryService } from './inventory.service';
import { LevelService } from './level.service';
import { STATS_CONFIG } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  /* Combat Stats */
  public AttackPower = computed(() => {
    const modifier: number = this.GetModifierFromBuffs(['Attack Boost']);
    return AttackPower.Calculate(this.attributesService.Strength(), modifier);
  });

  public AttackSpeed = computed(() => {
    const bonus: number = this.inventoryService.GetBonusStatFromGear('AttackSpeed');
    const modifier: number = this.GetModifierFromBuffs(['Speed Boost']);
    return AttackSpeed.Calculate(this.attributesService.Dexterity(), bonus, modifier);
  });

  public CriticalHitChance = computed(() => {
    const bonus = this.inventoryService.GetBonusStatFromGear('CriticalHitChance');
    const modifier: number = this.GetModifierFromBuffs(['Critical Focus']);
    return CriticalHitChance.Calculate(this.attributesService.Intelligence(), bonus, modifier);
  });

  private _criticalHitDamageStat = signal(STATS_CONFIG.CHD.BASE);
  public CriticalHitDamage = computed(() => {
    const bonus: number = this.inventoryService.GetBonusStatFromGear('CriticalHitDamage');
    return this._criticalHitDamageStat() + bonus;
  });

  public MultiHitChance = computed(() => {
    const bonus: number = this.inventoryService.GetBonusStatFromGear('MultiHitChance');
    const modifier: number = this.GetModifierFromBuffs(['Multi-Hit Frenzy']);
    return MultiHitChance.Calculate(this.attributesService.Dexterity(), bonus, modifier);
  });

  public MultiHitDamage = signal(STATS_CONFIG.MHD.BASE);

  constructor(
    private attributesService: AttributesService,
    private inventoryService: InventoryService,
    private buffsService: BuffsService
  ) {}

  public Attack(): AttackResult {
    let damage: number = this.AttackPower();
    let attackType: AttackType = AttackType.Normal;

    /* Critical Hit Calculation */
    if (ChanceUtils.success(this.CriticalHitChance())) {
      damage = CriticalHitDamage.Calculate(damage, this.CriticalHitDamage());
      attackType = FlagsUtils.AddFlag(attackType, AttackType.Critical);
    }

    /* Multi Hit Calculation */
    if (ChanceUtils.success(this.MultiHitChance())) {
      damage = MultiHitDamage.Calculate(damage, this.MultiHitDamage());
      attackType = FlagsUtils.AddFlag(attackType, AttackType.MultiHit);
    }

    return {
      Damage: damage,
      AttackType: attackType
    } as AttackResult;
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
