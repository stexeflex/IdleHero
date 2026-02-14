import { Event } from './models/event';

/**
 * Event-Queue, die Events nach Timestamp sortiert hält.
 */
export class EventQueue<T extends Event> {
  private QueuedItems: T[] = [];

  /**
   * Leert die Queue.
   * @param exceptType Optional: Es werden alle Events entfernt, außer denen mit den angegebenen Typen.
   */
  public Clear(exceptType: string[] = []): void {
    this.QueuedItems = this.QueuedItems.filter((item) => exceptType.includes(item.Type));
  }

  /**
   * Fügt ein Event in die Queue hinzu.
   */
  public Push(event: T): void {
    this.QueuedItems.push(event);
    this.BubbleUp(this.QueuedItems.length - 1);
  }

  /**
   * Peek auf das nächste Event in der Queue.
   * @returns Das nächste Event oder undefined, wenn die Queue leer ist.
   */
  public Peek(): T | undefined {
    return this.QueuedItems[0];
  }

  /**
   * Entfernt und gibt das nächste Event aus der Queue zurück.
   * @returns Das nächste Event oder undefined, wenn die Queue leer ist.
   */
  public Pop(): T | undefined {
    if (this.QueuedItems.length === 0) return undefined;

    const top = this.QueuedItems[0];
    const last = this.QueuedItems.pop()!;

    if (this.QueuedItems.length > 0) {
      this.QueuedItems[0] = last;
      this.BubbleDown(0);
    }

    return top;
  }

  /**
   * Applies a mutator to all queued events.
   * If the mutator returns null, the event is removed.
   * Resulting events are re-sorted by timestamp.
   */
  public UpdateAll(mutator: (event: T) => T | null): void {
    const next: T[] = [];

    for (const e of this.QueuedItems) {
      const m = mutator(e);
      if (m) next.push(m);
    }

    next.sort((a, b) => a.AtMs - b.AtMs);
    this.QueuedItems = next;
  }

  private BubbleUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);

      if (this.QueuedItems[index].AtMs < this.QueuedItems[parent].AtMs) {
        [this.QueuedItems[index], this.QueuedItems[parent]] = [
          this.QueuedItems[parent],
          this.QueuedItems[index]
        ];
        index = parent;
      } else break;
    }
  }

  private BubbleDown(index: number) {
    const length = this.QueuedItems.length;

    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;

      if (left < length && this.QueuedItems[left].AtMs < this.QueuedItems[smallest].AtMs) {
        smallest = left;
      }

      if (right < length && this.QueuedItems[right].AtMs < this.QueuedItems[smallest].AtMs) {
        smallest = right;
      }

      if (smallest !== index) {
        [this.QueuedItems[index], this.QueuedItems[smallest]] = [
          this.QueuedItems[smallest],
          this.QueuedItems[index]
        ];
        index = smallest;
      } else break;
    }
  }
}
