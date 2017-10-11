import {Injectable} from "@angular/core";
import {Headers, Http, Response} from "@angular/http";
import {Tag} from "./model/tag";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {TagDrilldown} from "./model/tag-drilldown";


  const tagType: string[]  = ["TagType","Ingredient","Rating", "DishType"];

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
      .map(mapTags).catch(handleError);  // HERE: This is new!
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
    let drilldownMaster: TagDrilldown[] = tagList.map(toTagDrilldown);
    this.populateChildren(baseList, drilldownMaster);

    return baseList.map(x => drilldownMaster.find(y => y.tag_id == x));
  }

  getTagDrilldownList(): Observable<TagDrilldown[]> {
    let tags$ = this.http
      .get(`${this.tagUrl}/taginfo`, {headers: this.getHeaders()})
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
      .map(mapTag)
      .catch(handleError);
    return tag$;
  }


  addTag(newTagName: string): Observable<Response> {
    var newTag: Tag = <Tag>({
      name: newTagName,
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
}

function mapTags(response: Response): Tag[] {
  // The response of the API has a results
  // property with the actual results
  return response.json()._embedded.tagResourceList.map(toTag);
}

function mapTag(response: Response): Tag {
  return toTag(response.json());
}

function toTag(r: any): Tag {
  let tag = <Tag>({
    tag_id: r.tag.tag_id,
    name: r.tag.name,
    description: r.tag.description,
    tag_type: r.tag.tag_type
  });

  console.log('Parsed tag:', tag);
  return tag;
}

function toTagDrilldown(r: any) {
  console.log('in map drilldown');
  let drilldown = <TagDrilldown>({
    "tag_id": r.tag_id,
    "name": r.name,
    "description": r.description,
    "tag_type": r.tag_type,
    "parent_id": r.parent_id,
    "children_ids": r.children_ids,
    "expanded": false,
    "level": 1,
    "children": []
  });

  console.log('Parsed drilldown:', drilldown);
  return drilldown;
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

