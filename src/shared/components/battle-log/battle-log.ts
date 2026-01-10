import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BattleLogMessage, MessageType } from '../../models';

import { BattleLogService } from '../../services';

@Component({
  selector: 'app-battle-log',
  imports: [],
  templateUrl: './battle-log.html',
  styleUrl: './battle-log.scss'
})
export class BattleLog implements AfterViewInit {
  @ViewChild('battleLogContainer') battleLogContainer!: ElementRef;

  protected get Messages(): BattleLogMessage[] {
    return this.battleLogService.Logs();
  }

  constructor(private battleLogService: BattleLogService) {}

  ngAfterViewInit(): void {
    this.scrollToBottom(this.battleLogContainer);
  }

  private scrollToBottom(element: ElementRef): void {
    setInterval(() => {
      const isScrolledToBottom = element.nativeElement.scrollTop >= 1;

      if (isScrolledToBottom) {
        element.nativeElement.scrollTop = 0;
      }
    }, 500);
  }

  protected GetMessageClass(type: MessageType): string {
    if (type === MessageType.Info) {
      return 'info';
    }

    if (type === MessageType.Separator) {
      return 'separator';
    }

    if (type === MessageType.Other) {
      return 'other';
    }

    if ((type & MessageType.Damage) === MessageType.Damage) {
      if (
        (type & MessageType.Crit) === MessageType.Crit &&
        (type & MessageType.Multi) === MessageType.Multi
      ) {
        return 'crit-multi';
      }

      if ((type & MessageType.Crit) === MessageType.Crit) {
        return 'crit';
      }

      if ((type & MessageType.Multi) === MessageType.Multi) {
        return 'multi';
      }

      return 'damage';
    }

    if ((type & MessageType.LevelUp) === MessageType.LevelUp) {
      return 'level-up';
    }

    if ((type & MessageType.BossDefeat) === MessageType.BossDefeat) {
      return 'boss-defeat';
    }

    return '';
  }

  protected GetMessageIcon(type: MessageType): string | null {
    if (type === MessageType.Info) {
      return 'ℹ️';
    }

    if ((type & MessageType.Damage) === MessageType.Damage) {
      if ((type & MessageType.Splash) === MessageType.Splash) {
        return '💥';
      }

      if (
        (type & MessageType.Crit) === MessageType.Crit &&
        (type & MessageType.Multi) === MessageType.Multi
      ) {
        return '⚡⚔️';
      }

      if ((type & MessageType.Crit) === MessageType.Crit) {
        return '⚡';
      }

      if ((type & MessageType.Multi) === MessageType.Multi) {
        return '⚔️';
      }

      return '🗡️';
    }

    if ((type & MessageType.LevelUp) === MessageType.LevelUp) {
      return '⬆️';
    }

    if ((type & MessageType.BossDefeat) === MessageType.BossDefeat) {
      return '❌';
    }

    return null;
  }
}
