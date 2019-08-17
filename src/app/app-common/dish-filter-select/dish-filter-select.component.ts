import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ITag} from "../../model/tag";
import {DishService} from "../../services/dish-service.service";
import {Subscription} from "rxjs/Subscription";
import {Dish} from "../../model/dish";
import TagSelectType from "../../model/tag-select-type";
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";
import {MealPlanService} from "../../services/meal-plan.service";
import {TagsService} from "app/services/tags.service";
import {TagDrilldown} from "../../model/tag-drilldown";
import {MealPlan} from "../../model/mealplan";
import TagType from "../../model/tag-type";
import {DishFilterSelectCommService} from "./dish-filter-select-comm.service";
import {DishSort} from "../../model/dish-sort";

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
  searchValue: string;
  mealPlanList: MealPlan[];
  mealPlanMore: boolean;
  showOrderBy: boolean = false;

  allDishes: Dish[];
  filteredDishes: Dish[];
  browseAllDrilldowns: { [type: string]: TagDrilldown[] } = {};
  browseTagTypes: string[];
  expandFoldState: Map<string, boolean> = new Map<string, boolean>();

  showBrowse: boolean = false;
  selectType: string = TagSelectType.Search;

  sortOptions: SortKey[] = DishSort.getKeys();
  sortKey: SortKey = SortKey.LastUsed;
  sortDirection: SortDirection = SortDirection.Up;

  private errorMessage: string;
  unsubscribe: Subscription[] = [];
  private alltags: ITag[];
  private alltagsSearch: ITag[];

  constructor(private dishService: DishService,
              private tagCommService: TagCommService,
              private mealPlanService: MealPlanService,
              private dishFilterCommService: DishFilterSelectCommService,
              private tagService: TagsService) {
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
            this.sortDishes(p);
            this.allDishes = p;
            this.resetFilter()
          },
          e => this.errorMessage = e);
    } else {
      var includeTagList = this.filterTags.filter(t => t.is_inverted == false).map(t => t.tag_id);
      var excludeTagList = this.filterTags.filter(t => t.is_inverted == true).map(t => t.tag_id);
      let $sub = this.dishService
        .findByTags(includeTagList, excludeTagList)
        .subscribe(p => {
            this.sortDishes(p);
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

  sortDishes(dishList: Dish[]) {
    if (this.sortKey == SortKey.Name) {
      this.sortByDishName(dishList);
    } else if (this.sortKey == SortKey.LastUsed) {
      this.sortByLastUsed(dishList)
    } else if (this.sortKey == SortKey.CreatedOn) {
      this.sortByCreated(dishList);
    }

  }

  private sortByDishName(dishList: Dish[]) {
    dishList.sort((a, b) => {
      return a.name.localeCompare(b.name) * this.sortDirection;
    });
  }


  private sortByCreated(dishList: Dish[]) {
    dishList.sort((a, b) => {
      let aNum = parseInt(a.dish_id, 10);
      let bNum = parseInt(b.dish_id, 10);

      if (aNum < bNum) return -1 * this.sortDirection;
      else if (aNum > bNum) return 1 * this.sortDirection;
      else return 0;
    });
  }


  private sortByLastUsed(dishList: Dish[]) {
    dishList.sort((a, b) => {
      let aDate = !a.last_added ? new Date('1970-10-01') : new Date(a.last_added);
      let bDate = !b.last_added ? new Date('1970-10-01') : new Date(b.last_added);
      if (aDate < bDate) return -1 * this.sortDirection;
      else if (aDate > bDate) return 1 * this.sortDirection;
      else return 0;
    });
  }

  changeSort() {
    this.sortDishes(this.allDishes);
    if (this.filteredDishes.length == this.allDishes.length) {
      this.filteredDishes = this.allDishes
    } else {
      this.sortDishes(this.filteredDishes);
    }
  }

  changeSortDirection() {
    if (this.sortDirection == SortDirection.Up) {
      this.sortDirection = SortDirection.Down;
    } else {
      this.sortDirection = SortDirection.Up;
    }
    this.changeSort();
  }

  isSortDirectionUp() {
    return this.sortDirection == SortDirection.Up;
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

  toggleShowOrderBy() {
    this.showOrderBy = !this.showOrderBy;
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
