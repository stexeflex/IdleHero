import { AttributesService, CombatStatsService, LevelService } from '../../../../core/services';
import { Component, LOCALE_ID, computed, inject, signal } from '@angular/core';
import { DecimalPipe, PercentPipe } from '@angular/common';

import { AttributesSpecifications } from '../../../../shared/specifications';
import { IconComponent } from '../../../../shared/components';
import { StatisticsService } from '../../../../shared/services';

interface StatsItem {
  label: string;
  value: any | null;
}

interface StatsGrid {
  title: string;
  items: StatsItem[];
  expanded: boolean;
}

@Component({
  selector: 'app-stats',
  imports: [IconComponent],
  templateUrl: './stats.html',
  styleUrl: './stats.scss'
})
export class Stats {
  private readonly locale = inject(LOCALE_ID);
  private readonly attributesService = inject(AttributesService);
  private readonly statsService = inject(CombatStatsService);
  private readonly levelService = inject(LevelService);
  private readonly statisticsService = inject(StatisticsService);
  private readonly canChangeAttributes = inject(AttributesSpecifications);

  private readonly decimalPipe: DecimalPipe;
  private readonly percentPipe: PercentPipe;

  protected AttributesExpanded = signal<boolean>(true);
  protected ChargingStrikeStatsExpanded = signal<boolean>(true);
  protected OffenseStatsExpanded = signal<boolean>(true);
  protected UtilityStatsExpanded = signal<boolean>(true);
  protected StatisticsExpanded = signal<boolean>(false);

  constructor() {
    this.decimalPipe = new DecimalPipe(this.locale);
    this.percentPipe = new PercentPipe(this.locale);
  }

  get ShowAttributePoints(): boolean {
    return this.levelService.UnspentAttributePoints() > 0;
  }

  get AttributePoints(): string | undefined {
    return this.attributesService.AllocatedTotal() > 0
      ? this.levelService.UnspentAttributePoints() + ' / ' + this.attributesService.AllocatedTotal()
      : undefined;
  }

  get CanIncreaseAttributes(): boolean {
    return this.canChangeAttributes.CanIncrease();
  }

  protected readonly AllStats = computed<StatsGrid[]>(() => [
    {
      title: 'CHARGING STRIKE',
      items: this.ChargingStrikeStats(),
      expanded: this.ChargingStrikeStatsExpanded()
    },
    {
      title: 'OFFENSE',
      items: this.OffenseStats(),
      expanded: this.OffenseStatsExpanded()
    },
    {
      title: 'UTILITY',
      items: this.UtilityStats(),
      expanded: this.UtilityStatsExpanded()
    },
    {
      title: 'STATISTICS',
      items: this.Statistics(),
      expanded: this.StatisticsExpanded()
    }
  ]);

  protected Attributes = computed<StatsItem[]>(() => {
    const attributes = this.attributesService.Effective();

    return [
      {
        label: 'Strength',
        value: this.decimalPipe.transform(attributes.Strength, '1.0-0')
      },
      {
        label: 'Intelligence',
        value: this.decimalPipe.transform(attributes.Intelligence, '1.0-0')
      },
      {
        label: 'Dexterity',
        value: this.decimalPipe.transform(attributes.Dexterity, '1.0-0')
      }
    ];
  });

  private ChargingStrikeStats = computed<StatsItem[]>(() => {
    const combatStats = this.statsService.Effective();

    return [
      {
        label: 'Charge Gain',
        value: this.decimalPipe.transform(combatStats.ChargeGain, '1.0-0') + ' / Hit'
      },
      {
        label: 'Charging Strike Damage',
        value: this.percentPipe.transform(combatStats.ChargeDamage, '1.0-0')
      },
      {
        label: 'Charged Duration',
        value: this.decimalPipe.transform(combatStats.ChargeDuration, '1.1-1', 'en-en') + ' s'
      }
    ];
  });

  private OffenseStats = computed<StatsItem[]>(() => {
    const combatStats = this.statsService.Effective();

    return [
      {
        label: 'Bleeding Chance',
        value: this.percentPipe.transform(combatStats.BleedingChance, '1.0-0')
      },
      {
        label: 'Bleeding Damage',
        value: this.percentPipe.transform(combatStats.BleedingDamage, '1.0-0')
      },
      {
        label: 'Critical Hit Chance',
        value: this.percentPipe.transform(combatStats.CriticalHitChance, '1.0-0')
      },
      {
        label: 'Critical Hit Damage',
        value: this.percentPipe.transform(combatStats.CriticalHitDamage, '1.0-0')
      },
      {
        label: 'Multi Hit Chance',
        value: this.percentPipe.transform(combatStats.MultiHitChance, '1.0-0')
      },
      {
        label: 'Multi Hit Chain',
        value: this.percentPipe.transform(combatStats.MultiHitChainFactor, '1.0-0')
      },
      {
        label: 'Multi Hit Damage',
        value: this.percentPipe.transform(combatStats.MultiHitDamage, '1.0-0')
      }
    ];
  });

  private UtilityStats = computed<StatsItem[]>(() => {
    const combatStats = this.statsService.Effective();

    return [
      {
        label: 'Attack Speed',
        value: this.percentPipe.transform(combatStats.AttackSpeed, '1.0-0')
      },
      {
        label: 'Accuracy',
        value: this.percentPipe.transform(combatStats.Accuracy, '1.0-0')
      },
      {
        label: 'Armor Penetration',
        value: this.percentPipe.transform(combatStats.ArmorPenetration, '1.0-0')
      },
      {
        label: 'Resistance Penetration',
        value: this.percentPipe.transform(combatStats.ResistancePenetration, '1.0-0')
      }
    ];
  });

  private Statistics = computed<StatsItem[]>(() => {
    return [
      {
        label: 'Highest Single Hit',
        value: this.decimalPipe.transform(
          this.statisticsService.DamageStatistics().HighestSingleHit,
          '1.0-0'
        )
      },
      {
        label: 'Highest Bleeding Tick',
        value: this.decimalPipe.transform(0, '1.0-0')
      },
      {
        label: 'Highest Critical Hit',
        value: this.decimalPipe.transform(
          this.statisticsService.DamageStatistics().HighestCriticalHit,
          '1.0-0'
        )
      },
      {
        label: 'Highest Multi Hit',
        value: this.decimalPipe.transform(
          this.statisticsService.DamageStatistics().HighestMultiHit,
          '1.0-0'
        )
      },
      {
        label: 'Highest Multi Hit Chain',
        value: this.decimalPipe.transform(0, '1.0-0')
      },
      {
        label: 'Highest Critical Multi Hit',
        value: this.decimalPipe.transform(
          this.statisticsService.DamageStatistics().HighestCriticalMultiHit,
          '1.0-0'
        )
      },
      {
        label: 'Highest Splash Hit',
        value: this.decimalPipe.transform(
          this.statisticsService.DamageStatistics().HighestSplashHit,
          '1.0-0'
        )
      }
    ];
  });

  protected CanDecreaseAttribute(attribute: string): boolean {
    return this.attributesService.CanDeallocate(
      attribute as 'Strength' | 'Intelligence' | 'Dexterity'
    );
  }

  protected increaseAttribute(attribute: string) {
    this.attributesService.Allocate(attribute as 'Strength' | 'Intelligence' | 'Dexterity', 1);
  }

  protected decreaseAttribute(attribute: string) {
    this.attributesService.Deallocate(attribute as 'Strength' | 'Intelligence' | 'Dexterity', 1);
  }
}
