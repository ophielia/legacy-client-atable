import {Component, OnInit, Output, EventEmitter} from "@angular/core";
import {Tag} from "../tag";
import {Router} from "@angular/router";
import {TagsService} from "../tags.service";

@Component({
  selector: 'at-tag-list',
  template: `<div>
    <h2>Tag Drilldown</h2>

    <div class="row card-group">
      <div class="col-4 tagboxContainer" *ngFor="let tag of tags">
        <div class="card tagbox">
          <at-tag-drilldown [node]="tag"></at-tag-drilldown>
        </div>
      </div>
    </div>
  </div>`,
  styleUrls: ['./tag-list.component.css','../shared.styles.css']
})
export class TagListComponent implements OnInit {

  private tagService: TagsService;
  tags: Tag[] = [];
  errorMessage: string;

  node = {name: 'root', children: [
    {name: 'a', children: []},
    {name: 'b', children: []},
    {name: 'c', children: [
      {name: 'd', children: []},
      {name: 'e', children: []},
      {name: 'f', children: []},
    ]},
  ]};

  constructor(tagService: TagsService, private router: Router) {
    this.tagService = tagService;
  }



  edit(tagId : string) {
    this.router.navigate(['/edit', tagId]);
  }

  ngOnInit() {
    var beep = this.tagService.getTagDrilldownList();
    this.tags = beep;
    /*this.tagService
        .getBaseTags()
        .subscribe(p => this.tags = p,
          e => this.errorMessage = e);*/
  }

}
