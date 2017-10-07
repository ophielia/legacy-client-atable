import {Injectable} from "@angular/core";
import {Headers, Http, Response} from "@angular/http";
import {Tag} from "./tag";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {TagDrilldown} from "./tag-drilldown";

const TAGS: Tag[] = [
  {tag_id: "1", name: 'carrot', description: 'orange'},
  {tag_id: "2", name: 'easy', description: 'easy to make'},
  {tag_id: "3", name: 'cheap', description: 'not expensive'}
];

const TESTDRILLDOWN = {"tagInfo":{"baseIds":[2,4,8,6],"tagList":[{"name":"Dish Type","description":null,"parentId":"0","childrenIds":["5","9","7"],"tag_id":"2"},{"name":"Ingredients","description":null,"parentId":"0","childrenIds":["14","16","12"],"tag_id":"4"},{"name":"Main Dish","description":null,"parentId":"2","childrenIds":[],"tag_id":"5"},{"name":"Side Dish","description":null,"parentId":"2","childrenIds":[],"tag_id":"7"},{"name":"Dessert","description":null,"parentId":"2","childrenIds":[],"tag_id":"9"},{"name":"Meat","description":null,"parentId":"4","childrenIds":["21","23"],"tag_id":"16"},{"name":"Dairy","description":null,"parentId":"4","childrenIds":[],"tag_id":"14"},{"name":"Dry","description":null,"parentId":"4","childrenIds":[],"tag_id":"12"},{"name":"Cheap","description":null,"parentId":"6","childrenIds":[],"tag_id":"10"},{"name":"Yummy","description":null,"parentId":"6","childrenIds":["29","31","33","35","37"],"tag_id":"11"},{"name":"Quick","description":null,"parentId":"6","childrenIds":[],"tag_id":"13"},{"name":"T Type Tag","description":null,"parentId":"0","childrenIds":["15","17","19"],"tag_id":"8"},{"name":"Rating","description":null,"parentId":"0","childrenIds":["11","10","13"],"tag_id":"6"},{"name":"healthy","description":null,"parentId":"8","childrenIds":[],"tag_id":"15"},{"name":"crockpot","description":null,"parentId":"8","childrenIds":[],"tag_id":"17"},{"name":"pasta","description":null,"parentId":"8","childrenIds":[],"tag_id":"19"},{"name":"Red Meat","description":null,"parentId":"16","childrenIds":[],"tag_id":"21"},{"name":"Poultry","description":null,"parentId":"16","childrenIds":["25","27"],"tag_id":"23"},{"name":"chicken","description":null,"parentId":"23","childrenIds":[],"tag_id":"25"},{"name":"duck","description":null,"parentId":"23","childrenIds":[],"tag_id":"27"},{"name":"Yummy 1","description":null,"parentId":"11","childrenIds":[],"tag_id":"29"},{"name":"Yummy 2","description":null,"parentId":"11","childrenIds":[],"tag_id":"31"},{"name":"Yummy 3","description":null,"parentId":"11","childrenIds":[],"tag_id":"33"},{"name":"Yummy 4","description":null,"parentId":"11","childrenIds":[],"tag_id":"35"},{"name":"Yummy 5","description":null,"parentId":"11","childrenIds":[],"tag_id":"37"}]},"_links":{"self":{"href":"http://localhost:8181/taginfo?filter=none"}}};
@Injectable()
export class TagsService {

  private tagUrl = 'http://localhost:8181';

  private tags = TAGS.slice(0);

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

  getBaseTags(): Observable<Tag[]> {
    let tags$ = this.http
      .get(`${this.tagUrl}/tag?filter=BaseTags`, {headers: this.getHeaders()})
      .map(mapTags).catch(handleError);  // HERE: This is new!
    return tags$;
  }

  getTagDrilldownList(): TagDrilldown[] {

    let taginfo = TESTDRILLDOWN.tagInfo;
    let tagList: Object[] = taginfo.tagList;
    let baseList: string[] = taginfo.baseIds.map(x => x+"");

    // convert all tagList to TagDrilldown objects
    //  (which will have their children filled with populateChildren
    let drilldownMaster: TagDrilldown[] = tagList.map(toTagDrilldown);
    this.populateChildren(baseList,drilldownMaster);

    return baseList.map(x => drilldownMaster.find(y => y.tag_id == x));
  }

  private populateChildren(tagList:string[], drilldownMaster: TagDrilldown[]) {
    // loop through all elements
    tagList.forEach(x=> {this.fillChildren(x,drilldownMaster);})
  }

  private fillChildren(drilldown_id: string, master: TagDrilldown[]): TagDrilldown {
    // get index for drilldown
    var drilldownIndex = master.findIndex(x => x.tag_id == drilldown_id);
    // get drilldown from master
    let toFill: TagDrilldown = master[drilldownIndex];

    // if children filled in, return
    if (toFill.children.length > 0) {
      return toFill;
    }
    // if doesn't contain ids to fill, return
    if (toFill.children_ids.length == 0) {
      toFill.children=[];
      return toFill;
    } else {
      // get children list
      //    for each child, fillchildren
      for (var i = 0; i < toFill.children_ids.length; i++) {
        let child: TagDrilldown = this.fillChildren(toFill.children_ids[i], master);
        //    put drilldown in children lst
        toFill.children.push(child);
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


  addTag(newTagName: string): Observable<Response>  {
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
    description: r.tag.description
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
    "parent_id": r.parent_id,
    "children_ids": r.childrenIds,
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

