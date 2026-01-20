import { Injectable, inject } from '@angular/core';
import { LevelService } from '../services';

@Injectable({ providedIn: 'root' })
export class LevelSpecifications {
  private levelService = inject(LevelService);


  public HasRequiredLevel(requiredLevel: number): boolean {
    return this.levelService.Level() >= requiredLevel;
  }
}
