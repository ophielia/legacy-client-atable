import {Inject, Injectable} from "@angular/core";
import {AuthenticationService} from "../authentication.service";
import {Headers, Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {ShoppingList} from "../model/shoppinglist";
import MappingUtils from "../mapping-utils";
import ListLayoutType from "../model/list-layout-type";
import {Item} from "../model/item";
import ItemSourceType from "../model/item-source-type";
import {Tag} from "../model/tag";
import {APP_CONFIG, AppConfig} from "../app.config";

@Injectable()
export class ShoppingListService {

  private shoppingListUrl = 'http://localhost:8181';

  constructor(private http: Http,
              @Inject(APP_CONFIG) private config: AppConfig,
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

  getAll(): Observable<ShoppingList[]> {
    let shoppingLists$ = this.http
      .get(`${this.shoppingListUrl}/shoppinglist`, {headers: this.getHeaders()})
      .map(this.mapShoppingLists).catch(handleError);  // HERE: This is new!
    return shoppingLists$;
  }

  getById(shoppingList_id: string): Observable<ShoppingList> {
    let shoppingList$ = this.http
      .get(`${this.shoppingListUrl}/shoppinglist/${shoppingList_id}`, {headers: this.getHeaders()})
      .map(this.mapShoppingList)
      .catch(handleError);
    return shoppingList$;
  }

  getByType(list_type: string): Observable<ShoppingList> {
    let shoppingList$ = this.http
      .get(`${this.shoppingListUrl}/shoppinglist/type/${list_type}`, {headers: this.getHeaders()})
      .map(this.mapShoppingList)
      .catch(handleError);
    return shoppingList$;
  }

  addShoppingList(listType: string): Observable<Response> {
    // MM hardcoding list layout type until there are 1) more or 2) defaults in backend
    var layoutType = ListLayoutType.All;
    var newShoppingList: ShoppingList = <ShoppingList>({
      list_type: listType,
      layout_type: layoutType
    });

    return this
      .http
      .post(`${this.shoppingListUrl}/shoppinglist`,
        JSON.stringify(newShoppingList),
        {headers: this.getHeaders()});

  }


  mapShoppingLists(response: Response): ShoppingList[] {
    return response.json()._embedded.shoppingListResourceList.map(MappingUtils.toShoppingList);
  }

  mapShoppingList(response: Response): ShoppingList {
    if (response.status == 200) {
      var beep = MappingUtils.toShoppingList(response.json());
      return beep;
    }
    return null;

  }

  removeItemFromShoppingList(shoppingList_id: string, item_id: string): Observable<Response> {
    return this
      .http
      .delete(`${this.shoppingListUrl}/shoppinglist/${shoppingList_id}/item/${item_id}`,
        {headers: this.getHeaders()});
  }

  addTagItemToShoppingList(shoppingList_id: string, tag: Tag): Observable<Response> {
    var item: Item = <Item>{tag_id: tag.tag_id};
    item.item_source = ItemSourceType.Manual;
    return this
      .http
      .post(`${this.shoppingListUrl}/shoppinglist/${shoppingList_id}/item`, item,
        {headers: this.getHeaders()});
  }

  deleteShoppingList(shoppingListId: string) {
    var url: string = this.shoppingListUrl + '/shoppinglist/' + shoppingListId;

    return this
      .http
      .delete(`${url}`, {headers: this.getHeaders()});
  }


  setListActive(shoppingListId: string) {
    var url = this.shoppingListUrl + "/shoppinglist/" + shoppingListId
      + "?generateType=Add";
    return this
      .http
      .put(`${url}`, null,
        {headers: this.getHeaders()});
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


