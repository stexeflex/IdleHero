import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal
} from '@angular/core';

import { DELAYS } from '../../constants';
import { DecimalPipe } from '@angular/common';
import { TimeoutUtils } from '../../utils';

@Component({
  selector: 'app-experience-bar',
  imports: [DecimalPipe],
  templateUrl: './experience-bar.html',
  styleUrl: './experience-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperienceBar implements AfterViewInit {
  // Animation timing (should match SCSS transition)
  private static readonly TRANSITION_MS = 800;

  // Inputs as signals
  currentLevel = input<number>(0);
  currentExp = input<number>(0);
  expToNextLevel = input<number>(100);

  // UI progress state (0..100)
  protected progress = signal<number>(0);
  protected isAnimating = signal<boolean>(true);

  // Derived labels
  protected experience = computed(() => Math.min(this.currentExp(), this.expToNextLevel()));
  protected targetPercent = computed(() => {
    const total = this.expToNextLevel();
    if (!total || total <= 0) {
      return 0;
    }
    return Math.min(100, (this.currentExp() / total) * 100);
  });

  // Previous values to detect level-ups
  private prevLevel = this.currentLevel();

  // Flag to skip level-up animation on initial render
  private fullyRendered = false;

  // Queue to serialize animations
  private animationQueue: Promise<void> = Promise.resolve();

  constructor() {
    // React to input changes and orchestrate animation
    effect(() => {
      const level = this.currentLevel();
      const target = this.targetPercent();

      // Determine if level-up(s) occurred
      // Skip level-up animation until after initial render
      const levelDelta = this.fullyRendered ? level - this.prevLevel : 0;

      if (levelDelta > 0) {
        // One or more level-ups occurred; animate fill-to-full cycles
        this.animateLevelUp(levelDelta, target);
      } else {
        // Normal progress change
        this.SetToValue(target);
      }

      this.prevLevel = level;
    });
  }

  ngAfterViewInit(): void {
    this.fullyRendered = true;
  }

  private animateLevelUp(levels: number, finalTarget: number) {
    // Queue animations to avoid overlap when inputs change rapidly
    this.animationQueue = this.animationQueue.then(async () => {
      // Step 1: fill to 100% with transition, hold briefly
      await this.SetToMax();

      // Handle intermediate level-ups, if more than one level was gained
      for (let i = 1; i < levels; i++) {
        // Reset instantly to 0 (no transition), then fill to 100% again
        await this.SetToZero();
        await this.SetToMax();
      }

      // Final: reset instantly to 0, then animate to remainder of current level
      await this.SetToZero();

      this.SetToValue(finalTarget);
    });
  }

  private async SetToZero(): Promise<void> {
    this.SetToValue(0, false);
    await TimeoutUtils.wait(DELAYS.LEVEL_UP_RESET_MS);
  }

  private async SetToMax(): Promise<void> {
    this.SetToValue(100);
    await TimeoutUtils.wait(ExperienceBar.TRANSITION_MS + DELAYS.LEVEL_UP_ANIMATION_MS);
  }

  private SetToValue(value: number, animate: boolean = true): void {
    this.isAnimating.set(animate);
    this.progress.set(value);
  }
}
