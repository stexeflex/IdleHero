import { Component, computed, inject } from '@angular/core';
import { IconComponent } from '../../../shared/components';

import { DungeonRoomService } from '../../../core/services';
import { DungeonRoom } from '../../../core/models';
import { GetDungeonById, GetScalingParamsForDungeon } from '../../../core/constants';

interface BossCard {
  DungeonId: string;
  Title: string;
  Description: string;
  Icon: DungeonRoom['Icon'];
  Hp: number;
  HpText: string;
}

@Component({
  selector: 'app-dungeon-bosses',
  imports: [IconComponent],
  templateUrl: './dungeon-bosses.html',
  styleUrl: './dungeon-bosses.scss'
})
export class DungeonBosses {
  private readonly dungeonRoom = inject(DungeonRoomService);

  public readonly DemonBosses = computed<BossCard[]>(() => {
    const demonDungeon = GetDungeonById('B1');
    const demonScaling = GetScalingParamsForDungeon('B1');

    if (!demonDungeon || !demonScaling) {
      return [];
    }

    const hp = demonScaling.BossBaseHealth;

    return [
      {
        DungeonId: demonDungeon.Id,
        Title: demonDungeon.Title,
        Description: demonDungeon.Description,
        Icon: demonDungeon.Icon,
        Hp: hp,
        HpText: hp.toLocaleString('en-US')
      }
    ];
  });

  public readonly AngelBosses = computed<BossCard[]>(() => {
    const angelDungeon = GetDungeonById('B2');
    const angelScaling = GetScalingParamsForDungeon('B2');

    if (!angelDungeon || !angelScaling) {
      return [];
    }

    const hp = angelScaling.BossBaseHealth;

    return [
      {
        DungeonId: angelDungeon.Id,
        Title: angelDungeon.Title,
        Description: angelDungeon.Description,
        Icon: angelDungeon.Icon,
        Hp: hp,
        HpText: hp.toLocaleString('en-US')
      }
    ];
  });

  public EnterDungeon(id: string): void {
    this.dungeonRoom.EnterDungeon(id);
  }

  public CanEnter(id: string): boolean {
    return this.dungeonRoom.CanEnter(id);
  }
}
