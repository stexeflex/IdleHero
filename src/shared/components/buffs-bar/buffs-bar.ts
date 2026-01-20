import { Buff } from '../../models';
import { BuffsService } from '../../services';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-buffs-bar',
  imports: [],
  templateUrl: './buffs-bar.html',
  styleUrl: './buffs-bar.scss'
})
export class BuffsBar {
  private buffsService = inject(BuffsService);

  protected get Buffs(): Buff[] {
    return this.buffsService.Buffs();
  }

  private static Active: Map<string, number> = new Map<string, number>();
  protected get Active(): Map<string, number> {
    return BuffsBar.Active;
  }

  private static Cooldown: Map<string, number> = new Map<string, number>();
  protected get Cooldown(): Map<string, number> {
    return BuffsBar.Cooldown;
  }

  constructor() {
    for (let buff of this.Buffs) {
      if (!BuffsBar.Active.has(buff.Name)) {
        BuffsBar.Active.set(buff.Name, 0);
      }

      if (!BuffsBar.Cooldown.has(buff.Name)) {
        BuffsBar.Cooldown.set(buff.Name, 0);
      }
    }
  }

  protected GetTooltip(buff: Buff): string {
    return (
      `- ${buff.Name} -` +
      '\n' +
      `${buff.Description}` +
      '\n' +
      `Duration: ${buff.DurationInSeconds} seconds`
    );
  }

  protected ActivateBuff(buff: Buff) {
    if (this.buffsService.ActivateBuff(buff)) {
      this.setActiveTime(buff);
      this.setCooldownTime(buff);
    }
  }

  private setActiveTime(buff: Buff) {
    BuffsBar.Active.set(buff.Name, buff.DurationInSeconds);

    const active = setInterval(() => {
      const currentActive = BuffsBar.Active.get(buff.Name) ?? 0;

      if (currentActive > 0) {
        BuffsBar.Active.set(buff.Name, currentActive - 1);
      } else {
        clearInterval(active);
      }
    }, 1000);
  }

  private setCooldownTime(buff: Buff) {
    BuffsBar.Cooldown.set(buff.Name, buff.DurationInSeconds + buff.CooldownInSeconds);

    const cooldown = setInterval(() => {
      const currentCooldown = BuffsBar.Cooldown.get(buff.Name) ?? 0;

      if (currentCooldown > 0) {
        BuffsBar.Cooldown.set(buff.Name, currentCooldown - 1);
      } else {
        clearInterval(cooldown);
      }
    }, 1000);
  }
}
