import { Injectable, OnDestroy, computed, signal } from '@angular/core';
import { Rewards, Rune } from '../../../models';

export interface DungeonRunState {
  Gold: number;
  Experience: number;
  Runes: Rune[];
}

function CreateEmptyDungeonRunState(): DungeonRunState {
  return {
    Gold: 0,
    Experience: 0,
    Runes: []
  };
}

@Injectable({ providedIn: 'root' })
export class DungeonRunService implements OnDestroy {
  private readonly State = signal<DungeonRunState>(CreateEmptyDungeonRunState());
  private readonly IsRunningState = signal<boolean>(false);
  private readonly StartedAtMsState = signal<number | null>(null);
  private readonly ElapsedMillisecondsState = signal<number>(0);

  public readonly Gold = computed<number>(() => this.State().Gold);
  public readonly Experience = computed<number>(() => this.State().Experience);
  public readonly Runes = computed<Rune[]>(() => [...this.State().Runes]);
  public readonly RuneCount = computed<number>(() => this.State().Runes.length);

  public readonly IsRunning = computed<boolean>(() => this.IsRunningState());
  public readonly ElapsedMilliseconds = computed<number>(() => this.ElapsedMillisecondsState());
  public readonly ElapsedSeconds = computed<number>(() =>
    Math.floor(this.ElapsedMillisecondsState() / 1000)
  );
  public readonly ElapsedFormatted = computed<string>(() =>
    this.FormatDuration(this.ElapsedMillisecondsState())
  );

  private TimerId: ReturnType<typeof setInterval> | null = null;

  /**
   * Cleans up active timers when service is destroyed.
   */
  ngOnDestroy(): void {
    this.StopRun();
  }

  /**
   * Starts a new dungeon run timer and resets the tracked run totals.
   */
  public StartRun(): void {
    this.Reset();

    this.StopTicker();
    this.IsRunningState.set(true);

    const now = Date.now();
    this.StartedAtMsState.set(now);
    this.ElapsedMillisecondsState.set(0);

    this.TimerId = setInterval(() => {
      const startedAtMs = this.StartedAtMsState();
      if (startedAtMs === null) return;

      this.ElapsedMillisecondsState.set(Math.max(0, Date.now() - startedAtMs));
    }, 250);
  }

  /**
   * Stops the current dungeon run timer and keeps the last measured duration.
   */
  public StopRun(): void {
    if (!this.IsRunningState()) {
      this.StopTicker();
      return;
    }

    const startedAtMs = this.StartedAtMsState();
    if (startedAtMs !== null) {
      this.ElapsedMillisecondsState.set(Math.max(0, Date.now() - startedAtMs));
    }

    this.IsRunningState.set(false);
    this.StartedAtMsState.set(null);
    this.StopTicker();
  }

  /**
   * Tracks newly granted rewards in the current dungeon run totals.
   * @param rewards the rewards to aggregate into the current run
   */
  public AddRewards(rewards: Rewards): void {
    this.State.update((state) => ({
      Gold: state.Gold + Math.max(0, Math.floor(rewards.Gold ?? 0)),
      Experience: state.Experience + Math.max(0, Math.floor(rewards.Experience ?? 0)),
      Runes: rewards.Rune ? [...state.Runes, rewards.Rune] : state.Runes
    }));
  }

  /**
   * Returns a snapshot of the current dungeon run state.
   * @returns a cloned dungeon run state
   */
  public GetState(): DungeonRunState {
    const state = this.State();
    return {
      Gold: state.Gold,
      Experience: state.Experience,
      Runes: [...state.Runes]
    };
  }

  /**
   * Replaces the current dungeon run state.
   * @param state the new dungeon run state
   */
  public SetState(state: DungeonRunState): void {
    this.State.set({
      Gold: Math.max(0, Math.floor(state.Gold)),
      Experience: Math.max(0, Math.floor(state.Experience)),
      Runes: [...state.Runes]
    });
  }

  /**
   * Resets all tracked rewards for the current dungeon run.
   */
  public Reset(): void {
    this.State.set(CreateEmptyDungeonRunState());
    this.ElapsedMillisecondsState.set(0);
  }

  private StopTicker(): void {
    if (this.TimerId) {
      clearInterval(this.TimerId);
      this.TimerId = null;
    }
  }

  private FormatDuration(durationMilliseconds: number): string {
    const totalSeconds = Math.floor(Math.max(0, durationMilliseconds) / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hourPrefix = hours > 0 ? `${hours.toString().padStart(2, '0')}:` : '';
    return `${hourPrefix}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
