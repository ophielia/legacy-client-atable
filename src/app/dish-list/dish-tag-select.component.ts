import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {Dish} from "../model/dish";
import {TagDrilldown} from "../model/tag-drilldown";
import {TagsService} from "../tags.service";
import {Tag} from "../model/tag";
import TagType from "../model/tag-type";

@Component({
  selector: 'at-dish-tag-select',
  templateUrl: './dish-tag-select.component.html',
})
export class DishTagSelectComponent implements OnInit, OnDestroy {
  @Output() tagSelected: EventEmitter<Tag> = new EventEmitter<Tag>();
  name: string;
  dish: Dish = <Dish>{dish_id: "", name: "", description: ""};
  private errorMessage: string;

  searchValue: string;
  selectedTag: TagDrilldown;
  expandFoldState: Map<string, boolean> = new Map<string, boolean>();
  showAddTags: boolean;
  dishTypeTags: TagDrilldown[];
  ingredientTags: TagDrilldown[];
  generalTags: TagDrilldown[];
  ratingTags: TagDrilldown[];
  newTag: Tag;

  lastSelectedId: string = "";
  alltags: Tag[];
  filteredTags: Tag[];

  ingredientType: string = TagType.Ingredient;
  dishType: string = TagType.DishType;
  ratingType: string = TagType.Rating;
  tagType: string = TagType.TagType;
  isSearch = true;
  searchBoxValue: string;

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
    this.tagService
      .getTagDrilldownList("TagType")
      .subscribe(p => this.generalTags = p,
        e => this.errorMessage = e);
    this.tagService
      .getTagDrilldownList("Rating")
      .subscribe(p => this.ratingTags = p,
        e => this.errorMessage = e);
    this.expandFoldState['DishType'] = false;
    this.expandFoldState['Ingredient'] = false;
    this.expandFoldState['TagType'] = false;
    this.expandFoldState['Rating'] = false;

    this.searchValue = null;
    this.getAllTags();

  }

  getAllTags() {
    this.tagService
      .getAllSelectable()
      .subscribe(p => {
          this.alltags = p;
          this.showAddTags = (this.alltags.length == 0);
          if (this.searchValue) {
            this.filterTags();
            this.checkSearchEnter();
          }
        },
        e => this.errorMessage = e);
  }

  filterTags() {
    if (this.searchValue) {
      let filterBy = this.searchValue.toLocaleLowerCase();
    this.filteredTags = this.alltags.filter((tag: Tag) =>
    tag.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
    this.showAddTags = this.filteredTags.length == 0;
    } else {
      this.filteredTags = null;
    }
  }

  ngOnDestroy() {

  }

  showSelected(tag: Tag) {
    if (this.lastSelectedId != tag.tag_id) {
      this.lastSelectedId = tag.tag_id;
      console.log('showing from drilldown select container-' + tag.tag_id);
      this.tagSelected.emit(tag);
    }
  }

  checkSearchEnter() {
    // when the user clicks on return from the search box
    // if only one tag is in the list, select this tag
    if (this.filteredTags.length == 1) {
      this.showSelected(this.filteredTags[0]);
      this.searchValue = null;
    }
  }

  expandFold(tagtype: string) {
    this.selectedTag = null;
    this.expandFoldState[tagtype] = !this.expandFoldState[tagtype];
  }

  isShow(tagtype: string) {
    return this.expandFoldState[tagtype];
  }

  setSearch(isSearch: boolean) {
    this.isSearch = isSearch;
  }

  showSearch() {
    this.lastSelectedId = "";
    return this.isSearch;
  }

  add(tagName: string, tagType: string) {
    this.searchBoxValue = tagName;
    console.log("tag type is " + tagType);
    this.tagService.addTag(tagName, tagType)
      .subscribe(r => {
        console.log(`added!!! this.tagName`);
        this.searchValue = null;
        this.getAllTags();
      });
  }
}
