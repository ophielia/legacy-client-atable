import {Component, OnInit, Output, EventEmitter} from "@angular/core";
import {Tag} from "../tag";
import {TagsService} from "../tags.service";
import {Router} from "@angular/router";

@Component({
  selector: 'at-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {

  private tagService: TagsService;
  tags: Tag[] = [];

  constructor(tagService: TagsService,private router: Router) {
    this.tagService = tagService;
  }

  edit(tagId : string) {
    alert('list' + tagId);
    this.router.navigate(['/edit', tagId]);
  }

  ngOnInit() {
    this.tags = this.tagService.getAllTags();
  }

}
