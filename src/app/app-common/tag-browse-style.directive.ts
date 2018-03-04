import {Directive, HostBinding, Input, OnInit} from '@angular/core';
import {Tag} from "../model/tag";
import {TagDrilldown} from "../model/tag-drilldown";

@Directive({
  selector: '[atTagBrowseStyle]'
})
export class TagBrowseStyleDirective implements OnInit {


  @HostBinding('class') elementClass = 'dish-color';
  @Input() tag: TagDrilldown;
  @Input() origClass: string;
  @Input() isOutline: boolean = false;


  constructor() {
  }

  ngOnInit(): void {
    let level = this.tag.level ? this.tag.level : 1;
    let tagname = this.origClass + " " + this.tag.tag_type.toLowerCase() + "-" + level;
    if (this.isOutline) {
      tagname = tagname + "-outline";
    }
    this.elementClass = tagname;
  }

}
