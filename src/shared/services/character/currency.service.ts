import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private _gold = signal<number>(1337);
  public Gold = this._gold.asReadonly();

  public AddGold(amount: number): void {
    this._gold.update((gold) => gold + amount);
  }

  public SpendGold(amount: number): boolean {
    if (this._gold() >= amount) {
      this._gold.update((gold) => gold - amount);
      return true;
    }
    return false;
  }
}
