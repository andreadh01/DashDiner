import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const canShowConfirmGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (router.url === '/carrito') {
    return true;
  } else {
    router.navigateByUrl('/');
    return false;
  }
};
