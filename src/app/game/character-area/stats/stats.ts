import { AttributesService, CombatStatsService, LevelService } from '../../../../core/services';
import { Component, LOCALE_ID, computed, inject, signal } from '@angular/core';
import { DecimalPipe, PercentPipe } from '@angular/common';

import { ATTRIBUTES_CONFIG } from '../../../../core/constants';
import { Attributes } from '../../../../core/models';
import { CombatState } from '../../../../core/systems/combat';
import { IconComponent } from '../../../../shared/components';
import { ToggleIcon } from './toggle-icon/toggle-icon';

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
  imports: [IconComponent, ToggleIcon],
  templateUrl: './stats.html',
  styleUrl: './stats.scss'
})
export class Stats {
  private readonly locale = inject(LOCALE_ID);
  private readonly combatState = inject(CombatState);
  private readonly attributesService = inject(AttributesService);
  private readonly levelService = inject(LevelService);
  private readonly statsService = inject(CombatStatsService);

  private readonly decimalPipe: DecimalPipe = new DecimalPipe(this.locale);
  private readonly percentPipe: PercentPipe = new PercentPipe(this.locale);

  // UI State
  protected AttributesExpanded = signal<boolean>(true);
  protected ChargingStrikeStatsExpanded = signal<boolean>(true);
  protected OffenseStatsExpanded = signal<boolean>(true);
  protected UtilityStatsExpanded = signal<boolean>(true);

  //#region ATTRIBUTES
  protected readonly ShowAttributePoints = computed<boolean>(
    () => this.attributesService.UnallocatedPoints() > 0
  );

  protected readonly AttributePoints = computed<string>(() => {
    const unspent: number = this.attributesService.UnallocatedPoints();
    return `${unspent}`;
  });

  protected readonly CanIncreaseAttributes = computed<boolean>(() => {
    const battleInProgress = this.combatState.InProgress();
    const hasUnspentPoints = this.attributesService.UnallocatedPoints() > 0;
    return !battleInProgress && hasUnspentPoints;
  });

  protected CanDecreaseAttribute(attribute: string): boolean {
    const battleInProgress = this.combatState.InProgress();
    const canDeallocate = this.attributesService.CanDeallocate(
      attribute as 'Strength' | 'Intelligence' | 'Dexterity'
    );
    return !battleInProgress && canDeallocate;
  }

  protected increaseAttribute(attribute: string) {
    this.attributesService.Allocate(attribute as 'Strength' | 'Intelligence' | 'Dexterity', 1);
  }

  protected decreaseAttribute(attribute: string) {
    this.attributesService.Deallocate(attribute as 'Strength' | 'Intelligence' | 'Dexterity', 1);
  }
  //#endregion ATTRIBUTES

  //#region STATS
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
    }
  ]);

  protected Attributes = computed<StatsItem[]>(() => {
    const attributes: Attributes = this.statsService.EffectiveAttributes();
    const displayValues: Attributes = {
      Strength: attributes.Strength + ATTRIBUTES_CONFIG.BASE.STRENGTH,
      Intelligence: attributes.Intelligence + ATTRIBUTES_CONFIG.BASE.INTELLIGENCE,
      Dexterity: attributes.Dexterity + ATTRIBUTES_CONFIG.BASE.DEXTERITY
    };

    return [
      {
        label: 'Strength',
        value: this.decimalPipe.transform(displayValues.Strength, '1.0-0')
      },
      {
        label: 'Intelligence',
        value: this.decimalPipe.transform(displayValues.Intelligence, '1.0-0')
      },
      {
        label: 'Dexterity',
        value: this.decimalPipe.transform(displayValues.Dexterity, '1.0-0')
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
        label: 'Charge Loss',
        value: this.percentPipe.transform(combatStats.ChargeLoss, '1.0-0') + ' / Miss'
      },
      {
        label: 'Charged Damage',
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
        label: 'Bleeding Ticks',
        value: this.decimalPipe.transform(combatStats.BleedingTicks, '1.0-0')
      },
      {
        label: 'Multi Hit Chain',
        value: this.decimalPipe.transform(combatStats.MultiHitChain, '1.0-0')
      },
      {
        label: 'Multi Hit Chain Factor',
        value: this.percentPipe.transform(combatStats.MultiHitChainFactor, '1.0-0')
      }
      // {
      //   label: 'Armor Penetration',
      //   value: this.percentPipe.transform(combatStats.ArmorPenetration, '1.0-0')
      // },
      // {
      //   label: 'Resistance Penetration',
      //   value: this.percentPipe.transform(combatStats.ResistancePenetration, '1.0-0')
      // }
    ];
  });
  //#endregion STATS
}
