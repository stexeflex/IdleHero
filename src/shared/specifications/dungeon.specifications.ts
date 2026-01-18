import { CurrencyService, DungeonRoomService, StageService } from '../services';
import { DungeonRoom, DungeonRoomId } from '../models';
import { Injectable, inject } from '@angular/core';

import { VendorSpecifications } from './vendor.specifications';

@Injectable({ providedIn: 'root' })
export class DungeonSpecifications {
  readonly currencyService = inject(CurrencyService);
  readonly vendorSpecifications = inject(VendorSpecifications);
  readonly dungeonRoomService = inject(DungeonRoomService);
  readonly stageService = inject(StageService);

  public DungeonRoomCleared(): boolean {
    return this.stageService.Current() >= this.dungeonRoomService.GetMaxStage();
  }

  public CanEnterDungeonRoom(roomId: DungeonRoomId): boolean {
    const room = this.dungeonRoomService.GetRoom(roomId);
    if (!room) return false;

    const goldEnough = this.vendorSpecifications.EnoughGold(room.Prerequisites.Gold);
    const hasKey = this.KeyRequirementMet(room);
    return goldEnough && hasKey;
  }

  public KeyRequirementMet(room: DungeonRoom): boolean {
    if (!room.Prerequisites.Key) {
      return true;
    }

    return this.currencyService.HasKey(room.Prerequisites.Key);
  }
}
