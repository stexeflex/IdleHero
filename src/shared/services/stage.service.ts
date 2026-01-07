import { Injectable, signal } from '@angular/core';

import { Experience } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StageService {
  private DEFAULT_STAGE = 1;

  private _currentStage = signal(this.DEFAULT_STAGE);
  public CurrentStage = this._currentStage.asReadonly();

  public get Experience(): number {
    return Experience.GetForStage(this._currentStage());
  }

  public NextStage() {
    this._currentStage.update((stage) => ++stage);
  }

  public Reset() {
    this._currentStage.set(this.DEFAULT_STAGE);
  }
}
