import {Component, EventEmitter, OnDestroy, OnInit, Output} from "@angular/core";
import {Dish} from "../model/dish";
import {TagDrilldown} from "../model/tag-drilldown";
import {TagsService} from "../tags.service";

@Component({
  selector: 'at-dish-tag-select',
  templateUrl: './dish-tag-select.component.html',
})
export class DishTagSelectComponent implements OnInit, OnDestroy {
  @Output() tagSelected: EventEmitter<TagDrilldown> = new EventEmitter<TagDrilldown>();
  name: string;
  dish: Dish = <Dish>{dish_id: "", name: "", description: ""};
  private errorMessage: string;

  selectedTag: TagDrilldown;
  expandFoldState: Map<string, boolean> = new Map<string, boolean>();

  dishTypeTags: TagDrilldown[];
  ingredientTags: TagDrilldown[];

  constructor(private tagService: TagsService) {

  }

  ngOnInit() {
    // get / fill tag lists here from service
    this.tagService
      .getTagDrilldownList("DishType")
      .subscribe(p => this.dishTypeTags = p,
        e => this.errorMessage = e);
    this.tagService
      .getTagDrilldownList("Ingredient")
      .subscribe(p => this.ingredientTags = p,
        e => this.errorMessage = e);
    this.expandFoldState['DishType'] = false;
    this.expandFoldState['Ingredient'] = false;
  }

  ngOnDestroy() {

  }

  showSelected(tag: TagDrilldown) {
    //this.selectedTag = tag;
    this.tagSelected.emit(tag);
  }

  expandFold(tagtype: string) {
    this.selectedTag = null;
    this.expandFoldState[tagtype] = !this.expandFoldState[tagtype];
  }

  isShow(tagtype: string) {
    return this.expandFoldState[tagtype];
  }
}
