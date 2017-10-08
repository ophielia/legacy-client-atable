import {EventEmitter, Injectable} from '@angular/core';
import {TagDrilldown} from "../tag-drilldown";

@Injectable()
export class DrilldownCommunicationService {

  selectEvent: EventEmitter<TagDrilldown> = new EventEmitter<TagDrilldown>();

  constructor() { }

  selected(tag: TagDrilldown) {
    console.log('found service');
    this.selectEvent.emit(tag);
  }
}
