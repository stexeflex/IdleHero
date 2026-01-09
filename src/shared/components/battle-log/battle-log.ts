import { BattleLogMessage, MessageType } from '../../models';

import { BattleLogService } from '../../services';
import { Component } from '@angular/core';

@Component({
  selector: 'app-battle-log',
  imports: [],
  templateUrl: './battle-log.html',
  styleUrl: './battle-log.scss'
})
export class BattleLog {
  protected get Messages(): BattleLogMessage[] {
    return this.battleLogService.Logs();
  }

  constructor(private battleLogService: BattleLogService) {}

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

  protected GetSubMessage(type: MessageType): string | null {
    switch (type) {
      case 'Crit':
        return 'Critical Hit!';

      case 'Multi':
        return 'Multi Hit!';

      case 'CritMulti':
        return 'Critical Multi Hit!';

      default:
        return null;
    }
  }
}
