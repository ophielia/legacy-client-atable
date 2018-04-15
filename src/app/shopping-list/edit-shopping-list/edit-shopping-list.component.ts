import {Component, OnDestroy, OnInit} from "@angular/core";
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";
import {IShoppingList, ShoppingList} from "../../model/shoppinglist";
import {ActivatedRoute, Router} from "@angular/router";
import {ShoppingListService} from "../../services/shopping-list.service";
import {TagsService} from "../../services/tags.service";
import {Tag} from "../../model/tag";
import {Subscription} from "rxjs/Subscription";
import {Item} from "../../model/item";
import {ListLayout} from "../../model/listlayout";
import {ListLayoutService} from "app/services/list-layout.service";
import {ItemSource} from "../../model/item-source";
import {SourceLegendService} from "../../services/source-legend.service";
import {ICategory} from "../../model/category";
import CategoryType from "../../model/category-type";

@Component({
  selector: 'at-edit-shopping-list',
  templateUrl: './edit-shopping-list.component.html',
  styleUrls: ['./edit-shopping-list.component.css']
})
export class EditShoppingListComponent implements OnInit, OnDestroy {


  tagSelectEvent: any;
  shoppingListId: any = ShoppingList;
  private shoppingList: IShoppingList;
  listLayoutList: ListLayout[];
  removedTags: Tag[] = [];
  listLegend: Map<string, string>;

  unsubscribe: Subscription[] = [];
  private showListLayouts: boolean;
  private showSources: boolean = false;
  private highlightDishId: string;
  showMenu: boolean;
  showPantryItems: boolean = true;
  showItemLegends: boolean = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private shoppingListService: ShoppingListService,
              private listLayoutService: ListLayoutService,
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
    this.tagSelectEvent = this.tagCommService.selectEvent
      .subscribe(selectevent => {
        this.addTagToList(selectevent);
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  getShoppingList(id: string) {
    if (this.highlightDishId) {
      var $sub = this.shoppingListService
        .getByIdWithHighlight(id, this.highlightDishId)
        .subscribe(p => {
          this.shoppingList = p;
          this.generateLegend();
          this.checkSpecialCategories();
        });
      this.unsubscribe.push($sub);


    } else {
      var $sub = this.shoppingListService
        .getByIdWithPantry(id, this.showPantryItems)
        .subscribe(p => {
          this.shoppingList = p;
          this.generateLegend();
          this.checkSpecialCategories();
        });
      this.unsubscribe.push($sub);
    }

  }


  getListLayouts() {
    var $sub = this.listLayoutService
      .getAll()
      .subscribe(r => {
        this.listLayoutList = r;
      })
  }

  private addTagToList(tag: Tag) {

  }


  changeListLayout(layoutId: string) {
    var $sub = this.shoppingListService
      .changeListLayout(this.shoppingList.list_id, layoutId)
      .subscribe(r => {
        this.getShoppingList(this.shoppingList.list_id);
      })
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
    if (category.category_type == CategoryType.Highlight) {
      // find category in legend
      var search: string = category.name;
      // set display class in category
      for (let entry of this.shoppingList.dish_sources) {
        console.log(entry.display);
        if (search != entry.display) {
          continue;
        }
        var id = entry.id;
        category.override_class = this.listLegend.get(id);
        category.dish_id = id;
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

  toggleShowDishSources() {
    this.showSources = !this.showSources;
    if (!this.showSources) {
      this.highlightDishId = null;
      this.getShoppingList(this.shoppingList.list_id);
    }
  }
}
