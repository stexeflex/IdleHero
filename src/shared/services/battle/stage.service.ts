import { Experience, Gold, StageRewards } from '../../models';
import { Injectable, inject, signal } from '@angular/core';

import { DungeonRoomService } from './dungeon-room.service';

@Injectable({
  providedIn: 'root'
})
export class StageService {
  readonly dungeonRoomService = inject(DungeonRoomService);

  private _currentStage = signal<number>(1);
  public Current = this._currentStage.asReadonly();

  public GetRewards(): StageRewards {
    const currentDungeonRoom = this.dungeonRoomService.Current();
    const currentStage = this._currentStage();

    const experience = Experience.GetForStage(currentDungeonRoom, currentStage);
    const gold = Gold.GetForStage(currentDungeonRoom, currentStage);
    return new StageRewards(experience, gold);
  }

  public NextStage() {
    const maxStage = this.dungeonRoomService.GetMaxStage();
    this._currentStage.update((stage) => Math.min(stage + 1, maxStage));
  }

  public Reset() {
    this._currentStage.set(1);
  }
}
