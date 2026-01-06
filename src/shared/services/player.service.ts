import { Injectable, computed, signal } from '@angular/core';

import { ChanceUtils } from '../utils';
import { Level } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private BASE_CHC = 0.05;
  private MAX_CHC = 1;
  private BASE_ATTACK_SPEED = 1;

  public Name = signal('Hero');
  public Level = signal(new Level());
  public Class = signal('Wizard');

  public Strength = signal(1);
  public Intelligence = signal(1);
  public Dexterity = signal(1);

  public AttackPower = computed(() => (this.Strength() === 1 ? 1 : 1 + (this.Strength() - 1) * 2));
  public AttackSpeed = computed(() => this.BASE_ATTACK_SPEED + (this.Dexterity() - 1) / 100);
  public CriticalHitChance = computed(() =>
    Math.min(this.BASE_CHC + (this.Intelligence() - 1) / 100, this.MAX_CHC)
  );
  public CriticalHitDamage = signal(1.5);

  public Attack(): number {
    // Critical Hit Calculation
    if (ChanceUtils.success(this.CriticalHitChance())) {
      console.log('Critical Hit!');
      return Math.ceil(this.AttackPower() * this.CriticalHitDamage());
    }
    // Default Hit
    else {
      return this.AttackPower();
    }
  }

  public IncreaseAttribute(attribute: 'Strength' | 'Intelligence' | 'Dexterity'): void {
    if (this.Level().UnspentSkillPoints <= 0) {
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

    this.Level().UnspentSkillPoints -= 1;
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
    this.Level().UnspentSkillPoints += 1;
  }
}
