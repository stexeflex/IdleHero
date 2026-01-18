import { Gear, GearType, ReconstructGear, StatType } from '../../models';
import { Injectable, signal } from '@angular/core';

import { InventorySchema } from '../../../persistence';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  public Weapon = signal<Gear>(null as any);
  public Shield = signal<Gear>(null as any);

  public Head = signal<Gear>(null as any);
  public Chest = signal<Gear>(null as any);
  public Legs = signal<Gear>(null as any);
  public Boots = signal<Gear>(null as any);

  public Init(inventorySchema: InventorySchema) {
    this.Weapon.set(ReconstructGear(inventorySchema.Weapon) as any);
    this.Shield.set(ReconstructGear(inventorySchema.Shield) as any);
    this.Head.set(ReconstructGear(inventorySchema.Head) as any);
    this.Chest.set(ReconstructGear(inventorySchema.Chest) as any);
    this.Legs.set(ReconstructGear(inventorySchema.Legs) as any);
    this.Boots.set(ReconstructGear(inventorySchema.Boots) as any);
  }

  public CollectSchema(schema: InventorySchema): InventorySchema {
    schema.Weapon = this.Weapon();
    schema.Shield = this.Shield();
    schema.Head = this.Head();
    schema.Chest = this.Chest();
    schema.Legs = this.Legs();
    schema.Boots = this.Boots();
    return schema;
  }

  public GetGearForSlot(slot: GearType): Gear | null {
    switch (slot) {
      case GearType.Weapon:
        return this.Weapon();
      case GearType.Shield:
        return this.Shield();
      case GearType.Head:
        return this.Head();
      case GearType.Chest:
        return this.Chest();
      case GearType.Legs:
        return this.Legs();
      case GearType.Boots:
        return this.Boots();
      default:
        return null;
    }
  }

  public SetGearForSlot(slot: GearType, gear: Gear): void {
    switch (slot) {
      case GearType.Weapon:
        this.Weapon.update(() => null as any);

        if (gear) {
          this.Weapon.update(() => gear);
        }
        break;

      case GearType.Shield:
        this.Shield.update(() => null as any);

        if (gear) {
          this.Shield.update(() => gear);
        }
        break;

      case GearType.Head:
        this.Head.update(() => null as any);

        if (gear) {
          this.Head.update(() => gear);
        }
        break;

      case GearType.Chest:
        this.Chest.update(() => null as any);

        if (gear) {
          this.Chest.update(() => gear);
        }
        break;

      case GearType.Legs:
        this.Legs.update(() => null as any);

        if (gear) {
          this.Legs.update(() => gear);
        }
        break;

      case GearType.Boots:
        this.Boots.update(() => null as any);

        if (gear) {
          this.Boots.update(() => gear);
        }
        break;
    }
  }

  public RemoveGearFromSlot(slot: GearType): void {
    this.SetGearForSlot(slot, null as any);
  }

  public GetBonusStatFromGear(stat: StatType): number {
    let totalBonus: number = 0;

    const gearSlots: Gear[] = [
      this.Weapon(),
      this.Shield(),
      this.Head(),
      this.Chest(),
      this.Legs(),
      this.Boots()
    ];

    gearSlots.forEach((gear) => {
      if (gear) {
        totalBonus += gear.GetStatBonus(stat);
      }
    });

    return totalBonus;
  }
}
