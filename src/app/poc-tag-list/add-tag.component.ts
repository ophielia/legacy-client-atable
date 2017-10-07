import {Component, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {TagsService} from "../tags.service";


@Component({
  selector: 'add-tag-view',
  templateUrl: './add-tag.component.html'
})
export class PocAddTagComponent {
  tagName: string;

  constructor(
    private tagService: TagsService,
    private router: Router) { }

  add() {
    this.tagService.addTag(this.tagName)
      .subscribe(r => console.log(`added!!! this.tagName`));;
    this.router.navigate(['/list']);
  }
}
