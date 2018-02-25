import {Component, OnInit, Output, EventEmitter} from "@angular/core";
import {ITag} from "../../model/tag";
import {Router} from "@angular/router";
import {TagsService} from "../../services/tags.service";

@Component({
  selector: 'at-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {

  private tagService: TagsService;
  tags: ITag[] = [];
  errorMessage: string;

  constructor(tagService: TagsService, private router: Router) {
    this.tagService = tagService;
  }

  edit(tagId : string) {
    this.router.navigate(['/dish/edit', tagId]);
  }

  ngOnInit() {
      this.tagService
        .getAll()
        .subscribe(p => this.tags = p,
          e => this.errorMessage = e);
  }

}
