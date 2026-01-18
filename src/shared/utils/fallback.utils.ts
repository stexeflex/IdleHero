import { ObjectUtils } from './object.utils';

export class FallbackUtils {
  public static pickString(value: unknown, fallback: string): string {
    return typeof value === 'string' ? value : fallback;
  }

  public static pickNumber(value: unknown, fallback: number): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  }

  public static pickBoolean(value: unknown, fallback: boolean): boolean {
    return typeof value === 'boolean' ? value : fallback;
  }

  public static pickNullableObject<T extends object | null>(value: unknown, fallback: T): T {
    if (value === null) return null as T;
    return ObjectUtils.isPlainObject(value) ? (value as T) : fallback;
  }
}
