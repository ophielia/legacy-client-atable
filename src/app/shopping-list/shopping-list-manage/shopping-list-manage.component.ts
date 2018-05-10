import {Component, OnDestroy, OnInit} from "@angular/core";
import ListType from "../../model/list-type";
import {ShoppingListService} from "../../services/shopping-list.service";
import {IShoppingList, ShoppingList} from "../../model/shoppinglist";
import {Subscription} from "rxjs/Subscription";
import {Router} from "@angular/router";


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

  constructor(private shoppingListService: ShoppingListService,
              private router: Router) {
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
        if (p) {
        this.sortOutShoppingLists(p)
        }
      });
    this.unsubscribe.push(sub$);
  }

  goToEditList(list_id) {
    this.router.navigate(["list/edit/", list_id]);

  }

  goToShopList(list_id) {
    this.router.navigate(["list/shop/", list_id]);

  }

  editList(list: ShoppingList) {

    if (list.list_id != null) {
      if (list.list_type == ListType.ActiveList) {
        this.goToShopList(list.list_id);
      } else {
        this.goToEditList(list.list_id);
      }
    } else if (list.list_type == ListType.PickUpList ||
      list.list_type == ListType.BaseList) {
      // createList
      this.shoppingListService.addShoppingListNew(null, null, false, false, false, list.list_type)
        .subscribe(r => {
            var headers = r.headers;
            var location = headers.get("Location");
            var splitlocation = location.split("/");
            var list_id = splitlocation[splitlocation.length - 1];
            this.goToEditList(list_id);
          }
        )

    }
  }

  sortOutShoppingLists(lists: IShoppingList[]) {
    this.pickupList = null;
    this.activeList = null;
    this.baseList = null;
    this.generalLists = new Array();
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

  createShoppingList(listType) {
    if (!listType) {
      listType = ListType.General;
    }
    var $sub = this.shoppingListService.addShoppingListNew(null, null, false, false, false, listType)
      .subscribe(r => {
        var headers = r.headers;
        var location = headers.get("Location");
        var splitlocation = location.split("/");
        var id = splitlocation[splitlocation.length - 1];
        this.router.navigate(['/list/edit', id]);
      });
    this.unsubscribe.push($sub);
  }

  deleteShoppingList(list_id: string) {
    this.shoppingListService.deleteList(list_id)
      .subscribe(l => this.getShoppingLists());
  }


}
