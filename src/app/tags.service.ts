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

const TESTDRILLDOWN = {
  "tagInfo": {
    "baseIds": [2, 4, 6, 17, 18, 19],
    "tagList": [{
      "name": "main1",
      "description": null,
      "parentId": "0",
      "childrenIds": ["8", "10", "12"],
      "tag_id": "2"
    }, {
      "name": "main2",
      "description": null,
      "parentId": "0",
      "childrenIds": ["14", "16"],
      "tag_id": "4"
    }, {"name": "main3", "description": null, "parentId": "0", "childrenIds": [], "tag_id": "6"}, {
      "name": "sub1_1",
      "description": null,
      "parentId": "2",
      "childrenIds": [],
      "tag_id": "8"
    }, {
      "name": "sub1_2",
      "description": null,
      "parentId": "2",
      "childrenIds": [],
      "tag_id": "10"
    }, {
      "name": "sub1_3",
      "description": null,
      "parentId": "2",
      "childrenIds": [],
      "tag_id": "12"
    }, {
      "name": "sub2_1",
      "description": null,
      "parentId": "4",
      "childrenIds": [],
      "tag_id": "14"
    }, {
      "name": "sub2_2",
      "description": null,
      "parentId": "4",
      "childrenIds": [],
      "tag_id": "16"
    }, {
      "name": "main 4",
      "description": "new description",
      "parentId": "0",
      "childrenIds": [],
      "tag_id": "17"
    }, {
      "name": "main 5",
      "description": "new description",
      "parentId": "0",
      "childrenIds": [],
      "tag_id": "18"
    }, {"name": "main 6", "description": "new description", "parentId": "0", "childrenIds": [], "tag_id": "19"}]
  }, "_links": {"self": {"href": "http://localhost:8181/taginfo?filter=none"}}
};

@Injectable()
export class TagsService {

  private tagUrl = 'http://localhost:8181';

  private headers = new Headers({
      'Content-Type': 'application/json'
      ,
      'Authorization': 'Bearer '
      +
      this
        .authenticationService
        .getToken()
    }
  )
  ;


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

  getAllTags(): Tag[] {
    return this.tags;
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
    //  (which will have their children filled with fillDrilldown
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
      return toFill;
    }
    // get children list
    //    for each child, fillchildren
    for (var i = 0; i < toFill.children_ids.length; i++) {
      let child: TagDrilldown = this.fillChildren(toFill.children_ids[i], master);
      //    put drilldown in children lst
      toFill.children.push(child);
    }
    // put drilldown in master
    master[drilldownIndex] = toFill;
  }

  getById(tag_id: string): Observable<Tag> {
    let tag$ = this.http
      .get(`${this.tagUrl}/tag/${tag_id}`, {headers: this.getHeaders()})
      .map(mapTag)
      .catch(handleError);
    return tag$;
  }


  addTag(newTag: Tag) {
    alert(newTag.name);
    // just for now
    newTag.tag_id = this.tags.length > 0 ?
      this.tags.map(s => s.tag_id)
        .reduce((p, c) => p < c ? c : p) + 1 + "" : "1";
    this.tags.push(newTag);
  }

  saveTag(tag: Tag): Observable<Response> {
    return this
      .http
      .put(`${this.tagUrl}/tag/${tag.tag_id}`,
        JSON.stringify(tag),
        {headers: this.getHeaders()});
  }

  deleteTag(id: string) {
    let oldTag = this.tags.filter(s => s.tag_id == id)[0];
    if (oldTag) {
      let tagIndex = this.tags.indexOf(oldTag);
      if (tagIndex >= 0) {
        this.tags.splice(tagIndex, 1);
      }
    }
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
  // could be something more sofisticated
  let errorMsg = error.message || `Yikes! There was a problem with our hyperdrive device and we couldn't retrieve your data!`
  console.error(errorMsg);

  // throw an application level error
  return Observable.throw(errorMsg);
}

