import {Injectable} from "@angular/core";
import {Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import {throwError} from "rxjs";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

@Injectable()
export class AuthenticationService {
  private authUrl = 'http://localhost:8181/auth';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private httpClient: HttpClient) {
  }

  login(username: string, password: string): Observable<boolean> {
    var httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Location',
      })
    }
    return this.httpClient.post(this.authUrl, JSON.stringify({
      username: username,
      password: password
    }), httpOptions)
      .map((response: HttpResponse<any>) => {
        // login successful if there's a jwt token in the response
        let token = response["token"];
        if (token) {
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify({username: username, token: token}));

          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          return false;
        }
      }).catch((error: any) => throwError(error.json().error || 'Server error'));
  }

  getToken(): String {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var token = currentUser && currentUser.token;
    return token ? token : "";
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}
