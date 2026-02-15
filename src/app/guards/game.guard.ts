import { AppStateService } from '../../shared/services';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const gameGuard: CanActivateFn = (route, state) => {
  const appStateService = inject(AppStateService);

  if (appStateService.LoadedExistingSaveGame()) {
    return true;
  }

  const router = inject(Router);
  return router.createUrlTree(['new']);
};
