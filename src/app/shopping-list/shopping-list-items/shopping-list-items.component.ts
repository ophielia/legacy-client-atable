import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Category} from "../../model/category";
import {ShoppingListService} from "../../services/shopping-list.service";
import {Item} from "../../model/item";

@Component({
  selector: 'at-shopping-list-items',
  templateUrl: './shopping-list-items.component.html',
  styleUrls: ['./shopping-list-items.component.css']
})
export class ShoppingListItemsComponent implements OnInit {
  @Input() category: Category;
  @Input() legendMap: Map<string, string>;
  @Input() listId: string;
  @Input() showItemLegends: boolean = true;
  @Output() listUpdated = new EventEmitter<boolean>();

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit() {
  }

  legendLookup(id: string) {
    return this.legendMap.get(id);
  }

  removeTagFromList(item: Item) {

    var $sub = this.shoppingListService.removeItemFromShoppingList(this.listId, item.item_id,
      this.category.is_frequent, this.category.dish_id)
      .subscribe(t => this.listUpdated.emit(true));
  }
}
