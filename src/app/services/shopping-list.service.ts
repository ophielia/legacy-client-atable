import {Inject, Injectable} from "@angular/core";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs/Observable";
import {IShoppingList} from "../model/shoppinglist";
import MappingUtils from "../model/mapping-utils";
import {Item} from "../model/item";
import {ITag} from "../model/tag";
import {APP_CONFIG, AppConfig} from "../app.config";
import {BaseHeadersService} from "app/services/base-service";
import {IListGenerateProperties} from "../model/listgenerateproperties";
import {NGXLogger} from "ngx-logger";
import {throwError} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map} from "rxjs/operators";
import {IShoppingListPut, ShoppingListPut} from "../model/shoppinglistput";
import {TargetSlot} from "../model/target-slot";
import {ItemOperationPut} from "../model/item-operation-put";

@Injectable()
export class ShoppingListService extends BaseHeadersService {

  private shoppingListUrl: string;

  constructor(private httpClient: HttpClient,
              @Inject(APP_CONFIG) private config: AppConfig,
              private _logger: NGXLogger,
              private _authenticationService: AuthenticationService) {
    super(_authenticationService);
    console.log("this.config.apiEndpoint" + this.config.apiEndpoint)
    this.shoppingListUrl = this.config.apiEndpoint + "shoppinglist";
  }

  getAll(): Observable<IShoppingList[]> {
    this._logger.debug("Retrieving all shopping lists for user.!" + this.shoppingListUrl);
    let shoppingLists$ = this.httpClient
      .get(`${this.shoppingListUrl}`)
      .map(this.mapShoppingLists).catch(handleError);
    return shoppingLists$;
  }

  getById(shoppingList_id: string): Observable<IShoppingList> {
    return this.getByIdWithPantry(shoppingList_id, false);
  }

  getByIdWithPantry(shoppingList_id: string, showPantry: boolean): Observable<IShoppingList> {
    var url = this.shoppingListUrl + "/" + shoppingList_id;
    if (showPantry) {
      url = url + "?showPantry=" + showPantry;
    }
    let shoppingList$ = this.httpClient
      .get(url)
      .map(this.mapShoppingList)
      .catch(handleError);
    return shoppingList$;
  }

  getByIdWithHighlight(shoppingList_id: string, dish_id: string, list_id: string, show_pantry: boolean) {
    var url = this.shoppingListUrl + "/" + shoppingList_id;
    if (dish_id) {
      url = url + "?highlightDish=" + dish_id;

    } else if (list_id) {
      url = url + "?highlightListId=" + list_id;
    } else if (show_pantry) {
      url = url + "?showPantry=true";
    }
    let shoppingList$ = this.httpClient
      .get(url)
      .map(this.mapShoppingList)
      .catch(handleError);
    return shoppingList$;
  }


  getStarterLists(): Observable<IShoppingList[]> {
    return this.getAll().pipe(
      map((shoppingLists) => shoppingLists.filter(
        list => list.is_starter == true)
      ));

  }

  addShoppingList(dishIds: string[], mealPlanId: string,
                  addBase: boolean,
                  generatePlan: boolean, listName: string = ""): Observable<HttpResponse<Object>> {

    if (listName = "") {
      listName = this.config.defaultShoppingListName;
    }
    var properties: IListGenerateProperties = <IListGenerateProperties>({
      dish_sources: dishIds,
      meal_plan_source: mealPlanId,
      add_from_starter: addBase,
      generate_mealplan: generatePlan,
      list_name: listName

    });
    var url = this.shoppingListUrl;
    return this
      .httpClient
      .post(url,
        JSON.stringify(properties), {observe: 'response'});

  }

  generateShoppingList(meal_plan_id: string): Observable<HttpResponse<Object>> {
    var url: string = this.shoppingListUrl + '/mealplan/' + meal_plan_id;
    return this
      .httpClient
      .post(`${url}`,
        null, {observe: 'response'});
  }


  removeItemFromShoppingList(shoppingList_id: string,
                             item_id: string,
                             tag_id: string,
                             remove_all: boolean,
                             dish_id: string): Observable<Object> {

    var tagIds: Array<string> = [tag_id];
    let itemOperation = <ItemOperationPut>({
      destination_list_id: '0',
    operation: 'Remove',
    tag_ids: tagIds
    }
    );
    var url: string= this.shoppingListUrl + "/" + shoppingList_id + "/item"
    var payload = JSON.stringify(itemOperation);
    return this
      .httpClient
      .put(`${url}`,
        payload);

  }

  removeDishItemsFromShoppingList(list_id: string, dish_id: string) {
    var url = this.shoppingListUrl + "/" + list_id + "/dish/" + dish_id;
    return this
      .httpClient
      .delete(url);
  }

  removeListItemsFromShoppingList(list_id: string, fromListId: string) {
    var url = this.shoppingListUrl + "/" + list_id + "/list/" + fromListId;
    return this
      .httpClient
      .delete(url);
  }

  removeAllItemsFromList(shoppinglist_id: string) {
    var url = this.shoppingListUrl + "/" + shoppinglist_id + "/item";
    return this
      .httpClient
      .delete(url);
  }

  addTagItemToShoppingList(shoppingList_id: string, tag: ITag): Observable<Object> {
    var item: Item = <Item>{tag_id: tag.tag_id};
    return this
      .httpClient
      .post(`${this.shoppingListUrl}/${shoppingList_id}/tag/${tag.tag_id}`, item);
  }

  addListToShoppingList(shoppingList_id: string, list_id: string): Observable<Object> {
    var url = this.shoppingListUrl + "/" + shoppingList_id + "/list/" + list_id;
    return this
      .httpClient
      .post(url,
        null);
  }

  addMealPlanToShoppingList(shoppingList_id: string, mealPlanId: string): Observable<Object> {
    var url = this.shoppingListUrl + "/" + shoppingList_id + "/mealplan/" + mealPlanId;
    return this
      .httpClient
      .put(url,
        null);
  }

  addDishToShoppingList(shoppingList_id: string, dish_id: string): Observable<HttpResponse<Object>> {
    return this
      .httpClient
      .post<Object>(`${this.shoppingListUrl}/${shoppingList_id}/dish/${dish_id}`,
        null, {observe: 'response'});
  }

  changeListLayout(list_id: string, layoutId: string) {
    return this
      .httpClient
      .post(`${this.shoppingListUrl}/${list_id}/layout/${layoutId}`,
        null);
  }

  mapShoppingLists(object: Object): IShoppingList[] {
    let embeddedObj = object["_embedded"];
    if (embeddedObj) {
      return embeddedObj["shoppingListResourceList"].map(MappingUtils.toShoppingList);
    }
    return null;
  }

  mapShoppingList(object: Object): IShoppingList {
    if (object) {
      return MappingUtils.toShoppingList(object);
    }
    return null;

  }

  deleteList(list_id: string) {
    var url = this.shoppingListUrl + "/" + list_id;
    return this
      .httpClient
      .delete(url);
  }

  updateShoppingListName(shoppingList: IShoppingList) {
    // create put object for call
    var shoppingListPut = new ShoppingListPut();
    shoppingListPut.name = shoppingList.name;
    shoppingListPut.is_starter_list = shoppingList.is_starter;
    var url = this.shoppingListUrl + "/" + shoppingList.list_id;
    return this.updateShoppingList(shoppingList.list_id, shoppingListPut);
  }

  updateShoppingListStarterStatus(shoppingList: IShoppingList) {
    // create put object for call
    var shoppingListPut = new ShoppingListPut();
    shoppingListPut.name = shoppingList.name;
    shoppingListPut.is_starter_list = true;
    var url = this.shoppingListUrl + "/" + shoppingList.list_id;
    return this.updateShoppingList(shoppingList.list_id, shoppingListPut);
  }

  private updateShoppingList(listId:string, shoppingList: IShoppingListPut) {
    var url = this.shoppingListUrl + "/" + listId;
    return this
      .httpClient
      .put(url,
        JSON.stringify(shoppingList), {observe: 'response'});
  }
}


// this could also be a private method of the component class
function handleError(error: any) {
  // log error
  // could be something more sophisticated
  let errorMsg = error.message || `Yikes! There was a problem with our hyperdrive device and we couldn't retrieve your data!`
  console.error(errorMsg);

  // throw an application level error
  return throwError(errorMsg);
}


