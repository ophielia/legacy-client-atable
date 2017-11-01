import {Component, Input, OnInit} from "@angular/core";
import {TagDrilldown} from "../model/tag-drilldown";
import {dash, plus} from "octicons";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {TagCommService} from "./tag-drilldown-select.service";

@Component({
  selector: 'at-tag-drilldown',
  template: `
    <div class="drilldown-level-{{node.level}}" (click)="notifyIsSelected(node)">{{node.name}} ({{node.level}})
      <button *ngIf="node.children.length > 0" (click)="showHideChildren(node)" type="button"
              class="btn btn-sm ">
        <span *ngIf="!node.expanded" class="octicon " [innerHTML]="plusIcon"></span>
        <span *ngIf="node.expanded" class="octicon " [innerHTML]="minusIcon"></span>
      </button>

    </div>
    <ul *ngIf="node.expanded" class="tagboxList">
      <li *ngFor="let node of node.children">
        <at-tag-drilldown [node]="node"></at-tag-drilldown>
      </li>
    </ul>
  `,
  styleUrls: ['./tag-drilldown.component.css']
})
export class TagDrilldownComponent implements OnInit {

  @Input() node;
  public plusIcon: SafeHtml;
  public minusIcon: SafeHtml;

  constructor(private sanitizer: DomSanitizer,
              private _tagDrilldownSelectService: TagCommService) {
  }

  ngOnInit() {
    console.log('in drilldown component');
    this.plusIcon = this.sanitizer.bypassSecurityTrustHtml(plus.toSVG());
    this.minusIcon = this.sanitizer.bypassSecurityTrustHtml(dash.toSVG());
  }

  showHideChildren(tag: TagDrilldown) {
    console.log('tag is ', tag);
    tag.expanded = !tag.expanded;
  }

  notifyIsSelected(tag: TagDrilldown) {
    console.log('child clicked');
    if (tag.children.length == 0) {
      console.log('child clicked and event fired');
      this._tagDrilldownSelectService.selected(tag);
    }
  }
}


