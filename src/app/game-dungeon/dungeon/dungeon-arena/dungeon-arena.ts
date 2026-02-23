import { Boss, DamageEvent, Hero } from '../../../../core/models';
import { ChargeBar, HealthBar, IconComponent } from '../../../../shared/components';
import {
  CombatState,
  IsBleedingHit,
  IsCriticalHit,
  IsCriticalMultiHit,
  IsMultiHit,
  IsSplashHit
} from '../../../../core/systems/combat';
import { Component, OnDestroy, computed, inject, signal } from '@angular/core';

import { DELAYS } from '../../../../core/constants';
import { Subscription } from 'rxjs';

interface BleedingTick {
  Tick: number;
  IsActive: boolean;
}

@Component({
  selector: 'app-dungeon-arena',
  imports: [HealthBar, IconComponent, ChargeBar],
  templateUrl: './dungeon-arena.html',
  styleUrl: './dungeon-arena.scss'
})
export class DungeonArena implements OnDestroy {
  private eventSub?: Subscription;
  private heroSub?: Subscription;
  private bossSub?: Subscription;

  // Service injections
  private readonly combat = inject(CombatState);

  // State
  protected Hero = signal<Hero | undefined>(undefined);
  protected Boss = signal<Boss | undefined>(undefined);

  // UI
  protected BleedingTicks = computed<BleedingTick[]>(() => {
    const boss = this.Boss();
    if (!boss) return [];
    if (!boss.State.IsBleeding || !boss.State.BleedingState) return [];

    const ticks: BleedingTick[] = [];
    for (let i = 1; i <= boss.State.BleedingState.TotalTicks; i++) {
      ticks.push({
        Tick: i,
        IsActive: i > boss.State.BleedingState.Tick
      });
    }
    return ticks.reverse();
  });
  protected readonly RotateBossIcon = computed(() => {
    const boss = this.Boss();
    return boss?.BossIcon?.Rotate ?? false;
  });

  // Animation state
  protected readonly isAttacking = signal(false);
  protected readonly isCrit = signal(false);
  protected readonly isMulti = signal(false);
  protected readonly isCritMulti = signal(false);
  protected readonly isBleed = signal(false);
  protected readonly isSplash = signal(false);
  protected readonly isBossTakingHit = signal(false);
  protected readonly isBossDefeated = signal(false);

  private attackTimer: any = null;
  private critTimer: any = null;
  private multiTimer: any = null;
  private critMultiTimer: any = null;
  private bleedTimer: any = null;
  private splashTimer: any = null;
  private isBossTakingHitTimer: any = null;
  private bossDefeatedTimer: any = null;

  constructor() {
    this.heroSub = this.combat.Hero$.subscribe((s) => {
      if (!s) {
        this.Hero.set(undefined);
        return;
      }
      this.Hero.set({ ...s } as Hero | undefined);
    });

    this.bossSub = this.combat.Boss$.subscribe((s) => {
      if (!s) {
        this.Boss.set(undefined);
        return;
      }
      this.Boss.set({ ...s } as Boss | undefined);
    });

    this.eventSub = this.combat.Events$.subscribe((event) => {
      if (event.Type === 'Attack') {
        this.isAttacking.set(true);
        if (this.attackTimer) clearTimeout(this.attackTimer);
        this.attackTimer = setTimeout(() => this.isAttacking.set(false), 300);
      }

      if (event.Type === 'Damage') {
        const damageEvent = event as DamageEvent;

        this.isBossTakingHit.set(true);
        if (this.isBossTakingHitTimer) clearTimeout(this.isBossTakingHitTimer);
        this.isBossTakingHitTimer = setTimeout(() => this.isBossTakingHit.set(false), 500);

        // Splash Damage Animation
        if (IsSplashHit(damageEvent.Damage)) {
          this.isSplash.set(true);
          if (this.splashTimer) clearTimeout(this.splashTimer);
          this.splashTimer = setTimeout(() => this.isSplash.set(false), 500);
        }
        // Critical Multi Hit Animation
        else if (IsCriticalMultiHit(damageEvent.Damage)) {
          this.isCritMulti.set(true);
          if (this.critMultiTimer) clearTimeout(this.critMultiTimer);
          this.critMultiTimer = setTimeout(() => this.isCritMulti.set(false), 500);
        }
        // Multi Hit Animation
        else if (IsMultiHit(damageEvent.Damage)) {
          this.isMulti.set(true);
          if (this.multiTimer) clearTimeout(this.multiTimer);
          this.multiTimer = setTimeout(() => this.isMulti.set(false), 500);
        }
        // Critical Hit Animation
        else if (IsCriticalHit(damageEvent.Damage)) {
          this.isCrit.set(true);
          if (this.critTimer) clearTimeout(this.critTimer);
          this.critTimer = setTimeout(() => this.isCrit.set(false), 500);
        }
        // Bleed Animation
        else if (IsBleedingHit(damageEvent.Damage)) {
          this.isBleed.set(true);
          if (this.bleedTimer) clearTimeout(this.bleedTimer);
          this.bleedTimer = setTimeout(() => this.isBleed.set(false), 500);
        }
      }

      if (event.Type === 'Death') {
        if (!!(event.Actor as Boss)) {
          this.isBossDefeated.set(true);
          if (this.bossDefeatedTimer) clearTimeout(this.bossDefeatedTimer);
          this.bossDefeatedTimer = setTimeout(
            () => this.isBossDefeated.set(false),
            DELAYS.BOSS_RESPAWN_ANIMATION_MS * 1.5
          );
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.heroSub?.unsubscribe();
    this.bossSub?.unsubscribe();
    this.eventSub?.unsubscribe();

    if (this.attackTimer) clearTimeout(this.attackTimer);
    if (this.critTimer) clearTimeout(this.critTimer);
    if (this.multiTimer) clearTimeout(this.multiTimer);
    if (this.critMultiTimer) clearTimeout(this.critMultiTimer);
    if (this.bleedTimer) clearTimeout(this.bleedTimer);
    if (this.splashTimer) clearTimeout(this.splashTimer);
    if (this.isBossTakingHitTimer) clearTimeout(this.isBossTakingHitTimer);
    if (this.bossDefeatedTimer) clearTimeout(this.bossDefeatedTimer);
  }
}
