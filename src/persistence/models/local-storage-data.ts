import { Schema } from './schema';

export interface LocalStorageData<T> {
  Version: string;
  TimeStamp: Date;
  Data: Schema;
}
