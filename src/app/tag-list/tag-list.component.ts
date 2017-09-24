import {Component, OnInit} from "@angular/core";
import {Tag} from "../tag";
import {TagsService} from "../tags.service";

@Component({
  selector: 'at-tag-list',
  template: `
    <ul>
      <li *ngFor="let tag of tags">
        <a href="#" (click)="selectTag(tag)">
          {{tag.name}}
        </a>
      </li>
    </ul>
    
    <at-tag-details [tag]="selectedTag"></at-tag-details>
  `,
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {

  private tagService: TagsService;
  tags: Tag[] = [];
  selectedTag: Tag;

  constructor(tagService: TagsService) {
    this.tagService = tagService;
  }

  ngOnInit() {
    this.tags = this.tagService.getAll();
  }

  selectTag(tag) {
    this.selectedTag = tag;
  }

}
