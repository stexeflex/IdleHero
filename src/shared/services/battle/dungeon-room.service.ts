import { DungeonRoom, DungeonRoomId } from '../../models';
import { Injectable, signal } from '@angular/core';

import { DUNGEON_CONFIG } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class DungeonRoomService {
  private _currentRoom = signal<DungeonRoomId>(1);
  public Current = this._currentRoom.asReadonly();

  public Total = signal<number>(DUNGEON_CONFIG.DUNGEONS.TOTAL);

  public GetMaxStage(): number {
    const room = this.Current();

    switch (room) {
      case 1:
        return DUNGEON_CONFIG[1].STAGES.MAX;
      case 2:
        return DUNGEON_CONFIG[2].STAGES.MAX;
      case 3:
        return DUNGEON_CONFIG[3].STAGES.MAX;
      default:
        return DUNGEON_CONFIG[1].STAGES.MAX;
    }
  }

  public Get(): DungeonRoom {
    return this.GetRoom(this.Current())!;
  }

  public Set(room: DungeonRoomId): void {
    if (room < 1 || room > this.Total()) {
      return;
    }

    this._currentRoom.set(room);
  }

  public GetRoom(roomId: DungeonRoomId): DungeonRoom | null {
    const rooms = this.GetRooms();
    return rooms.find((r) => r.Id === roomId) || null;
  }

  public GetRooms(): DungeonRoom[] {
    return [
      {
        Id: 1,
        Title: 'Dungeon Room I',
        Icon: 'wyvern',
        StagesBase: DUNGEON_CONFIG[1].STAGES.BASE,
        StagesMax: DUNGEON_CONFIG[1].STAGES.MAX,
        BossBaseHealth: DUNGEON_CONFIG[1].BOSS.BASE_HEALTH,
        XpBase: DUNGEON_CONFIG[1].REWARDS.BASE_EXPERIENCE_REWARD,
        GoldBase: DUNGEON_CONFIG[1].REWARDS.BASE_GOLD_REWARD,
        Prerequisites: {
          Gold: DUNGEON_CONFIG[1].PREREQUISITES.GOLD_COST,
          Key: DUNGEON_CONFIG[1].PREREQUISITES.KEY
        },
        Rewards: {
          Gold: DUNGEON_CONFIG[1].ROOM_REWARDS.GOLD,
          Key: DUNGEON_CONFIG[1].ROOM_REWARDS.KEY
        }
      },
      {
        Id: 2,
        Title: 'Dungeon Room II',
        Icon: 'spectre',
        StagesBase: DUNGEON_CONFIG[2].STAGES.BASE,
        StagesMax: DUNGEON_CONFIG[2].STAGES.MAX,
        BossBaseHealth: DUNGEON_CONFIG[2].BOSS.BASE_HEALTH,
        XpBase: DUNGEON_CONFIG[2].REWARDS.BASE_EXPERIENCE_REWARD,
        GoldBase: DUNGEON_CONFIG[2].REWARDS.BASE_GOLD_REWARD,
        Prerequisites: {
          Gold: DUNGEON_CONFIG[2].PREREQUISITES.GOLD_COST,
          Key: DUNGEON_CONFIG[2].PREREQUISITES.KEY
        },
        Rewards: {
          Gold: DUNGEON_CONFIG[2].ROOM_REWARDS.GOLD,
          Key: DUNGEON_CONFIG[2].ROOM_REWARDS.KEY
        }
      },
      {
        Id: 3,
        Title: 'Dungeon Room III',
        Icon: 'gargoyle',
        StagesBase: DUNGEON_CONFIG[3].STAGES.BASE,
        StagesMax: DUNGEON_CONFIG[3].STAGES.MAX,
        BossBaseHealth: DUNGEON_CONFIG[3].BOSS.BASE_HEALTH,
        XpBase: DUNGEON_CONFIG[3].REWARDS.BASE_EXPERIENCE_REWARD,
        GoldBase: DUNGEON_CONFIG[3].REWARDS.BASE_GOLD_REWARD,
        Prerequisites: {
          Gold: DUNGEON_CONFIG[3].PREREQUISITES.GOLD_COST,
          Key: DUNGEON_CONFIG[3].PREREQUISITES.KEY
        },
        Rewards: {
          Gold: DUNGEON_CONFIG[3].ROOM_REWARDS.GOLD,
          Key: DUNGEON_CONFIG[3].ROOM_REWARDS.KEY
        }
      }
    ];
  }
}
