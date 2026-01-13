import { Experience, Gold, StageRewards } from '../../models';
import { Injectable, signal } from '@angular/core';

import { GAME_CONFIG } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class StageService {
  private _currentStage = signal(GAME_CONFIG.STAGE.BASE);
  public Current = this._currentStage.asReadonly();

  public GetRewards(): StageRewards {
    const experience = Experience.GetForStage(this._currentStage());
    const gold = Gold.GetForStage(this._currentStage());
    return new StageRewards(experience, gold);
  }

  public NextStage() {
    this._currentStage.update((stage) => Math.min(stage + 1, GAME_CONFIG.STAGE.MAX));
  }

  public Reset() {
    this._currentStage.set(GAME_CONFIG.STAGE.BASE);
  }
}
