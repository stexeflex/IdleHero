import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HeroStatsStateService {
  public AttributesExpanded = signal<boolean>(true);
  public ChargingStrikeStatsExpanded = signal<boolean>(true);
  public OffenseStatsExpanded = signal<boolean>(true);
  public UtilityStatsExpanded = signal<boolean>(true);
}
