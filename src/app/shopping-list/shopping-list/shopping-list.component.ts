import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {IDish} from "../../model/dish";
import {IShoppingList, ShoppingList} from "../../model/shoppinglist";
import {ITag, Tag} from "../../model/tag";
import ListType from "../../model/list-type";
import {ListLayout} from "../../model/listlayout";
import {Subscription} from "rxjs/Subscription";
import {ActivatedRoute, Router} from "@angular/router";
import {ShoppingListService} from "../../services/shopping-list.service";
import {ListLayoutService} from "../../services/list-layout.service";
import {DishService} from "../../services/dish-service.service";
import {TagsService} from "../../services/tags.service";
import {SourceLegendService} from "../../services/source-legend.service";
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";
import {Category, ICategory} from "../../model/category";
import {ItemSource} from "../../model/item-source";
import CategoryType from "../../model/category-type";
import {Item} from "../../model/item";

@Component({
  selector: 'at-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  otherShopName: string;

  @ViewChild('modal1') input;
  private shoppingListId: any = ShoppingList;
  private allDishes: IDish[];

  private shoppingList: IShoppingList;
  private listLayoutList: ListLayout[];
  private listLegend: Map<string, string>;

  private sourceDisplayType: any = 'color';
  private highlightDishId: string;
  private highlightListId: string;
  private showListLayouts: boolean;
  private showItemLegends: boolean = true;
  private unsubscribe: Subscription[] = [];
  private crossOffAll: boolean = true;
  private hideCrossedOff: boolean = false;

  errorMessage: any;
  private activeListExists: boolean = false;
  private showMenu: boolean = false;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private shoppingListService: ShoppingListService,
              private listLayoutService: ListLayoutService,
              private dishService: DishService,
              private tagService: TagsService,
              private legendService: SourceLegendService,
              private tagCommService: TagCommService) {
    this.shoppingListId = this.route.snapshot.params['id'];

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting dish with id: ', id);
      this.getShoppingList(id);
    });
    this.getListLayouts();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  getShoppingList(id: string) {
    if (this.highlightDishId || this.highlightListId) {
      var $sub = this.shoppingListService
        .getByIdWithHighlight(id, this.highlightDishId, this.highlightListId, false)
        .subscribe(p => {
          this.shoppingList = p;
          this.generateLegend();
          this.checkListType();
          this.checkSpecialCategories();
        });
      this.unsubscribe.push($sub);
    } else {
      var $sub = this.shoppingListService
        .getByIdWithPantry(id, false)
        .subscribe(p => {
          this.shoppingList = p;
          this.generateLegend();
          this.checkListType();
          this.checkSpecialCategories();
        });
      this.unsubscribe.push($sub);
    }

    var $sub = this.shoppingListService
      .getByType(ListType.ActiveList)
      .subscribe(t => {
        if (t) {
          this.activeListExists = true;
        }
      });
    this.unsubscribe.push($sub);
  }

  getListLayouts() {
    var $sub = this.listLayoutService
      .getAll()
      .subscribe(r => {
        this.listLayoutList = r;
      })
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

  crossOffItem(item: Item) {
    var $sub = this.shoppingListService.toggleCrossedOffForItem(this.shoppingList.list_id, item.item_id, item.crossed_off)
      .subscribe();
  }

  setSourceDisplay(display_type) {
    this.sourceDisplayType = display_type;
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
    if (category.category_type == CategoryType.Highlight) {
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
    if (source.display == this.highlightListId) {
      this.highlightListId = null;
    } else {

      this.highlightListId = source.display;
      this.highlightDishId = null;
    }
    this.getShoppingList(this.shoppingList.list_id);
  }

  getAllDishes() {
    this.dishService.getAll()
      .subscribe(p => {
          this.allDishes = p;
          //this.showAddTags = (this.allDishes.length == 0);
        },
        e => this.errorMessage = e);

  }

  crossOffAllItems() {
    var $sub = this.shoppingListService.crossOffAllItemsFromList(this.shoppingList.list_id, this.crossOffAll)
      .subscribe(r => {
        this.getShoppingList(this.shoppingList.list_id)
      });
    this.unsubscribe.push($sub);
    this.crossOffAll = !this.crossOffAll;
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

    }
  }

  toggleLayoutList() {
    this.showListLayouts = !this.showListLayouts;
  }

  toggleHideCrossedOff() {
    this.hideCrossedOff = !this.hideCrossedOff;
  }

  private checkListType() {
    this.otherShopName = 'Active List';
    if (this.shoppingList.list_type == ListType.ActiveList) {
      this.otherShopName = 'Pick-Up List';
    }
  }

  switchLists() {
    var newListType = this.otherShopName.toLowerCase().indexOf('active') >= 0 ? ListType.ActiveList : ListType.PickUpList;

    var $sub = this.shoppingListService.getByType(newListType)
      .subscribe(p => {
        this.shoppingList = p;
        this.generateLegend();
        this.checkListType();
        this.checkSpecialCategories();
      });
    this.unsubscribe.push($sub);
  }
}
