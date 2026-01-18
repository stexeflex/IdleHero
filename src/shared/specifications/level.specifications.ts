import { Injectable } from '@angular/core';
import { LevelService } from '../services';

@Injectable({ providedIn: 'root' })
export class LevelSpecifications {
  constructor(private levelService: LevelService) {}

  public HasRequiredLevel(requiredLevel: number): boolean {
    return this.levelService.Level() >= requiredLevel;
  }
}
