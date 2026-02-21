import { CreaturesIconName } from '../../../shared/components';
import { RuneQuality } from '../items/runes/rune-quality.enum';

export type DungeonRoomKey = 'Silver Key' | 'Magic Key' | 'Golden Key';

export enum DungeonType {
  Normal = 'Normal',
  Capstone = 'Capstone'
}

export interface DungeonRoomRewards {
  XpBase: number;
  GoldBase: number;
  RuneDropChances: Record<RuneQuality, number>;
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

  Rewards: DungeonRoomRewards;

  Locked: boolean;
}

export interface NormalDungeonRoom extends DungeonRoom {
  Type: DungeonType.Normal;
}

export interface CapstoneDungeonRoomPrerequisites {
  Gold: number;
  Key?: DungeonRoomKey | null;
}

export interface CapstoneDungeonRoomRewards {
  Gold: number;
  Key?: DungeonRoomKey | null;
}

export interface CapstoneDungeonRoom extends DungeonRoom {
  Type: DungeonType.Capstone;
  Prerequisites: CapstoneDungeonRoomPrerequisites;
  CapstoneRewards: CapstoneDungeonRoomRewards;
}
