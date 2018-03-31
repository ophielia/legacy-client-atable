import {Inject, Injectable} from "@angular/core";
import {AuthenticationService} from "./authentication.service";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import MappingUtils from "../model/mapping-utils";
import {ITag} from "../model/tag";
import {ListLayout} from "../model/listlayout";
import {ListLayoutCategory} from "../model/listcategory";
import {BaseHeadersService} from "./base-service";
import {APP_CONFIG, AppConfig} from "../app.config";
import {Logger} from "angular2-logger/core";

@Injectable()
export class ListLayoutService extends BaseHeadersService {

  private baseUrl: string;

  constructor(private http: Http,
              @Inject(APP_CONFIG) private config: AppConfig,
              private _logger: Logger,
              private _authenticationService: AuthenticationService) {
    super(_authenticationService);
    this.baseUrl = this.config.apiEndpoint + "listlayout";
  }

  getAll(): Observable<ListLayout[]> {
    let listLayouts$ = this.http
      .get(`${this.baseUrl}`, {headers: this.getHeaders()})
      .map(this.mapListLayouts).catch(handleError);
    return listLayouts$;
  }

  addListLayout(listLayoutType: string): Observable<Response> {

    var newListLayout: ListLayout = <ListLayout>({
      name: listLayoutType,
      list_layout_type: listLayoutType
    });

    return this
      .http
      .post(`${this.baseUrl}`,
        JSON.stringify(newListLayout),
        {headers: this.getHeaders()});

  }

  getById(listLayout_id: string): Observable<ListLayout> {
    let listLayout$ = this.http
      .get(`${this.baseUrl}/${listLayout_id}`, {headers: this.getHeaders()})
      .map(this.mapListLayout)
      .catch(handleError);
    return listLayout$;
  }


  addCategoryToListLayout(listLayout_id: string, category_name: string): Observable<Response> {
    var category: ListLayoutCategory = <ListLayoutCategory>{name: category_name};
    return this
      .http
      .post(`${this.baseUrl}/${listLayout_id}/category`, category,
        {headers: this.getHeaders()});
  }


  deleteCategoryFromListLayout(listLayout_id: string, category_id: string): Observable<Response> {
    return this
      .http
      .delete(`${this.baseUrl}/${listLayout_id}/category/${category_id}`,
        {headers: this.getHeaders()});
  }

  updateCategoryInListLayout(listLayout_id: string, category_id: string, category_name: string): Observable<Response> {
    var category: ListLayoutCategory = new ListLayoutCategory();
    category.name = category_name;
    category.category_id = category_id;
    category.layout_id = listLayout_id;
    category.tags = [];

    return this
      .http
      .put(`${this.baseUrl}/${listLayout_id}/category/${category.category_id}`, category,
        {headers: this.getHeaders()});
  }


  addTagsToLayoutCategory(layout_id: string, category_id: string, listofids: string) {
    //"/{listLayoutId}/category/{layoutCategoryId}/tag" tags
    var url = this.baseUrl + "/" + layout_id
      + "/category/" + category_id + "/tag?tags=" + listofids;
    return this
      .http
      .post(`${url}`,
        null,
        {headers: this.getHeaders()});

  }

  removeTagsFromLayoutCategory(layout_id: string, category_id: string, listofids: string) {
    var url = this.baseUrl + "/" + layout_id
      + "/category/" + category_id + "/tag?tags=" + listofids;
    return this
      .http
      .delete(`${url}`,
        {headers: this.getHeaders()});
  }

  getUncategorizedTags(id: string) {
    var url = this.baseUrl + "/" + id + "/tag";
    let tags$ = this.http
      .get(`${url}`, {headers: this.getHeaders()})
      .map(this.mapTags).catch(handleError);
    return tags$;
  }


  getTagsForLayoutCategory(layoutId: any, category_id: string) {
    ///{listLayoutId}/category/{layoutCategoryId}/tag
    var url = this.baseUrl + "/" + layoutId + "/category/" + category_id + "/tag";
    let tags$ = this.http
      .get(`${url}`, {headers: this.getHeaders()})
      .map(this.mapTags).catch(handleError);
    return tags$;
  }

  moveCategory(layout_id: string, category: ListLayoutCategory, directionUp: boolean) {
    var url = this.baseUrl + "/category/" + category.category_id + "?move=" + ( directionUp ? "up" : "down");
    return this
      .http
      .post(`${url}`,
        null,
        {headers: this.getHeaders()});
  }

  moveCategoryToParent(layout_id: string, category: ListLayoutCategory) {
    var url = this.baseUrl
      + "/category/" + category.category_id + "/parent/0";
    return this
      .http
      .post(`${url}`,
        null,
        {headers: this.getHeaders()});

  }

  setParentForCategory(layout_id: string, parentId: string, categoryId: string) {
    var url = this.baseUrl
      + "/category/" + categoryId
      + "/parent/" + parentId;
    return this
      .http
      .post(`${url}`,
        null,
        {headers: this.getHeaders()});
  }

  mapListLayouts(response: Response): ListLayout[] {
    return response.json()._embedded.listLayoutResourceList.map(MappingUtils.toListLayout);
  }

  mapListLayout(response: Response): ListLayout {
    if (response.status == 200) {
      var beep = MappingUtils.toListLayout(response.json());
      return beep;
    }
    return null;

  }

  mapTags(response: Response): ITag[] {
    if (response.json()) {
      return response.json()._embedded.tagResourceList.map(MappingUtils.toTag);
    }
  }


}

function handleError(error: any) {
  // log error
  // could be something more sophisticated
  let errorMsg = error.message || `Yikes! There was a problem with our hyperdrive device and we couldn't retrieve your data!`
  console.error(errorMsg);

  // throw an application level error
  return Observable.throw(errorMsg);
}
