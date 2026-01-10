import { Buff } from '../../models';
import { BuffsService } from '../../services';
import { Component } from '@angular/core';

@Component({
  selector: 'app-buffs-bar',
  imports: [],
  templateUrl: './buffs-bar.html',
  styleUrl: './buffs-bar.scss'
})
export class BuffsBar {
  protected get Buffs(): Buff[] {
    return this.buffsService.Buffs();
  }

  protected Active: Map<string, number> = new Map<string, number>();
  protected Cooldown: Map<string, number> = new Map<string, number>();

  constructor(private buffsService: BuffsService) {
    for (let buff of this.Buffs) {
      this.Active.set(buff.Name, 0);
      this.Cooldown.set(buff.Name, 0);
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
    this.Active.set(buff.Name, buff.DurationInSeconds);

    const active = setInterval(() => {
      const currentActive = this.Active.get(buff.Name) ?? 0;

      if (currentActive > 0) {
        this.Active.set(buff.Name, currentActive - 1);
      } else {
        clearInterval(active);
      }
    }, 1000);
  }

  private setCooldownTime(buff: Buff) {
    this.Cooldown.set(buff.Name, buff.DurationInSeconds + buff.CooldownInSeconds);

    const cooldown = setInterval(() => {
      const currentCooldown = this.Cooldown.get(buff.Name) ?? 0;

      if (currentCooldown > 0) {
        this.Cooldown.set(buff.Name, currentCooldown - 1);
      } else {
        clearInterval(cooldown);
      }
    }, 1000);
  }
}
