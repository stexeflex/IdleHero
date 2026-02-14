import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameService {
  public readonly Title = signal('Not So Idle Hero');
}
