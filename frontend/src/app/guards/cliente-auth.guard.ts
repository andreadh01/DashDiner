import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClienteAuthGuard {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const userObjString = sessionStorage.getItem('usuario');
    if (userObjString) {
      const user = JSON.parse(userObjString);
      console.log('current');

      console.log(user);
      if (
        user.tipo == 'cliente' &&
        Number(route.paramMap.get('id')) == user.id
      ) {
        //     console.log('verdadero');
        return true;
      } else {
        this.router.navigateByUrl('/');
        return false;
      }
    } else {
      this.router.navigateByUrl('/');
      return false;
    }
  }
}
