import { Injectable, Signal, signal } from '@angular/core';

import { CharactersIconName } from '../../components';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  public readonly Name = signal('Hero');
  public readonly CharacterIcon: Signal<CharactersIconName> = signal('dwarf');
  public readonly PrestigeLevel = signal(0);
  public readonly HighestStageReached = signal(0);

  public Prestige(atStage: number) {
    this.PrestigeLevel.update((level) => level + 1);
    this.HighestStageReached.update((highest) => Math.max(highest, atStage));
  }
}
