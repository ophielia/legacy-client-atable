import {Component, OnDestroy, OnInit} from '@angular/core';
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
  showMenu: boolean;
  showPantryItems: boolean = true;

  unsubscribe: Subscription[] = [];
  private showListLayouts: boolean;
  private showSources: boolean = false;
  private highlightDishId: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private shoppingListService: ShoppingListService,
              private listLayoutService: ListLayoutService,
              private tagService: TagsService,
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
        });

    } else {
      var $sub = this.shoppingListService
        .getByIdWithPantry(id, this.showPantryItems)
        .subscribe(p => {
          this.shoppingList = p;
        });
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

  removeTagFromList(item: Item) {

    var $sub = this.shoppingListService.removeItemFromShoppingList(this.shoppingListId, item.item_id)
      .subscribe(t => this.getShoppingList(this.shoppingListId));
    this.unsubscribe.push($sub);
  }

  changeListLayout(layoutId: string) {
    var $sub = this.shoppingListService
      .changeListLayout(this.shoppingList.list_id, layoutId)
      .subscribe(r => {
        this.getShoppingList(this.shoppingList.list_id);
      })
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

  toggleMenu() {
    this.showMenu = !this.showMenu;
    if (!this.showMenu) {
      this.showListLayouts = false;
    }
  }

  toggleLayoutList() {
    this.showListLayouts = !this.showListLayouts;
  }

  togglePantryItems() {
    this.showPantryItems = !this.showPantryItems;
    this.getShoppingList(this.shoppingList.list_id);
  }

  toggleShowDishSources() {
    this.showSources = !this.showSources;
  }
}
