import {Inject, Injectable} from "@angular/core";
import {AuthenticationService} from "./authentication.service";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Dish} from "../model/dish";
import MappingUtils from "../model/mapping-utils";
import {BaseHeadersService} from "./base-service";
import {APP_CONFIG, AppConfig} from "../app.config";
import {Logger} from "angular2-logger/core";
import {ITag} from "../model/tag";
import {isUndefined} from "util";

@Injectable()
export class DishService extends BaseHeadersService {

  private dishUrl: string;

  constructor(private http: Http,
              @Inject(APP_CONFIG) private config: AppConfig,
              private _logger: Logger,
              private _authenticationService: AuthenticationService) {
    super(_authenticationService);
    this.dishUrl = this.config.apiEndpoint + "dish";
  }

  getAll(): Observable<Dish[]> {
    let dishs$ = this.http
      .get(`${this.dishUrl}`, {headers: this.getHeaders()})
      .map(this.mapDishes).catch(handleError);  // HERE: This is new!
    return dishs$;
  }

  getById(dish_id: string): Observable<Dish> {
    let dish$ = this.http
      .get(`${this.dishUrl}/${dish_id}`, {headers: this.getHeaders()})
      .map(this.mapDish)
      .catch(handleError);
    return dish$;
  }


  addDish(newDishName: string, tags?: ITag[]): Observable<Response> {

    var newDish: Dish = <Dish>({
      name: newDishName,
    });

    if (tags) {
      newDish.tags = tags;
    }

    return this
      .http
      .post(`${this.dishUrl}`,
        JSON.stringify(newDish),
        {headers: this.getHeaders()});

  }

  saveDish(dish: Dish): Observable<Response> {
    return this
      .http
      .put(`${this.dishUrl}/${dish.dish_id}`,
        JSON.stringify(dish),
        {headers: this.getHeaders()});
  }

  mapDishes(response: Response): Dish[] {
    // The response of the API has a results
    // property with the actual results
    if (response.json()._embedded && response.json()._embedded.dishResourceList) {
      return response.json()._embedded.dishResourceList.map(MappingUtils.toDish);
    }
    return null;
  }

  mapDish(response: Response): Dish {
    return MappingUtils.toDish(response.json());
  }

  removeTagFromDish(dish_id: string, tag_id: string): Observable<Response> {
    return this
      .http
      .delete(`${this.dishUrl}/${dish_id}/tag/${tag_id}`,
        {headers: this.getHeaders()});
  }

  addTagToDish(dish_id: string, tag_id: string): Observable<Response> {
    return this
      .http
      .post(`${this.dishUrl}/${dish_id}/tag/${tag_id}`, null,
        {headers: this.getHeaders()});
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
    let dishs$ = this.http
      .get(url, {headers: this.getHeaders()})
      .map(this.mapDishes).catch(handleError);
    return dishs$;
  }

  addAndRemoveTags(dish: any, toAdd: string[], toRemove: string[], saveDish): Observable<Response> {
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
    let dishs$ = this.http
      .put(url, null, {headers: this.getHeaders()});
    if (saveDish == true) {
      let saveDish$ = this.saveDish(dish);
      return dishs$.concat(saveDish$).combineAll();
    }
    return dishs$;
  }
}


// this could also be a private method of the component class
function handleError(error: any) {
  // log error
  // could be something more sophisticated
  let errorMsg = error.message || `Yikes! There was a problem with our hyperdrive device and we couldn't retrieve your data!`
  console.error(errorMsg);

  // throw an application level error
  return Observable.throw(errorMsg);
}


