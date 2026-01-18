import { DungeonRoomService, StageService } from '../services';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DungeonSpecifications {
  readonly dungeonRoomService = inject(DungeonRoomService);
  readonly stageService = inject(StageService);

  public DungeonRoomCleared(): boolean {
    return this.stageService.Current() >= this.dungeonRoomService.GetMaxStage();
  }
}
