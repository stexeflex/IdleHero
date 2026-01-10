import {
  AttackPower,
  AttackResult,
  AttackSpeed,
  AttackType,
  CriticalHitChance,
  CriticalHitDamage,
  MultiHitChance,
  MultiHitDamage
} from '../models';
import { Injectable, computed, signal } from '@angular/core';

import { BuffsService } from './buffs-service';
import { ChanceUtils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private readonly SKILL_POINTS_PER_LEVEL = 1;

  public UnspentSkillPoints = signal(0);

  /* Attributes */
  public Strength = signal(1);
  public Intelligence = signal(1);
  public Dexterity = signal(1);

  /* Combat Stats */
  public AttackPower = computed(() => {
    const modifier: number = this.GetModifierFromBuffs(['Attack Boost']);
    return AttackPower.Calculate(this.Strength(), modifier);
  });

  public AttackSpeed = computed(() => {
    const modifier: number = this.GetModifierFromBuffs(['Speed Boost']);
    return AttackSpeed.Calculate(this.Dexterity(), modifier);
  });

  public CriticalHitChance = computed(() => {
    const modifier: number = this.GetModifierFromBuffs(['Critical Focus']);
    return CriticalHitChance.Calculate(this.Intelligence(), modifier);
  });

  public CriticalHitDamage = signal(1.5);

  public MultiHitChance = computed(() => {
    const modifier: number = this.GetModifierFromBuffs(['Multi-Hit Frenzy']);
    return MultiHitChance.Calculate(this.Dexterity(), modifier);
  });

  public MultiHitDamage = signal(2);

  constructor(private buffsService: BuffsService) {}

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

  public LevelUp() {
    this.UnspentSkillPoints.set(this.UnspentSkillPoints() + this.SKILL_POINTS_PER_LEVEL);
  }

  public IncreaseAttribute(attribute: 'Strength' | 'Intelligence' | 'Dexterity'): void {
    if (this.UnspentSkillPoints() <= 0) {
      return;
    }

    switch (attribute) {
      case 'Strength':
        this.Strength.set(this.Strength() + 1);
        break;
      case 'Intelligence':
        this.Intelligence.set(this.Intelligence() + 1);
        break;
      case 'Dexterity':
        this.Dexterity.set(this.Dexterity() + 1);
        break;
    }

    this.UnspentSkillPoints.set(this.UnspentSkillPoints() - 1);
  }

  public DecreaseAttribute(attribute: 'Strength' | 'Intelligence' | 'Dexterity'): void {
    switch (attribute) {
      case 'Strength':
        if (this.Strength() <= 1) return;
        this.Strength.set(this.Strength() - 1);
        break;

      case 'Intelligence':
        if (this.Intelligence() <= 1) return;
        this.Intelligence.set(this.Intelligence() - 1);
        break;

      case 'Dexterity':
        if (this.Dexterity() <= 1) return;
        this.Dexterity.set(this.Dexterity() - 1);
        break;
    }

    this.UnspentSkillPoints.set(this.UnspentSkillPoints() + 1);
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
