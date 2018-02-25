import {Inject, Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs/Observable";
import MappingUtils from "../model/mapping-utils";
import {Proposal} from "../model/proposal";
import {BaseHeadersService} from "./base-service";
import {APP_CONFIG, AppConfig} from "../app.config";
import {Logger} from "angular2-logger/core";

@Injectable()
export class ProposalService extends BaseHeadersService {

  private baseUrl: string;

  constructor(private http: Http,
              @Inject(APP_CONFIG) private config: AppConfig,
              private _logger: Logger,
              private _authenticationService: AuthenticationService) {
    super(_authenticationService);
    this.baseUrl = this.config.apiEndpoint + "proposal";
  }


  getById(proposal_id: any) {
    let proposal$ = this.http
      .get(`${this.baseUrl}/${proposal_id}`,
        {headers: this.getHeaders()})
      .map(this.mapProposal)
      .catch(handleError);
    return proposal$;
  }

  generateProposal(target_id: string) {
    var url: string = this.baseUrl + '/target/' + target_id;

    return this
      .http
      .post(`${url}`,
        null,
        {headers: this.getHeaders()});
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
    let url = this.baseUrl + "/"
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
    let url = this.baseUrl + "/"
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


  refreshProposal(proposalId: string, direction: string) {
    let url = this.baseUrl + "/"
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
    let url = this.baseUrl + "/"
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

