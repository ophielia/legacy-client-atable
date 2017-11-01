import {Component, OnInit} from '@angular/core';
import {ShoppingListService} from "../shopping-list.service";
import {Router} from "@angular/router";
import {ShoppingList} from "../model/shoppinglist";

@Component({
  selector: 'at-shopping-list-list',
  templateUrl: './shopping-list-list.component.html',
  styleUrls: ['./shopping-list-list.component.css']
})
export class ShoppingListListComponent implements OnInit {
  private shoppingListService: ShoppingListService;
  private shoppingLists: ShoppingList[];
  private errorMessage: string;

  constructor(shoppingListService: ShoppingListService, private router: Router) {
    this.shoppingListService = shoppingListService;
  }

  ngOnInit() {
    this.getAllLists();
  }

  private getAllLists() {
    this.shoppingListService
      .getAll()
      .subscribe(p => this.shoppingLists = p,
        e => this.errorMessage = e);
  }

  deleteShoppingList(shoppingListId: string) {
    this.shoppingListService.deleteShoppingList(shoppingListId)
      .subscribe(r => {
        this.getAllLists();
      })
  }
}
