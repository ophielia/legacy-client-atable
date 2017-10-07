import {Component, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {MockTagsService} from "../mock-tags.service";


@Component({
  selector: 'add-tag-view',
  templateUrl: './add-tag.component.html'
})
export class PocAddTagComponent {
  tagName: string;

  constructor(
    private tagService: MockTagsService,
    private router: Router) { }

  add() {
    this.tagService.addTag({tag_id: "", name:this.tagName, description: ""});
    this.router.navigate(['/list']);
  }
}
