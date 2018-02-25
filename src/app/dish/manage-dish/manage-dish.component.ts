import {Component, OnInit} from '@angular/core';
import {ITag} from "../../model/tag";
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";
import {Dish} from "../../model/dish";
import TagSelectType from "../../model/tag-select-type";
import {DishService} from "../../services/dish-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TagDrilldown} from "../../model/tag-drilldown";
import {TagsService} from "../../services/tags.service";
import TagType from "../../model/tag-type";

@Component({
  selector: 'at-manage-dish',
  templateUrl: './manage-dish.component.html',
  styleUrls: ['./manage-dish.component.css']
})
export class ManageDishComponent implements OnInit {
  filterTags: ITag[];
  tagSelectEvent: any;
  selectedDishes: Dish[] = [];
  searchValue: string;

  allDishes: Dish[];
  filteredDishes: Dish[];
  browseAllDrilldowns: { [type: string]: TagDrilldown[] } = {};
  browseTagTypes: string[];
  expandFoldState: Map<string, boolean> = new Map<string, boolean>();

  showFilter: boolean = true;
  showBrowse: boolean = true;
  selectType: string = TagSelectType.Search;


  private errorMessage: string;


  constructor(private dishService: DishService,
              private tagCommService: TagCommService,
              private tagService: TagsService,
              private route: ActivatedRoute,
              private router: Router,) {
    this.tagCommService = tagCommService;
    this.initializeBrowseTagTypes();


  }

  private initializeBrowseTagTypes() {
    this.browseTagTypes = [];
    this.browseTagTypes.push(TagType.DishType);
    this.browseTagTypes.push(TagType.Rating);
    this.browseTagTypes.push(TagType.TagType);
    this.browseTagTypes.push(TagType.Ingredient);
  }

  ngOnInit() {

    this.getAllDishes();
    this.getTagsForBrowse();
    this.tagSelectEvent = this.tagCommService.selectEvent
      .subscribe(selectevent => {
        this.addTagToFilter(selectevent);
      })
  }

  ngOnDestroy() {
    this.tagSelectEvent.unsubscribe();
  }

  getTagsForBrowse() {
    let includedtypes = TagType.TagType + TagType.DishType + TagType.Rating + TagType.Ingredient;

    for (var i = 0; i < this.browseTagTypes.length; i++) {
      let ttype = this.browseTagTypes[i];
      // get / fill tag lists here from service
      this.tagService
        .getTagDrilldownList(ttype)
        .subscribe(p => {
          this.browseAllDrilldowns[ttype] = p
        });

      this.expandFoldState[ttype] = false;
    }


  }

  getAllDishes() {
    if (!this.filterTags || this.filterTags.length == 0) {
      this.dishService
        .getAll()
        .subscribe(p => {
            this.allDishes = p;
            this.sortDishes();
            this.resetFilter()
          },
          e => this.errorMessage = e);
    } else {
      var includeTagList = this.filterTags.filter(t => t.is_inverted == false).map(t => t.tag_id);
      var excludeTagList = this.filterTags.filter(t => t.is_inverted == true).map(t => t.tag_id);
      this.dishService
        .findByTags(includeTagList, excludeTagList)
        .subscribe(p => this.allDishes = p,
          e => this.errorMessage = e);
    }
  }

  sortDishes() {
    this.allDishes.sort((a, b) => {
      if (a.name < b.name) return -1;
      else if (a.name > b.name) return 1;
      else return 0;
    });
  }

  resetFilter() {
    this.filteredDishes = this.allDishes;
  }

  clearSearchValue() {
    this.searchValue = "";
    this.resetFilter();
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
    if (!this.showFilter) {
      this.showBrowse = false;
    }
  }

  toggleBrowse() {
    this.showBrowse = !this.showBrowse;
  }

  expandOrFoldBrowse(tagtype: string) {
    this.expandFoldState[tagtype] = !this.expandFoldState[tagtype];
  }

  is

  filterByDishname() {
    console.log("filter by dishname" + this.searchValue);

    if (this.searchValue.length == 0) {
      this.filteredDishes = this.allDishes;
    } else if (this.filteredDishes) {
      let filterBy = this.searchValue.toLocaleLowerCase();
      this.filteredDishes = this.filteredDishes.filter((dish: Dish) =>
      dish.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }
  }

  selectDish(dish: Dish) {
    let match = this.selectedDishes.filter(t => dish.dish_id == t.dish_id);
    if (!match || match.length == 0) {
      this.selectedDishes.push(dish);
    }
  }

  unSelectDish(dish: Dish) {
    this.selectedDishes = this.selectedDishes.filter(t => dish.dish_id != t.dish_id);
  }


  addTagToFilter(tag: ITag) {
    tag.is_inverted = false;
    if (!this.filterTags) {
      this.filterTags = [];
    }
    this.filterTags.push(tag);

    // this.getAllDishes();
  }

  removeTagFromFilter(tag: ITag) {
    this.filterTags = this.filterTags.filter(t => t.tag_id != tag.tag_id);
    this.getAllDishes();
  }


  toggleInvert(tag: ITag) {
    for (var i: number = 0; i < this.filterTags.length; i++) {
      if (this.filterTags[i].tag_id == tag.tag_id) {
        this.filterTags[i].is_inverted = !this.filterTags[i].is_inverted;
      }
    }
    this.getAllDishes();
  }

  goToList() {
    this.router.navigate(['/mealplan/list']);
  }

}
