import { StatType } from '../stats/stat-type';

export class Enchantment {
  constructor(
    public Stat: StatType,
    public Value: number
  ) {}

  public get DisplayName(): string {
    return this.GetStatDisplayName(this.Stat);
  }

  private GetStatDisplayName(stat: StatType): string {
    switch (stat) {
      case 'Strength':
        return '+' + this.Value + ' Strength';

      case 'Dexterity':
        return '+' + this.Value + ' Dexterity';

      case 'Intelligence':
        return '+' + this.Value + ' Intelligence';

      case 'CriticalHitChance':
        return 'x' + Math.round(this.Value * 100) + '% Critical Hit Chance';

      case 'CriticalHitDamage':
        return 'x' + Math.round(this.Value * 100) + '% Critical Hit Damage';

      case 'AttackSpeed':
        return 'x' + Math.round(this.Value * 100) + '% Attack Speed';

      case 'MultiHitChance':
        return 'x' + Math.round(this.Value * 100) + '% Multi-Hit Chance';

      case 'MultiHitDamage':
        return 'x' + Math.round(this.Value * 100) + '% Multi-Hit Damage';

      default:
        return stat;
    }
  }
}
