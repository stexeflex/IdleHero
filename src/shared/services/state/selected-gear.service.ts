import { Gear, GearType } from '../../models';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectedGearService {
  private _selected = signal<Gear | null>(null);
  public Selected = this._selected.asReadonly();

  private _type = signal<GearType | null>(null);
  public Type = this._type.asReadonly();

  public SetSelectedGear(gear: Gear | null) {
    this._selected.set(gear ? gear : null);
  }

  public SetSelectedGearType(type: GearType | null) {
    this._type.set(type ? type : null);
  }

  public DeselectGear() {
    this._selected.set(null);
    this._type.set(null);
  }
}
