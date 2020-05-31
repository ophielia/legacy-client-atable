import {Inject, Injectable} from "@angular/core";
import {ITag} from "../model/tag";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {TagDrilldown} from "../model/tag-drilldown";
import MappingUtils from "../model/mapping-utils";
import TType from "../model/tag-type";
import TagSelectType from "../model/tag-select-type";
import {APP_CONFIG, AppConfig} from "../app.config";
import {NGXLogger} from "ngx-logger";
import {BaseHeadersService} from "./base-service";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {throwError} from "rxjs";


const tagType: string[] = TType.listAll();

@Injectable()
export class TagsService extends BaseHeadersService {

  private tagUrl;
  private tagInfoUrl: string;

  constructor(private httpClient: HttpClient,
              @Inject(APP_CONFIG) private config: AppConfig,
              private _logger: NGXLogger,
              private _authenticationService: AuthenticationService) {
    super(_authenticationService);
    this.tagUrl = this.config.apiEndpoint + "tag";
    this.tagInfoUrl = this.config.apiEndpoint + "taginfo";
  }


  getAll(): Observable<ITag[]> {
    return this.getAllExtended( false);
  }

  getAllExtended(extendedInfo: Boolean): Observable<ITag[]> {
    var url = this.tagUrl
      if (extendedInfo) {
        url = url + "?extended=true";
      }
    let tags$ = this.httpClient
      .get(`${url}`)
      .map(this.mapTagsClient).catch(handleError);
    return tags$;
  }

  getAllSelectable(tagTypes: string, selectType: string): Observable<ITag[]> {
    let searchString = "ForSelectAssign";
    if (selectType == TagSelectType.Search) {
      searchString = "ForSelectSearch";
    }
    let url = this.tagUrl + "?filter="
      + searchString + "&tag_type=" + tagTypes;
    let tags$ = this.httpClient
      .get(`${url}`)
      .map(this.mapTagsClient).catch(handleError);
    return tags$;
  }

  getAllParentTags(tagTypes: string): Observable<ITag[]> {
    let tags$ = this.httpClient
      .get(`${this.tagUrl}?filter=ParentTags&tag_type=` + tagTypes)
      .map(this.mapTagsClient).catch(handleError);
    return tags$;
  }

  getTagTypes(): string[] {
    return tagType;
  }

  getTagDrilldownList(tagtype: string): Observable<TagDrilldown[]> {
    var filter: string = "";
    if (tagtype) {
      filter = "?tag_type=" + tagtype;
    }
    let tags$ = this.httpClient
      .get(`${this.tagInfoUrl}${filter}`)
      .map(this.mapFilledTagsClient).catch(handleError);  // HERE: This is new!
    return tags$;

  }

  getById(tag_id: string): Observable<ITag> {
    let tag$ = this.httpClient
      .get(`${this.tagUrl}/${tag_id}`)
      .map(this.mapTagClient)
      .catch(handleError);
    return tag$;
  }

  addTag(newTagName: string, tagType: string): Observable<HttpResponse<Object>> {
    var newTag: ITag = <ITag>({
      name: newTagName,
      tag_type: tagType
    });

    return this
      .httpClient
      .post(`${this.tagUrl}`,
        JSON.stringify(newTag), {observe: 'response'});

  }

  saveTag(tag: ITag): Observable<HttpResponse<Object>> {
    return this
      .httpClient
      .put(`${this.tagUrl}/${tag.tag_id}`,
        JSON.stringify(tag), {observe: 'response'});
  }

  mapFilledTagsClient(object: Object): TagDrilldown[] {
    let embeddedObj = Object.keys(object);
    return Array.from(embeddedObj, k => object[k]).map(MappingUtils._toNewTagDrilldown);
  }

  mapTagsClient(object: Object): ITag[] {
    let embeddedObj = object["_embedded"];
    return embeddedObj["tagResourceList"].map(MappingUtils.toTag);
  }

  mapTagClient(object: Object): ITag {
    let tag = MappingUtils.toTag(object);
    return tag;
  }


  assignTagsToTag(tag_id: string, tagsToAdd: string) {
    //"{parentId}/child/{childId}"
    var basicUrl: string = this.tagUrl + "/" + tag_id
      + "/children?tagIds=" + tagsToAdd;
    // create list of urls - 1 per hopperTag
    let tag$ = this.httpClient.post(basicUrl, null);
    return tag$;
  }

  assignTagsToBaseTag(tagsToAdd: ITag[]) {
    //"{parentId}/child/{childId}"
    var basicUrl: string = this.tagUrl + "/base/";
    // create list of urls - 1 per hopperTag
    let tag$ = null;

    for (var i = 0; i < tagsToAdd.length; i++) {
      // put together merge of urls
      var tagUrl = basicUrl + tagsToAdd[i].tag_id;
      if (tag$ == null) {
        tag$ = this.httpClient
          .put(`${tagUrl}`, null);
      }
      else {
        tag$ = tag$.merge(this.httpClient)
          .put(`${tagUrl}`, null);
      }
    }
    // return observable
    return tag$;
  }


  getDishesForRatingTags(selectedRatingId: number) {
    var url = this.tagUrl + "/" + selectedRatingId + "/dish";
    let tags$ = this.httpClient
      .get(`${url}`)
      .map(this.mapTagsClient).catch(handleError);
    return tags$;
  }


  replaceTagsInDishes(fromTagId: string, toTagId: string) {
    var url = this.tagUrl + "/" + fromTagId + "/dish/" + toTagId;

    let tag$ = this.httpClient
      .put(`${url}`, null);

    return tag$;
  }

  replaceTagGlobally(tagToDelete: ITag, tagForReplace: ITag) {
    var url = this.tagUrl + "/delete/" + tagToDelete.tag_id + "?replacementTagId=" + tagForReplace.tag_id;

    let tag$ = this.httpClient
      .delete(`${url}`);

    return tag$;
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

