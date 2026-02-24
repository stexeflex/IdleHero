import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal
} from '@angular/core';

import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-charge-bar',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './charge-bar.html',
  styleUrl: './charge-bar.scss'
})
export class ChargeBar {
  private readonly destroyRef = inject(DestroyRef);

  readonly current = input<number>(0);
  readonly max = input<number>(0);
  readonly showValues = input<boolean>(false);
  readonly charged = input<boolean>(false);
  readonly chargeDurationSeconds = input<number>(1);

  protected readonly displayProgress = signal<number>(0);

  private animationFrameId: number | null = null;
  private animationStartedAtMs = 0;
  private animationDurationMs = 1000;
  private isAnimatingChargeDrain = false;

  public constructor() {
    effect(() => {
      const isCharged = this.charged();

      if (isCharged) {
        this.StartChargeDrainAnimation();
        return;
      }

      this.StopAnimation();
      this.displayProgress.set(this.NormalizeProgress(this.current(), this.max()));
    });

    this.destroyRef.onDestroy(() => {
      this.StopAnimation();
    });
  }

  private StartChargeDrainAnimation(): void {
    if (this.isAnimatingChargeDrain) return;

    this.isAnimatingChargeDrain = true;
    this.displayProgress.set(100);
    this.animationStartedAtMs = performance.now();
    this.animationDurationMs = Math.max(Math.round(this.chargeDurationSeconds() * 1000), 1);
    this.animationFrameId = requestAnimationFrame((timeMs) =>
      this.AdvanceChargeDrainAnimation(timeMs)
    );
  }

  private AdvanceChargeDrainAnimation(timeMs: number): void {
    const elapsedMs = timeMs - this.animationStartedAtMs;
    const progress = Math.max(0, 100 - (elapsedMs / this.animationDurationMs) * 100);

    this.displayProgress.set(progress);

    if (!this.charged() || elapsedMs >= this.animationDurationMs) {
      this.StopAnimation();
      return;
    }

    this.animationFrameId = requestAnimationFrame((nextTimeMs) =>
      this.AdvanceChargeDrainAnimation(nextTimeMs)
    );
  }

  private StopAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.isAnimatingChargeDrain = false;
  }

  private NormalizeProgress(current: number, max: number): number {
    if (max <= 0) return 0;
    return Math.min(100, Math.max(0, (current / max) * 100));
  }
}
