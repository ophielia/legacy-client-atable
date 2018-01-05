import {Injectable} from '@angular/core';
import {Http, Headers, Response} from "@angular/http";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs/Observable";
import MappingUtils from "./mapping-utils";
import {Proposal} from "./model/proposal";
import {ProposalSlot} from "./model/proposal-slot";

@Injectable()
export class ProposalService {

  private baseUrl = "http://localhost:8181";

  constructor(private http: Http,
              private authenticationService: AuthenticationService) {
  }

  private getHeaders() {
    // I included these headers because otherwise FireFox
    // will request text/html instead of application/json
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Expose-Headers', 'Location');
    headers.append('Authorization', 'Bearer ' + this.authenticationService.getToken());
    return headers;
  }


  getById(proposal_id: any) {
    let proposal$ = this.http
      .get(`${this.baseUrl}/proposal/${proposal_id}`,
        {headers: this.getHeaders()})
      .map(this.mapProposal)
      .catch(handleError);
    return proposal$;
  }


  private mapProposal(response: Response): Proposal {
    return MappingUtils.toProposal(response.json());
  }

}

function handleError(error: any) {
  // log error
  // could be something more sophisticated
  let errorMsg = error.message || `Yikes! There was a problem with our hyperdrive device and we couldn't retrieve your data!`
  console.error(errorMsg);

  // throw an application level error
  return Observable.throw(errorMsg);
}

