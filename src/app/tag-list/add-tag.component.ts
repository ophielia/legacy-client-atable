import {Component, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {TagsService} from "../tags.service";


@Component({
  selector: 'add-tag-view',
  templateUrl: 'add-tag.component.html'
})
export class AddTagComponent {
  tagName: string;

  constructor(
    private tagService: TagsService,
    private router: Router) { }

  add() {
    this.tagService.addTag({tag_id: "", name:this.tagName, description: ""});
    this.router.navigate(['/list']);
  }
}
