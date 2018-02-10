import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {TagsService} from "../../services/tags.service";
import {TagDrilldown} from "app/model/tag-drilldown";
import {TagCommService} from "../drilldown/tag-drilldown-select.service";

@Component({
  selector: 'at-tag-list',
  template: `
    <div>
      <h2>Tag Drilldown <span *ngIf="selectedTag">Selected: {{selectedTag.name}}</span></h2>
      <div *ngIf="this.isComplete" class="row card-group">
        <div class="col-4 tagboxContainer" *ngFor="let tag of tags">
          <div class="card tagbox" (selectEvent)="onNotify($event)">
            <at-tag-drilldown-container [tagDrilldown]="tag"></at-tag-drilldown-container>
          </div>
        </div>
      </div>
    </div>`,
  styleUrls: ['./tag-list.component.css', '../../shared.styles.css']
})
export class TagListComponent implements OnInit {

  private tagService: TagsService;
  selectedTag: TagDrilldown;
  tags: TagDrilldown[] = [];
  errorMessage: string;
  private isComplete: boolean = false;

  constructor(tagService: TagsService, private router: Router,
              private tagCommunicationService: TagCommService) {
    this.tagService = tagService;

    this.tagCommunicationService.selectEvent.subscribe(e => {
      this.onSelect(e);
    });
  }


  ngOnInit() {
    this.tagService
      .getTagDrilldownList(null)
      .subscribe(p => this.tags = p,
        e => this.errorMessage = e,
        () => this.isComplete = true);
  }

  onSelect(tag: TagDrilldown) {
    this.selectedTag = tag;
  }

}