import { Injectable, inject } from '@angular/core';

import { AttributesService } from './attributes.service';
import { GoldService } from './gold.service';
import { RespecCost } from '../systems/progression';

@Injectable({ providedIn: 'root' })
export class RespecService {
  private readonly Attributes = inject(AttributesService);
  private readonly Gold = inject(GoldService);

  /**
   * Performs a full respec: refunds all allocated attribute points.
   * Optionally charges gold cost if provided.
   * @returns The number of points refunded. Returns 0 if cost not affordable.
   */
  public FullRespec(): number {
    const respecCost = RespecCost(this.Attributes.AllocatedTotal());

    if (Number.isFinite(respecCost) && respecCost > 0) {
      if (!this.Gold.CanAfford(respecCost)) {
        return 0;
      }

      const spent = this.Gold.Spend(respecCost);

      if (!spent) {
        return 0;
      }
    }

    const refunded = this.Attributes.Respec();
    return refunded;
  }
}
