import { AttackResult, BattleLogMessage, MessageType, StageRewards } from '../models';
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

  public Prestige(stage: number) {
    this.AddSeparator();
    this.AddLog({
      Message: 'Prestige!',
      Submessage: `You reached Stage ${stage}`,
      Type: 'Info'
    });
    this.AddSeparator();
  }

  public AttackLog(attackResult: AttackResult) {
    let message: BattleLogMessage = {
      Message: `${attackResult.Damage}`,
      Type: 'Damage'
    };

    if (attackResult.IsCritical && attackResult.IsMultiHit) {
      // this.AddLog({ Message: 'Critical Multi Hit!', Type: 'CritMulti' });
      message.Type = 'CritMulti';
      message.Submessage = 'Critical Multi Hit'.toUpperCase();
    } else if (attackResult.IsCritical) {
      // this.AddLog({ Message: 'Critical Hit!', Type: 'Crit' });
      message.Type = 'Crit';
      message.Submessage = 'Critical Hit'.toUpperCase();
    } else if (attackResult.IsMultiHit) {
      // this.AddLog({ Message: 'Multi Hit!', Type: 'Multi' });
      message.Type = 'Multi';
      message.Submessage = 'Multi Hit'.toUpperCase();
    }

    this.AddLog(message);
  }

  public BossDefeated(stageRewards: StageRewards) {
    this.AddSeparator();
    this.AddLog({
      Message: 'Boss defeated!',
      Submessage: `⭐ ${stageRewards.Experience} 💰 ${stageRewards.Gold}`,
      Type: 'BossDefeat'
    });
    this.AddSeparator();
  }

  public LevelUp(previousLevel: number, newLevel: number) {
    this.AddLog({
      Message: 'Level Up!',
      Submessage: `Level ${previousLevel} → Level ${newLevel}`,
      Type: 'LevelUp'
    });
    this.AddSeparator();
  }

  public ClearLogs() {
    this._logs.set([]);
  }
}
