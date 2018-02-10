import {Injectable} from "@angular/core";
import {AuthenticationService} from "../authentication.service";
import {Headers, Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {ShoppingList} from "../model/shoppinglist";
import MappingUtils from "../mapping-utils";
import ListLayoutType from "../model/list-layout-type";
import {Item} from "../model/item";
import ItemSourceType from "../model/item-source-type";
import {Tag} from "../model/tag";
import {ListLayout} from "../model/listlayout";
import {ListLayoutCategory} from "../model/listcategory";

@Injectable()
export class ListLayoutService {

  private baseUrl = 'http://localhost:8181';

  constructor(private http: Http,
              private authenticationService: AuthenticationService) {
  }

  private getHeaders() {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Expose-Headers', 'Location');
    headers.append('Authorization', 'Bearer ' + this.authenticationService.getToken());
    return headers;
  }

  getAll(): Observable<ListLayout[]> {
    let listLayouts$ = this.http
      .get(`${this.baseUrl}/listlayout`, {headers: this.getHeaders()})
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
      .post(`${this.baseUrl}/listlayout`,
        JSON.stringify(newListLayout),
        {headers: this.getHeaders()});

  }

  getById(listLayout_id: string): Observable<ListLayout> {
    let listLayout$ = this.http
      .get(`${this.baseUrl}/listlayout/${listLayout_id}`, {headers: this.getHeaders()})
      .map(this.mapListLayout)
      .catch(handleError);
    return listLayout$;
  }


  addCategoryToListLayout(listLayout_id: string, category_name: string): Observable<Response> {
    var category: ListLayoutCategory = <ListLayoutCategory>{name: category_name};
    return this
      .http
      .post(`${this.baseUrl}/listlayout/${listLayout_id}/category`, category,
        {headers: this.getHeaders()});
  }

  deleteCategoryFromListLayout(listLayout_id: string, category_id: string): Observable<Response> {
    return this
      .http
      .delete(`${this.baseUrl}/listlayout/${listLayout_id}/category/${category_id}`,
        {headers: this.getHeaders()});
  }

  updateCategoryInListLayout(listLayout_id: string, category_id: string, category_name: string): Observable<Response> {
    var category: ListLayoutCategory = <ListLayoutCategory>{
      name: category_name,
      category_id: category_id,
      layout_id: listLayout_id,
      tags: []
    };
    return this
      .http
      .put(`${this.baseUrl}/listlayout/${listLayout_id}/category/${category.category_id}`, category,
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

  addTagsToLayoutCategory(layout_id: string, category_id: string, listofids: string) {
    //"/{listLayoutId}/category/{layoutCategoryId}/tag" tags
    var url = this.baseUrl + "/listlayout/" + layout_id
      + "/category/" + category_id + "/tag?tags=" + listofids;
    return this
      .http
      .post(`${url}`,
        null,
        {headers: this.getHeaders()});

  }

  removeTagsFromLayoutCategory(layout_id: string, category_id: string, listofids: string) {
    var url = this.baseUrl + "/listlayout/" + layout_id
      + "/category/" + category_id + "/tag?tags=" + listofids;
    return this
      .http
      .delete(`${url}`,
        {headers: this.getHeaders()});
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
