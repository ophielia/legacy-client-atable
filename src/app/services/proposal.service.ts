import {Inject, Injectable} from "@angular/core";
import {AuthenticationService} from "./authentication.service";
import MappingUtils from "../model/mapping-utils";
import {Proposal} from "../model/proposal";
import {BaseHeadersService} from "./base-service";
import {APP_CONFIG, AppConfig} from "../app.config";
import {NGXLogger} from "ngx-logger";
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";

@Injectable()
export class ProposalService extends BaseHeadersService {

  private baseUrl: string;

  constructor(private httpClient: HttpClient,
              @Inject(APP_CONFIG) private config: AppConfig,
              private _logger: NGXLogger,
              private _authenticationService: AuthenticationService) {
    super(_authenticationService);
    this.baseUrl = this.config.apiEndpoint + "proposal";
  }


  getById(proposal_id: any) {
    let proposal$ = this.httpClient
      .get(`${this.baseUrl}/${proposal_id}`)
      .map(this.mapProposal)
      .catch(handleError);
    return proposal$;
  }

  generateProposal(target_id: string): Observable<HttpResponse<Proposal>> {
    var url: string = this.baseUrl + '/target/' + target_id;

    return this
      .httpClient
      .post<Proposal>(`${url}`,
        null, {observe: 'response'});
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


    let proposal$ = this.httpClient
      .post(`${url}`,
        null);
    return proposal$;
  }

  clearDishFromSlot(proposalId: string, slot_id: string, dish_id: string) {
    let url = this.baseUrl + "/"
      + proposalId
      + "/slot/"
      + slot_id
      + "/dish/"
      + dish_id;


    let proposal$ = this.httpClient
      .delete(`${url}`);
    return proposal$;
  }


  refreshProposal(proposalId: string, direction: string) {
    let url = this.baseUrl + "/"
      + proposalId
      + "?direction="
      + direction;


    let proposal$ = this.httpClient
      .put(`${url}`,
        null);
    return proposal$;
  }

  refreshProposalSlot(proposalId: string, slot_id: string) {
    let url = this.baseUrl + "/"
      + proposalId
      + "/slot/"
      + slot_id;


    let proposal$ = this.httpClient
      .put(`${url}`,
        null);
    return proposal$;
  }
}

function handleError(error: any) {
  // log error
  // could be something more sophisticated
  let errorMsg = error.message || `Yikes! There was a problem with our hyperdrive device and we couldn't retrieve your data!`
  console.error(errorMsg);

  // throw an application level error
  return throwError(errorMsg);
}

