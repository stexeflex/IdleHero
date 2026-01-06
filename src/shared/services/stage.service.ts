import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StageService {
  private DEFAULT_STAGE = 1;

  private _currentStage = signal(this.DEFAULT_STAGE);
  public CurrentStage = this._currentStage.asReadonly();

  public NextStage() {
    this._currentStage.update((stage) => stage + 1);
  }

  public GetExperience(): number {
    if (this._currentStage() === 1) {
      return 100;
    } else {
      return 100 + this._currentStage() * 10;
    }
  }

  public Reset() {
    this._currentStage.set(this.DEFAULT_STAGE);
  }
}
