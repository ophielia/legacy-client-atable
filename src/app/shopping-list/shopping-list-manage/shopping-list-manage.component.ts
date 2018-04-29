import {Component, OnDestroy, OnInit} from "@angular/core";
import ListType from "../../model/list-type";
import {ShoppingListService} from "../../services/shopping-list.service";
import {IShoppingList, ShoppingList} from "../../model/shoppinglist";
import {Subscription} from "rxjs/Subscription";


@Component({
  selector: 'at-shopping-list-manage',
  templateUrl: './shopping-list-manage.component.html',
  styleUrls: ['./shopping-list-manage.component.css']
})
export class ManageShoppingListComponent implements OnInit, OnDestroy {
  private baseList: IShoppingList = null;
  private pickupList: IShoppingList = null;
  private activeList: IShoppingList;
  private generalLists: ShoppingList[];

  unsubscribe: Subscription[] = [];

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit() {
    this.getShoppingLists();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  getShoppingLists() {

    let sub$ = this.shoppingListService
      .getAll()
      .subscribe(p => {
        this.sortOutShoppingLists(p)
      });
    this.unsubscribe.push(sub$);
  }

  sortOutShoppingLists(lists: IShoppingList[]) {
    for (var i = 0; i < lists.length; i++) {
      var list = lists[i];
      if (list.list_type == ListType.BaseList) {
        this.baseList = list;
      } else if (list.list_type == ListType.PickUpList) {
        this.pickupList = list;
      } else if (list.list_type == ListType.ActiveList) {
        this.activeList = list;
      } else {
        if (this.generalLists == null) {
          this.generalLists = new Array<ShoppingList>();
        }
        this.generalLists.push(list);

      }
    }
  }


}
