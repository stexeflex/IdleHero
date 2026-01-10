import { Injectable, signal } from '@angular/core';

import { Buff } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BuffsService {
  public readonly Buffs = signal<Buff[]>([
    Buff.FromObject({
      Icon: '🔥',
      Name: 'Strength Boost',
      Description: 'Increases damage by 10%.',
      DurationInSeconds: 20,
      CooldownInSeconds: 30
    }),
    Buff.FromObject({
      Icon: '🥷🏼',
      Name: 'Speed Boost',
      Description: 'Increases Attack Speed by 50%.',
      DurationInSeconds: 10,
      CooldownInSeconds: 60
    }),
    Buff.FromObject({
      Icon: '🎯',
      Name: 'Critical Focus',
      Description: 'Increases Critical Hit Chance by 15%.',
      DurationInSeconds: 15,
      CooldownInSeconds: 60
    }),
    Buff.FromObject({
      Icon: '⚔️',
      Name: 'Multi-Hit Frenzy',
      Description: 'Increases Multi-Hit Chance by 20%.',
      DurationInSeconds: 15,
      CooldownInSeconds: 60
    }),
    Buff.FromObject({
      Icon: '💥',
      Name: 'Splash Area Damage',
      Description: 'Causes Damage Overflow to Hit the next Enemy.',
      DurationInSeconds: 30,
      CooldownInSeconds: 120
    })
  ]);

  public ActivateBuff(buff: Buff): boolean {
    const buffIndexToActivate: number = this.Buffs().findIndex((b) => b.Name === buff.Name);

    if (
      buffIndexToActivate === -1 ||
      this.Buffs()[buffIndexToActivate].IsActive ||
      this.Buffs()[buffIndexToActivate].IsOnCooldown
    ) {
      return false;
    }

    return this.Buffs()[buffIndexToActivate].Activate();
  }
}
