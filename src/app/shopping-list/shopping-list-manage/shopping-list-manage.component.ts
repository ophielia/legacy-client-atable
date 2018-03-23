import {Component, OnDestroy, OnInit} from '@angular/core';
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
  allShoppingLists: { [type: string]: IShoppingList } = {};
  private shoppingListTypes: string[];

  unsubscribe: Subscription[] = [];

  constructor(private shoppingListService: ShoppingListService,
              private router: Router) {
  }

  ngOnInit() {
    this.initializeShoppingListTypes();
    this.getShoppingLists();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  private initializeShoppingListTypes() {
    this.shoppingListTypes = [];
    this.shoppingListTypes.push(ListType.BaseList);
    this.shoppingListTypes.push(ListType.PickUpList);
    this.shoppingListTypes.push(ListType.ActiveList);
  }

  getShoppingLists() {

    for (var i = 0; i < this.shoppingListTypes.length; i++) {
      let ltype = this.shoppingListTypes[i];
      // get / fill tag lists here from service
      let sub$ = this.shoppingListService
        .getByType(ltype)
        .subscribe(p => {
          this.allShoppingLists[ltype] = p
        });
      this.unsubscribe.push(sub$);
    }
  }

  goToEdit(tagtype: string) {
    let list = this.allShoppingLists[tagtype];
    if (!list) {
      return;
    }

    this.router.navigate(["list/edit/", list.list_id])
  }

}
