import { Boss, CapstoneDungeonRoom, DungeonRoom, DungeonType } from '../models';
import { Injectable, computed, inject, signal } from '@angular/core';

import { BossSelectionService } from '../systems/combat';
import { ClampUtils } from '../../shared/utils';
import { DungeonKeyService } from './dungeon-key.service';
import { DungeonRewardsService } from '../systems/combat/dungeons/dungeon-rewards.service';
import { GetDungeonById } from '../constants';
import { GoldService } from './gold.service';
import { StatisticsService } from './statistics.service';

@Injectable({ providedIn: 'root' })
export class DungeonRoomService {
  private readonly Statistics = inject<StatisticsService>(StatisticsService);
  private readonly Bosses = inject(BossSelectionService);
  private readonly Rewards = inject(DungeonRewardsService);
  private readonly Keys = inject(DungeonKeyService);
  private readonly Gold = inject(GoldService);

  private readonly CurrentDungeonIdState = signal<string | null>(null);
  private readonly CurrentStageState = signal<number>(1);

  // Current Dungeon ID
  public readonly CurrentDungeonId = computed<string | null>(() => this.CurrentDungeonIdState());
  // Current Dungeon Room
  public readonly CurrentDungeon = computed<DungeonRoom | null>(() => {
    const id = this.CurrentDungeonIdState();
    return id !== null ? GetDungeonById(id) : null;
  });

  // Current Stage within the Dungeon Room
  public readonly CurrentStage = computed<number>(() => this.CurrentStageState());

  // Current Boss
  public readonly CurrentBoss = computed((): Boss | null => {
    const dungeon = this.CurrentDungeon();
    const stage = this.CurrentStage();

    if (!dungeon) return null;

    return this.Bosses.GetBoss(dungeon.Id, stage);
  });

  /**
   * Checks if the player can enter the given dungeon.
   * Validates gold and key requirements for Capstone dungeons.
   * @param dungeonId The dungeon Id to check.
   * @returns True if entry is allowed; false otherwise.
   */
  public CanEnter(dungeonId: string): boolean {
    const dungeon = GetDungeonById(dungeonId);

    if (!dungeon) return false;

    if (
      dungeon.Type === DungeonType.Capstone &&
      !this.CanEnterCapstoneDungeon(dungeon as CapstoneDungeonRoom)
    ) {
      return false;
    }

    // Normal dungeons have no prerequisites
    return dungeon.Locked === false;
  }

  private CanEnterCapstoneDungeon(dungeon: CapstoneDungeonRoom): boolean {
    // Check gold prerequisite
    if (!this.Gold.CanAfford(dungeon.Prerequisites.Gold)) {
      return false;
    }

    // Check key prerequisite
    if (dungeon.Prerequisites.Key && !this.Keys.HasKey(dungeon.Prerequisites.Key)) {
      return false;
    }

    return true;
  }

  /**
   * Enters a dungeon and sets the stage to 1 when allowed.
   * @param dungeonId The dungeon Id to enter.
   * @returns True if entered successfully; false otherwise.
   */
  public EnterDungeon(dungeonId: string): boolean {
    if (!this.CanEnter(dungeonId)) return false;

    const dungeon = GetDungeonById(dungeonId);

    if (!dungeon) return false;

    if (dungeon.Type === DungeonType.Capstone) {
      const capstoneDungeon = dungeon as CapstoneDungeonRoom;

      // Spend gold prerequisite
      if (!this.Gold.Spend(capstoneDungeon.Prerequisites.Gold)) {
        return false;
      }
    }

    this.CurrentDungeonIdState.set(dungeonId);
    this.CurrentStageState.set(1);

    return true;
  }

  /**
   * Advances the current stage, granting rewards.
   * At final stage, grants completion rewards and any capstone key.
   * @returns True if advanced; false if no dungeon or already at max stage.
   */
  public AdvanceStage(): boolean {
    const dungeon = this.CurrentDungeon();

    if (!dungeon) return false;

    const stage = this.CurrentStage();

    // Grant stage rewards and advance to next stage
    if (stage < dungeon.StagesMax) {
      if (dungeon.MidStages.includes(stage)) {
        this.Rewards.GrantMidBossRewards(dungeon, stage);
      } else {
        this.Rewards.GrantStageRewards(dungeon, stage);
      }

      this.CurrentStageState.set(stage + 1);
      return true;
    }
    // At final stage: grant completion rewards and capstone key reward if any
    else {
      this.Rewards.GrantCompletionRewards(dungeon);
      // already at max; no further advancement
      return false;
    }
  }

  /**
   * Sets the current stage to a specific value within bounds.
   * @param stage The stage to set (1..StagesMax).
   */
  public SetStage(stage: number): void {
    const dungeon = this.CurrentDungeon();

    if (!dungeon) return;

    // Clamp (1..StagesMax)
    const stageToSet = ClampUtils.clamp(Math.floor(stage), 1, dungeon.StagesMax);
    this.CurrentStageState.set(stageToSet);
  }

  /**
   * Exits the current dungeon and clears state.
   */
  public ExitDungeon(): void {
    this.CurrentDungeonIdState.set(null);
    this.CurrentStageState.set(1);
  }

  /**
   * Handles prestige by updating statistics, resetting stage, and exiting dungeon.
   */
  public Prestige(cleared: boolean): void {
    const currentDungeon: DungeonRoom = this.CurrentDungeon()!;
    const currentStage: number = this.CurrentStage()!;

    // Store the last completed stage (current stage - 1)
    const completedStage = cleared ? currentStage : currentStage - 1;

    const dungeonRoomStat = {
      [currentDungeon.Id]: completedStage
    };

    switch (currentDungeon.Type) {
      case 'Normal':
        this.Statistics.UpdateDungeon({ Dungeon: dungeonRoomStat });
        break;
      case 'Capstone':
        this.Statistics.UpdateDungeon({ Capstone: dungeonRoomStat });
        break;
    }

    this.SetStage(1);
  }
}
