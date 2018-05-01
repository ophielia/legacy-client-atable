import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Category} from "../../model/category";
import {ShoppingListService} from "../../services/shopping-list.service";
import {Item} from "../../model/item";

@Component({
  selector: 'at-cross-off-item',
  templateUrl: './cross-off-item.component.html',
  styleUrls: ['./cross-off-item.component.css']
})
export class CrossOffItemComponent implements OnInit {
  @Input() category: Category;
  @Input() legendMap: Map<string, string>;
  @Input() listId: string;
  @Input() legendType: string;
  @Input() hideCrossedOff: boolean;
  @Output() itemCrossedOff = new EventEmitter<Item>();


  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit() {
  }

  legendLookup(id: string) {
    return this.legendMap.get(id);
  }

  crossOffItem(item: Item) {
    item.crossed_off = !item.crossed_off;
    this.itemCrossedOff.emit(item);
  }

  isChecked(item: Item) {
    return item.crossed_off;
  }

  showLegends(item: Item) {
    /*if (!this.showItemLegends) {
     return false;
     }
     return item.dish_sources.length > 0 || item.list_sources.length > 0;
     */
  }

}
