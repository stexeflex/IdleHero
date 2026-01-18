import { Component, inject } from '@angular/core';
import { CurrencyService, HeroService } from '../../../shared/services';
import { Gold, IconComponent, Separator } from '../../../shared/components';

import { DecimalPipe } from '@angular/common';
import { DungeonRoomKey } from '../../../shared/models';

@Component({
  selector: 'app-info-area',
  imports: [DecimalPipe, Gold, Separator, IconComponent],
  templateUrl: './info-area.html',
  styleUrl: './info-area.scss'
})
export class InfoArea {
  readonly currencyService = inject<CurrencyService>(CurrencyService);
  readonly heroService = inject<HeroService>(HeroService);

  protected get GoldAmount(): number {
    return this.currencyService.Gold();
  }

  protected get PrestigeLevel(): number {
    return this.heroService.PrestigeLevel();
  }

  protected get MaxStage(): number {
    return this.heroService.HighestStageReached();
  }

  protected get MaxDamageDealt(): number {
    return this.heroService.HighestDamageDealt();
  }

  protected get HasAnyKey(): boolean {
    return (
      this.currencyService.SilverKey() ||
      this.currencyService.MagicKey() ||
      this.currencyService.GoldenKey()
    );
  }

  protected HasKey(key: DungeonRoomKey): boolean {
    return this.currencyService.HasKey(key);
  }
}
