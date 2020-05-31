import {Component, OnDestroy, OnInit, ViewChild, SkipSelf} from "@angular/core";
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
import {Category, ICategory} from "../../model/category";
import TagType from "../../model/tag-type";
import {IDish} from "../../model/dish";
import {DishService} from "../../services/dish-service.service";
import {IItem} from "../../model/item";
import {LegendService} from "../../services/legend.service";
import {LegendPoint} from "../../model/legend-point";


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
  public listLayoutList: ListLayout[];
  public listOfLists: IShoppingList[];


  shoppingList: IShoppingList;
  listLegendMap: Map<string, LegendPoint>;
  legendList: LegendPoint[] = [];
  isEditListName: boolean = false;
  starterListId: string;
  showListLayouts: boolean;
  showPantryItems: boolean = true;
  crossedOffExist: boolean = true;
  crossedOffHidden: boolean = false;
  showItemLegends: boolean = true;
  removedItems: IItem[] = [];
  showAddDish: boolean;
  showAddItem: boolean;
  showMenu: boolean;
  errorMessage: any;
  showMakeStarter: boolean;
  showAllLists: boolean;
  canShowLegend: boolean;

  private tagTypes: string;
  private tagSelectEvent: any;
  private highlightSourceId: string;
  private highlightListId: string;
  private showSources: boolean = false;
  private unsubscribe: Subscription[] = [];



  constructor(private route: ActivatedRoute,
              private shoppingListService: ShoppingListService,
              private listLayoutService: ListLayoutService,
              private dishService: DishService,
              private tagService: TagsService,
              public legendService: LegendService,
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
    let $sub = this.shoppingListService
      .getById(id)
      .subscribe(p => {
        this.processRetrievedShoppingList(p);
      });
    this.unsubscribe.push($sub);
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

  addTagToList(tag: Tag) {
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

  getCategoryDispClass(defaultClass: string, category: ICategory) {
    if (category.override_class) {
      return "legend-highlight";
    }
    return defaultClass;
  }

  highlightSource(source: string) {
    if (!source) {
      return;
    }
    if (source == this.highlightSourceId) {
      this.highlightSourceId = null;
    } else {

      this.highlightSourceId = source;
    }
    this.getShoppingList(this.shoppingList.list_id);
  }



  reAddItem(item: IItem) {
    this.removedItems = this.removedItems.filter(i => i.item_id != item.item_id );
    if (item.tag) {
      this.addTagToList(item.tag);
    }

  }

  removeDishOrList(source: ItemSource) {
    let $sub = this.shoppingListService.removeDishItemsFromShoppingList(this.shoppingList.list_id, source.id)
      .subscribe(() => {
        this.getShoppingList(this.shoppingList.list_id)
      });
    this.unsubscribe.push($sub);
    if (this.highlightSourceId == source.id) {
      this.highlightSourceId = null;
    }
  }

  addDishToList(dish: any) {
    this.listLegendMap = null;
    let $sub = this.shoppingListService.addDishToShoppingList(this.shoppingList.list_id, dish.dish_id)
      .subscribe(() => {
        this.highlightSourceId = this.shoppingList.is_starter ? null : dish.dish_id;
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
    this.highlightSourceId = null;
  }

  addFromList(fromListId: string) {
    this.listLegendMap = null;
    let $sub = this.shoppingListService.addListToShoppingList(this.shoppingList.list_id, fromListId)
      .subscribe(() => {
        this.highlightListId = null;
        this.highlightSourceId = null;
        this.getShoppingList(this.shoppingList.list_id);
      });

    this.unsubscribe.push($sub);
  }

  markItemRemoved(item: IItem) {
    this.removedItems.push(item);
  }


  newEvaluateShowLegend() {
    let thisListIsTheStarter = this.shoppingList.is_starter;
    if (thisListIsTheStarter) {
      return false;
    }
    return this.shoppingList.legend.length > 0;
  }


  toggleMenu() {
    this.showMenu = !this.showMenu;
    if (!this.showMenu) {
      this.showListLayouts = false;
      this.showSources = false;
    }
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

  iconSourceForKey(key: string): string {
    // assets/images/legend/colors/blue/bowl.png
    let point = this.listLegendMap.get(key);
    if (!point) {
      return null;
    }
    return "assets/images/legend/circles/" + point.color + "/" + point.icon + ".png";
  }

  private prepareLegend(list: IShoppingList) {
    let legendMap = this.legendService.processLegend(list.legend);
    var collectedValue: LegendPoint[] = [];
    this.listLegendMap = new Map();
    legendMap.forEach((value: LegendPoint, key: string) => {
      collectedValue.push(value);
      this.listLegendMap.set(key,value);
    });
    collectedValue.sort((a, b) => {
      return a.display.toLowerCase().localeCompare(b.display.toLowerCase());
    });
    this.legendList = collectedValue;
  }

  private processRetrievedShoppingList(p: IShoppingList) {
    this.determineCrossedOff(p);
    this.prepareLegend(p);
    this.shoppingList = this.filterForDisplay(p);
    this.showMakeStarter = !this.shoppingList.is_starter;
    this.canShowLegend = this.newEvaluateShowLegend();

    // check for starter and pantry
    /* MM
           if (this.shoppingList.is_starter && this.showPantryItems) {
         this.showPantryItems = false;
         this.getShoppingList(this.shoppingListId);
       }
   */
    /*
            // sort legend points by display
      unsortedLegendPoints.sort((a,b) => {
        return (a.display < b.display) ? -1 : 1;
      });
     */

  }

  private filterForDisplay(shoppingList: IShoppingList): IShoppingList {

    if (this.crossedOffHidden) {
      for (let category of shoppingList.categories) {
        this.hideCrossedOff(category);
      }
    }
    if (this.highlightSourceId || this.showPantryItems) {
      shoppingList.categories = this.pullCategoryByTag(this.highlightSourceId, shoppingList);
    }
    return shoppingList;
  }

  private pullCategoryByTag(sourceId: string, shoppingList: IShoppingList) {
    var beep = "bop";
    if (!sourceId && !this.showPantryItems) {
      return;
    }
    var highlightId = sourceId ? sourceId : LegendService.FREQUENT;

    var newCategories = [];
    var pulledItems = [];
    for (let category of shoppingList.categories) {
      var categoryItems = [];
      for (let item of category.items) {
        if (item.source_keys.includes(highlightId)) {
          pulledItems.push(item);
        } else {
          categoryItems.push(item);
        }
      }
      category.items = categoryItems;
      newCategories.push(category);
    }
    // now, make new category
    var name;
    var is_frequent = false;
    if (highlightId == LegendService.FREQUENT) {
      name = "Frequent";
      is_frequent = true;
    } else {
      var legendPoint = this.listLegendMap.get(this.highlightSourceId);
      name = legendPoint.display;

    }
    // to fill in name, items, is_frequent
    var pulledCategory = new Category(
      name,
      pulledItems,
      null,
      "yes",
      is_frequent
    )

    // put pulledItems at the front of the list
    newCategories.unshift(pulledCategory);
    return newCategories;
  }

  private hideCrossedOff(category: ICategory) {
    // process subcategories
    for (let subcategory of category.subcategories) {
      this.hideCrossedOff(subcategory);
    }
    // process direct items
    category.items = category.items.filter(i => !i.crossed_off);


  }

  private static getCrossedOff(shoppingList: IShoppingList):IItem[] {
    if (!shoppingList.categories || shoppingList.categories.length == 0) {
      return [];
    }

    let allItems = shoppingList.categories
      .map(c => c.allItems().filter(i => i.crossed_off));

    //return allItems;
    return allItems
      .reduce(function(a,b){ return a.concat(b) }, []);
  }

  private determineCrossedOff(shoppingList: IShoppingList) {
    let crossedOff = EditShoppingListComponent.getCrossedOff(shoppingList);
    this.crossedOffExist = crossedOff.length > 0;

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

}
