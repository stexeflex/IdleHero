import { Timestamp } from './models/timestamp';

/**
 * Event-Queue, die Events nach Timestamp sortiert hält.
 */
export class EventQueue<T extends Timestamp> {
  private QueuedItems: T[] = [];

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
