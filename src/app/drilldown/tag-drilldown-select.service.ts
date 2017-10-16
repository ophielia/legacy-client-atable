import {EventEmitter, Injectable} from "@angular/core";
import {TagDrilldown} from "../model/tag-drilldown";

@Injectable()
export class DrilldownCommService {

  selectEvent: EventEmitter<TagDrilldown> = new EventEmitter<TagDrilldown>();

  constructor() {
  }

  selected(tag: TagDrilldown) {
    console.log('found service');
    this.selectEvent.emit(tag);
  }

}
