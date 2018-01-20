import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {TagsService} from "../tags.service";
import {TagDrilldown} from "app/model/tag-drilldown";
import {TagCommService} from "./tag-drilldown-select.service";
import TagSelectType from "../model/tag-select-type";

@Component({
  selector: 'at-tag-drilldown-container',
  template: `
    <div class="tagbox" (selectEvent)="0">
      <at-tag-drilldown [node]="tagDrilldown" [selectType]="currentSelect"></at-tag-drilldown>
    </div>`,
  styleUrls: ['./tag-drilldown-container.css', '../shared.styles.css']
})
export class TagDrilldownContainer implements OnInit, OnDestroy {

  @Input() tagDrilldown: TagDrilldown;
  @Input() selectType: string;
  //@Input() parentSelect: boolean; // MM do we need this?
  //@Output() selectedDrilldown: EventEmitter<TagDrilldown> = new EventEmitter<TagDrilldown>();
  currentTag: TagDrilldown;
  private tagService: TagsService;
  currentSelect: string;


  constructor(tagService: TagsService,
              private tagCommunicationService: TagCommService) {
    this.tagService = tagService;

    this.tagCommunicationService.selectEvent.subscribe(e => {
      this.onSelect(e);
    });
  }


  ngOnInit() {
    this.currentTag = this.tagDrilldown;
    this.currentSelect = this.selectType;
    //   if (this.parentSelect == null) {
    //   this.parentSelect = false;
    //}
  }

  ngOnDestroy() {

  }

  onSelect(tag: TagDrilldown) {
    //this.selectedDrilldown.emit(tag);
  }


}
