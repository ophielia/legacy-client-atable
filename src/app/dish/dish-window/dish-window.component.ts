import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Dish} from "../../model/dish";
import TagType from "../../model/tag-type";

@Component({
  selector: 'at-dish-window',
  templateUrl: './dish-window.component.html',
  styleUrls: ['./dish-window.component.css']
})
export class DishWindowComponent implements OnInit, OnDestroy {

  @Input() dish: Dish;
  @Input() tagTypes: string;

  tagTypeShow: any = {};
  allTagTypes: string[];
  private dishTagsByType: any = {};
  private dishFilled: boolean = false;

  constructor() {
    this.tagTypeShow = [];
    this.dishTagsByType = {};
    this.allTagTypes = TagType.listAll();
//this.initializeLists();
  }


  ngOnInit() {
    this.initializeLists();
  }


  ngOnDestroy(): void {
  }

  initializeLists() {
    for (var i = 0; i < this.allTagTypes.length; i++) {
      this.tagTypeShow[this.allTagTypes[i]] = this.tagTypes.includes(this.allTagTypes[i]);
      this.dishTagsByType[this.allTagTypes[i]] = [];
    }


  }

  fillFromDish() {
    if (!this.dishFilled && this.dish) {
      for (var i = 0; i < this.dish.tags.length; i++) {
        let tag = this.dish.tags[i];
        this.dishTagsByType[tag.tag_type].push(tag);
      }
    }
    this.dishFilled = true;
  }

  getTags(tagtype: string) {
    this.fillFromDish();
    if (this.tagTypeShow[tagtype]) {
      return this.dishTagsByType[tagtype];
    }
  }
}
