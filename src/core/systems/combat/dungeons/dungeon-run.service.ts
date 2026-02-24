import { Injectable, OnDestroy, computed, signal } from '@angular/core';
import { Rewards, Rune } from '../../../models';

export interface DungeonRunState {
  Gold: number;
  Experience: number;
  Runes: Rune[];
  MimicsDefeated: number;
}

interface DungeonRunInfo {
  Rewards: DungeonRunState;
  StageReached: number;
  IsRunning: boolean;
  StartedAtMs: number | null;
  ElapsedMilliseconds: number;
}

function CreateEmptyDungeonRunState(): DungeonRunState {
  return {
    Gold: 0,
    Experience: 0,
    Runes: [],
    MimicsDefeated: 0
  };
}

function CreateEmptyDungeonRunInfo(): DungeonRunInfo {
  return {
    Rewards: CreateEmptyDungeonRunState(),
    StageReached: 0,
    IsRunning: false,
    StartedAtMs: null,
    ElapsedMilliseconds: 0
  };
}

@Injectable({ providedIn: 'root' })
export class DungeonRunService implements OnDestroy {
  private readonly RunsByDungeonIdState = signal<Record<string, DungeonRunInfo>>({});
  private readonly CurrentDungeonIdState = signal<string>('');

  // Current Run Info
  public readonly DungeonId = computed<string>(() => this.CurrentDungeonIdState());

  public readonly StageReached = computed<number>(() => {
    const runInfo = this.CurrentRunInfo();
    return runInfo ? runInfo.StageReached : 0;
  });

  // Current Run Rewards
  public readonly Gold = computed<number>(() => {
    const runInfo = this.CurrentRunInfo();
    return runInfo ? runInfo.Rewards.Gold : 0;
  });

  public readonly Experience = computed<number>(() => {
    const runInfo = this.CurrentRunInfo();
    return runInfo ? runInfo.Rewards.Experience : 0;
  });

  public readonly Runes = computed<Rune[]>(() => {
    const runInfo = this.CurrentRunInfo();
    return runInfo ? [...runInfo.Rewards.Runes] : [];
  });

  public readonly RuneCount = computed<number>(() => {
    const runInfo = this.CurrentRunInfo();
    return runInfo ? runInfo.Rewards.Runes.length : 0;
  });

  public readonly MimicsDefeated = computed<number>(() => {
    const runInfo = this.CurrentRunInfo();
    return runInfo ? runInfo.Rewards.MimicsDefeated : 0;
  });

  public readonly IsRunning = computed<boolean>(() => {
    const runInfo = this.CurrentRunInfo();
    return runInfo ? runInfo.IsRunning : false;
  });

  public readonly ElapsedMilliseconds = computed<number>(() => {
    const runInfo = this.CurrentRunInfo();
    return runInfo ? runInfo.ElapsedMilliseconds : 0;
  });

  public readonly ElapsedSeconds = computed<number>(() =>
    Math.floor(this.ElapsedMilliseconds() / 1000)
  );
  public readonly ElapsedFormatted = computed<string>(() =>
    this.FormatDuration(this.ElapsedMilliseconds())
  );

  private TimerId: ReturnType<typeof setInterval> | null = null;

  /**
   * Cleans up active timers when service is destroyed.
   */
  ngOnDestroy(): void {
    this.StopRun(0);
  }

  /**
   * Starts a new dungeon run timer and resets the tracked run totals.
   */
  public StartRun(dungeonId: string): void {
    this.SetCurrentDungeonRoom(dungeonId);
    this.Reset();

    this.StopTicker();

    const now = Date.now();
    this.UpdateRunInfo(dungeonId, (runInfo) => ({
      ...runInfo,
      StageReached: 0,
      IsRunning: true,
      StartedAtMs: now,
      ElapsedMilliseconds: 0
    }));

    this.TimerId = setInterval(() => {
      const currentDungeonId = this.CurrentDungeonIdState();
      const runInfo = this.GetRunInfo(currentDungeonId);

      if (!runInfo || runInfo.StartedAtMs === null || !runInfo.IsRunning) return;

      this.UpdateRunInfo(currentDungeonId, (currentRunInfo) => ({
        ...currentRunInfo,
        ElapsedMilliseconds: Math.max(0, Date.now() - (currentRunInfo.StartedAtMs ?? Date.now()))
      }));
    }, 250);
  }

  /**
   * Stops the current dungeon run timer and keeps the last measured duration.
   */
  public StopRun(stageReached: number): void {
    const currentDungeonId = this.CurrentDungeonIdState();
    const runInfo = this.GetRunInfo(currentDungeonId);

    if (!runInfo || !runInfo.IsRunning) {
      this.StopTicker();
      return;
    }

    this.UpdateRunInfo(currentDungeonId, (currentRunInfo) => {
      const startedAtMs = currentRunInfo.StartedAtMs;
      const elapsedMilliseconds =
        startedAtMs !== null
          ? Math.max(0, Date.now() - startedAtMs)
          : currentRunInfo.ElapsedMilliseconds;

      return {
        ...currentRunInfo,
        StageReached: Math.max(0, Math.floor(stageReached)),
        ElapsedMilliseconds: elapsedMilliseconds,
        IsRunning: false,
        StartedAtMs: null
      };
    });

    this.StopTicker();
  }

  /**
   * Tracks newly granted rewards in the current dungeon run totals.
   * @param rewards the rewards to aggregate into the current run
   */
  public AddRewards(rewards: Rewards): void {
    const currentDungeonId = this.CurrentDungeonIdState();
    if (!currentDungeonId) return;

    this.UpdateRunInfo(currentDungeonId, (runInfo) => ({
      ...runInfo,
      Rewards: {
        ...runInfo.Rewards,
        Gold: runInfo.Rewards.Gold + Math.max(0, Math.floor(rewards.Gold ?? 0)),
        Experience: runInfo.Rewards.Experience + Math.max(0, Math.floor(rewards.Experience ?? 0)),
        Runes: rewards.Rune ? [...runInfo.Rewards.Runes, rewards.Rune] : runInfo.Rewards.Runes
      }
    }));
  }

  /**
   * Increments the count of defeated Mimics in the current dungeon run totals.
   */
  public AddMimicDefeat(): void {
    const currentDungeonId = this.CurrentDungeonIdState();
    if (!currentDungeonId) return;

    this.UpdateRunInfo(currentDungeonId, (runInfo) => ({
      ...runInfo,
      Rewards: {
        ...runInfo.Rewards,
        MimicsDefeated: runInfo.Rewards.MimicsDefeated + 1
      }
    }));
  }

  /**
   * Returns a snapshot of the current dungeon run state.
   * @returns a cloned dungeon run state
   */
  public GetState(): DungeonRunState {
    const runInfo = this.CurrentRunInfo();
    const state = runInfo?.Rewards ?? CreateEmptyDungeonRunState();

    return {
      Gold: state.Gold,
      Experience: state.Experience,
      Runes: [...state.Runes],
      MimicsDefeated: state.MimicsDefeated
    };
  }

  /**
   * Replaces the current dungeon run state.
   * @param state the new dungeon run state
   */
  public SetState(state: DungeonRunState): void {
    const currentDungeonId = this.CurrentDungeonIdState();
    if (!currentDungeonId) return;

    this.UpdateRunInfo(currentDungeonId, (runInfo) => ({
      ...runInfo,
      Rewards: {
        Gold: Math.max(0, Math.floor(state.Gold)),
        Experience: Math.max(0, Math.floor(state.Experience)),
        Runes: [...state.Runes],
        MimicsDefeated: Math.max(0, Math.floor(state.MimicsDefeated))
      }
    }));
  }

  /**
   * Resets all tracked rewards for the current dungeon run.
   */
  public Reset(): void {
    const currentDungeonId = this.CurrentDungeonIdState();
    if (!currentDungeonId) return;

    this.UpdateRunInfo(currentDungeonId, (runInfo) => ({
      ...runInfo,
      Rewards: CreateEmptyDungeonRunState(),
      StageReached: 0,
      ElapsedMilliseconds: 0
    }));
  }

  /**
   * Sets the currently selected dungeon room for exposing run data.
   * @param dungeonId the dungeon room identifier
   */
  public SetCurrentDungeonRoom(dungeonId: string): void {
    this.CurrentDungeonIdState.set(dungeonId);
  }

  private CurrentRunInfo(): DungeonRunInfo | null {
    const currentDungeonId = this.CurrentDungeonIdState();
    return this.GetRunInfo(currentDungeonId);
  }

  private GetRunInfo(dungeonId: string): DungeonRunInfo | null {
    if (!dungeonId) return null;
    const runsByDungeonId = this.RunsByDungeonIdState();
    return runsByDungeonId[dungeonId] ?? null;
  }

  private UpdateRunInfo(
    dungeonId: string,
    updater: (runInfo: DungeonRunInfo) => DungeonRunInfo
  ): void {
    if (!dungeonId) return;

    this.RunsByDungeonIdState.update((runsByDungeonId) => {
      const currentRunInfo = runsByDungeonId[dungeonId] ?? CreateEmptyDungeonRunInfo();
      return {
        ...runsByDungeonId,
        [dungeonId]: updater(currentRunInfo)
      };
    });
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
