import {Component, Input, OnInit} from '@angular/core';
import TagSelectType from "../../model/tag-select-type";
import {TagDrilldown} from "../../model/tag-drilldown";
import {DomSanitizer} from "@angular/platform-browser";
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";

@Component({
  selector: 'at-tag-browse-node',
  templateUrl: './tag-browse-node.component.html',
  styleUrls: ['./tag-browse-node.component.css']
})
export class TagBrowseNodeComponent implements OnInit {
  @Input() selectType: string;
  @Input() showEdit: boolean;
  @Input() node;
  currentSelect: string = TagSelectType.Assign;


  constructor(private sanitizer: DomSanitizer,
              private _tagDrilldownSelectService: TagCommService) {
  }

  ngOnInit() {
    console.log('in drilldown component');
    if (this.selectType) {
      this.currentSelect = this.selectType;
    }
    if (!this.showEdit) {
      this.showEdit = false;
    }
  }

  showHideChildren(tag: TagDrilldown) {
    console.log('tag is ', tag);
    tag.expanded = !tag.expanded;
  }

  notifyIsSelected(tag: TagDrilldown) {
    console.log('child clicked');
    if (this.isSelectable(tag)) {
      console.log('child clicked and event fired');
      this._tagDrilldownSelectService.selected(tag);
    }
  }

  private isSelectable(tag: TagDrilldown) {
    if (this.currentSelect == TagSelectType.All) {
      return true;
    }
    if (this.currentSelect == TagSelectType.Assign
      && tag.assign_select) {
      return true;
    }
    if (this.currentSelect == TagSelectType.Search
      && tag.search_select) {
      return true;
    }
    return false;
  }
}


