import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const forgotPasswordGuard: CanActivateFn = (route, state) => {
  console.log(sessionStorage.getItem('reset_code'));
  var session = sessionStorage.getItem('reset_code');
  const router = inject(Router);

  if (session) {
    return true;
  } else {
    router.navigateByUrl('forgot-password');
    return false;
  }
};
