import {Component, Input, OnInit} from "@angular/core";
import {Tag} from "../tag";

@Component({
  selector: 'at-tag-details',
  template: `
    <section *ngIf="tag">
      <h2>You selected: {{tag.name}}</h2>
      <h3>Description</h3>
      <p>
        {{tag.name}} : with description {{tag.description}} and id {{tag.tag_id}}.
      </p>
    </section>
  `,
  styles: []
})
export class TagDetailsComponent implements OnInit {
  @Input() tag : Tag;

  constructor() {
  }

  ngOnInit() {
  }

}
