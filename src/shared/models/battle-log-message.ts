export interface BattleLogMessage {
  Message: string;
  Submessage?: string;
  Type: MessageType;
}

export enum MessageType {
  Info = 0,
  Other = 1 << 0,
  Separator = 1 << 1,
  Damage = 1 << 2,
  Crit = 1 << 3,
  Multi = 1 << 4,
  Splash = 1 << 5,
  LevelUp = 1 << 6,
  BossDefeat = 1 << 7
}
