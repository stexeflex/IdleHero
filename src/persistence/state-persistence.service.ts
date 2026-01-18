import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { LocalStorageData } from './models/local-storage-data';
import { Schema } from './models/schema';
import { environment } from '../environment/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StatePersistenceService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'idle-hero:save:v1';

  private get Version(): string {
    return environment.version;
  }

  constructor() {}

  public async Save<T>(data: T): Promise<void> {
    if (!this.isBrowser()) {
      console.log('Not in browser environment, cannot save to local storage');
      return;
    }

    try {
      const payloadData: LocalStorageData<T> = {
        version: this.Version,
        timestamp: Date.now(),
        data: data
      };
      const payload = JSON.stringify(payloadData);
      localStorage.setItem(this.STORAGE_KEY, payload);
    } catch (error) {
      // ignore quota/serialization errors for now
      console.error('Failed to save to local storage', error);
    }
  }

  public async Load<T = unknown>(): Promise<T | null> {
    if (!this.isBrowser()) {
      console.log('Not in browser environment, cannot load from local storage');
      return null;
    }

    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);

      if (!raw) {
        return null;
      }

      const localStorageData: LocalStorageData<T> | null = JSON.parse(
        raw
      ) as LocalStorageData<T> | null;

      if (localStorageData === null) {
        return null;
      }

      const version = localStorageData.version;
      let data = localStorageData.data;

      if (version !== this.Version) {
        data = this.migrate(data, version, this.Version) as T;
      }

      return (data ?? null) as T | null;
    } catch (error) {
      console.error('Failed to load from local storage', error);
      return null;
    }
  }

  /**
   * Convenience loader that returns a validated, default-filled Schema instance.
   * Ensures missing or invalid fields are replaced by defaults.
   */
  public async LoadSchema(): Promise<Schema> {
    const raw = await this.Load<unknown>();
    const defaults = new Schema();
    const merged = Schema.FromRaw(defaults, raw);

    // Always set schema version to current app version
    merged.Version = this.Version;

    return merged;
  }

  public Clear(): void {
    if (!this.isBrowser()) {
      console.log('Not in browser environment, cannot clear local storage');
      return;
    }

    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear local storage', error);
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private migrate(data: unknown, fromVersion: string, toVersion: string): unknown {
    // Add versioned migrations here as your schema evolves
    // Example:
    // if (fromVersion < 1) { /* transform data to v1 */ }
    return data;
  }
}
