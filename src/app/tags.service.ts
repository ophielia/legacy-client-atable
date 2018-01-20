import {Injectable} from "@angular/core";
import {Headers, Http, Response} from "@angular/http";
import {Tag} from "./model/tag";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {TagDrilldown} from "./model/tag-drilldown";
import MappingUtils from "./mapping-utils";
import TType from "./model/tag-type";


const tagType: string[] = TType.listAll();

@Injectable()
export class TagsService {

  private tagUrl = 'http://localhost:8181';

  constructor(private http: Http,
              private authenticationService: AuthenticationService) {
  }

  private getHeaders() {
    // I included these headers because otherwise FireFox
    // will request text/html instead of application/json
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.authenticationService.getToken());
    return headers;
  }

  getAll(): Observable<Tag[]> {
    let tags$ = this.http
      .get(`${this.tagUrl}/tag`, {headers: this.getHeaders()})
      .map(this.mapTags).catch(handleError);
    return tags$;
  }

  getAllSelectable(tagTypes: string): Observable<Tag[]> {
    let tags$ = this.http
      .get(`${this.tagUrl}/tag?filter=ForSelectAssig&tag_type=` + tagTypes, {headers: this.getHeaders()})
      .map(this.mapTags).catch(handleError);
    return tags$;
  }

  getAllParentTags(tagTypes: string): Observable<Tag[]> {
    let tags$ = this.http
      .get(`${this.tagUrl}/tag?filter=ParentTags&tag_type=` + tagTypes, {headers: this.getHeaders()})
      .map(this.mapTags).catch(handleError);
    return tags$;
  }

  getTagTypes(): string[] {
    return tagType;
  }

  processTagDrilldownList(response: Response): TagDrilldown[] {
    let tagList: Object[] = response.json().tagInfo.tagList;
    let baseList: string[] = response.json().tagInfo.baseIds.map(x => x + "");

    // convert all tagList to TagDrilldown objects
    //  (which will have their children filled with populateChildren
    let drilldownMaster: TagDrilldown[] = tagList.map(MappingUtils.toTagDrilldown);
    this.populateChildren(baseList, drilldownMaster);

    return baseList.map(x => drilldownMaster.find(y => y.tag_id == x));
  }


  getTagDrilldownList(tagtype: string): Observable<TagDrilldown[]> {
    var filter: string = "";
    if (tagtype) {
      filter = "?tag_type=" + tagtype;
    }
    let tags$ = this.http
      .get(`${this.tagUrl}/taginfo${filter}`, {headers: this.getHeaders()})
      .map(r => this.processTagDrilldownList(r)).catch(handleError);  // HERE: This is new!
    return tags$;

  }

  private populateChildren(tagList: string[], drilldownMaster: TagDrilldown[]) {
    // loop through all elements
    tagList.forEach(x => {
      this.fillChildren(x, 1, drilldownMaster);
    })
  }

  private fillChildren(drilldown_id: string, level: number, master: TagDrilldown[]): TagDrilldown {
    // get index for drilldown
    var drilldownIndex = master.findIndex(x => x.tag_id == drilldown_id);

    // may not be found (in tagtype case) - so return directly if not found
    if (drilldownIndex == -1) {
      return null;
    }

    // get drilldown from master
    let toFill: TagDrilldown = master[drilldownIndex];

    // if children filled in, return
    if (toFill.children.length > 0) {
      return toFill;
    }
    toFill.level = level;
    // if doesn't contain ids to fill, return
    if (toFill.children_ids.length == 0) {
      toFill.children = [];
      return toFill;
    } else {
      // get children list
      //    for each child, fillchildren
      for (var i = 0; i < toFill.children_ids.length; i++) {
        let child: TagDrilldown = this.fillChildren(toFill.children_ids[i], level + 1, master);
        //child.level = toFill.level+1;
        //    put drilldown in children lst
        if (child) {
          // fill parent id
          //    child.parent_id = toFill.tag_id;
          toFill.children.push(child);
        }
      }
    }
    // put drilldown in master
    master[drilldownIndex] = toFill;
    return toFill;
  }

  getById(tag_id: string): Observable<Tag> {
    let tag$ = this.http
      .get(`${this.tagUrl}/tag/${tag_id}`, {headers: this.getHeaders()})
      .map(this.mapTag)
      .catch(handleError);
    return tag$;
  }


  addTag(newTagName: string, tagType: string): Observable<Response> {
    var newTag: Tag = <Tag>({
      name: newTagName,
      tag_type: tagType
    });

    return this
      .http
      .post(`${this.tagUrl}/tag`,
        JSON.stringify(newTag),
        {headers: this.getHeaders()});

  }

  saveTag(tag: Tag): Observable<Response> {
    return this
      .http
      .put(`${this.tagUrl}/tag/${tag.tag_id}`,
        JSON.stringify(tag),
        {headers: this.getHeaders()});
  }

  mapTags(response: Response): Tag[] {
    if (response.json()) {
    return response.json()._embedded.tagResourceList.map(MappingUtils.toTag);
  }
  }

  mapTag(response: Response): Tag {
    return MappingUtils.toTag(response.json());
  }

  getUncategorizedTags(id: string) {
    var url = this.tagUrl + "/listlayout/" + id + "/tag";
    let tags$ = this.http
      .get(`${url}`, {headers: this.getHeaders()})
      .map(this.mapTags).catch(handleError);
    return tags$;
  }

  getTagsForLayoutCategory(layoutId: any, category_id: string) {
    ///{listLayoutId}/category/{layoutCategoryId}/tag
    var url = this.tagUrl + "/listlayout/" + layoutId + "/category/" + category_id + "/tag";
    let tags$ = this.http
      .get(`${url}`, {headers: this.getHeaders()})
      .map(this.mapTags).catch(handleError);
    return tags$;
  }

  assignTagsToTag(tag_id: string, tagsToAdd: string) {
    //"{parentId}/child/{childId}"
    var basicUrl: string = this.tagUrl + "/tag/" + tag_id
      + "/children?tagIds=" + tagsToAdd;
    // create list of urls - 1 per hopperTag
    let tag$ = this.http.post(basicUrl, null, {headers: this.getHeaders()});
    return tag$;
  }

  assignTagsToBaseTag(tagsToAdd: Tag[]) {
    //"{parentId}/child/{childId}"
    var basicUrl: string = this.tagUrl + "/tag/basetag/child/";
    // create list of urls - 1 per hopperTag
    let tag$ = null;

    for (var i = 0; i < tagsToAdd.length; i++) {
      // put together merge of urls
      var tagUrl = basicUrl + tagsToAdd[i].tag_id;
      if (tag$ == null) {
        tag$ = this.http
          .put(`${tagUrl}`, {headers: this.getHeaders()});
      }
      else {
        tag$ = tag$.merge(this.http
          .put(`${tagUrl}`, {headers: this.getHeaders()}));
      }
    }
    // return observable
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
  return Observable.throw(errorMsg);
}

