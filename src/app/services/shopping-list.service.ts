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
import ListType from "../model/list-type";
import {NGXLogger} from "ngx-logger";
import {throwError} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";

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
      .map(this.mapShoppingLists).catch(handleError);  // HERE: This is new!
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

  getByIdWithHighlight(shoppingList_id: string, dish_id: string, list_type: string, show_pantry: boolean) {
    var url = this.shoppingListUrl + "/" + shoppingList_id;
    if (dish_id) {
      url = url + "?highlightDish=" + dish_id;

    }
    else if (list_type) {
      url = url + "?highlightListType=" + list_type;
    } else if (show_pantry) {
      url = url + "?showPantry=true";
    }
    let shoppingList$ = this.httpClient
      .get(url)
      .map(this.mapShoppingList)
      .catch(handleError);
    return shoppingList$;
  }

  getByType(list_type: string): Observable<IShoppingList> {
    this._logger.debug("Retrieving shopping lists by type [" + list_type + "] for user.");
    let shoppingList$ = this.httpClient
      .get(`${this.shoppingListUrl}/type/${list_type}`)
      .map(this.mapShoppingList)
      .catch(handleError);
    return shoppingList$;
  }

  addShoppingListNew(dishIds: string[], mealPlanId: string,
                     addBase: boolean, addPickup: boolean,
                     generatePlan: boolean, listType: string): Observable<HttpResponse<Object>> {

    if (!listType) {
      listType = ListType.General;
    }
    var properties: IListGenerateProperties = <IListGenerateProperties>({
      dish_sources: dishIds,
      meal_plan_source: mealPlanId,
      add_from_base: addBase,
      add_from_pickup: addPickup,
      generate_mealplan: generatePlan,
      list_type: listType,

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
                             remove_all: boolean,
                             dish_id: string): Observable<Object> {
    var url = this.shoppingListUrl + "/" + shoppingList_id + "/item/" + item_id;
    var params: string[] = new Array();
    if (dish_id) {
      params.push("sourceId=" + dish_id);
    }
    if (remove_all) {
      params.push("removeEntireItem=true");
    }

    if (params.length > 0) {
      var paramstr = params.join("&");
      url = url + "?" + paramstr;
    }
    return this
      .httpClient
      .delete(url);
  }

  toggleCrossedOffForItem(shoppingList_id: string,
                          item_id: string,
                          crossOff: boolean): Observable<Object> {
    var url = this.shoppingListUrl + "/" + shoppingList_id + "/item/shop/" + item_id;
    var params: string[] = new Array();
    if (crossOff) {
      params.push("crossOff=true");
    } else {
      params.push("crossOff=false");
    }

    if (params.length > 0) {
      var paramstr = params.join("&");
      url = url + "?" + paramstr;
    }
    return this
      .httpClient
      .post(url,
        null);
  }

  crossOffAllItemsFromList(shoppingList_id: string, crossOff): Observable<Object> {
    var url = this.shoppingListUrl + "/" + shoppingList_id + "/item/shop";
    var params: string[] = new Array();
    if (crossOff) {
      params.push("crossOff=true");
    } else {
      params.push("crossOff=false");
    }

    if (params.length > 0) {
      var paramstr = params.join("&");
      url = url + "?" + paramstr;
    }
    return this
      .httpClient
      .post(url,
        null);
  }

  removeDishItemsFromShoppingList(list_id: string, dish_id: string) {
    var url = this.shoppingListUrl + "/" + list_id + "/dish/" + dish_id;
    return this
      .httpClient
      .delete(url);
  }

  removeListItemsFromShoppingList(list_id: string, listSource: string) {
    var url = this.shoppingListUrl + "/" + list_id + "/listtype/" + listSource;
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
      .post(`${this.shoppingListUrl}/${shoppingList_id}/item`, item);
  }

  addListToShoppingList(shoppingList_id: string, list_type: string): Observable<Object> {
    var url = this.shoppingListUrl + "/" + shoppingList_id + "/listtype/" + list_type;
    return this
      .httpClient
      .post(url,
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

  deleteShoppingList(shoppingListId: string) {
    var url: string = this.shoppingListUrl + '/' + shoppingListId;

    return this
      .httpClient
      .delete(`${url}`);
  }


  setListActive(shoppingListId: string, replaceList: boolean): Observable<HttpResponse<Object>> {
    var generateType = replaceList ? 'Replace' : 'Add';
    var url = this.shoppingListUrl + "/" + shoppingListId
      + "?generateType=" + generateType;
    var observable$ = this
      .httpClient
      .put(`${url}`, null, {observe: 'response'});
    return observable$;
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


