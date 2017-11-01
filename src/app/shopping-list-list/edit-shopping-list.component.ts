import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ShoppingListService} from "../shopping-list.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ShoppingList} from "../model/shoppinglist";
import {TagCommService} from "../drilldown/tag-drilldown-select.service";
import {TagDrilldown} from "../model/tag-drilldown";
import {Tag} from "../model/tag";
import {Item} from "../model/item";

@Component({
  selector: 'at-edit-shopping-list',
  templateUrl: './edit-shopping-list.component.html',
  styleUrls: ['./edit-shopping-list.component.css']
})
export class EditShoppingListComponent implements OnInit {
  private shoppingListId: string;
  private subGetId: any;
  private subTagEvent: any;
  shoppingList: ShoppingList = <ShoppingList>{list_id: "", list_type: ""};
  private tagCommService: TagCommService;
  @Output() tagEvent: EventEmitter<Tag> = new EventEmitter<Tag>();


  constructor(private shoppingListService: ShoppingListService,
              tagCommService: TagCommService,
              private route: ActivatedRoute,
              private router: Router,) {
    this.shoppingListId = this.route.snapshot.params['id'];
    this.tagCommService = tagCommService;
  }

  ngOnInit() {
    this.subGetId = this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting dish with id: ', id);
      this.refreshList(id);
    });
    this.subTagEvent = this.tagCommService.selectEvent
      .subscribe(selectevent => {
        this.addItem(selectevent);
      });
  }

  ngOnDestroy() {
    this.subTagEvent.unsubscribe();
    this.subGetId.unsubscribe();
  }


  addItem(tag: Tag) {
    // add tag to list as item in back end
    this.shoppingListService.addTagItemToShoppingList(this.shoppingListId, tag)
      .subscribe(p => {
        this.refreshList(this.shoppingListId);
      });
    return false;

  }

  removeItem(item: Item) {

    // remove Item from shopping list
    this.shoppingListService.removeItemFromShoppingList(this.shoppingListId, item.item_id)
      .subscribe(p => {
        this.refreshList(this.shoppingListId);
      });
    return false;

  }

  refreshList(id: string) {
    this.shoppingListService
      .getById(id)
      .subscribe(p => this.shoppingList = p);
  }
}
