import {Injectable} from '@angular/core';
import {Http, Headers, Response} from "@angular/http";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs/Observable";
import {Target} from "./model/target";
import MappingUtils from "./mapping-utils";
import {TargetSlot} from "./model/target-slot";

@Injectable()
export class TargetService {

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

  getAll(): Observable<Target[]> {
    let targets$ = this.http
      .get(`${this.baseUrl}/target`, {headers: this.getHeaders()})
      .map(this.mapTargets).catch(handleError);
    return targets$;
  }

  private mapTargets(response: Response): Target[] {
    return response.json()._embedded.targetResourceList.map(MappingUtils.toTarget);
  }

  private mapTarget(response: Response): Target {
    return MappingUtils.toTarget(response.json());
  }

  getById(target_id: any) {
    let target$ = this.http
      .get(`${this.baseUrl}/target/${target_id}`,
        {headers: this.getHeaders()})
      .map(this.mapTarget)
      .catch(handleError);
    return target$;
  }

  removeDishFromTarget(dish_id: string, target_id: string) {
    var url: string = this.baseUrl + '/target/' + target_id + "/dish/" + dish_id;

    return this
      .http
      .delete(`${url}`,
        {headers: this.getHeaders()});
  }

  addSlotToTarget(target_id: string, tag_id: string) {
    var newTargetSlot: TargetSlot = <TargetSlot>({
      slot_dish_tag_id: tag_id,
    });
    var url: string = this.baseUrl + '/target/' + target_id + "/slot";

    return this
      .http
      .post(`${url}`,
        JSON.stringify(newTargetSlot),
        {headers: this.getHeaders()});
  }

  deleteSlotFromTarget(target_id: string, slot_id: string) {
    var url: string = this.baseUrl + '/target/' + target_id + "/slot/" + slot_id;

    return this
      .http
      .delete(`${url}`,
        {headers: this.getHeaders()});
  }

  addTarget(targetName: string) {
    var newTarget: Target = <Target>({
      target_name: targetName,
    });

    var url: string = this.baseUrl + '/target';

    return this
      .http
      .post(`${url}`,
        JSON.stringify(newTarget),
        {headers: this.getHeaders()});
  }

  deleteTarget(targetId: string) {
    var url: string = this.baseUrl + '/target/' + targetId;

    return this
      .http
      .delete(`${url}`, {headers: this.getHeaders()});
  }

  addTagToTarget(target_id: string, tag_id: string) {
    var url: string = this.baseUrl + '/target/' + target_id + "/tag/" + tag_id;

    return this
      .http
      .post(`${url}`,
        null,
        {headers: this.getHeaders()});
  }

  removeTagFromTarget(target_id: string, tag_id: string) {
    var url: string = this.baseUrl + '/target/' + target_id + "/tag/" + tag_id;

    return this
      .http
      .delete(`${url}`,
        {headers: this.getHeaders()});
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


