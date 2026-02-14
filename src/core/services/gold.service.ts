import { GoldState, InitialGoldState } from '../models/economy/gold-state';
import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GoldService {
  private readonly State = signal<GoldState>(InitialGoldState());

  public readonly Balance = computed<number>(() => this.State().Balance);
  public readonly TotalEarned = computed<number>(() => this.State().TotalEarned);
  public readonly TotalSpent = computed<number>(() => this.State().TotalSpent);

  /**
   * Sets the gold balance directly. Earned/Spent are not altered.
   * @param amount the new balance amount
   */
  public SetBalance(amount: number): void {
    if (!Number.isFinite(amount)) return;

    const balance = Math.max(0, Math.floor(amount));
    this.State.update((s) => ({ ...s, Balance: balance }));
  }

  /**
   * Adds gold to the balance and tracks it in TotalEarned.
   * @param amount the amount to add
   * @returns new balance
   */
  public Add(amount: number): number {
    if (!Number.isFinite(amount) || amount <= 0) return this.State().Balance;

    const increaseAmount = Math.floor(amount);
    let next = 0;

    this.State.update((current) => {
      next = current.Balance + increaseAmount;
      return {
        ...current,
        Balance: next,
        TotalEarned: current.TotalEarned + increaseAmount
      };
    });
    return next;
  }

  /**
   * Attempts to spend gold from the balance. Fails if insufficient.
   * @param amount the amount to spend
   * @returns true if spending succeeded, false otherwise
   */
  public Spend(amount: number): boolean {
    if (!Number.isFinite(amount) || amount < 0) return false;

    const decreaseAmount = Math.floor(amount);

    if (this.State().Balance < decreaseAmount) return false;

    this.State.update((current) => ({
      ...current,
      Balance: current.Balance - decreaseAmount,
      TotalSpent: current.TotalSpent + decreaseAmount
    }));

    return true;
  }

  /**
   * Checks if the current balance can cover the specified amount.
   * @param amount the amount to check
   * @returns true if balance is sufficient, false otherwise
   */
  public CanAfford(amount: number): boolean {
    if (!Number.isFinite(amount) || amount < 0) return false;
    return this.State().Balance >= Math.floor(amount);
  }

  /**
   * Resets gold tracking to the provided balance, clearing spent/earned.
   * @param initialBalance the balance to reset to
   */
  public Reset(initialBalance = 0): void {
    this.State.set(InitialGoldState(initialBalance));
  }

  public GetState(): GoldState {
    return { ...this.State() };
  }

  public SetState(state: GoldState): void {
    this.State.set({ ...state });
  }
}
