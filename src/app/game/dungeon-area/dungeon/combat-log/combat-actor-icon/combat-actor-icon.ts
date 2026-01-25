import { Boss, Hero } from '../../../../../../core/models';
import {
  CharactersIconName,
  CreaturesIconName,
  IconComponent,
  IconSize
} from '../../../../../../shared/components';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-combat-actor-icon',
  imports: [IconComponent],
  template: `
    @if (ActorIsHero) {
      <app-icon [character]="HeroIcon" [size]="Size()"></app-icon>
    } @else if (ActorIsBoss) {
      <app-icon [creatures]="BossIcon" [size]="Size()"></app-icon>
    }
  `
})
export class CombatActorIcon {
  readonly Actor = input.required<Hero | Boss>();
  readonly Size = input<IconSize>('sm');

  protected get ActorIsHero(): boolean {
    const actor = this.Actor();
    return (actor as Hero).HeroIcon !== undefined;
  }

  protected get HeroIcon(): CharactersIconName | undefined {
    const actor = this.Actor();
    return (actor as Hero).HeroIcon || undefined;
  }

  protected get ActorIsBoss(): boolean {
    const actor = this.Actor();
    return (actor as Boss).BossIcon !== undefined;
  }

  protected get BossIcon(): CreaturesIconName | undefined {
    const actor = this.Actor();
    return (actor as Boss).BossIcon || undefined;
  }
}
