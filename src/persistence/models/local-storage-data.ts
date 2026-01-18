export interface LocalStorageData<T> {
  version: string;
  timestamp: number;
  data: T;
}
