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
import {IItem} from "../../model/item";


@Component({
  selector: 'at-edit-shopping-list',
  templateUrl: './edit-shopping-list.component.html',
  styleUrls: ['./edit-shopping-list.component.css']
})
export class EditShoppingListComponent implements OnInit, OnDestroy {
  @ViewChild('modal1') input;
  public shoppingListId: any = ShoppingList;
  public allDishes: IDish[];
  public alltags: ITag[];

  private tagTypes: string;
  private tagSelectEvent: any;
  private shoppingList: IShoppingList;
  private retrievedShoppingList: IShoppingList;
  public listLayoutList: ListLayout[];
  private listLegend: Map<string, string>;
  public listOfLists: IShoppingList[] ;
  private starterListId: string;
  private isEditListName: boolean = false;

  private highlightDishId: string;
  private highlightListId: string;

  private showListLayouts: boolean;
  private showSources: boolean = false;
  private showListLegend: boolean = true;
  private showPantryItems: boolean = true;
  private crossedOffExist: boolean = true;
  private crossedOffHidden: boolean = false;
  private showItemLegends: boolean = true;
  private unsubscribe: Subscription[] = [];
  private showAddDish: boolean;
  private showAddItem: boolean;
  private showMenu: boolean;
  errorMessage: any;
  showMakeStarter: boolean;

  private showAllLists: boolean;
  private showItemLegend: boolean;


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
      console.log('getting list with id: ', id);
      this.getShoppingList(id);
    });
    this.getListLayouts();
    this.tagSelectEvent = this.tagCommService.selectEvent
      .subscribe(selectevent => {
        this.addTagToList(selectevent);
      });
    this.getAllTags();
    this.getAllDishes();
    this.getFilteredLists();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }



  getShoppingList(id: string) {
    let $sub;
    if (this.highlightDishId || this.highlightListId) {
      $sub = this.shoppingListService
        .getByIdWithHighlight(id, this.highlightDishId, this.highlightListId, this.showPantryItems)
        .subscribe(p => {
          this.processRetrievedShoppingList(p);
        });
      this.unsubscribe.push($sub);
    } else {
      $sub = this.shoppingListService
        .getByIdWithPantry(id, this.showPantryItems)
        .subscribe(p => {
          this.processRetrievedShoppingList(p);
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
    let $sub = this.listLayoutService
      .getAll()
      .subscribe(r => {
        this.listLayoutList = r;
      });
    this.unsubscribe.push($sub);
  }

  private addTagToList(tag: Tag) {
    // add tag to list as item in back end
    let $sub = this.shoppingListService.addTagItemToShoppingList(this.shoppingList.list_id, tag)
      .subscribe(() => {
        this.getShoppingList(this.shoppingList.list_id);
      });
    this.unsubscribe.push($sub);
  }

  changeListLayout(layoutId: string) {
    let $sub = this.shoppingListService
      .changeListLayout(this.shoppingList.list_id, layoutId)
      .subscribe(() => {
        this.getShoppingList(this.shoppingList.list_id);
        this.showListLayouts = false;
      });
    this.unsubscribe.push($sub);
  }

  generateLegend() {
    if (!this.listLegend) {
      this.listLegend = this.legendService.createLegendForSources(this.shoppingList.dish_sources, this.shoppingList.list_sources);
    }
    this.shoppingList.dish_sources.forEach(s => {
      let classname = this.listLegend.get(s.id);
      if (classname) {
        s.disp_class = classname;
      }
    });
    this.shoppingList.list_sources.forEach(s => {
      let classname = this.listLegend.get(s.display);
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
    let category: ICategory = this.shoppingList.categories[0];

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
      let search: string = category.name;

      // set display class in category
      for (let entry of this.shoppingList.dish_sources) {
        console.log(entry.display);
        if (search != entry.display) {
          continue;
        }
        let id = entry.id;
        if (this.listLegend.get(id)) {
          category.override_class = this.listLegend.get(id);
          category.dish_id = id;
        }
        break;
      }

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
    let $sub = this.shoppingListService.removeDishItemsFromShoppingList(this.shoppingList.list_id, source.id)
      .subscribe(() => {
        this.getShoppingList(this.shoppingList.list_id)
      });
    this.unsubscribe.push($sub);
    if (this.highlightDishId == source.id) {
      this.highlightDishId = null;
    }
  }

  removeList(listSource: ItemSource) {
    let $sub = this.shoppingListService.removeListItemsFromShoppingList(this.shoppingList.list_id, listSource.id)
      .subscribe(() => {
        this.getShoppingList(this.shoppingList.list_id)
      });
    this.unsubscribe.push($sub);
  }

  addDishToList(dish: any) {
    this.listLegend = null;
    let $sub = this.shoppingListService.addDishToShoppingList(this.shoppingList.list_id, dish.dish_id)
      .subscribe(() => {
        this.highlightDishId = this.shoppingList.is_starter ? null : dish.dish_id;
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
    let $sub = this.shoppingListService.removeAllItemsFromList(this.shoppingList.list_id)
      .subscribe(() => {
        this.getShoppingList(this.shoppingList.list_id)
      });
    this.unsubscribe.push($sub);
    this.highlightDishId = null;
  }

  addFromList(fromListId: string) {
    this.listLegend = null;
    let $sub = this.shoppingListService.addListToShoppingList(this.shoppingList.list_id, fromListId)
      .subscribe(() => {
        this.highlightListId = null;
        this.highlightDishId = null;
        this.getShoppingList(this.shoppingList.list_id);
      });

    this.unsubscribe.push($sub);
  }
  evaluateShowSources() {
    let thisListIsTheStarter = this.shoppingList.is_starter;
    if (thisListIsTheStarter) {
      return false;
    }
    return this.showItemLegend || this.showListLegend;
  }

  evaluateShowItemLegend() {
    let thisListIsTheStarter = this.shoppingList.is_starter;
    if (thisListIsTheStarter) {
      return false;
    }
    return this.shoppingList.dish_sources.length > 0;
  }

  evaluateShowLegend() {
    let thisListIsTheStarter = this.shoppingList.is_starter;
    if (thisListIsTheStarter) {
      return false;
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
  private getFilteredLists() {
    this.listOfLists = [];
    let $sub = this.shoppingListService.getAll()
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
    let $sub = this.shoppingListService.updateShoppingListName(this.shoppingList)
      .subscribe(() => {
        this.getShoppingList(this.shoppingList.list_id);
      });

    this.unsubscribe.push($sub);
    this.isEditListName = !this.isEditListName;
  }

  makeStarterList() {
    let $sub = this.shoppingListService.updateShoppingListStarterStatus(this.shoppingList)
      .subscribe(() => {
        this.getShoppingList(this.shoppingList.list_id);
      });

    this.unsubscribe.push($sub);

  }

  toggleShowCrossedOff() {
    this.crossedOffHidden = !this.crossedOffHidden;
    this.getShoppingList(this.shoppingListId)
  }

  removeCrossedOffItems() {
    let $sub = this.shoppingListService.removeItemsFromShoppingList(this.shoppingListId)
      .subscribe(() => {
        this.getShoppingList(this.shoppingList.list_id);
      });

    this.unsubscribe.push($sub);
  }

  private processRetrievedShoppingList(p: IShoppingList) {
    this.determineCrossedOff(p);
    this.shoppingList = this.filterForDisplay(p);
    this.generateLegend();
    this.checkSpecialCategories();
    this.showMakeStarter = !this.shoppingList.is_starter;
    this.showListLegend = this.evaluateShowLegend();
    this.showItemLegend = this.evaluateShowItemLegend();
    this.showSources = this.evaluateShowSources();
    this.retrievedShoppingList = p;
    // check for starter and pantry
    if (this.shoppingList.is_starter && this.showPantryItems) {
      this.showPantryItems = false;
      this.getShoppingList(this.shoppingListId);
    }
  }

  private filterForDisplay(shoppingList: IShoppingList):IShoppingList {

    if (this.crossedOffHidden) {
    for (let category of shoppingList.categories) {
       this.hideCrossedOff(category);
    }
    }
    return shoppingList;
  }

  private hideCrossedOff(category: ICategory) {
    // process subcategories
    for (let subcategory of category.subcategories) {
      this.hideCrossedOff(subcategory);
    }
    // process direct items
    category.items = category.items.filter(i => !i.crossed_off);


  }

  private getCrossedOff(shoppingList: IShoppingList):IItem[] {
    if (!shoppingList.categories || shoppingList.categories.length == 0) {
      return [];
    }

    let allItems = shoppingList.categories
      .map(c => c.allItems().filter(i => i.crossed_off));

    return allItems
      .reduce(function(a,b){ return a.concat(b) }, []);
  }

  private determineCrossedOff(shoppingList: IShoppingList) {
    this.crossedOffExist = this.getCrossedOff(shoppingList).length > 0;

  }
}
