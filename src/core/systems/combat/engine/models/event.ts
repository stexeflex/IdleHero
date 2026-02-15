import { Timestamp } from './timestamp';

export interface Event extends Timestamp {
  Type: string;
}
