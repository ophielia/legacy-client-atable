import {Inject, Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs/Observable";
import {Target} from "../model/target";
import MappingUtils from "../model/mapping-utils";
import {TargetSlot} from "../model/target-slot";
import {BaseHeadersService} from "./base-service";
import {APP_CONFIG, AppConfig} from "../app.config";
import {NGXLogger} from "ngx-logger";
import {ITag} from "../model/tag";
import TargetType from "../model/target-type";
import {throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class TargetService extends BaseHeadersService {

  private baseUrl = "http://localhost:8181";

  constructor(private httpClient: HttpClient,
              @Inject(APP_CONFIG) private config: AppConfig,
              private _logger: NGXLogger,
              private _authenticationService: AuthenticationService) {
    super(_authenticationService);
    this.baseUrl = this.config.apiEndpoint + "target";
  }


  getAll(): Observable<Target[]> {
    let targets$ = this.httpClient
      .get(`${this.baseUrl}`)
      .map(this.mapTargets).catch(handleError);
    return targets$;
  }


  getById(target_id: any) {
    let target$ = this.httpClient
      .get(`${this.baseUrl}/${target_id}`)
      .map(this.mapTarget)
      .catch(handleError);
    return target$;
  }

  removeDishFromTarget(dish_id: string, target_id: string) {
    var url: string = this.baseUrl + '/' + target_id + "/dish/" + dish_id;

    return this
      .httpClient
      .delete(`${url}`);
  }

  addSlotToTarget(target_id: string, tag_id: string) {
    var newTargetSlot: TargetSlot = <TargetSlot>({
      slot_dish_tag_id: tag_id,
    });
    var url: string = this.baseUrl + '/' + target_id + "/slot";

    return this
      .httpClient
      .post(`${url}`,
        JSON.stringify(newTargetSlot));
  }

  deleteSlotFromTarget(target_id: string, slot_id: string) {
    var url: string = this.baseUrl + '/' + target_id + "/slot/" + slot_id;

    return this
      .httpClient
      .delete(`${url}`);
  }

  addTarget(targetName: string) {
    var newTarget: Target = <Target>({
      target_name: targetName
    });

    var url: string = this.baseUrl + '';

    return this
      .httpClient
      .post(`${url}`,
        JSON.stringify(newTarget));
  }

  createPickupTarget(targetName: string, tags: ITag[]) {
    var newTarget: Target = <Target>({
      target_name: targetName,
      target_type: TargetType.PickUp
    });

    var idString: string = "";
    if (tags) {
      tags.forEach(t => idString = idString + "," + t.tag_id);
      if (idString.length > 0) {
        idString = "?pickupTags=" + idString.substr(1, idString.length - 1);
      }
    }
    var url: string = this.baseUrl + '/pickup' + idString;

    return this
      .httpClient
      .post(`${url}`,
        JSON.stringify(newTarget));
  }

  deleteTarget(targetId: string) {
    var url: string = this.baseUrl + '/' + targetId;

    return this
      .httpClient
      .delete(`${url}`);
  }

  addTagToTarget(target_id: string, tag_id: string) {
    var url: string = this.baseUrl + '/' + target_id + "/tag/" + tag_id;

    return this
      .httpClient
      .post(`${url}`,
        null);
  }

  removeTagFromTarget(target_id: string, tag_id: string) {
    var url: string = this.baseUrl + '/' + target_id + "/tag/" + tag_id;

    return this
      .httpClient
      .delete(`${url}`);
  }

  moveTagToTarget(target_id: string, tag_id: string, source_slot_id: string) {
    var addTagUrl: string = this.baseUrl + '/'
      + target_id + "/tag/" + tag_id;
    var cleanupTagUrl: string = this.baseUrl + '/'
      + target_id + "/slot/" + source_slot_id
      + "/tag/" + tag_id;


    let addTagCall = this
      .httpClient
      .post(`${addTagUrl}`,
        null);

    let cleanupTagCall = this
      .httpClient
      .delete(`${cleanupTagUrl}`);

    return addTagCall.concat(cleanupTagCall);
  }

  moveTagToTargetSlot(target_id: string, tag_id: string, source_slot_id: string, dest_slot_id: string) {
    var addTagUrl: string = this.baseUrl + '/'
      + target_id + "/slot/" + dest_slot_id
      + "/tag/" + tag_id;
    var cleanupTagUrl: string;
    if (source_slot_id) {
      cleanupTagUrl = this.baseUrl + '/'
        + target_id + "/slot/" + source_slot_id
        + "/tag/" + tag_id;
    } else {
      // no source id - this was from the target, and should be deleted from the target
      cleanupTagUrl = this.baseUrl + '/' + target_id + "/tag/" + tag_id;
    }


    let addTagCall = this
      .httpClient
      .post(`${addTagUrl}`,
        null);

    let cleanupTagCall = this
      .httpClient
      .delete(`${cleanupTagUrl}`);

    return addTagCall.concat(cleanupTagCall);
  }


  private mapTargets(response: Response): Target[] {
    if (response.json()._embedded && response.json()._embedded.targetResourceList) {
      return response.json()._embedded.targetResourceList.map(MappingUtils.toTarget);
    }
    return null;
  }

  private mapTarget(response: Response): Target {
    return MappingUtils.toTarget(response.json());
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


