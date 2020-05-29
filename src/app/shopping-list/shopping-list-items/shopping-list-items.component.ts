import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Category} from "../../model/category";
import {ShoppingListService} from "../../services/shopping-list.service";
import {IItem, Item} from "../../model/item";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'at-shopping-list-items',
  templateUrl: './shopping-list-items.component.html',
  styleUrls: ['./shopping-list-items.component.css']
})
export class ShoppingListItemsComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  @Input() category: Category;
  @Input() legendMap: Map<string, string>;
  @Input() listId: string;
  @Input() showItemLegends: boolean = true;
  @Output() listUpdated = new EventEmitter<boolean>();
  @Output() itemRemoved = new EventEmitter<IItem>();

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit() {
  }


  ngOnDestroy(): void {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  legendLookup(id: string) {
    return this.legendMap.get(id);
  }

  removeTagFromList(item: Item) {

    let $sub = this.shoppingListService.removeItemFromShoppingList(this.listId, item.item_id,
      item.tag.tag_id,
      true, this.category.dish_id)  // note - always remove entire item
      .subscribe(() => {
        this.listUpdated.emit(true);
        this.itemRemoved.emit(item);
      });
    this.unsubscribe.push($sub);
  }

  showLegends(item: Item) {
   return false;
   /* MM  if (!this.showItemLegends) {
      return false;
    }
    return item.dish_sources.length > 0 || item.list_sources.length > 0;

    */
  }

}
