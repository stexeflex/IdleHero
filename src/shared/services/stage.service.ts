import { Experience, StageRewards } from '../models';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StageService {
  private DEFAULT_STAGE = 1;

  private _currentStage = signal(this.DEFAULT_STAGE);
  public Current = this._currentStage.asReadonly();

  public GetRewards(): StageRewards {
    const experience = Experience.GetForStage(this._currentStage());
    return new StageRewards(experience, 0);
  }

  public NextStage() {
    this._currentStage.update((stage) => ++stage);
  }

  public Reset() {
    this._currentStage.set(this.DEFAULT_STAGE);
  }
}
