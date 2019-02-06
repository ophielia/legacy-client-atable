import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ITag} from "../../model/tag";
import {DishService} from "../../services/dish-service.service";
import {Subscription} from "rxjs/Subscription";
import {Dish} from "../../model/dish";
import TagSelectType from "../../model/tag-select-type";
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";
import {MealPlanService} from "../../services/meal-plan.service";
import {TagsService} from "app/services/tags.service";
import {Router} from "@angular/router";
import {TagDrilldown} from "../../model/tag-drilldown";
import {MealPlan} from "../../model/mealplan";
import TagType from "../../model/tag-type";
import {DishFilterSelectCommService} from "./dish-filter-select-comm.service";

@Component({
  selector: 'at-dish-filter-select',
  templateUrl: './dish-filter-select.component.html',
  styleUrls: ['./dish-filter-select.component.css']
})
export class DishFilterSelectComponent implements OnInit {
  @Output() dishSelected: EventEmitter<Dish> = new EventEmitter<Dish>();
  @Output() onAddClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() elementClass: string = 'dish';
  @Input() showAdd: boolean = true;

  filterTags: ITag[];
  tagSelectEvent: any;
  selectedDishes: Dish[] = [];
  searchValue: string;
  mealPlanList: MealPlan[];
  mealPlanMore: boolean;
  showMealPlanList: boolean;


  allDishes: Dish[];
  filteredDishes: Dish[];
  browseAllDrilldowns: { [type: string]: TagDrilldown[] } = {};
  browseTagTypes: string[];
  expandFoldState: Map<string, boolean> = new Map<string, boolean>();
  isShowTagEntry: boolean = false;

  showBrowse: boolean = false;
  selectType: string = TagSelectType.Search;


  private errorMessage: string;
  private showSelectedMenu: boolean = false;
  unsubscribe: Subscription[] = [];
  private alltags: ITag[];
  private alltagsSearch: ITag[];

  constructor(private dishService: DishService,
              private tagCommService: TagCommService,
              private mealPlanService: MealPlanService,
              private dishFilterCommService: DishFilterSelectCommService,
              private tagService: TagsService,
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
    this.getMealPlanForSelect(5);
    this.tagSelectEvent = this.tagCommService.selectEvent
      .subscribe(selectevent => {
        this.addTagToFilter(selectevent);
      })
    this.dishFilterCommService.dishSelectedObs$.subscribe(
      t => {
        this.clearSearchValue();
      }
    )
    this.getAllTags();
  }

  ngOnDestroy() {
    this.tagSelectEvent.unsubscribe();
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  getMealPlanForSelect(limit: number) {
    let $sub = this.mealPlanService.getAll().subscribe(l => {
      if (l && l.length > limit) {
        this.mealPlanMore = true;
        this.mealPlanList = l.slice(0, limit - 1);
      } else {
        this.mealPlanList = l;
        this.mealPlanMore = false;
      }
    })
    this.unsubscribe.push($sub);
  }

  getTagsForBrowse() {

    for (var i = 0; i < this.browseTagTypes.length; i++) {
      let ttype = this.browseTagTypes[i];
      // get / fill tag lists here from service
      let $sub = this.tagService
        .getTagDrilldownList(ttype).subscribe(p => {
          this.browseAllDrilldowns[ttype] = p
        });
      this.unsubscribe.push($sub);

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
      let $sub = this.dishService
        .findByTags(includeTagList, excludeTagList)
        .subscribe(p => {
            this.allDishes = p;
            this.filteredDishes = p;
          },
          e => this.errorMessage = e);
      this.unsubscribe.push($sub);
    }
  }


  selectDish(dish: Dish) {
    this.dishSelected.emit(dish);
  }

  addClick() {
    this.onAddClick.emit(true);
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

  toggleBrowse() {
    this.showBrowse = !this.showBrowse;
  }

  expandOrFoldBrowse(tagtype: string) {
    this.expandFoldState[tagtype] = !this.expandFoldState[tagtype];
  }

  isExpanded(tagtype: string) {
    return this.expandFoldState[tagtype];
  }

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


  hasSelectedDishes() {
    if (this.selectedDishes && this.selectedDishes.length > 0) {
      return true;
    }
    return false;
  }


  addTagToFilter(tag: ITag) {
    tag.is_inverted = false;
    if (!this.filterTags) {
      this.filterTags = [];
    }

    this.filterTags.push(tag);

    this.getAllDishes();
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


  getAllTags() {
    this.tagService
      .getAllSelectable('Ingredient,Rating,DishType,TagType', TagSelectType.Assign)
      .subscribe(p => {
          this.alltags = p;
        },
        e => this.errorMessage = e);
    this.tagService
      .getAllSelectable('Ingredient,Rating,DishType,TagType', TagSelectType.Search)
      .subscribe(p => {
          this.alltagsSearch = p;
        },
        e => this.errorMessage = e);

  }


  getElementClass(baseclass: string) {
    var classString = baseclass + this.elementClass + '-outline-color';
    return classString;
  }

  getAddButtonClass(baseclass: string) {
    var classString = baseclass + ' ' + this.elementClass + '-color';
    return classString;
  }

}
