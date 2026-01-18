import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BattleLogMessage, MessageType } from '../../models';

import { BattleLogService } from '../../services';
import { FlagsUtils } from '../../utils';

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
    if (FlagsUtils.IsFlag(type, MessageType.Info)) {
      return 'info';
    }

    if (FlagsUtils.IsFlag(type, MessageType.Separator)) {
      return 'separator';
    }

    if (FlagsUtils.IsFlag(type, MessageType.Other)) {
      return 'other';
    }

    if (FlagsUtils.HasFlag(type, MessageType.Damage)) {
      if (FlagsUtils.HasFlag(type, MessageType.Crit | MessageType.Multi)) {
        return 'crit-multi';
      }

      if (FlagsUtils.HasFlag(type, MessageType.Crit)) {
        return 'crit';
      }

      if (FlagsUtils.HasFlag(type, MessageType.Multi)) {
        return 'multi';
      }

      return 'damage';
    }

    if (FlagsUtils.IsFlag(type, MessageType.LevelUp)) {
      return 'level-up';
    }

    if (FlagsUtils.IsFlag(type, MessageType.BossDefeat)) {
      return 'boss-defeat';
    }

    if (FlagsUtils.IsFlag(type, MessageType.DungeonCleared)) {
      return 'dungeon-cleared';
    }

    return '';
  }

  protected GetMessageIcon(type: MessageType): string | null {
    if (FlagsUtils.IsFlag(type, MessageType.Info)) {
      return 'ℹ️';
    }

    if (FlagsUtils.HasFlag(type, MessageType.Damage)) {
      if (FlagsUtils.HasFlag(type, MessageType.Splash)) {
        return '💥';
      }

      if (FlagsUtils.HasFlag(type, MessageType.Crit | MessageType.Multi)) {
        return '⚡⚔️';
      }

      if (FlagsUtils.HasFlag(type, MessageType.Crit)) {
        return '⚡';
      }

      if (FlagsUtils.HasFlag(type, MessageType.Multi)) {
        return '⚔️';
      }

      return '🗡️';
    }

    if (FlagsUtils.IsFlag(type, MessageType.LevelUp)) {
      return '⬆️';
    }

    if (FlagsUtils.IsFlag(type, MessageType.BossDefeat)) {
      return '❌';
    }

    if (FlagsUtils.IsFlag(type, MessageType.DungeonCleared)) {
      return '🏆';
    }

    return null;
  }
}
