import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import { AttackResult, AttackType } from '../../../../shared/models';
import {
  CharactersIconName,
  CreaturesIconName,
  IconComponent
} from '../../../../shared/components';

import { BattleState } from '../../../../shared/engine';
import { DELAYS } from '../../../../shared/constants';
import { FlagsUtils } from '../../../../shared/utils';

@Component({
  selector: 'app-dungeon-arena',
  imports: [IconComponent],
  templateUrl: './dungeon-arena.html',
  styleUrl: './dungeon-arena.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DungeonArena implements AfterViewInit {
  readonly heroIcon = input.required<CharactersIconName>();
  readonly bossIcon = input.required<CreaturesIconName>();
  readonly showBoss = input.required<boolean>();

  private readonly battleState = inject(BattleState);

  // Animation state
  protected readonly isAttacking = signal(false);
  protected readonly isCrit = signal(false);
  protected readonly isMulti = signal(false);
  protected readonly isCritMulti = signal(false);

  protected readonly isBossDefeated = signal(false);

  private attackTimer: any = null;
  private critTimer: any = null;
  private multiTimer: any = null;
  private critMultiTimer: any = null;
  private bossDefeatedTimer: any = null;

  private fullyRendered = false;

  ngAfterViewInit(): void {
    this.fullyRendered = true;
  }

  constructor() {
    effect(() => {
      const result: AttackResult | null = this.battleState.attackResult();

      if (!this.fullyRendered || !result) {
        return;
      }

      // Base attack animation
      this.isAttacking.set(true);
      if (this.attackTimer) clearTimeout(this.attackTimer);
      this.attackTimer = setTimeout(
        () => this.isAttacking.set(false),
        DELAYS.HERO_ATTACK_ANIMATION_MS
      );

      // Crit + Multi-hit effect
      if (FlagsUtils.HasFlag(result.AttackType, AttackType.Critical | AttackType.MultiHit)) {
        this.isCritMulti.set(true);
        if (this.critMultiTimer) clearTimeout(this.critMultiTimer);
        this.critMultiTimer = setTimeout(
          () => this.isCritMulti.set(false),
          DELAYS.HERO_CRIT_MULTI_HIT_ANIMATION_MS
        );
      }

      // Crit effect
      if (FlagsUtils.HasFlag(result.AttackType, AttackType.Critical)) {
        this.isCrit.set(true);
        if (this.critTimer) clearTimeout(this.critTimer);
        this.critTimer = setTimeout(() => this.isCrit.set(false), DELAYS.HERO_CRIT_ANIMATION_MS);
      }

      // Multi-hit effect
      if (FlagsUtils.HasFlag(result.AttackType, AttackType.MultiHit)) {
        this.isMulti.set(true);
        if (this.multiTimer) clearTimeout(this.multiTimer);
        this.multiTimer = setTimeout(
          () => this.isMulti.set(false),
          DELAYS.HERO_MULTI_HIT_ANIMATION_MS
        );
      }
    });

    effect(() => {
      const bossRespawn: boolean = this.battleState.isTransitioning();

      if (!this.fullyRendered) {
        return;
      }

      this.isBossDefeated.set(bossRespawn);

      if (bossRespawn) {
        if (this.bossDefeatedTimer) clearTimeout(this.bossDefeatedTimer);
        this.bossDefeatedTimer = setTimeout(
          () => this.isBossDefeated.set(false),
          DELAYS.BOSS_RESPAWN_ANIMATION_MS
        );
      }
    });
  }
}
