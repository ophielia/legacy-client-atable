import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {TagsService} from "../tags.service";


@Component({
  selector: 'edit-site-view',
  templateUrl: 'edit-tag.template.html'
})
export class EditTagComponent {
  tagId: string;
  tagName: string;

  constructor(
    private tagService: TagsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.tagId = this.route.snapshot.params['id'];
    this.tagName = this.tagService
      .getById(this.tagId).name;
  }

  save() {
    this.tagService.saveTag({tag_id: this.tagId, name:this.tagName, description: ""});
    this.router.navigate(['/list']);
  }
}
