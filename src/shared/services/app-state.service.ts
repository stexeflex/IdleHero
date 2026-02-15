import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppStateService {
  public readonly LoadedExistingSaveGame = signal(false);
}
