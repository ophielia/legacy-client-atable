import {Inject, Injectable} from "@angular/core";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs/Observable";
import MappingUtils from "../model/mapping-utils";
import {ITag} from "../model/tag";
import {ListLayout} from "../model/listlayout";
import {ListLayoutCategory} from "../model/listcategory";
import {BaseHeadersService} from "./base-service";
import {APP_CONFIG, AppConfig} from "../app.config";
import {NGXLogger} from "ngx-logger";
import {throwError} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";

@Injectable()
export class ListLayoutService extends BaseHeadersService {

  private baseUrl: string;

  constructor(private httpClient: HttpClient,
              @Inject(APP_CONFIG) private config: AppConfig,
              private _logger: NGXLogger,
              private _authenticationService: AuthenticationService) {
    super(_authenticationService);
    this.baseUrl = this.config.apiEndpoint + "listlayout";
  }

  getAll(): Observable<ListLayout[]> {
    let listLayouts$ = this.httpClient
      .get(`${this.baseUrl}`)
      .map(this.mapListLayouts).catch(handleError);
    return listLayouts$;
  }

  addListLayout(listLayoutType: string): Observable<HttpResponse<ListLayout>> {

    var newListLayout: ListLayout = <ListLayout>({
      name: listLayoutType,
      list_layout_type: listLayoutType
    });

    return this
      .httpClient
      .post<ListLayout>(`${this.baseUrl}`,
        JSON.stringify(newListLayout), {observe: 'response'});

  }

  getById(listLayout_id: string): Observable<ListLayout> {
    let listLayout$ = this.httpClient
      .get(`${this.baseUrl}/${listLayout_id}`)
      .map(this.mapListLayout)
      .catch(handleError);
    return listLayout$;
  }


  addCategoryToListLayout(listLayout_id: string, category_name: string): Observable<Object> {
    var category: ListLayoutCategory = <ListLayoutCategory>{name: category_name};
    return this
      .httpClient
      .post(`${this.baseUrl}/${listLayout_id}/category`, category);
  }


  deleteCategoryFromListLayout(listLayout_id: string, category_id: string): Observable<Object> {
    return this
      .httpClient
      .delete(`${this.baseUrl}/${listLayout_id}/category/${category_id}`);
  }

  updateCategoryInListLayout(listLayout_id: string, category_id: string, category_name: string): Observable<Object> {
    var category: ListLayoutCategory = new ListLayoutCategory();
    category.name = category_name;
    category.category_id = category_id;
    category.layout_id = listLayout_id;
    category.tags = [];

    return this
      .httpClient
      .put(`${this.baseUrl}/${listLayout_id}/category/${category.category_id}`, category);
  }


  addTagsToLayoutCategory(layout_id: string, category_id: string, listofids: string) {
    //"/{listLayoutId}/category/{layoutCategoryId}/tag" tags
    var url = this.baseUrl + "/" + layout_id
      + "/category/" + category_id + "/tag?tags=" + listofids;
    return this
      .httpClient
      .post(`${url}`,
        null);

  }

  removeTagsFromLayoutCategory(layout_id: string, category_id: string, listofids: string) {
    var url = this.baseUrl + "/" + layout_id
      + "/category/" + category_id + "/tag?tags=" + listofids;
    return this
      .httpClient
      .delete(`${url}`);
  }

  getUncategorizedTags(id: string) {
    var url = this.baseUrl + "/" + id + "/tag";
    let tags$ = this.httpClient
      .get(`${url}`)
      .map(this.mapTags).catch(handleError);
    return tags$;
  }


  getTagsForLayoutCategory(layoutId: any, category_id: string) {
    ///{listLayoutId}/category/{layoutCategoryId}/tag
    var url = this.baseUrl + "/" + layoutId + "/category/" + category_id + "/tag";
    let tags$ = this.httpClient
      .get(`${url}`)
      .map(this.mapTags).catch(handleError);
    return tags$;
  }

  moveCategory(layout_id: string, category: ListLayoutCategory, directionUp: boolean) {
    var url = this.baseUrl + "/category/" + category.category_id + "?move=" + (directionUp ? "up" : "down");
    return this
      .httpClient
      .post(`${url}`,
        null);
  }

  moveCategoryToParent(layout_id: string, category: ListLayoutCategory) {
    var url = this.baseUrl
      + "/category/" + category.category_id + "/parent/0";
    return this
      .httpClient
      .post(`${url}`,
        null);

  }

  setParentForCategory(layout_id: string, parentId: string, categoryId: string) {
    var url = this.baseUrl
      + "/category/" + categoryId
      + "/parent/" + parentId;
    return this
      .httpClient
      .post(`${url}`,
        null);
  }

  mapListLayouts(object: Object): ListLayout[] {
    let embeddedObj = object["_embedded"];
    if (embeddedObj) {
      return embeddedObj["listLayoutResourceList"].map(MappingUtils.toListLayout);
    }
    return null;
    //   return response.map(MappingUtils.toListLayout);
  }


  mapListLayout(object: Object): ListLayout {
    if (object) {
      var beep = MappingUtils.toListLayout(object);
      return beep;
    }
    return null;

  }

  mapTags(object: Object): ITag[] {
    let embeddedObj = object["_embedded"];
    return embeddedObj["tagResourceList"].map(MappingUtils.toTag);
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
