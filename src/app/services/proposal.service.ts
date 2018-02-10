import {Injectable} from "@angular/core";
import {Headers, Http, Response} from "@angular/http";
import {AuthenticationService} from "../authentication.service";
import {Observable} from "rxjs/Observable";
import MappingUtils from "../mapping-utils";
import {Proposal} from "../model/proposal";

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
    let proposal = MappingUtils.toProposal(response.json());
    for (var i = 0; i < proposal.proposal_slots.length; i++) {
      let slot = proposal.proposal_slots[i];
      if (slot.selected_dish_index > -1) {
        let dish = slot.dish_slot_list[slot.selected_dish_index];
        dish.selected = true;
      }
    }
    return proposal;
  }

  selectDishForSlot(proposalId: string, slot_id: string, dish_id: string) {
    let url = this.baseUrl + "/proposal/"
      + proposalId
      + "/slot/"
      + slot_id
      + "/dish/"
      + dish_id;


    let proposal$ = this.http
      .post(`${url}`,
        null,
        {headers: this.getHeaders()});
    return proposal$;
  }

  clearDishFromSlot(proposalId: string, slot_id: string, dish_id: string) {
    let url = this.baseUrl + "/proposal/"
      + proposalId
      + "/slot/"
      + slot_id
      + "/dish/"
      + dish_id;


    let proposal$ = this.http
      .delete(`${url}`,
        {headers: this.getHeaders()});
    return proposal$;
  }

  generateMealPlan(proposalId: string) {
    let url = this.baseUrl + "/mealplan/proposal/"
      + proposalId;


    let proposal$ = this.http
      .post(`${url}`,
        null,
        {headers: this.getHeaders()});
    return proposal$;
  }

  refreshProposal(proposalId: string, direction: string) {
    let url = this.baseUrl + "/proposal/"
      + proposalId
      + "?direction="
      + direction;


    let proposal$ = this.http
      .put(`${url}`,
        null,
        {headers: this.getHeaders()});
    return proposal$;
  }

  refreshProposalSlot(proposalId: string, slot_id: string) {
    let url = this.baseUrl + "/proposal/"
      + proposalId
      + "/slot/"
      + slot_id;


    let proposal$ = this.http
      .put(`${url}`,
        null,
        {headers: this.getHeaders()});
    return proposal$;
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

