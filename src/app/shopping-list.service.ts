import {Injectable} from "@angular/core";
import {AuthenticationService} from "./authentication.service";
import {Headers, Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {ShoppingList} from "./model/shoppinglist";
import MappingUtils from "./mapping-utils";
import ListLayoutType from "./model/list-layout-type";
import {Item} from "./model/item";
import ItemSourceType from "./model/item-source-type";

@Injectable()
export class ShoppingListService {

  private shoppingListUrl = 'http://localhost:8181';

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
    return MappingUtils.toShoppingList(response.json());
  }

  removeItemFromShoppingList(shoppingList_id: string, item_id: string): Observable<Response> {
    return this
      .http
      .delete(`${this.shoppingListUrl}/shoppinglist/${shoppingList_id}/item/${item_id}`,
        {headers: this.getHeaders()});
  }

  addItemToShoppingList(shoppingList_id: string, item: Item): Observable<Response> {
    if (!item.free_text) {
      // put tag_id in field
      item.tag_id = item.tag.tag_id;
    }
    item.item_source = ItemSourceType.Manual;
    return this
      .http
      .post(`${this.shoppingListUrl}/shoppinglist/${shoppingList_id}`, item,
        {headers: this.getHeaders()});
  }

  deleteShoppingList(shoppingListId: string) {
    var url: string = this.shoppingListUrl + '/shoppinglist/' + shoppingListId;

    return this
      .http
      .delete(`${url}`, {headers: this.getHeaders()});
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


