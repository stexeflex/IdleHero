import {
  ApplicationConfig,
  LOCALE_ID,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';

import { GameLoaderService } from '../persistence';
import localeDe from '@angular/common/locales/de';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { routes } from './app.routes';

registerLocaleData(localeDe, 'de-DE');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: LOCALE_ID, useValue: 'de-DE' },
    provideAppInitializer(async () => {
      await InitializeApp(inject(GameLoaderService));
    }),
    provideRouter(routes)
  ]
};

export async function InitializeApp(gameLoaderService: GameLoaderService): Promise<void> {
  await gameLoaderService.LoadGame();
}
