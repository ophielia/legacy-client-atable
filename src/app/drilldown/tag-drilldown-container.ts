import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {TagsService} from "../tags.service";
import {TagDrilldown} from "app/model/tag-drilldown";
import {TagCommService} from "./tag-drilldown-select.service";

@Component({
  selector: 'at-tag-drilldown-container',
  template: `
    <div class="tagbox" (selectEvent)="0">
      <at-tag-drilldown [node]="tagDrilldown" [parentSelect]="parentSelect"></at-tag-drilldown>
    </div>`,
  styleUrls: ['./tag-drilldown-container.css', '../shared.styles.css']
})
export class TagDrilldownContainer implements OnInit, OnDestroy {

  @Input() tagDrilldown: TagDrilldown;
  @Input() parentSelect: boolean;
  //@Output() selectedDrilldown: EventEmitter<TagDrilldown> = new EventEmitter<TagDrilldown>();
  currentTag: TagDrilldown;
  private tagService: TagsService;


  constructor(tagService: TagsService,
              private tagCommunicationService: TagCommService) {
    this.tagService = tagService;

    this.tagCommunicationService.selectEvent.subscribe(e => {
      this.onSelect(e);
    });
  }


  ngOnInit() {
    this.currentTag = this.tagDrilldown;
    if (this.parentSelect == null) {
      this.parentSelect = false;
    }
  }

  ngOnDestroy() {

  }

  onSelect(tag: TagDrilldown) {
    //this.selectedDrilldown.emit(tag);
  }


}
