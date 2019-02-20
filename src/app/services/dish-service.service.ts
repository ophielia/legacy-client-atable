import {Inject, Injectable} from "@angular/core";
import {AuthenticationService} from "./authentication.service";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {merge} from 'rxjs';
import {Dish} from "../model/dish";
import MappingUtils from "../model/mapping-utils";
import {BaseHeadersService} from "./base-service";
import {APP_CONFIG, AppConfig} from "../app.config";
import {NGXLogger} from "ngx-logger";
import {ITag} from "../model/tag";
import {RatingUpdateInfo} from "../model/rating-update-info";
import {RatingInfo} from "../model/rating-info";

@Injectable()
export class DishService extends BaseHeadersService {

  private dishUrl: string;

  constructor(private httpClient: HttpClient,
              @Inject(APP_CONFIG) private config: AppConfig,
              private _logger: NGXLogger,
              private _authenticationService: AuthenticationService) {
    super(_authenticationService);
    this.dishUrl = this.config.apiEndpoint + "dish";
  }

  getAll(): Observable<Dish[]> {
    let dishs$ = this.httpClient
      .get(`${this.dishUrl}`)
      .map(this.mapDishes);
    return dishs$;
  }

  getById(dish_id: string): Observable<Dish> {
    let dish$ = this.httpClient
      .get(`${this.dishUrl}/${dish_id}`)
      .map(data => this.mapDish(data));
    return dish$;
  }

  getRatingInfoForDish(dish_id: string): Observable<RatingUpdateInfo> {
    let dish$ = this.httpClient
      .get(`${this.dishUrl}/${dish_id}/ratings`)
      .map(data => this.mapRatingUpdateInfo(data));
    return dish$;
  }

  addDish(newDishName: string, tags?: ITag[]): Observable<HttpResponse<Object>> {

    var newDish: Dish = <Dish>({
      name: newDishName,
    });

    if (tags) {
      newDish.tags = tags;
    }

    return this
      .httpClient
      .post(`${this.dishUrl}`,
        JSON.stringify(newDish),
        {observe: 'response'});

  }

  saveDish(dish: Dish): Observable<Object> {
    return this
      .httpClient
      .put(`${this.dishUrl}/${dish.dish_id}`,
        JSON.stringify(dish));
  }


  removeTagFromDish(dish_id: string, tag_id: string): Observable<Object> {
    return this
      .httpClient
      .delete(`${this.dishUrl}/${dish_id}/tag/${tag_id}`);
  }

  addTagToDish(dish_id: string, tag_id: string): Observable<Object> {
    return this
      .httpClient
      .post(`${this.dishUrl}/${dish_id}/tag/${tag_id}`, null);
  }

  findByTags(inclList: string[], exclList: string[]) {
    var inclString = "";
    if (inclList) {
      inclString = inclList.join(",");

    }
    var exclString = "";
    if (exclList) {
      exclString = exclList.join(",");

    }

    var url = this.dishUrl;
    if (inclString.length > 0) {
      url = url + "?includedTags=" + inclString;
    }
    if (exclString.length > 0) {
      url = url +
        (inclString.length > 0 ? "&" : "?") + "excludedTags=" + exclString;
    }
    let dishs$ = this.httpClient
      .get(url)
      .map(this.mapDishes);
    return dishs$;
  }

  addAndRemoveTags(dish: any, toAdd: string[], toRemove: string[], saveDish): Observable<Object> {
    var inclString = "";
    if (toAdd) {
      inclString = toAdd.join(",");

    }
    var exclString = "";
    if (toRemove) {
      exclString = toRemove.join(",");

    }

    var url = this.dishUrl + "/" + dish.dish_id + "/tag";
    if (inclString.length > 0) {
      url = url + "?addTags=" + inclString;
    }
    if (exclString.length > 0) {
      url = url +
        (inclString.length > 0 ? "&" : "?") + "removeTags=" + exclString;
    }
    let dishs$ = this.httpClient
      .put(url, null);
    if (saveDish == true) {
      let saveDish$ = this.saveDish(dish);
      return merge(dishs$, saveDish$);
    }
    return dishs$;
  }

  addTagToDishes(dishList: Dish[], tag_id: string) {
    if (!dishList || dishList.length == 0) {
      return;
    }

    var dishrequest$ = this.addTagToDish(dishList[0].dish_id, tag_id);
    for (var i = 1; i < dishList.length; i++) {
      let nextDish$ = this.addTagToDish(dishList[i].dish_id, tag_id);
      dishrequest$ = merge(dishrequest$, nextDish$);
    }
    return dishrequest$;
  }

  incrementDishRating(dish_id: string, rating_tag_id: number, direction: string) {
    var url = this.dishUrl;
    url = url + "/" + dish_id + "/rating/" + rating_tag_id + "?direction=" + direction;
    return this
      .httpClient
      .post(url, null);
  }

  private mapDishes(object: Object): Dish[] {
    let embeddedObj = object["_embedded"];
    if (embeddedObj) {
      return embeddedObj["dishResourceList"].map(MappingUtils.toDish);
    } else
      return [];
  }

  private mapDish(object: Object): Dish {
    return MappingUtils.toDish(object);
  }

  private mapRatingUpdateInfo(object: Object): RatingUpdateInfo {
    return MappingUtils.toRatingUpdateInfo(object);
  }


}



