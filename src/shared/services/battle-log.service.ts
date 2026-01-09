import { AttackResult, BattleLogMessage, MessageType } from '../models';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BattleLogService {
  private _logs = signal<BattleLogMessage[]>([]);
  public readonly Logs = this._logs.asReadonly();

  public AddLog(message: BattleLogMessage) {
    this._logs.update((logs) => [...logs, message]);
  }

  public AddSeparator() {
    this.AddLog({ Message: '+-----------------------+', Type: 'Separator' });
  }

  public StartGame() {
    this.AddLog({ Message: 'Game Started!', Type: 'Info' });
    this.AddSeparator();
  }

  public Prestige() {
    this.AddLog({ Message: 'Prestige!', Type: 'Info' });
    this.AddSeparator();
  }

  public AttackLog(attackResult: AttackResult) {
    let messageType: MessageType = 'Damage';

    if (attackResult.IsCritical && attackResult.IsMultiHit) {
      // this.AddLog({ Message: 'Critical Multi Hit!', Type: 'CritMulti' });
      messageType = 'CritMulti';
    } else if (attackResult.IsCritical) {
      // this.AddLog({ Message: 'Critical Hit!', Type: 'Crit' });
      messageType = 'Crit';
    } else if (attackResult.IsMultiHit) {
      // this.AddLog({ Message: 'Multi Hit!', Type: 'Multi' });
      messageType = 'Multi';
    }

    this.AddLog({
      Message: `${attackResult.Damage}`,
      Type: messageType
    });
  }

  public BossDefeated() {
    this.AddSeparator();
    this.AddLog({ Message: 'Boss defeated!', Type: 'BossDefeat' });
    this.AddSeparator();
  }

  public LevelUp() {
    this.AddLog({ Message: 'Level Up!', Type: 'LevelUp' });
    this.AddSeparator();
  }

  public ClearLogs() {
    this._logs.set([]);
  }
}
