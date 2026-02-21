import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CombatLogEntry, DamageLogEntry } from '../../../../core/models';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { IconComponent, Separator } from '../../../../shared/components';

import { CombatActorIcon } from './combat-actor-icon/combat-actor-icon';
import { CombatLogService } from '../../../../core/services';
import { TimestampUtils } from '../../../../shared/utils';

interface DamageLogEntryExtended {
  ActorClass: string;
  ActionContent: string;
  TotalDamage: number;
  DamageDetails: string;
  AdditionalDetails: AdditionalDetail[];
}

interface AdditionalDetail {
  value: string;
  class: string;
}

@Component({
  selector: 'app-combat-log',
  imports: [DecimalPipe, PercentPipe, CombatActorIcon, IconComponent, Separator],
  templateUrl: './combat-log.html',
  styleUrl: './combat-log.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CombatLog {
  private readonly Log = inject(CombatLogService);

  private readonly Entries = this.Log.Entries;
  protected readonly VisibleEntries = computed<CombatLogEntry[]>(() => this.Entries());

  protected DamageLogEntryExtended(entry: DamageLogEntry): DamageLogEntryExtended {
    const totalDamage = entry.Damage.reduce((sum, dmg) => sum + dmg.Amount, 0);

    return {
      ActorClass: this.DamageActorClass(entry),
      ActionContent: this.ActionContent(entry),
      TotalDamage: totalDamage,
      DamageDetails: this.DamageDetails(entry),
      AdditionalDetails: this.AdditionalDetails(entry)
    };
  }

  private DamageActorClass(entry: DamageLogEntry): string {
    const isCritical = entry.Damage.some((d) => d.IsCritical);

    if (isCritical && entry.IsMultiHit) {
      return 'log-critical-multi';
    } else if (entry.IsMultiHit) {
      return 'log-multi';
    } else if (isCritical) {
      return 'log-critical';
    } else {
      return '';
    }
  }

  private ActionContent(entry: DamageLogEntry): string {
    const isCritical = entry.Damage.some((d) => d.IsCritical);

    if (isCritical && entry.IsMultiHit) {
      return '⚡⚔️';
    } else if (entry.IsMultiHit) {
      return '⚔️';
    } else if (isCritical) {
      return '⚡';
    } else {
      return '🗡️';
    }
  }

  private DamageDetails(entry: DamageLogEntry): string {
    let damageDetails = 'HIT';

    if (entry.Damage.length > 1) {
      damageDetails = 'MULTI ' + damageDetails + ' [x' + entry.Damage.length + ']';
    }

    if (entry.Damage.some((d) => d.IsCritical)) {
      damageDetails = 'CRITICAL ' + damageDetails;
    }

    return damageDetails === 'HIT' ? '' : damageDetails;
  }

  private AdditionalDetails(entry: DamageLogEntry): AdditionalDetail[] {
    const details: AdditionalDetail[] = [];

    if (entry.Damage.some((d) => d.IsBleeding)) {
      details.push({ value: 'BLEEDING', class: 'log-bleed' });
    }

    if (entry.Damage.some((d) => d.IsCharged)) {
      details.push({ value: 'CHARGED', class: 'log-charged' });
    }

    return details;
  }

  protected FormatTimestamp(timestampMs: number): string {
    return TimestampUtils.FormatTimestamp(timestampMs);
  }
}
