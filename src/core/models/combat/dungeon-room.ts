import { CreaturesIconName } from '../../../shared/components';

export type DungeonRoomKey = 'Silver Key' | 'Magic Key' | 'Golden Key';

export enum DungeonType {
  Normal = 'Normal',
  Capstone = 'Capstone'
}

export interface DungeonRoomPrerequisites {
  Gold: number;
  Key?: DungeonRoomKey | null;
}

export interface DungeonRoomRewards {
  Gold: number;
  Key?: DungeonRoomKey | null;
}

export interface DungeonRoom {
  Id: string;
  Title: string;
  Description: string;

  Icon: CreaturesIconName;
  Type: DungeonType;

  StagesBase: number;
  MidStages: number[];
  StagesMax: number;

  XpBase: number;
  GoldBase: number;

  Locked: boolean;
}

export interface NormalDungeonRoom extends DungeonRoom {
  Type: DungeonType.Normal;
}

export interface CapstoneDungeonRoom extends DungeonRoom {
  Type: DungeonType.Capstone;
  Prerequisites: DungeonRoomPrerequisites;
  Rewards: DungeonRoomRewards;
}
