export interface BattleLogMessage {
  Message: string;
  Submessage?: string;
  Type: MessageType;
}

export type MessageType =
  | 'Info'
  | 'Other'
  | 'Separator'
  | 'Damage'
  | 'Crit'
  | 'Multi'
  | 'CritMulti'
  | 'LevelUp'
  | 'BossDefeat';
