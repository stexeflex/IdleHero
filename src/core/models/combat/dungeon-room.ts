import { CreaturesIconName } from '../../../shared/components';
import { RuneQuality } from '../items/runes/rune-quality.enum';

export type DungeonRoomKey =
  | 'Silver Key'
  | 'Magic Key'
  | 'Golden Key'
  | 'Epic Key'
  | 'Legendary Key';

export enum DungeonType {
  Normal = 'Normal',
  Capstone = 'Capstone',
  Boss = 'Boss'
}

export interface DungeonRoomRewards {
  XpBase: number;
  GoldBase: number;
  RuneDropChances: Record<RuneQuality, number>;
  Key: DungeonRoomKey | null;
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

export interface NormalDungeonRoomPrerequisites {
  Level: number;
}

export interface NormalDungeonRoom extends DungeonRoom {
  Type: DungeonType.Normal;
  Prerequisites: NormalDungeonRoomPrerequisites;
}

export interface CapstoneDungeonRoomPrerequisites {
  Key: DungeonRoomKey;
}

export interface CapstoneDungeonRoom extends DungeonRoom {
  Type: DungeonType.Capstone;
  Prerequisites: CapstoneDungeonRoomPrerequisites;
}

export interface BossDungeonRoom extends DungeonRoom {
  Type: DungeonType.Boss;
}

export type AnyDungeonRoom = NormalDungeonRoom | CapstoneDungeonRoom | BossDungeonRoom;
