import { Component, computed, inject } from '@angular/core';
import { IconComponent } from '../../../shared/components';

import { DungeonRoomService } from '../../../core/services';
import { DungeonRoom } from '../../../core/models';
import { GetDungeonById, GetScalingParamsForDungeon } from '../../../core/constants';

interface BossCard {
  Id: string;
  Name: string;
  Description: string;
  Icon: DungeonRoom['Icon'];
  Hp: number;
  HpText: string;
  DungeonId: string;
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

    return demonDungeon
      ? [
          {
            Id: 'DB1',
            Name: 'Demon Overlord',
            Description: 'A brutal demon commander ruling over the abyss.',
            Icon: demonDungeon.Icon,
            Hp: hp,
            HpText: hp.toLocaleString('en-US'),
            DungeonId: demonDungeon.Id
          }
        ]
      : [];
  });

  public readonly AngelBosses = computed<BossCard[]>(() => {
    const angelDungeon = GetDungeonById('B2');
    const angelScaling = GetScalingParamsForDungeon('B2');

    if (!angelDungeon || !angelScaling) {
      return [];
    }

    const hp = angelScaling.BossBaseHealth;

    return angelDungeon
      ? [
          {
            Id: 'AB1',
            Name: 'Angel Paragon',
            Description: 'A celestial guardian forged from divine light.',
            Icon: angelDungeon.Icon,
            Hp: hp,
            HpText: hp.toLocaleString('en-US'),
            DungeonId: angelDungeon.Id
          }
        ]
      : [];
  });

  public EnterDungeon(id: string): void {
    this.dungeonRoom.EnterDungeon(id);
  }

  public CanEnter(id: string): boolean {
    return this.dungeonRoom.CanEnter(id);
  }
}
