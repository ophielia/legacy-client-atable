import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {TagsService} from '../tags.service';

@Component({
  selector: 'delete-site-view',
  templateUrl: './delete-tag.template.html'
})
export class DeleteTagComponent {
  tagId: string;
  tagName: string;
  private parSub: any;

  constructor(
    private tagService: TagsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
        this.tagId = this.route.snapshot.params['id'];
        this.tagName = this.tagService
          .getById(this.tagId).name;
  }

  delete() {
    this.tagService.deleteTag(this.tagId);
    this.router.navigate(['/list']);
  }
}
