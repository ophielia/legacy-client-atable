import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";
import {IShoppingList, ShoppingList} from "../../model/shoppinglist";
import {ActivatedRoute, Router} from "@angular/router";
import {ShoppingListService} from "../../services/shopping-list.service";
import {TagsService} from "../../services/tags.service";
import {ITag, Tag} from "../../model/tag";
import {Subscription} from "rxjs/Subscription";
import {ListLayout} from "../../model/listlayout";
import {ListLayoutService} from "app/services/list-layout.service";
import {ItemSource} from "../../model/item-source";
import {SourceLegendService} from "../../services/source-legend.service";
import {ICategory} from "../../model/category";
import CategoryType from "../../model/category-type";
import TagType from "../../model/tag-type";
import {IDish} from "../../model/dish";
import {DishService} from "../../services/dish-service.service";


@Component({
  selector: 'at-edit-shopping-list',
  templateUrl: './edit-shopping-list.component.html',
  styleUrls: ['./edit-shopping-list.component.css']
})
export class EditShoppingListComponent implements OnInit, OnDestroy {
  @ViewChild('modal1') input;
  private shoppingListId: any = ShoppingList;
  private allDishes: IDish[];
  private alltags: ITag[];

  private tagTypes: string;
  private tagSelectEvent: any;
  private shoppingList: IShoppingList;
  private listLayoutList: ListLayout[];
  private listLegend: Map<string, string>;
  private listOfLists: IShoppingList[] ;
  private starterListId: string;
  private isEditListName: boolean = false;

  private highlightDishId: string;
  private highlightListId: string;

  private showListLayouts: boolean;
  private showSources: boolean = false;
  private showAddDish: boolean;
  private showAddItem: boolean;
  private showMenu: boolean;
  private showPantryItems: boolean = true;
  private showItemLegends: boolean = true;
  private unsubscribe: Subscription[] = [];
  errorMessage: any;
  showMakeStarter: boolean;

  private showAllLists: boolean;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private shoppingListService: ShoppingListService,
              private listLayoutService: ListLayoutService,
              private dishService: DishService,
              private tagService: TagsService,
              private legendService: SourceLegendService,
              private tagCommService: TagCommService) {
    this.shoppingListId = this.route.snapshot.params['id'];
    this.tagTypes = TagType.Ingredient + "," + TagType.NonEdible;

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting dish with id: ', id);
      this.getShoppingList(id);
    });
    this.getListLayouts();
    this.tagSelectEvent = this.tagCommService.selectEvent
      .subscribe(selectevent => {
        this.addTagToList(selectevent);
      })
    this.getAllTags()
    this.getAllDishes();
    this.getFilteredLists();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  getShoppingList(id: string) {
    if (this.highlightDishId || this.highlightListId) {
      var $sub = this.shoppingListService
        .getByIdWithHighlight(id, this.highlightDishId, this.highlightListId, this.showPantryItems)
        .subscribe(p => {
          this.shoppingList = p;
          this.generateLegend();
          this.checkSpecialCategories();
          this.showMakeStarter = !this.shoppingList.is_starter
        });
      this.unsubscribe.push($sub);
    } else {
      var $sub = this.shoppingListService
        .getByIdWithPantry(id, this.showPantryItems)
        .subscribe(p => {
          this.shoppingList = p;
          this.generateLegend();
          this.checkSpecialCategories();
          this.showMakeStarter = !this.shoppingList.is_starter
        });
      this.unsubscribe.push($sub);
    }


  }

  getAllTags() {
    this.tagService
      .getAllSelectable(this.tagTypes, 'Assign')
      .subscribe(p => {
          this.alltags = p;
        },
        e => this.errorMessage = e);

  }

  getListLayouts() {
    var $sub = this.listLayoutService
      .getAll()
      .subscribe(r => {
        this.listLayoutList = r;
      })
  }

  private addTagToList(tag: Tag) {
    // add tag to list as item in back end
    var $sub = this.shoppingListService.addTagItemToShoppingList(this.shoppingList.list_id, tag)
      .subscribe(p => {
        this.getShoppingList(this.shoppingList.list_id);
      });
    this.unsubscribe.push($sub);
  }

  changeListLayout(layoutId: string) {
    var $sub = this.shoppingListService
      .changeListLayout(this.shoppingList.list_id, layoutId)
      .subscribe(r => {
        this.getShoppingList(this.shoppingList.list_id);
        this.showListLayouts = false;
      })
    this.unsubscribe.push($sub);
  }

  generateLegend() {
    if (!this.listLegend) {
      this.listLegend = this.legendService.createLegendForSources(this.shoppingList.dish_sources, this.shoppingList.list_sources);
    }
    this.shoppingList.dish_sources.forEach(s => {
      var classname = this.listLegend.get(s.id);
      if (classname) {
        s.disp_class = classname;
      }
    });
    this.shoppingList.list_sources.forEach(s => {
      var classname = this.listLegend.get(s.display);
      if (classname) {
        s.disp_class = classname;
      }
    });
  }

  getCategoryDispClass(defaultClass: string, category: ICategory) {
    if (category.override_class) {
      return category.override_class;
    }
    return defaultClass;
  }

  checkSpecialCategories() {
    if (!this.shoppingList.categories || this.shoppingList.categories.length == 0) {
      return;
    }
    // get first category
    var category: ICategory = this.shoppingList.categories[0];

    if (category.name == CategoryType.Frequent) {
      category.is_frequent = true;
    }
    if (!this.listLegend) {
      return;
    }
    // check if it's connected with a dish
    if (category.category_type == CategoryType.Highlight
      || category.category_type == CategoryType.HighlightList) {
      // find category in legend
      var search: string = category.name;
      var overrideName = null;
      // set display class in category
      for (let entry of this.shoppingList.dish_sources) {
        console.log(entry.display);
        if (search != entry.display) {
          continue;
        }
        var id = entry.id;
        if (this.listLegend.get(id)) {
          category.override_class = this.listLegend.get(id);
          category.dish_id = id;
        }
        break;
      }
      if (!overrideName) {
        for (let entry of this.shoppingList.list_sources) {
          console.log(entry.display);
          if (search != entry.display) {
            continue;
          }
          category.override_class = this.listLegend.get(entry.display);
          break;
        }
      }
    }
  }

  highlightDish(source: ItemSource) {
    if (!source) {
      return;
    }
    if (source.id == this.highlightDishId) {
      this.highlightDishId = null;
    } else {

      this.highlightDishId = source.id;
      this.highlightListId = null;
    }
    this.getShoppingList(this.shoppingList.list_id);
  }

  highlightList(source: ItemSource) {
    if (!source) {
      return;
    }
    if (source.id == this.highlightListId) {
      this.highlightListId = null;
    } else {

      this.highlightListId = source.id;
      this.highlightDishId = null;
    }
    this.getShoppingList(this.shoppingList.list_id);
  }

  removeDish(source: ItemSource) {
    var $sub = this.shoppingListService.removeDishItemsFromShoppingList(this.shoppingList.list_id, source.id)
      .subscribe(r => {
        this.getShoppingList(this.shoppingList.list_id)
      });
    this.unsubscribe.push($sub);
    if (this.highlightDishId == source.id) {
      this.highlightDishId = null;
    }
  }

  removeList(listSource: ItemSource) {
    var $sub = this.shoppingListService.removeListItemsFromShoppingList(this.shoppingList.list_id, listSource.id)
      .subscribe(r => {
        this.getShoppingList(this.shoppingList.list_id)
      });
    this.unsubscribe.push($sub);
  }

  addDishToList(dish: any) {
    this.listLegend = null;
    var $sub = this.shoppingListService.addDishToShoppingList(this.shoppingList.list_id, dish.dish_id)
      .subscribe(t => {
        this.highlightDishId = dish.dish_id;
        this.getShoppingList(this.shoppingList.list_id);
        this.showAddDish = false;
      });
    this.unsubscribe.push($sub);
  }

  getAllDishes() {
    this.dishService.getAll()
      .subscribe(p => {
          this.allDishes = p;
        },
        e => this.errorMessage = e);

  }

  clearList() {
    var $sub = this.shoppingListService.removeAllItemsFromList(this.shoppingList.list_id)
      .subscribe(r => {
        this.getShoppingList(this.shoppingList.list_id)
      });
    this.unsubscribe.push($sub);
    this.highlightDishId = null;
  }

  addFromList(fromListId: string) {
    this.listLegend = null;
    var $sub = this.shoppingListService.addListToShoppingList(this.shoppingList.list_id, fromListId)
      .subscribe(r => {
        this.highlightListId = this.starterListId;
        this.highlightDishId = null;
        this.getShoppingList(this.shoppingList.list_id);
      });

    this.unsubscribe.push($sub);
  }

  isStarterList() {
    return this.shoppingList.is_starter;
  }

  showLegend() {
    if (this.shoppingList.dish_sources.length > 0) {
      return true;
    }
    return this.shoppingList.list_sources.length > 0;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    if (!this.showMenu) {
      this.showListLayouts = false;
      this.showSources = false;
    }
  }

  toggleLayoutList() {
    this.showListLayouts = !this.showListLayouts;
  }

  togglePantryItems() {
    this.showPantryItems = !this.showPantryItems;
    this.getShoppingList(this.shoppingList.list_id);
  }

  toggleShowItemLegends() {
    this.showItemLegends = !this.showItemLegends;
  }

  toggleAddItem() {
    this.showAddItem = !this.showAddItem;
    if (this.showAddItem) {
      this.showAddDish = false;
    }
  }

  toggleAddDish() {
    this.showAddDish = !this.showAddDish;
    if (this.showAddDish) {
      this.showAddItem = false;
    }
  }

  toggleShowAllLists() {
    this.showAllLists = !this.showAllLists;

  }


  private getStarterList() {
    var $sub = this.shoppingListService.getStarterLists()
      .subscribe( lists => {
        if (lists && lists.length >0) {
          this.starterListId = lists[0].list_id;
        }
          });
    this.unsubscribe.push($sub);
  }


  private getFilteredLists() {
    this.listOfLists = []
    var $sub = this.shoppingListService.getAll()
      .subscribe( lists => {
        for (let list of lists) {
          // don't include this list
          if (list.list_id == this.shoppingListId) {
            continue;
          }
         // check for starter, and fill in starter
          if (list.is_starter) {
            this.starterListId = list.list_id;
          }
          // add to list
          this.listOfLists.push(list);
        }



      });
    this.unsubscribe.push($sub);
  }

  toggleListName() {
    this.isEditListName = !this.isEditListName;
  }

  saveListName() {
    var $sub = this.shoppingListService.updateShoppingListName(this.shoppingList)
      .subscribe(r => {
        this.getShoppingList(this.shoppingList.list_id);
      });

    this.unsubscribe.push($sub);
    this.isEditListName = !this.isEditListName;
  }

  makeStarterList() {
    var $sub = this.shoppingListService.updateShoppingListStarterStatus(this.shoppingList)
      .subscribe(r => {
        this.getShoppingList(this.shoppingList.list_id);
      });

    this.unsubscribe.push($sub);

  }
}
