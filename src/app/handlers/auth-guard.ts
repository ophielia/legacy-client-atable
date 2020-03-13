import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public auth: AuthenticationService, public router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
      return false;
    }
    return true;
  }
}
