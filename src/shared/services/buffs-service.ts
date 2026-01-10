import { Injectable, signal } from '@angular/core';

import { Buff } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BuffsService {
  public readonly Buffs = signal<Buff[]>([
    Buff.FromObject({
      Icon: '🔥',
      Name: 'Attack Boost',
      Description: 'Increases Damage by 25%.',
      DurationInSeconds: 20,
      CooldownInSeconds: 30,
      Modifier: 0.25
    }),
    Buff.FromObject({
      Icon: '🥷🏼',
      Name: 'Speed Boost',
      Description: 'Increases Attack Speed by 50%.',
      DurationInSeconds: 10,
      CooldownInSeconds: 60,
      Modifier: 0.5
    }),
    Buff.FromObject({
      Icon: '🎯',
      Name: 'Critical Focus',
      Description: 'Increases Critical Hit Chance by 15%.',
      DurationInSeconds: 15,
      CooldownInSeconds: 60,
      Modifier: 0.15
    }),
    Buff.FromObject({
      Icon: '⚔️',
      Name: 'Multi-Hit Frenzy',
      Description: 'Increases Multi-Hit Chance by 20%.',
      DurationInSeconds: 15,
      CooldownInSeconds: 60,
      Modifier: 0.2
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

    const buffToActivate: Buff = this.Buffs()[buffIndexToActivate];
    buffToActivate.IsActive = true;
    this.UpdateBuffState(buffIndexToActivate, buffToActivate);

    /* Active duration timer */
    setTimeout(() => {
      buffToActivate.IsActive = false;
      buffToActivate.IsOnCooldown = true;
      this.UpdateBuffState(buffIndexToActivate, buffToActivate);

      /* Cooldown duration timer */
      setTimeout(() => {
        buffToActivate.IsOnCooldown = false;
        this.UpdateBuffState(buffIndexToActivate, buffToActivate);
      }, buffToActivate.CooldownInSeconds * 1000);
    }, buffToActivate.DurationInSeconds * 1000);

    return true;
  }

  private UpdateBuffState(buffIndex: number, updatedBuff: Buff) {
    const updatedBuffs = [...this.Buffs()];
    updatedBuffs[buffIndex] = updatedBuff;
    this.Buffs.set(updatedBuffs);
  }
}
