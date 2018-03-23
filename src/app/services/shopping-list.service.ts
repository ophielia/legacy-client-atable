import {Inject, Injectable} from "@angular/core";
import {AuthenticationService} from "./authentication.service";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {IShoppingList} from "../model/shoppinglist";
import MappingUtils from "../model/mapping-utils";
import ListLayoutType from "../model/list-layout-type";
import {Item} from "../model/item";
import ItemSourceType from "../model/item-source-type";
import {ITag} from "../model/tag";
import {APP_CONFIG, AppConfig} from "../app.config";
import {Logger} from "angular2-logger/core";
import {BaseHeadersService} from "app/services/base-service";

@Injectable()
export class ShoppingListService extends BaseHeadersService {

  private shoppingListUrl: string;

  constructor(private http: Http,
              @Inject(APP_CONFIG) private config: AppConfig,
              private _logger: Logger,
              private _authenticationService: AuthenticationService) {
    super(_authenticationService);
    this.shoppingListUrl = this.config.apiEndpoint + "shoppinglist";
  }

  getAll(): Observable<IShoppingList[]> {
    this._logger.debug("Retrieving all shopping lists for user.");
    let shoppingLists$ = this.http
      .get(`${this.shoppingListUrl}`, {headers: this.getHeaders()})
      .map(this.mapShoppingLists).catch(handleError);  // HERE: This is new!
    return shoppingLists$;
  }

  getById(shoppingList_id: string): Observable<IShoppingList> {
    let shoppingList$ = this.http
      .get(`${this.shoppingListUrl}/${shoppingList_id}`, {headers: this.getHeaders()})
      .map(this.mapShoppingList)
      .catch(handleError);
    return shoppingList$;
  }

  getByType(list_type: string): Observable<IShoppingList> {
    this._logger.debug("Retrieving shopping lists by type [" + list_type + "] for user.");
    let shoppingList$ = this.http
      .get(`${this.shoppingListUrl}/type/${list_type}`, {headers: this.getHeaders()})
      .map(this.mapShoppingList)
      .catch(handleError);
    return shoppingList$;
  }

  addShoppingList(listType: string): Observable<Response> {
    // MM hardcoding list layout type until there are 1) more or 2) defaults in backend
    var layoutType = ListLayoutType.All;
    var newShoppingList: IShoppingList = <IShoppingList>({
      list_type: listType,
      layout_type: layoutType
    });

    return this
      .http
      .post(`${this.shoppingListUrl}`,
        JSON.stringify(newShoppingList),
        {headers: this.getHeaders()});

  }

  generateShoppingList(meal_plan_id: string) {
    var url: string = this.shoppingListUrl + '/mealplan/' + meal_plan_id;
    return this
      .http
      .post(`${url}`,
        null,
        {headers: this.getHeaders()});
  }


  removeItemFromShoppingList(shoppingList_id: string, item_id: string): Observable<Response> {
    return this
      .http
      .delete(`${this.shoppingListUrl}/${shoppingList_id}/item/${item_id}`,
        {headers: this.getHeaders()});
  }

  addTagItemToShoppingList(shoppingList_id: string, tag: ITag): Observable<Response> {
    var item: Item = <Item>{tag_id: tag.tag_id};
    item.item_source = ItemSourceType.Manual;
    return this
      .http
      .post(`${this.shoppingListUrl}/${shoppingList_id}/item`, item,
        {headers: this.getHeaders()});
  }

  deleteShoppingList(shoppingListId: string) {
    var url: string = this.shoppingListUrl + '/' + shoppingListId;

    return this
      .http
      .delete(`${url}`, {headers: this.getHeaders()});
  }


  setListActive(shoppingListId: string) {
    var url = this.shoppingListUrl + "/" + shoppingListId
      + "?generateType=Add";
    return this
      .http
      .put(`${url}`, null,
        {headers: this.getHeaders()});
  }

  mapShoppingLists(response: Response): IShoppingList[] {
    return response.json()._embedded.shoppingListResourceList.map(MappingUtils.toShoppingList);
  }

  mapShoppingList(response: Response): IShoppingList {
    if (response.status == 200) {
      var beep = MappingUtils.toShoppingList(response.json());
      return beep;
    }
    return null;

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


