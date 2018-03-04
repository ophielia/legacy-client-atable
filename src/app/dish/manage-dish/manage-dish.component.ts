import {Component, OnInit, ViewChild} from "@angular/core";
import {ITag, Tag} from "../../model/tag";
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";
import {Dish} from "../../model/dish";
import TagSelectType from "../../model/tag-select-type";
import {DishService} from "../../services/dish-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TagDrilldown} from "../../model/tag-drilldown";
import {TagsService} from "../../services/tags.service";
import TagType from "../../model/tag-type";
import {TimerObservable} from "rxjs/observable/TimerObservable";


@Component({
  selector: 'at-manage-dish',
  templateUrl: './manage-dish.component.html',
  styleUrls: ['./manage-dish.component.css']
})
export class ManageDishComponent implements OnInit {
  @ViewChild('modal1') input;
  filterTags: ITag[];
  tagSelectEvent: any;
  selectedDishes: Dish[] = [];
  searchValue: string;
  hoverTimer: any;

  allDishes: Dish[];
  filteredDishes: Dish[];
  browseAllDrilldowns: { [type: string]: TagDrilldown[] } = {};
  browseTagTypes: string[];
  expandFoldState: Map<string, boolean> = new Map<string, boolean>();
  selectHoverDetail: string;
  isShowTagEntry: boolean = false;

  showBrowse: boolean = false;
  selectType: string = TagSelectType.Search;


  private errorMessage: string;
  private showSelectedMenu: boolean = false;
  private hoverDish: Dish;
  private selectShowTags: string;


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
        .subscribe(p => {
            this.allDishes = p;
            this.filteredDishes = p;
          },
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

  toggleBrowse() {
    this.showBrowse = !this.showBrowse;
  }


  toggleSelectedMenu() {
    this.showSelectedMenu = !this.showSelectedMenu;
    if (!this.showSelectedMenu) {
      this.isShowTagEntry = false;
    }

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

  selectDish(dish: Dish) {
    let match = this.selectedDishes.filter(t => dish.dish_id == t.dish_id);
    if (!match || match.length == 0) {
      this.dishService.getById(dish.dish_id)
        .subscribe(d => this.selectedDishes.push(d));
    }
  }

  unSelectDish(dish: Dish) {
    this.selectedDishes = this.selectedDishes.filter(t => dish.dish_id != t.dish_id);
  }

  selectedDishMouseIn(dish: Dish) {
    this.hoverDish = dish;
    let timer = TimerObservable.create(500);
    this.hoverTimer = timer.subscribe(t => {
      this.selectHoverDetail = dish.dish_id;
    });
  }

  selectedDishMouseOut() {
    this.hoverTimer.unsubscribe();
    this.selectHoverDetail = "";
    this.selectShowTags = "";
  }

  toggleDishTags(dish_id) {
    if (this.selectShowTags && this.selectShowTags != "") {
      this.selectShowTags = "";
    } else {
      this.selectShowTags = dish_id;
    }
  }

  isShowTags(dish_id: string) {
    if (dish_id == this.selectShowTags) {
      return true;
    }
    return false;
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

  addTagToDishes(tag: Tag) {
    console.log("adding tag to dishes");
    this.dishService.addTagToDishes(this.selectedDishes, tag.tag_id)
      .subscribe(t => {
        this.input.show();
        this.isShowTagEntry = false;
        this.showSelectedMenu = false;
      })
    ;
  }

  showTagEntry() {
    this.isShowTagEntry = true;
  }

  goToDishEdit(dish_id: string) {
    this.router.navigate(["editdish/edit/", dish_id])
  }

}
