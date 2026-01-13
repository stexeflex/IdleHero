import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  public readonly Name = signal('Hero');
  public PrestigeLevel = signal(0);
  public HighestStageReached = signal(0);

  public Prestige(atStage: number) {
    this.PrestigeLevel.update((level) => level + 1);
    this.HighestStageReached.update((highest) => Math.max(highest, atStage));
  }
}
