import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';
import decode from 'jwt-decode';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(public auth: AuthenticationService, public router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {    // on the data property
    const expectedRole = route.data.expectedRole;
    const userString = localStorage.getItem('currentUser');    // decode the token to get its payload
    const user = JSON.parse(userString)
    const token = user.token;
    const tokenPayload = decode(token);
    if (
      !this.auth.isAuthenticated() ||
      !user.roles.includes(expectedRole)
    ) {
      this.router.navigate(['login'], {queryParams: {returnUrl: state.url}});
      return false;
    }
    return true;
  }
}
