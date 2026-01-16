import {
  ApplicationConfig,
  LOCALE_ID,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { StateApplicationService, StatePersistenceService } from '../persistence';

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
      await InitializeApp(inject(StatePersistenceService), inject(StateApplicationService));
    }),
    provideRouter(routes)
  ]
};

export async function InitializeApp(
  statePersistenceService: StatePersistenceService,
  stateApplicationService: StateApplicationService
): Promise<void> {
  const schema = await statePersistenceService.LoadSchema();
  console.log('Loaded schema:', schema);
  stateApplicationService.ApplyState(schema);
}
