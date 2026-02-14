import { Attributes, InitialAttributes, ZeroAttributes } from '../models';
import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AttributesService {
  private readonly Base = signal<Attributes>(InitialAttributes());
  private readonly Allocated = signal<Attributes>(ZeroAttributes());
  private readonly Unallocated = signal<number>(0);

  /**
   * Effective attributes: Base + Allocated
   */
  public readonly Effective = computed<Attributes>(() => {
    const b = this.Base();
    const a = this.Allocated();
    return {
      Strength: b.Strength + a.Strength,
      Intelligence: b.Intelligence + a.Intelligence,
      Dexterity: b.Dexterity + a.Dexterity
    };
  });

  /**
   * Total allocated attribute points
   */
  public readonly AllocatedTotal = computed<number>(() => {
    const a = this.Allocated();
    return a.Strength + a.Intelligence + a.Dexterity;
  });

  /**
   * Unallocated attribute points available to spend on allocation
   */
  public readonly UnallocatedPoints = computed<number>(() => this.Unallocated());

  public SetBase(attributes: Attributes): void {
    this.Base.set({ ...attributes });
  }

  public SetAllocated(attributes: Attributes): void {
    this.Allocated.set({ ...attributes });
  }

  public AddAttributePoints(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) return;
    this.Unallocated.update((current) => current + Math.floor(amount));
  }

  /**
   * Gets a copy of the base attributes
   * @returns the base attributes
   */
  public GetBase(): Attributes {
    return { ...this.Base() };
  }

  /**
   * Gets a copy of the allocated attributes
   * @returns the allocated attributes
   */
  public GetAllocated(): Attributes {
    return { ...this.Allocated() };
  }

  /**
   * Allocates attribute points if available
   * @param attribute the attribute to allocate points to
   * @param amount the amount of points to allocate
   * @returns true if allocation was successful, false otherwise
   */
  public Allocate(attribute: keyof Attributes, amount: number): boolean {
    if (!Number.isFinite(amount) || amount <= 0) return false;

    const spendOk = this.SpendAttributePoints(amount);
    if (!spendOk) return false;

    this.Allocated.update((cur) => ({
      ...cur,
      [attribute]: cur[attribute] + Math.floor(amount)
    }));

    return true;
  }

  /**
   * Deallocates attribute points, refunding them back to unspent pool
   * @param attribute the attribute to deallocate points from
   * @param amount the amount of points to deallocate
   * @returns the number of points actually deallocated
   */
  public Deallocate(attribute: keyof Attributes, amount: number): number {
    if (!Number.isFinite(amount) || amount <= 0) return 0;

    const currentlyAllocated = this.Allocated();
    const available = currentlyAllocated[attribute];
    const toRefund = Math.min(available, Math.floor(amount));

    if (toRefund <= 0) return 0;

    this.Allocated.update((a) => ({
      ...a,
      [attribute]: a[attribute] - toRefund
    }));

    this.RefundAttributePoints(toRefund);

    return toRefund;
  }

  /**
   * Checks if deallocation is possible for the given attribute
   * @param attribute the attribute to check
   * @returns true if deallocation is possible, false otherwise
   */
  public CanDeallocate(attribute: keyof Attributes): boolean {
    const currentlyAllocated = this.Allocated();
    return currentlyAllocated[attribute] > 0;
  }

  /**
   * Refund all allocated points and reset allocation to zero.
   * @returns number of points refunded
   */
  public Respec(): number {
    const currentlyAllocated = this.Allocated();

    const total =
      currentlyAllocated.Strength + currentlyAllocated.Intelligence + currentlyAllocated.Dexterity;

    if (total > 0) {
      this.Allocated.set(InitialAttributes());
      this.RefundAttributePoints(total);
    }

    return total;
  }

  /**
   * Deducts points if available
   * @param amount the amount of attribute points to spend
   * @returns true if points were successfully spent, false otherwise
   */
  private SpendAttributePoints(amount: number): boolean {
    if (!Number.isFinite(amount) || amount <= 0) return false;
    if (this.UnallocatedPoints() < amount) return false;

    this.Unallocated.update((current) => current - amount);
    return true;
  }

  /**
   * Refunds attribute points back to the unspent pool
   * @param amount the amount of points to refund
   */
  private RefundAttributePoints(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) return;
    this.Unallocated.update((current) => current + Math.floor(amount));
  }
}
