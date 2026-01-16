import { Experience, Gold, StageRewards } from '../../models';
import { Injectable, signal } from '@angular/core';

import { BATTLE_CONFIG } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class StageService {
  private _currentStage = signal(BATTLE_CONFIG.STAGE.BASE);
  public Current = this._currentStage.asReadonly();

  public GetRewards(): StageRewards {
    const experience = Experience.GetForStage(this._currentStage());
    const gold = Gold.GetForStage(this._currentStage());
    return new StageRewards(experience, gold);
  }

  public NextStage() {
    this._currentStage.update((stage) => Math.min(stage + 1, BATTLE_CONFIG.STAGE.MAX));
  }

  public Reset() {
    this._currentStage.set(BATTLE_CONFIG.STAGE.BASE);
  }
}
