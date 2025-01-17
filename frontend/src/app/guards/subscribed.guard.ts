// dashboard-auth.guard.ts
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { GlobalService } from '../services/global.service';

@Injectable({
  providedIn: 'root',
})
export class SubscribedGuard {
  constructor(private service: GlobalService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Replace the following condition with your actual authentication logic
    const userObjString = sessionStorage.getItem('usuario');
    if (userObjString) {
      const user = JSON.parse(userObjString);
      console.log('aquiiii');
      if (!this.service.isSuscrito) {
        console.log('not suscrito');
        // Redirect to another route if the user doesn't meet the conditions
        console.log(this.router.url);
        this.router.navigateByUrl('admin/' + user.id + '/menu');
        return false;
      }

      return true;
    } else {
      this.router.navigateByUrl('/');
      return false;
    }
  }
}
