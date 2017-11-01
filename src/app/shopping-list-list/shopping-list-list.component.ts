import {Component, OnInit} from "@angular/core";
import {ShoppingListService} from "../shopping-list.service";
import {Router} from "@angular/router";
import {ShoppingList} from "../model/shoppinglist";
import ListType from "../model/list-type";

@Component({
  selector: 'at-shopping-list-list',
  templateUrl: './shopping-list-list.component.html',
  styleUrls: ['./shopping-list-list.component.css']
})
export class ShoppingListListComponent implements OnInit {
  private shoppingListService: ShoppingListService;
  private shoppingLists: ShoppingList[];
  private errorMessage: string;
  private baseList: ShoppingList;
  private pickUpList: ShoppingList;
  private inProcessList: ShoppingList;
  private activeList: ShoppingList;
  private baseListLoaded: boolean = false;
  private pickUpListLoaded: boolean = false;
  private inProcessListLoaded: boolean = false;
  private activeListLoaded: boolean = false;

  constructor(shoppingListService: ShoppingListService, private router: Router) {
    this.shoppingListService = shoppingListService;
  }

  ngOnInit() {
    this.getAllLists();
  }

  private getAllLists() {
    this.shoppingListService
      .getByType(ListType.BaseList)
      .subscribe(p => {
          if (p) {
            this.baseList = p;
          } else {
            this.baseList = <ShoppingList>{list_type: ListType.BaseList}
          }
          this.baseListLoaded = true;
        },
        e => this.errorMessage = e);

    this.shoppingListService
      .getByType(ListType.ActiveList)
      .subscribe(p => {
          if (p) {
            this.activeList = p;
          } else {
            this.activeList = <ShoppingList>{list_type: ListType.ActiveList}
          }
          this.activeListLoaded = true;
        },
        e => this.errorMessage = e);

    this.shoppingListService
      .getByType(ListType.InProcess)
      .subscribe(p => {
          if (p) {
            this.inProcessList = p;
          } else {
            this.inProcessList = <ShoppingList>{list_type: ListType.InProcess}
          }
          this.inProcessListLoaded = true;
        },
        e => this.errorMessage = e);

    this.shoppingListService
      .getByType(ListType.PickUpList)
      .subscribe(p => {
          if (p) {
            this.pickUpList = p;
          } else {
            this.pickUpList = <ShoppingList>{list_type: ListType.PickUpList}
          }
          this.pickUpListLoaded = true;
        },
        e => this.errorMessage = e);

  }

  createList(listType: string) {
    this.shoppingListService.addShoppingList(listType)
      .subscribe(r => {
        this.baseListLoaded = false;
        this.activeListLoaded = false;
        this.pickUpListLoaded = false;
        this.inProcessListLoaded = false;
        this.getAllLists();
      });
  }

  deleteShoppingList(shoppingListId: string) {
    this.shoppingListService.deleteShoppingList(shoppingListId)
      .subscribe(r => {
        this.baseListLoaded = false;
        this.activeListLoaded = false;
        this.pickUpListLoaded = false;
        this.inProcessListLoaded = false;
        this.getAllLists();
      })
  }
}
