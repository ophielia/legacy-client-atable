import {Component, OnDestroy, OnInit} from "@angular/core";
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


  editList(list: ShoppingList) {

    if (list.list_id != null) {
      this.goToEditList(list.list_id);
    }
  }


  sortOutShoppingLists(lists: IShoppingList[]) {
    this.generalLists = lists;
  }

  createShoppingList() {
    var $sub = this.shoppingListService.addShoppingList(null, null, false, false, null)
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
