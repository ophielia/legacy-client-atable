import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";
import {TagDrilldown} from "../../model/tag-drilldown";
import {TagsService} from "../../services/tags.service";

@Component({
  selector: 'at-tag-browse',
  templateUrl: './tag-browse.component.html',
  styleUrls: ['./tag-browse.component.css']
})
export class TagBrowseComponent implements OnInit, OnDestroy {


  @Input() tagDrilldown: TagDrilldown;
  @Input() showEdit: boolean = false;
  @Input() selectType: string;
  currentTag: TagDrilldown;
  currentSelect: string;


  constructor() {

  }


  ngOnInit() {
    this.currentTag = this.tagDrilldown;
    this.currentSelect = this.selectType;
  }

  ngOnDestroy() {

  }


}
