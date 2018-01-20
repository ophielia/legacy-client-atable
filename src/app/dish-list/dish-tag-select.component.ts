import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {Dish} from "../model/dish";
import {TagDrilldown} from "../model/tag-drilldown";
import {TagsService} from "../tags.service";
import {Tag} from "../model/tag";
import TagType from "../model/tag-type";
import TagSelectType from "../model/tag-select-type";

@Component({
  selector: 'at-dish-tag-select',
  templateUrl: './dish-tag-select.component.html',
})
export class DishTagSelectComponent implements OnInit, OnDestroy {
  @Output() tagSelected: EventEmitter<Tag> = new EventEmitter<Tag>();
  @Input() tagTypes: string;
  @Input() selectType: string = TagSelectType.Assign;
  name: string;
  dish: Dish = <Dish>{dish_id: "", name: "", description: ""};
  private errorMessage: string;
  currentSelect: string;
  searchValue: string;
  selectedTag: TagDrilldown;
  expandFoldState: Map<string, boolean> = new Map<string, boolean>();
  includedTypes: Map<string, boolean> = new Map<string, boolean>();
  showAddTags: boolean;
  autoSelectedTag: Tag;
  dishTypeTags: TagDrilldown[];
  ingredientTags: TagDrilldown[];
  generalTags: TagDrilldown[];
  ratingTags: TagDrilldown[];
  nonEdibleTags: TagDrilldown[];

  allTagTypes: string[];
  allDrilldowns: { [type: string]: TagDrilldown[] } = {};
  lastSelectedId: string = "";
  alltags: Tag[];
  filteredTags: Tag[];

  ingredientType: string = TagType.Ingredient;
  dishType: string = TagType.DishType;
  ratingType: string = TagType.Rating;
  tagType: string = TagType.TagType;
  nonEdible: string = TagType.NonEdible;
  isSearch = true;
  searchBoxValue: string;

  constructor(private tagService: TagsService) {
    this.allTagTypes = TagType.listAll();
  }

  ngOnInit() {
    for (var i = 0; i < this.allTagTypes.length; i++) {
      let ttype = this.allTagTypes[i];
      // get / fill tag lists here from service
      if (this.tagTypes.includes(ttype)) {
        this.includedTypes[ttype] = true;
        this.tagService
          .getTagDrilldownList(ttype)
          .subscribe(p => {
            this.allDrilldowns[ttype] = p
          });
      } else {
        this.includedTypes[ttype] = false;
      }
      this.expandFoldState[ttype] = false;
    }

    this.searchValue = null;
    this.currentSelect = this.selectType;
    this.getAllTags();

  }


  getAllTags() {
    this.tagService
      .getAllSelectable(this.tagTypes, this.selectType)
      .subscribe(p => {
          this.alltags = p;
          this.showAddTags = (this.alltags.length == 0);
          if (this.searchValue) {
            this.filterTags();
            this.checkSearchEnter(null);
          }
        },
        e => this.errorMessage = e);

  }

  filterTags() {
    if (this.searchValue) {
      if (this.alltags) {
        let filterBy = this.searchValue.toLocaleLowerCase();
        this.filteredTags = this.alltags.filter((tag: Tag) =>
        tag.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
        this.showAddTags = this.filteredTags.length == 0;
      }
    } else {
      this.filteredTags = null;
    }
  }

  acFilterTags(event) {
    if (event.query) {
      if (this.alltags) {
        let filterBy = event.query.toLocaleLowerCase();
        this.filteredTags = this.alltags.filter((tag: Tag) =>
        tag.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
        this.showAddTags = this.filteredTags.length == 0;
      }
    } else {
      this.filteredTags = null;
    }
  }

  bingo(event) {
    this.tagSelected.emit(event);
    this.autoSelectedTag = null;
    this.filteredTags = [];
  }

  ngOnDestroy() {

  }

  showSelected(tag: Tag) {
    if (this.lastSelectedId != tag.tag_id) {
      this.lastSelectedId = tag.tag_id;
      console.log('showing from drilldown select container-' + tag.tag_id);
      this.autoSelectedTag = null;
      this.tagSelected.emit(tag);
    }
  }

  checkSearchEnter(el) {
    // when the user clicks on return from the search box
    // if only one tag is in the list, select this tag
    if (this.filteredTags.length == 1) {
      this.bingo(this.filteredTags[0]);
      if (el) {
        el.panelVisible = false;

        //el.focus();
      }
    }
  }

  expandFold(tagtype: string) {
    this.selectedTag = null;
    this.expandFoldState[tagtype] = !this.expandFoldState[tagtype];
  }

  isExpanded(tagtype: string) {
    return this.expandFoldState[tagtype];
  }

  isIncluded(tagtype: string) {
    return this.includedTypes[tagtype];
  }

  setSearch(isSearch: boolean) {
    this.isSearch = isSearch;
  }

  showSearch() {
    this.lastSelectedId = "";
    return this.isSearch;
  }

  add(tagType: string) {
    var tagName = this.searchValue;
    console.log("tag type is " + tagType);
    this.tagService.addTag(tagName, tagType)
      .subscribe(r => {
        console.log(`added!!! this.tagName`);
        this.searchValue = null;
        var headers = r.headers;
        var location = headers.get("Location");
        var splitlocation = location.split("/");
        var id = splitlocation[splitlocation.length - 1];
        this.tagService.getById(id)
          .subscribe(t => {
            this.showSelected(t);
          });

        this.getAllTags();
      });
  }
}
