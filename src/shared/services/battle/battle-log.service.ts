import { DecimalPipe } from '@angular/common';
import {
  AttackResult,
  AttackType,
  BattleLogMessage,
  MessageType,
  StageRewards
} from '../../models';
import { Inject, Injectable, LOCALE_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BattleLogService {
  private _logs = signal<BattleLogMessage[]>([]);
  public readonly Logs = this._logs.asReadonly();

  private readonly decimalPipe: DecimalPipe;

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.decimalPipe = new DecimalPipe(locale);
  }

  public AddLog(message: BattleLogMessage) {
    this._logs.update((logs) => [...logs, message]);
  }

  public AddSeparator() {
    this.AddLog({ Message: '+-----------------------+', Type: MessageType.Separator });
  }

  public StartGame() {
    this.AddLog({ Message: 'Game Started!', Type: MessageType.Info });
    this.AddSeparator();
  }

  public Prestige(stage: number) {
    this.AddSeparator();
    this.AddLog({
      Message: 'Prestige!',
      Submessage: `You reached Stage ${stage}`,
      Type: MessageType.Info
    });
    this.AddSeparator();
  }

  public AttackLog(attackResult: AttackResult) {
    let message: BattleLogMessage = {
      Message: `${this.decimalPipe.transform(attackResult.Damage)}`,
      Type: MessageType.Damage
    };

    if ((attackResult.AttackType & AttackType.Splash) === AttackType.Splash) {
      message.Type |= MessageType.Splash;
    }

    if (attackResult.AttackType === (AttackType.Critical | AttackType.MultiHit)) {
      message.Type |= MessageType.Crit | MessageType.Multi;
      message.Submessage = 'Critical Multi Hit'.toUpperCase();
    } else if ((attackResult.AttackType & AttackType.Critical) === AttackType.Critical) {
      message.Type |= MessageType.Crit;
      message.Submessage = 'Critical Hit'.toUpperCase();
    } else if ((attackResult.AttackType & AttackType.MultiHit) === AttackType.MultiHit) {
      message.Type |= MessageType.Multi;
      message.Submessage = 'Multi Hit'.toUpperCase();
    }

    this.AddLog(message);
  }

  public BossDefeated(stageRewards: StageRewards) {
    this.AddSeparator();
    this.AddLog({
      Message: 'Boss defeated!',
      Submessage: `⭐ ${stageRewards.Experience} 💰 ${stageRewards.Gold}`,
      Type: MessageType.BossDefeat
    });
    this.AddSeparator();
  }

  public LevelUp(previousLevel: number, newLevel: number) {
    this.AddLog({
      Message: 'Level Up!',
      Submessage: `Level ${previousLevel} → Level ${newLevel}`,
      Type: MessageType.LevelUp
    });
    this.AddSeparator();
  }

  public ClearLogs() {
    this._logs.set([]);
  }
}
