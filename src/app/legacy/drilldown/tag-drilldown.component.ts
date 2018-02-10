import {Component, Input, OnInit} from "@angular/core";
import {TagDrilldown} from "../../model/tag-drilldown";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {TagCommService} from "./tag-drilldown-select.service";
import TagSelectType from "../../model/tag-select-type";

@Component({
  selector: 'at-tag-drilldown',
  template: `
    <div class="drilldown-level-{{node.level}}" (dblclick)="notifyIsSelected(node)">{{node.name}} ({{node.level}})
      <button *ngIf="node.children.length > 0" (click)="showHideChildren(node)" type="button"
              class="btn btn-sm ">
        <span *ngIf="!node.expanded"><fa [name]="'plus'"></fa></span>
        <span *ngIf="node.expanded"><fa [name]="'minus'"></fa></span>
      </button>
      <span style="margin-left:3px" [routerLink]="['/edit', node.tag_id]"><fa [name]="'pencil'"></fa></span>

    </div>
    <ul *ngIf="node.expanded" class="tagboxList">
      <li *ngFor="let node of node.children">
        <at-tag-drilldown [node]="node" [selectType]="currentSelect"></at-tag-drilldown>
      </li>
    </ul>
  `,
  styleUrls: ['./tag-drilldown.component.css']
})
export class TagDrilldownComponent implements OnInit {
  //@Input() parentSelect: boolean;
  @Input() selectType: string;
  @Input() node;
  currentSelect: string;


  constructor(private sanitizer: DomSanitizer,
              private _tagDrilldownSelectService: TagCommService) {
  }

  ngOnInit() {
    console.log('in drilldown component');
    this.currentSelect = this.selectType;
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
    if (this.selectType == TagSelectType.All) {
      return true;
    }
    if (this.selectType == TagSelectType.Assign
      && tag.assign_select) {
      return true;
    }
    if (this.selectType == TagSelectType.Search
      && tag.search_select) {
      return true;
    }
    return false;
  }
}


