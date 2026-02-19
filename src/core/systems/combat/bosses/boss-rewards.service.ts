import { Injectable, inject } from '@angular/core';

import { BossDungeonRoom, Rewards } from '../../../models';
import { CombatLogService, GoldService, LevelService } from '../../../services';
import { GetBossRoomRewards } from '../../../constants';

@Injectable({ providedIn: 'root' })
export class BossRewardsService {
  private readonly Level = inject(LevelService);
  private readonly Gold = inject(GoldService);
  private readonly Log = inject<CombatLogService>(CombatLogService);

  public ComputeCompletionRewards(bossRoom: BossDungeonRoom): Rewards {
    return GetBossRoomRewards(bossRoom.Id);
  }

  public GrantCompletionRewards(bossRoom: BossDungeonRoom): Rewards {
    const rewards = this.ComputeCompletionRewards(bossRoom);
    this.Log.Rewards(bossRoom.StagesMax, rewards);
    this.Gold.Add(rewards.Gold);
    this.Level.AddExperience(rewards.Experience);
    return rewards;
  }
}
