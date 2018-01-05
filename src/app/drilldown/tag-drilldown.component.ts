import {Component, Input, OnInit} from "@angular/core";
import {TagDrilldown} from "../model/tag-drilldown";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {TagCommService} from "./tag-drilldown-select.service";

@Component({
  selector: 'at-tag-drilldown',
  template: `
    <div class="drilldown-level-{{node.level}}" (dblclick)="notifyIsSelected(node)">{{node.name}} ({{node.level}})
      <button *ngIf="node.children.length > 0" (click)="showHideChildren(node)" type="button"
              class="btn btn-sm ">
        <span *ngIf="!node.expanded"><fa [name]="'empire'"></fa></span>
        <span *ngIf="node.expanded"><fa [name]="'rocket'"></fa></span>
      </button>

    </div>
    <ul *ngIf="node.expanded" class="tagboxList">
      <li *ngFor="let node of node.children">
        <at-tag-drilldown [node]="node" [parentSelect]="parentSelect"></at-tag-drilldown>
      </li>
    </ul>
  `,
  styleUrls: ['./tag-drilldown.component.css']
})
export class TagDrilldownComponent implements OnInit {
  @Input() parentSelect: boolean;
  @Input() node;


  constructor(private sanitizer: DomSanitizer,
              private _tagDrilldownSelectService: TagCommService) {
  }

  ngOnInit() {
    console.log('in drilldown component');

  }

  showHideChildren(tag: TagDrilldown) {
    console.log('tag is ', tag);
    tag.expanded = !tag.expanded;
  }

  notifyIsSelected(tag: TagDrilldown) {
    console.log('child clicked');
    if (tag.children.length == 0 || this.parentSelect) {
      console.log('child clicked and event fired');
      this._tagDrilldownSelectService.selected(tag);
    }
  }
}


