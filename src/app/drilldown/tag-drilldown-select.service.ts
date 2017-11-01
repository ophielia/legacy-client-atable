import {EventEmitter, Injectable, Output} from "@angular/core";
import {TagDrilldown} from "../model/tag-drilldown";

@Injectable()
export class TagCommService {

  @Output() selectEvent: EventEmitter<TagDrilldown> = new EventEmitter<TagDrilldown>();

  constructor() {
  }

  selected(tag: TagDrilldown) {
    console.log('found service');
    this.selectEvent.emit(tag);
  }

}
