import {Component, forwardRef, Input, OnInit} from '@angular/core';

@Component({
  selector: 'at-tag-drilldown',
  template: `
    <div>{{node.name}}</div>
    <ul>
      <li *ngFor="let node of node.children">
        <at-tag-drilldown  [node]="node"></at-tag-drilldown>
      </li>
    </ul>
  `,
  styleUrls: ['./tag-drilldown.component.css']
})
export class TagDrilldownComponent implements OnInit {
  @Input() node;

  constructor() { }

  ngOnInit() {
  }

}


