import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'at-color-tags',
  templateUrl: './color-tags.component.html',
  styleUrls: ['./color-tags.component.css']
})
export class ColorTagsComponent implements OnInit {

  @Input() legendMap: Map<string, string>;
  @Input() item: string;

  constructor() {
  }

  ngOnInit() {
  }

  legendLookup(id: string) {
    return this.legendMap.get(id);
  }

}
