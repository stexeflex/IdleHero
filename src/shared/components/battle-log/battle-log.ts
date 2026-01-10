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

  protected GetMessageIcon(type: MessageType): string | null {
    switch (type) {
      case 'Info':
        return 'ℹ️';

      case 'Other':
        return null;

      case 'Damage':
        return '🗡️';

      case 'Crit':
        return '⚡';

      case 'Multi':
        return '⚔️';

      case 'CritMulti':
        return '⚡⚔️';

      case 'LevelUp':
        return '⬆️';

      case 'BossDefeat':
        return '❌';

      default:
        return null;
    }
  }
}
