import {Injectable} from "@angular/core";
import {AuthenticationService} from "./authentication.service";
import {Headers} from "@angular/http";

@Injectable()
export class BaseHeadersService {

  constructor(private authenticationService: AuthenticationService) {
  }

  getHeaders() {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Expose-Headers', 'Location');
    headers.append('Authorization', 'Bearer ' + this.authenticationService.getToken());
    return headers;
  }
}




