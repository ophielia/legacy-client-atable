import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Router} from "@angular/router";
import {TagsService} from "../tags.service";
import {TagDrilldown} from "app/model/tag-drilldown";
import {DrilldownCommService} from "./tag-drilldown-select.service";

@Component({
  selector: 'at-tag-drilldown-container',
  template: `
    <div class="tagbox" (selectEvent)="notifySelected($event)">
      <at-tag-drilldown [node]="tagDrilldown"></at-tag-drilldown>
    </div>`,
  styleUrls: ['./tag-drilldown-container.css', '../shared.styles.css']
})
export class TagDrilldownContainer implements OnInit {

  @Input() tagDrilldown: TagDrilldown;
  @Output() selectedDrilldown: EventEmitter<TagDrilldown> = new EventEmitter<TagDrilldown>();
  currentTag: TagDrilldown;
  private tagService: TagsService;


  constructor(tagService: TagsService,
              private tagCommunicationService: DrilldownCommService) {
    this.tagService = tagService;

    this.tagCommunicationService.selectEvent.subscribe(e => {
      this.onSelect(e);
    });
  }


  ngOnInit() {
    this.currentTag = this.tagDrilldown;
  }

  onSelect(tag: TagDrilldown) {
    console.log("selected");
    this.selectedDrilldown.emit(tag);
  }

}
