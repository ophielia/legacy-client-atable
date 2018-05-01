import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'at-word-tags',
  templateUrl: './word-tags.component.html',
  styleUrls: ['./word-tags.component.css']
})
export class WordTagsComponent implements OnInit {

  @Input() item: string;

  constructor() {
  }

  ngOnInit() {
  }


}
