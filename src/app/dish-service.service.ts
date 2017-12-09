import {Injectable} from "@angular/core";
import {AuthenticationService} from "./authentication.service";
import {Headers, Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Dish} from "./model/dish";
import MappingUtils from "./mapping-utils";

@Injectable()
export class DishService {

  private dishUrl = 'http://localhost:8181';

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
    headers.append('Authorization', 'Bearer ' + this.authenticationService.getToken());
    return headers;
  }

  getAll(): Observable<Dish[]> {
    let dishs$ = this.http
      .get(`${this.dishUrl}/dish`, {headers: this.getHeaders()})
      .map(this.mapDishes).catch(handleError);  // HERE: This is new!
    return dishs$;
  }

  getById(dish_id: string): Observable<Dish> {
    let dish$ = this.http
      .get(`${this.dishUrl}/dish/${dish_id}`, {headers: this.getHeaders()})
      .map(this.mapDish)
      .catch(handleError);
    return dish$;
  }

  addDish(newDishName: string): Observable<Response> {
    var newDish: Dish = <Dish>({
      name: newDishName,
    });

    return this
      .http
      .post(`${this.dishUrl}/dish`,
        JSON.stringify(newDish),
        {headers: this.getHeaders()});

  }

  saveDish(dish: Dish): Observable<Response> {
    return this
      .http
      .put(`${this.dishUrl}/dish/${dish.dish_id}`,
        JSON.stringify(dish),
        {headers: this.getHeaders()});
  }

  mapDishes(response: Response): Dish[] {
    // The response of the API has a results
    // property with the actual results
    return response.json()._embedded.dishResourceList.map(MappingUtils.toDish);
  }

  mapDish(response: Response): Dish {
    return MappingUtils.toDish(response.json());
  }

  removeTagFromDish(dish_id: string, tag_id: string): Observable<Response> {
    return this
      .http
      .delete(`${this.dishUrl}/dish/${dish_id}/tag/${tag_id}`,
        {headers: this.getHeaders()});
  }

  addTagToDish(dish_id: string, tag_id: string): Observable<Response> {
    return this
      .http
      .post(`${this.dishUrl}/dish/${dish_id}/tag/${tag_id}`, null,
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

    var url = this.dishUrl + "/dish";
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


