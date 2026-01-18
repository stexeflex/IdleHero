import { AttackResult, AttackType, BossDamageResult } from '../../models';
import { BattleLogService, BossService, StatsService } from '../../services';

import { AttackTickContext } from '../models/attack-tick-context';
import { AttackTickHandler } from '../models/attack-tick-handler';
import { BattleState } from '../battle.state';
import { FlagsUtils } from '../../utils';
import { Injectable } from '@angular/core';
import { StatisticsService } from '../../services/character/statistics.service';

@Injectable({ providedIn: 'root' })
export class BattleLogic {
  constructor(
    private battleState: BattleState,
    private statsService: StatsService,
    private statisticsService: StatisticsService,
    private bossService: BossService,
    private battleLogService: BattleLogService
  ) {}

  /**
   * Ordered battle phase steps executed on each attack tick.
   * Each step receives the tick context for future time-aware logic.
   */
  public get AttackTickHandler(): Array<AttackTickHandler> {
    return [
      /* Reset Attack State */
      (ctx: AttackTickContext) => {
        if (this.battleState.battleEnded()) return;
        if (this.battleState.isTransitioning()) return;

        if (!this.battleState.splashDamageEnabled()) {
          this.battleState.attackOverflow.set(0);
        }

        this.battleState.attackResult.set(null);
      },
      /* Perform Attack */
      (ctx: AttackTickContext) => {
        if (this.battleState.battleEnded()) return;
        if (this.battleState.isTransitioning()) return;

        let attackResult: AttackResult = this.statsService.Attack();

        if (this.battleState.attackOverflow() > 0) {
          attackResult.Damage += this.battleState.attackOverflow();
          attackResult.AttackType = FlagsUtils.AddFlag(attackResult.AttackType, AttackType.Splash);
        }

        this.battleState.attackResult.set(attackResult);
        this.battleState.attacks.push(attackResult);
        this.battleState.attackCounter.set(this.battleState.attackCounter() + 1);
      },
      /* Record Damage Dealt */
      (ctx: AttackTickContext) => {
        if (this.battleState.battleEnded()) return;
        if (this.battleState.isTransitioning()) return;

        let attackResult = this.battleState.attackResult();
        if (!attackResult) return;

        this.battleLogService.AttackLog(attackResult);
        this.statisticsService.RecordDamageDealt(attackResult);
      },
      /* Deal Damage */
      (ctx: AttackTickContext) => {
        if (this.battleState.battleEnded()) return;
        if (this.battleState.isTransitioning()) return;

        let attackResult = this.battleState.attackResult();
        if (!attackResult) return;

        const bossDamageResult: BossDamageResult = this.bossService.TakeDamage(attackResult.Damage);
        this.battleState.bossFightResult.set(bossDamageResult);
      },
      /* Handle Overflow */
      (ctx: AttackTickContext) => {
        if (this.battleState.battleEnded()) return;
        if (this.battleState.isTransitioning()) return;

        let attackResult = this.battleState.attackResult();
        let damageResult = this.battleState.bossFightResult();
        if (!attackResult || !damageResult) return;

        if (damageResult.DamageDealt < attackResult.Damage) {
          const overflow = Math.max(attackResult.Damage - damageResult.DamageDealt, 0);
          this.battleState.attackOverflow.set(overflow);
        } else {
          this.battleState.attackOverflow.set(0);
        }
      }
    ];
  }
}
