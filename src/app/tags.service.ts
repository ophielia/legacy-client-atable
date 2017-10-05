import {Injectable} from "@angular/core";
import {Headers} from '@angular/http';
import {Tag} from "./tag";
import {Http, Response} from "@angular/http";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

const TAGS: Tag[] = [
  {tag_id: "1", name: 'carrot', description: 'orange'},
  {tag_id: "2", name: 'easy', description: 'easy to make'},
  {tag_id: "3", name: 'cheap', description: 'not expensive'}
];

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





  getById(tag_id: string): Tag {
    return this.tags.find(p => p.tag_id === tag_id);
  }

  addTag(newTag: Tag) {
    alert(newTag.name);
    // just for now
    newTag.tag_id = this.tags.length > 0 ?
      this.tags.map(s => s.tag_id)
        .reduce((p, c) => p < c ? c : p) + 1 + "" : "1";
    this.tags.push(newTag);
  }

  saveTag(tag: Tag) {
    let oldTag = this.tags.filter(s => s.tag_id == tag.tag_id)[0];
    if (oldTag) {
      oldTag.name = tag.name;
      oldTag.description = tag.description;
    }
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

function toTag(r: any): Tag {
  let tag = <Tag>({
    tag_id: r.tag.tag_id,
    name: r.tag.name,
    description: r.tag.description
  });



  console.log('Parsed tag:', tag);
  return tag;
}

// this could also be a private method of the component class
function handleError (error: any) {
  // log error
  // could be something more sofisticated
  let errorMsg = error.message || `Yikes! There was a problem with our hyperdrive device and we couldn't retrieve your data!`
  console.error(errorMsg);

  // throw an application level error
  return Observable.throw(errorMsg);
}
