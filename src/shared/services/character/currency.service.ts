import { Injectable, signal } from '@angular/core';

import { CURRENCY_CONFIG } from '../../constants';
import { CurrencySchema } from '../../../persistence';
import { DungeonRoomKey } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private _gold = signal<number>(CURRENCY_CONFIG.GOLD.STARTING_AMOUNT);
  public Gold = this._gold.asReadonly();

  public _silverKey = signal<boolean>(false);
  public SilverKey = this._silverKey.asReadonly();
  public _magicKey = signal<boolean>(false);
  public MagicKey = this._magicKey.asReadonly();
  public _goldenKey = signal<boolean>(false);
  public GoldenKey = this._goldenKey.asReadonly();

  public Init(currencySchema: CurrencySchema) {
    this._gold.set(currencySchema.Gold);
    this._silverKey.set(currencySchema.SilverKey);
    this._magicKey.set(currencySchema.MagicKey);
    this._goldenKey.set(currencySchema.GoldenKey);
  }

  public CollectSchema(schema: CurrencySchema): CurrencySchema {
    schema.Gold = this.Gold();
    schema.SilverKey = this.SilverKey();
    schema.MagicKey = this.MagicKey();
    schema.GoldenKey = this.GoldenKey();
    return schema;
  }

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

  public HasKey(key: DungeonRoomKey): boolean {
    switch (key) {
      case 'Silver Key':
        return this.SilverKey();
      case 'Magic Key':
        return this.MagicKey();
      case 'Golden Key':
        return this.GoldenKey();
      default:
        return false;
    }
  }

  public ObtainKey(key: DungeonRoomKey) {
    switch (key) {
      case 'Silver Key':
        this._silverKey.set(true);
        break;
      case 'Magic Key':
        this._magicKey.set(true);
        break;
      case 'Golden Key':
        this._goldenKey.set(true);
        break;
    }
  }
}
